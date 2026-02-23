const DB_NAME = "lumore-chat-crypto";
const DB_VERSION = 1;
const KEYS_STORE = "keys";
const ROOM_KEYS_STORE = "room_keys";

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(KEYS_STORE)) {
        db.createObjectStore(KEYS_STORE);
      }
      if (!db.objectStoreNames.contains(ROOM_KEYS_STORE)) {
        db.createObjectStore(ROOM_KEYS_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const idbGet = async <T>(storeName: string, key: IDBValidKey): Promise<T | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
};

const idbPut = async (
  storeName: string,
  key: IDBValidKey,
  value: unknown
): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getIdentityPrivateKeyPkcs8 = () => idbGet<string>(KEYS_STORE, "identity.private");
export const getIdentityPublicKeySpki = () => idbGet<string>(KEYS_STORE, "identity.public");
export const setIdentityKeyPair = async (privateKeyPkcs8B64: string, publicKeySpkiB64: string) => {
  await idbPut(KEYS_STORE, "identity.private", privateKeyPkcs8B64);
  await idbPut(KEYS_STORE, "identity.public", publicKeySpkiB64);
};

export const getRoomKeyRaw = (roomId: string, epoch: number) =>
  idbGet<string>(ROOM_KEYS_STORE, `${roomId}:${epoch}`);
export const setRoomKeyRaw = (roomId: string, epoch: number, rawB64: string) =>
  idbPut(ROOM_KEYS_STORE, `${roomId}:${epoch}`, rawB64);
