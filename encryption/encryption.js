const crypto = require("crypto");
function LipadEncryption(payload) {
    const IVKey = process.env.IVKey;
    const consumerSecret = process.env.consumerSecret;
    const algorithm = "aes-256-cbc";

    if (!IVKey || !consumerSecret) {
        throw new Error("IVKey and consumerSecret must be provided in environment variables.");
    }
    let jsonStringPayload = JSON.stringify(payload);
    let key = crypto.createHash("sha256").update(IVKey).digest("hex").substring(0, 16);
    key = Buffer.from(key);
    let secret = crypto.createHash("sha256").update(consumerSecret).digest("hex").substring(0, 32);
    secret = Buffer.from(secret);
    const cipher = crypto.createCipheriv(algorithm, secret, key);
    let encryptedData = cipher.update(jsonStringPayload, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    let encryptedPayload = Buffer.from(encryptedData, "hex").toString("base64");
    return encryptedPayload;
}
module.exports = LipadEncryption;