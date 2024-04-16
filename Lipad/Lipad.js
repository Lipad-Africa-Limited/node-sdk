const crypto = require("crypto");
const axios = require("axios");

const CHECKOUT_BASE_URL = {
    production: "https://checkout.api.lipad.io", sandbox: "https://checkout.api.uat.lipad.io",
};
const DIRECT_CHARGE_BASE_URL = {
    production: "https://charge.lipad.io/v1", sandbox: "https://dev.charge.lipad.io/v1",
};
const DIRECT_API_AUTH_URL = {
    production: "https://charge.lipad.io/v1/auth", sandbox: "https://dev.lipad.io/v1/auth",
};

class Lipad {
    constructor(IVKey, consumerSecret, consumerKey, environment) {
        this.IVKey = IVKey;
        this.consumerSecret = consumerSecret;
        this.algorithm = "aes-256-cbc";
        this.consumerKey = consumerKey;

        if (!environment) {
            console.error("Error: Environment is required.");
            return;
        }
        this.environment = environment;
    }

    validatePayload(obj) {
        const requiredKeys = ["msisdn", "account_number", "country_code", "currency_code", "client_code", "due_date", "customer_email", "customer_first_name", "customer_last_name", "merchant_transaction_id", "preferred_payment_option_code", "callback_url", "request_amount", "request_description", "success_redirect_url", "fail_redirect_url", "invoice_number", "language_code", "service_code",];

        for (const key of requiredKeys) {
            if (!(key in obj)) {
                throw new Error(`Missing required key: ${key}`);
            }
        }
    }

    encrypt(payload) {
        let secret = crypto
            .createHash("sha256")
            .update(this.consumerSecret)
            .digest("hex")
            .substring(0, 32);

        secret = Buffer.from(secret);

        // prepare the IV key
        let IV = crypto
            .createHash("sha256")
            .update(this.IVKey)
            .digest("hex")
            .substring(0, 16);

        IV = Buffer.from(IV);

        const cipher = crypto.createCipheriv(this.algorithm, secret, IV);

        const result = Buffer.concat([cipher.update(payload), cipher.final()]);

        return result.toString("base64");
    }

    async accessTokens(apiUrl, postData) {
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(postData),
            },
        };

        try {
            const response = await axios.post(apiUrl, postData, config);
            const {access_token} = response.data;

            if (access_token) {
                return access_token;
            } else if (response.status === 401) {
                const errorMessage = "Invalid Credentials!";
                console.log(errorMessage);
                throw new Error(errorMessage);
            } else {
                throw new Error("Access token not found in response");
            }
        } catch (error) {
            console.error("Error:", error.message);
            throw error;
        }
    }

    async getDirectAPIAccessToken() {
        const authData = {
            consumer_key: this.consumerKey, consumer_secret: this.consumerSecret,
        };

        const postData = new URLSearchParams(authData).toString();
        const apiUrl = DIRECT_API_AUTH_URL[this.environment];

        if (!apiUrl) {
            throw new Error(`Invalid environment: ${this.environment}`);
        }

        return this.accessTokens(apiUrl, postData);

    }

    async getAccessToken() {
        const authData = {
            consumerKey: this.consumerKey, consumerSecret: this.consumerSecret,
        };

        const postData = new URLSearchParams(authData).toString();
        const apiUrl = `${CHECKOUT_BASE_URL[this.environment]}/api/v1/api-auth/access-token`;

        return await this.accessTokens(apiUrl, postData);
    }

    async checkCheckoutStatus(merchant_transaction_id, access_token) {
        const apiUrl = `${CHECKOUT_BASE_URL[this.environment]}/api/v1/checkout/request/status?merchant_transaction_id=${merchant_transaction_id}`;
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            } else if (response.status === 401) {
                const errorMessage = `Transaction with Merchant Transaction ID ${merchant_transaction_id} not found`;
                console.log(errorMessage);
                return {error: errorMessage};
            } else {
                const errorMessage = `Request failed with status code ${response.status}`;
                console.error(errorMessage);
                return {error: errorMessage};
            }
        } catch (error) {
            console.error("Error:", error.message);
            return {error: error.message};
        }
    }

    async getCheckoutStatus(merchant_transaction_id) {
        try {
            const access_token = await this.getAccessToken();

            return await this.checkCheckoutStatus(merchant_transaction_id, access_token);
        } catch (error) {
            console.error("Error:", error);
            return {error: error.message};
        }
    }

    async DirectCharge(payload) {
        try {
            const baseUrl = DIRECT_CHARGE_BASE_URL[this.environment];
            const accessToken = await this.getDirectAPIAccessToken();

            // Construct the complete URL by appending the fixed endpoint
            const url = `${baseUrl}/mobile-money/charge`;

            // Build the payment payload
            const paymentPayload = this.buildPaymentPayload(payload);

            // Make the POST request
            await this.postRequest(url, paymentPayload, accessToken);
        } catch (error) {
            console.error("Error:", error.message);
            throw error;
        }
    }


    buildPaymentPayload(payload) {
        const commonPayload = {
            external_reference: payload.external_reference,
            origin_channel_code: "API",
            originator_msisdn: payload.originator_msisdn,
            payer_msisdn: payload.payer_msisdn,
            service_code: payload.service_code,
            account_number: payload.account_number,
            client_code: payload.client_code,
            payer_email: payload.payer_email,
            country_code: payload.country_code,
            invoice_number: payload.invoice_number,
            currency_code: payload.currency_code,
            amount: payload.amount,
            add_transaction_charge: payload.add_transaction_charge,
            transaction_charge: payload.transaction_charge,
            extra_data: payload.extra_data,
            description: "Payment by " + payload.payer_msisdn,
            notify_client: payload.notify_client,
            notify_originator: payload.notify_originator,
        };

        const mpesaPayload = {
            ...commonPayload, payment_method_code: "MPESA_KEN", paybill: payload.paybill,
        };

        const airtelPayload = {
            ...commonPayload, payment_method_code: "AIRTEL_KEN",
        };

        return payload.payment_method_code === "MPESA_KEN" ? mpesaPayload : airtelPayload;
    }

    async postRequest(url, data, accessToken) {
        const headers = {
            "x-access-token": accessToken, "Content-Type": "application/json",
        };

        try {
            const response = await axios.post(url, data, {headers});
            return response.data;
        } catch (error) {
            throw new Error("Failed to make POST request: " + error.message);
        }
    }

    async getChargeRequestStatus(chargeRequestId) {
        try {
            const accessToken = await this.getDirectAPIAccessToken();
            const baseUrl = `${DIRECT_CHARGE_BASE_URL[this.environment]}/transaction/${chargeRequestId}/status`;
            const headers = {
                "x-access-token": accessToken, "Content-Type": "application/json",
            };

            const response = await axios.get(baseUrl, {headers});

            if (response.status === 200) {
                return response.data;
            } else {
                console.error(`Failed to make GET request. Response code: ${response.status}`);
                throw new Error(`Failed to make GET request. Response code: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to make GET request: ${error.message}`);
            throw new Error(`Failed to make GET request: ${error.message}`);
        }
    }
}

module.exports = Lipad;
