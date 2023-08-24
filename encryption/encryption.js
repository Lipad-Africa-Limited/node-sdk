const crypto = require("crypto");
class LipadEncryption{
    constructor(ivKey, secretKey, algorithm) {
        this.IVKey = ivKey;
        this.secretKey = secretKey;
        this.algorithm = "aes-256-cbc";
    }
validatePayload(obj){
        const requiredKeys = [
        "msisdn",
        "account_number",
        "country_code",
        "currency_code",
        "client_code",
        "due_date",
        "customer_email",
        "customer_first_name",
        "customer_last_name",
        "merchant_transaction_id",
        "preferred_payment_option_code",
        "callback_url",
        "request_amount",
        "request_description",
        "success_redirect_url",
        "fail_redirect_url",
        "invoice_number",
        "language_code",
        "service_code",
];
        for (const key of requiredKeys) {
            if (!(key in obj)) {
                throw new Error(`Missing required key: ${key}`);
            }
        }
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
