const LipadEncryption = require('../encryption/encryption');
const accessKey = "t9BbimKKJebKnjEya34iN68xtipG7j";
const IVKey = "p6BbimKKJebKnjEya34iN68xtipG7j";
const consumerSecret = "C6BbimKKJebKnjEya34iN68xtipG7j";
const consumerKey = "0GtzQyR9UkahffE0AGCZ3GWHlGxVar";

let payload = {
    msisdn: "+254714254393",
    account_number: "oid39",
    country_code: "KEN",
    currency_code: "KES",
    client_code: "DEMO",
    due_date: "2023-12-12T13:00:00Z",
    customer_email: "johndoe@mail.com",
    customer_first_name: "John",
    customer_last_name: "Doe",
    merchant_transaction_id: "36",
    preferred_payment_option_code: "",
    callback_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    request_amount: "100",
    request_description: "Dummy merchant transaction",
    success_redirect_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    fail_redirect_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    invoice_number: "",
    language_code: "en",
    service_code: "DEMCHE1"
};

// Create an instance of LipadEncryption
let encryption = new LipadEncryption.Encryption(IVKey, consumerSecret);

async function main() {
    try {
        // Validate payload before encrypting
        encryption.validatePayload(payload);

        const payloadStr = JSON.stringify(payload);

        // Encrypt the payload
        let encryptedPayload = encryption.encrypt(payloadStr);
        // console.log('Encrypted Payload', encryptedPayload);

        // Get access token
        const access_token = await encryption.getAccessToken(consumerKey, consumerSecret);
        console.log('Access Token', access_token);

        // Build the checkout URL
        const checkoutUrl =
            'https://checkout2.dev.lipad.io/?access_key=' +
            encodeURIComponent(accessKey) +
            '&payload=' +
            encodeURIComponent(encryptedPayload);

        console.log('Checkout URL', checkoutUrl);

        // Get checkout status
        const checkoutData = await encryption.getCheckoutStatus(payload.merchant_transaction_id, consumerKey, consumerSecret, payload);
        console.log('Checkout Status', checkoutData);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
