const LipadEncryption = require('../encryption/encryption');
const accessKey = "t9BbimKKJebKnjEya34iN68xtipG7j"
const IVKey = "p6BbimKKJebKnjEya34iN68xtipG7j";
const secretKey = "C6BbimKKJebKnjEya34iN68xtipG7j";
const consumerKey = "0GtzQyR9UkahffE0AGCZ3GWHlGxVar";
let payload = {
    msisdn: "+254700000000",
    account_number: "oid39",
    country_code: "KEN",
    currency_code: "KES",
    client_code: "ABCDEXAMPLE",
    due_date: "2022-12-12T13:00:00Z",
    customer_email: "johndoe@mail.com",
    customer_first_name: "John",
    customer_last_name: "Doe",
    merchant_transaction_id: "60",
    preferred_payment_option_code: "",
    callback_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    request_amount: "100",
    request_description: "Dummy merchant transaction",
    success_redirect_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    fail_redirect_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
    invoice_number: "",
    language_code: "en",
    service_code: "<Client service code>"
};
//Validate payload before encrypting
let encryption = new LipadEncryption.Encryption(IVKey, secretKey);
encryption.validatePayload(payload);

const payloadStr = JSON.stringify(payload);

const accessToken = encryption.getAccessToken(consumerKey, secretKey);
console.log('Access token', accessToken);
encryption.getCheckoutStats(payload.merchant_transaction_id, accessToken)
    .then(checkoutData => {
        console.log('Checkout Data:', checkoutData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
// call encrypt method
let encryptedPayload = encryption.encrypt(payloadStr);

// console.log(encryptedPayload);

const checkoutUrl =
    'https://checkout2.dev.lipad.io/?access_key=' +
    encodeURIComponent(accessKey) +
    '&payload=' +
    encodeURIComponent(encryptedPayload);
console.log('Checkout URL', checkoutUrl)
