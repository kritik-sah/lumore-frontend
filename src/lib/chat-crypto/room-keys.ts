import { importRecipientPublicKey, getIdentityPrivateCryptoKey } from "./identity";
import {
  base64ToArrayBuffer,
  base64ToBytes,
  bytesToBase64,
  toArrayBuffer,
} from "./base64";
import { getRoomKeyRaw, setRoomKeyRaw } from "./indexeddb";

const ROOM_KEY_WRAP_INFO = "lumore-room-key-wrap-v1";
const ROOM_KEY_ALG = "AES-GCM";

export interface RoomKeyEnvelopePayload {
  recipientUserId: string;
  algorithm: string;
  ephemeralPublicKey: string;
  iv: string;
  salt: string;
  ciphertext: string;
  tag: string;
}

const ensureSubtle = () => {
  if (!window?.crypto?.subtle) {
    throw new Error("WebCrypto unavailable");
  }
  return window.crypto.subtle;
};

const splitCipherAndTag = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 17) {
    throw new Error("Invalid encrypted payload");
  }
  const tagLength = 16;
  const ciphertext = bytes.slice(0, bytes.length - tagLength);
  const tag = bytes.slice(bytes.length - tagLength);
  return { ciphertext, tag };
};

const combineCipherAndTag = (ciphertext: Uint8Array, tag: Uint8Array) => {
  const merged = new Uint8Array(ciphertext.length + tag.length);
  merged.set(ciphertext, 0);
  merged.set(tag, ciphertext.length);
  return merged;
};

const deriveWrapKey = async (
  privateKey: CryptoKey,
  peerPublicKey: CryptoKey,
  salt: Uint8Array
) => {
  const subtle = ensureSubtle();
  const sharedSecret = await subtle.deriveBits(
    { name: "X25519", public: peerPublicKey },
    privateKey,
    256
  );
  const hkdfInput = await subtle.importKey("raw", sharedSecret, "HKDF", false, [
    "deriveKey",
  ]);
  return subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: toArrayBuffer(salt),
      info: toArrayBuffer(new TextEncoder().encode(ROOM_KEY_WRAP_INFO)),
    },
    hkdfInput,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const createRoomKeyRaw = () => window.crypto.getRandomValues(new Uint8Array(32));

export const createRoomKeyEnvelopes = async (params: {
  roomId: string;
  epoch: number;
  recipientPublicKeys: Array<{ userId: string; publicKeySpki: string }>;
}) => {
  const subtle = ensureSubtle();
  const { roomId, epoch, recipientPublicKeys } = params;
  const roomKeyRaw = createRoomKeyRaw();
  await setRoomKeyRaw(roomId, epoch, bytesToBase64(roomKeyRaw));

  const envelopes: RoomKeyEnvelopePayload[] = [];
  for (const recipient of recipientPublicKeys) {
    const recipientPublicKey = await importRecipientPublicKey(recipient.publicKeySpki);
    const eph = (await subtle.generateKey({ name: "X25519" }, true, [
      "deriveBits",
    ])) as CryptoKeyPair;
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const wrapKey = await deriveWrapKey(eph.privateKey, recipientPublicKey, salt);
    const encrypted = await subtle.encrypt(
      { name: ROOM_KEY_ALG, iv: toArrayBuffer(iv) },
      wrapKey,
      toArrayBuffer(roomKeyRaw)
    );
    const { ciphertext, tag } = splitCipherAndTag(encrypted);
    envelopes.push({
      recipientUserId: recipient.userId,
      algorithm: "X25519-HKDF-AES-256-GCM",
      ephemeralPublicKey: bytesToBase64(
        new Uint8Array(await subtle.exportKey("spki", eph.publicKey))
      ),
      iv: bytesToBase64(iv),
      salt: bytesToBase64(salt),
      ciphertext: bytesToBase64(ciphertext),
      tag: bytesToBase64(tag),
    });
  }

  return { roomKeyRaw: bytesToBase64(roomKeyRaw), envelopes };
};

export const ensureRoomKey = async (params: {
  roomId: string;
  epoch: number;
  fetchEnvelope: () => Promise<{
    ephemeralPublicKey: string;
    iv: string;
    salt: string;
    ciphertext: string;
    tag: string;
  } | null>;
}) => {
  const subtle = ensureSubtle();
  const { roomId, epoch, fetchEnvelope } = params;
  const existing = await getRoomKeyRaw(roomId, epoch);
  if (existing) {
    return subtle.importKey("raw", base64ToArrayBuffer(existing), { name: "AES-GCM" }, false, [
      "encrypt",
      "decrypt",
    ]);
  }

  const envelope = await fetchEnvelope();
  if (!envelope) {
    throw new Error("No room key envelope available");
  }

  const privateKey = await getIdentityPrivateCryptoKey();
  const ephemeralPublicKey = await subtle.importKey(
    "spki",
    base64ToArrayBuffer(envelope.ephemeralPublicKey),
    { name: "X25519" },
    false,
    []
  );
  const salt = base64ToBytes(envelope.salt);
  const wrapKey = await deriveWrapKey(privateKey, ephemeralPublicKey, salt);
  const encrypted = combineCipherAndTag(
    base64ToBytes(envelope.ciphertext),
    base64ToBytes(envelope.tag)
  );

  const raw = await subtle.decrypt(
    { name: "AES-GCM", iv: base64ToArrayBuffer(envelope.iv) },
    wrapKey,
    toArrayBuffer(encrypted)
  );
  const rawBytes = new Uint8Array(raw);
  await setRoomKeyRaw(roomId, epoch, bytesToBase64(rawBytes));
  return subtle.importKey("raw", toArrayBuffer(rawBytes), { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
};
