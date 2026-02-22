import {
  getIdentityPrivateKeyPkcs8 as getIdentityPrivateKeyPkcs8Stored,
  getIdentityPublicKeySpki as getIdentityPublicKeySpkiStored,
  setIdentityKeyPair,
} from "./indexeddb";
import {
  base64ToArrayBuffer,
  bytesToBase64,
  textToBytes,
  toArrayBuffer,
} from "./base64";

const IDENTITY_ALGORITHM = "X25519";
const RECOVERY_VERSION = 1;

export interface RecoveryBackupPayload {
  encryptedPrivateKey: string;
  publicKeySpki: string;
  salt: string;
  nonce: string;
  kdfParams: {
    algorithm: "pbkdf2-sha256";
    iterations: number;
    dkLen: number;
  };
  version: number;
}

const ensureSubtle = () => {
  if (!window?.crypto?.subtle) {
    throw new Error("WebCrypto unavailable");
  }
  return window.crypto.subtle;
};

const importIdentityPrivateKey = async (privateKeyPkcs8B64: string) => {
  const subtle = ensureSubtle();
  return subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(privateKeyPkcs8B64),
    { name: IDENTITY_ALGORITHM },
    true,
    ["deriveBits"]
  );
};

const importIdentityPublicKey = async (publicKeySpkiB64: string) => {
  const subtle = ensureSubtle();
  return subtle.importKey(
    "spki",
    base64ToArrayBuffer(publicKeySpkiB64),
    { name: IDENTITY_ALGORITHM },
    true,
    []
  );
};

export const ensureIdentityKeyPair = async () => {
  const subtle = ensureSubtle();
  const existingPrivate = await getIdentityPrivateKeyPkcs8Stored();
  const existingPublic = await getIdentityPublicKeySpkiStored();
  if (existingPrivate && existingPublic) {
    return {
      privateKeyPkcs8: existingPrivate,
      publicKeySpki: existingPublic,
      algorithm: IDENTITY_ALGORITHM,
    };
  }

  const keyPair = (await subtle.generateKey(
    { name: IDENTITY_ALGORITHM },
    true,
    ["deriveBits"]
  )) as CryptoKeyPair;
  const privateKeyPkcs8 = bytesToBase64(
    new Uint8Array(await subtle.exportKey("pkcs8", keyPair.privateKey))
  );
  const publicKeySpki = bytesToBase64(
    new Uint8Array(await subtle.exportKey("spki", keyPair.publicKey))
  );

  await setIdentityKeyPair(privateKeyPkcs8, publicKeySpki);
  return {
    privateKeyPkcs8,
    publicKeySpki,
    algorithm: IDENTITY_ALGORITHM,
  };
};

export const getIdentityPrivateCryptoKey = async (): Promise<CryptoKey> => {
  const privateKey = await getIdentityPrivateKeyPkcs8Stored();
  if (!privateKey) {
    throw new Error("Identity private key not found");
  }
  return importIdentityPrivateKey(privateKey);
};

const deriveScryptLikeKey = async (
  secret: string,
  saltB64: string
): Promise<CryptoKey> => {
  const subtle = ensureSubtle();
  const salt = base64ToArrayBuffer(saltB64);
  const keyMaterial = await subtle.importKey(
    "raw",
    toArrayBuffer(textToBytes(secret)),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: 210000,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const buildRecoveryBackup = async (
  passphrase: string
): Promise<RecoveryBackupPayload> => {
  const subtle = ensureSubtle();
  const privateKeyPkcs8 = await getIdentityPrivateKeyPkcs8Stored();
  const publicKeySpki = await getIdentityPublicKeySpkiStored();
  if (!privateKeyPkcs8) {
    throw new Error("No identity private key found");
  }
  if (!publicKeySpki) {
    throw new Error("No identity public key found");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const nonce = window.crypto.getRandomValues(new Uint8Array(12));
  const saltB64 = bytesToBase64(salt);
  const kek = await deriveScryptLikeKey(passphrase, saltB64);
  const encryptedPrivateKey = await subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(nonce) },
    kek,
    base64ToArrayBuffer(privateKeyPkcs8)
  );

  return {
    encryptedPrivateKey: bytesToBase64(new Uint8Array(encryptedPrivateKey)),
    publicKeySpki,
    salt: saltB64,
    nonce: bytesToBase64(nonce),
    kdfParams: {
      algorithm: "pbkdf2-sha256",
      iterations: 210000,
      dkLen: 32,
    },
    version: RECOVERY_VERSION,
  };
};

export const buildPinRecoveryBackup = async (
  pin: string
): Promise<RecoveryBackupPayload> => {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("PIN must be 6 digits");
  }
  return buildRecoveryBackup(pin);
};

export const recoverIdentityFromBackup = async (
  backup: RecoveryBackupPayload,
  passphrase: string
) => {
  const subtle = ensureSubtle();
  const kek = await deriveScryptLikeKey(passphrase, backup.salt);
  const decrypted = await subtle.decrypt(
    { name: "AES-GCM", iv: base64ToArrayBuffer(backup.nonce) },
    kek,
    base64ToArrayBuffer(backup.encryptedPrivateKey)
  );
  const privateKeyPkcs8 = bytesToBase64(new Uint8Array(decrypted));
  if (!backup.publicKeySpki) {
    throw new Error("Recovery backup is missing public key");
  }
  await setIdentityKeyPair(privateKeyPkcs8, backup.publicKeySpki);
  return { privateKeyPkcs8, publicKeySpki: backup.publicKeySpki };
};

export const recoverIdentityFromPinBackup = async (
  backup: RecoveryBackupPayload,
  pin: string
) => {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("PIN must be 6 digits");
  }
  return recoverIdentityFromBackup(backup, pin);
};

export const importRecipientPublicKey = (publicKeySpki: string) =>
  importIdentityPublicKey(publicKeySpki);
