import axios from "axios";

const PHP_DECRYPT_URL = "https://txserver.site/decryption.php";
const PHP_ENCRYPT_URL = "https://txserver.site/encryption.php";

/**
 * 🔓 Decrypt incoming payload via PHP
 */
export async function decryptViaPhp(payload: string): Promise<any> {
    const response = await axios.post(
        PHP_DECRYPT_URL,
        { encrypted: payload },
        { headers: { "Content-Type": "application/json" } }
    );

    if (response.data?.code !== 0) {
        throw new Error("PHP decryption failed");
    }

    return response.data.data; // contains { credit_amount, timestamp }
}

/**
 * 🔐 Encrypt response payload via PHP
 */
export async function encryptViaPhp(data: object): Promise<string> {
    const response = await axios.post(
        PHP_ENCRYPT_URL,
        data,
        { headers: { "Content-Type": "application/json" } }
    );

    if (response.data?.code !== 0) {
        throw new Error("PHP encryption failed");
    }

    return response.data.data.encrypted;
}
