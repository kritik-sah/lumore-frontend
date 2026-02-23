const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const base64ToArrayBuffer = (value: string): ArrayBuffer => {
  const bytes = base64ToBytes(value);
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  return output.buffer;
};

export const toArrayBuffer = (view: Uint8Array): ArrayBuffer => {
  const output = new Uint8Array(view.byteLength);
  output.set(view);
  return output.buffer;
};

export const textToBytes = (value: string): Uint8Array => encoder.encode(value);
export const bytesToText = (value: ArrayBuffer | Uint8Array): string =>
  decoder.decode(value instanceof Uint8Array ? value : new Uint8Array(value));
