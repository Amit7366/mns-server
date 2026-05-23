// import CryptoJS from "crypto-js";

// const KEY = CryptoJS.enc.Utf8.parse(process.env.PROVIDER_AES_KEY!);

// export function decryptPayload(base64: string) {
//   const bytes = CryptoJS.AES.decrypt(base64, KEY, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   const text = bytes.toString(CryptoJS.enc.Utf8);
//   if (!text) throw new Error("❌ Decryption failed");

//   return JSON.parse(text);
// }

// export function encryptPayload(data: object) {
//   const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), KEY, {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();

//   // Provider verification log
//   console.log("🔐 PROVIDER WILL SEE:", decryptPayload(encrypted));
//   return encrypted;
// }
