const crypto = require("crypto");
const https = require('https');
const querystring = require('querystring');

class LipadCheckout {
    constructor(ivKey, consumerSecret) {
        this.IVKey = ivKey;
        this.consumerSecret = consumerSecret;
        this.algorithm = "aes-256-cbc";
    }

    validatePayload(obj) {
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

    encrypt(payload) {
        let secret = crypto
            .createHash('sha256')
            .update(this.consumerSecret)
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

        return result.toString('base64');
    }

    async getAccessToken(consumerKey, consumerSecret) {
        const authData = {
            consumerKey: consumerKey,
            consumerSecret: consumerSecret
        };

        const postData = querystring.stringify(authData);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const apiUrl = 'https://uat.checkout-api.lipad.io/api/v1/api-auth/access-token';

        return new Promise((resolve, reject) => {
            const req = https.request(apiUrl, options, res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', async () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.access_token) {
                            const access_token = response.access_token;
                            resolve(access_token);
                        } else if (res.statusCode === 401) {
                            const errorMessage = "Invalid Credentials!";
                            console.log(errorMessage);
                            reject(new Error(errorMessage));
                        } else {
                            reject(new Error('Access token not found in response'));
                            console.log('Response', response);
                        }
                    } catch (error) {
                        reject(new Error('Error parsing JSON response:' + error.message));
                    }
                });
            });

            req.on('error', error => {
                console.error('Error:', error);
                reject(error);
            });

            req.write(postData); // Write the serialized data to the request body
            req.end();
        });
    }

    async checkCheckoutStatus(merchant_transaction_id, access_token) {
        const apiUrl = `https://uat.checkout-api.lipad.io/api/v1/checkout/request/status?merchant_transaction_id=${merchant_transaction_id}`;

        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };

            const req = https.request(apiUrl, options, res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(data));
                    } else if (res.statusCode === 401) {
                        const errorMessage = `Transaction with Merchant Transaction ID ${merchant_transaction_id} not found`;
                        console.log(errorMessage);
                        reject(new Error(errorMessage));
                    } else {
                        reject(new Error(`Request failed with status code ${res.statusCode}`));
                    }
                });
            });

            req.on('error', error => {
                console.error('Error:', error);
                reject(error);
            });

            req.end();
        });
    }

    async getCheckoutStatus(merchant_transaction_id, consumerKey, consumerSecret, payload) {
        try {
            const access_token = await this.getAccessToken(consumerKey, consumerSecret);
            console.log('Access Token', access_token);
            return await this.checkCheckoutStatus(merchant_transaction_id, access_token, payload);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

module.exports.Checkout = LipadCheckout;

