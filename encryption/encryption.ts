import * as crypto from 'crypto';

export function encryptPayload(payload: any, ivKey: string, consumerSecret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ivKey, iv);
    let encryptedPayload = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    encryptedPayload += cipher.final('hex');
    return encryptedPayload;
}
