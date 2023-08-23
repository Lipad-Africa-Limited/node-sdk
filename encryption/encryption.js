const crypto = require("crypto");
// function LipadEncryption(payload) {
//     const IVKey = process.env.IVKey;
//     const consumerSecret = process.env.consumerSecret;
//     const algorithm = "aes-256-cbc";
//
//     if (!IVKey || !consumerSecret) {
//         throw new Error("IVKey and consumerSecret must be provided in environment variables.");
//     }
//     let jsonStringPayload = JSON.stringify(payload);
//     let key = crypto.createHash("sha256").update(IVKey).digest("hex").substring(0, 16);
//     key = Buffer.from(key);
//     let secret = crypto.createHash("sha256").update(consumerSecret).digest("hex").substring(0, 32);
//     secret = Buffer.from(secret);
//     const cipher = crypto.createCipheriv(algorithm, secret, key);
//     let encryptedData = cipher.update(jsonStringPayload, "utf-8", "hex");
//     encryptedData += cipher.final("hex");
//     let encryptedPayload = Buffer.from(encryptedData, "hex").toString("base64");
//     return encryptedPayload;
// }
// module.exports = LipadEncryption;
class LipadEncryption{
    constructor(ivKey, secretKey, algorithm) {
        this.IVKey = ivKey;
        this.secretKey = secretKey;
        this.algorithm = algorithm;
    }

    encrypt(payload){
        let secret = crypto
            .createHash('sha256')
            .update(this.secretKey)
            .digest('hex')
            .substring(0, 32);

        secret = Buffer.from(secret);

        // prepare the IV key
        let IV = crypto
            .createHash('sha256')
            .update(this.IVKey)
            .digest('hex')
            .substring(0, 16);

        IV = Buffer.from(IV);

        const cipher = crypto
            .createCipheriv(this.algorithm, secret, IV);

        const result = Buffer
            .concat([cipher.update(payload), cipher.final()]);

        var base64Str= Buffer
            .from(result, 'binary')
            .toString('base64');

        var base64Str2= Buffer
            .from(base64Str, 'binary')
            .toString('base64');

        return base64Str2;

    }
}

module.exports.Encryption = LipadEncryption;
