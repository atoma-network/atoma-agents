import crypto from 'crypto';
import dotenv from 'dotenv';
import config from '../config/config';
dotenv.config();
const { algorithm, secretKey } = config.encryption;
const encoding = 'base64';

const ivLength = 16;

class Utils {
  // **Encryption Function**
  encrypt(message: string) {
    const iv = crypto.randomBytes(ivLength);
    const bufferedSecret = Buffer.from(secretKey, encoding);
    const cipher = crypto.createCipheriv(algorithm, bufferedSecret, iv);
    let encrypted = cipher.update(message, 'utf-8', encoding);
    encrypted += cipher.final(encoding);
    return { encrypted, iv: iv.toString(encoding) };
  }
  // **Decryption Function**
  decrypt(encrypted: string, iv: string) {
    const ivBuffer = Buffer.from(iv, encoding);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, encoding), ivBuffer);
    let decrypted = decipher.update(encrypted, encoding, 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}

export default Utils;
