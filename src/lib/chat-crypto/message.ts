import {
  base64ToArrayBuffer,
  base64ToBytes,
  bytesToBase64,
  bytesToText,
  textToBytes,
  toArrayBuffer,
} from "./base64";

const MESSAGE_ALGORITHM = "AES-GCM";
const MESSAGE_ALG_LABEL = "AES-256-GCM";

export interface EncryptedMessageContent {
  alg: string;
  keyEpoch: number;
  ciphertext: string;
  iv: string;
  tag: string;
  aadHash: string;
}

const encoder = new TextEncoder();

const splitCipherAndTag = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 17) {
    throw new Error("Invalid encrypted payload");
  }
  const tagLength = 16;
  return {
    ciphertext: bytes.slice(0, bytes.length - tagLength),
    tag: bytes.slice(bytes.length - tagLength),
  };
};

const combineCipherAndTag = (ciphertext: Uint8Array, tag: Uint8Array) => {
  const merged = new Uint8Array(ciphertext.length + tag.length);
  merged.set(ciphertext, 0);
  merged.set(tag, ciphertext.length);
  return merged;
};

export const buildMessageAad = (params: {
  roomId: string;
  senderId: string;
  messageType: "text";
  keyEpoch: number;
}) =>
  JSON.stringify({
    roomId: params.roomId,
    senderId: params.senderId,
    messageType: params.messageType,
    keyEpoch: params.keyEpoch,
  });

const hashAad = async (aad: string) => {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    toArrayBuffer(textToBytes(aad))
  );
  return bytesToBase64(new Uint8Array(digest));
};

export const encryptTextMessage = async (params: {
  roomId: string;
  senderId: string;
  text: string;
  keyEpoch: number;
  roomKey: CryptoKey;
}) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const aad = buildMessageAad({
    roomId: params.roomId,
    senderId: params.senderId,
    messageType: "text",
    keyEpoch: params.keyEpoch,
  });
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: MESSAGE_ALGORITHM,
      iv,
      additionalData: toArrayBuffer(encoder.encode(aad)),
    },
    params.roomKey,
    toArrayBuffer(textToBytes(params.text))
  );

  const { ciphertext, tag } = splitCipherAndTag(encrypted);
  return {
    encryptedContent: {
      alg: MESSAGE_ALG_LABEL,
      keyEpoch: params.keyEpoch,
      ciphertext: bytesToBase64(ciphertext),
      iv: bytesToBase64(iv),
      tag: bytesToBase64(tag),
      aadHash: await hashAad(aad),
    } as EncryptedMessageContent,
  };
};

export const decryptTextMessage = async (params: {
  roomId: string;
  senderId: string;
  keyEpoch: number;
  roomKey: CryptoKey;
  encryptedContent: EncryptedMessageContent;
}) => {
  const aad = buildMessageAad({
    roomId: params.roomId,
    senderId: params.senderId,
    messageType: "text",
    keyEpoch: params.keyEpoch,
  });
  const aadHash = await hashAad(aad);
  if (aadHash !== params.encryptedContent.aadHash) {
    throw new Error("AAD mismatch");
  }

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: MESSAGE_ALGORITHM,
      iv: base64ToArrayBuffer(params.encryptedContent.iv),
      additionalData: toArrayBuffer(encoder.encode(aad)),
    },
    params.roomKey,
    combineCipherAndTag(
      base64ToBytes(params.encryptedContent.ciphertext),
      base64ToBytes(params.encryptedContent.tag)
    ).buffer
  );
  return bytesToText(decrypted);
};
