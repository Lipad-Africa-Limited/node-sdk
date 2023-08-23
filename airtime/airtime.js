const axios = require('axios');
const LipadEncryption = require('../encryption/encryption');
// const rootDir = path.resolve(__dirname, '..');
// require('dotenv').config({ path: path.join(rootDir, '.env') });
//
// class AirtimeSDK {
//     async sendEncryptedAirtime(
//         msisdn,
//         accountNumber,
//         amount,
//         currencyCode,
//         countryCode,
//         dueDate,
//         customerEmail,
//         customerFirstName,
//         customerLastName,
//         merchantTransactionId,
//         callbackUrl,
//         requestDescription,
//         successRedirectUrl,
//         failRedirectUrl,
//         languageCode
//     ) {
//         const payload = {
//             msisdn,
//             account_number: accountNumber,
//             country_code: countryCode,
//             currency_code: currencyCode,
//             due_date: dueDate,
//             customer_email: customerEmail,
//             customer_first_name: customerFirstName,
//             customer_last_name: customerLastName,
//             merchant_transaction_id: merchantTransactionId,
//             callback_url: callbackUrl,
//             request_amount: amount,
//             request_description: requestDescription,
//             success_redirect_url: successRedirectUrl,
//             fail_redirect_url: failRedirectUrl,
//             client_code: process.env.CLIENT_CODE,
//             service_code: process.env.SERVICE_CODE,
//             language_code: languageCode,
//         };
//
//         // Encrypt the payload
//         const encryptedPayload = LipadEncryption(payload);
//
//         const checkoutUrl =
//             'https://checkout2.dev.lipad.io/?access_key=' +
//             process.env.ACCESS_KEY +
//             '&payload=' +
//             encodeURIComponent(JSON.stringify(encryptedPayload));
//
//         // console.log('Checkout URL:', checkoutUrl);
//         // Make a request to the checkout URL
//         try {
//             const response = await axios.get(checkoutUrl);
//             console.log('Response:', response.data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
// }
//
// const airtimeSDK = new AirtimeSDK();
//
// const msisdn = '+254714254392';
// const accountNumber = '+254714254392';
// const countryCode = 'KEN';
// const currencyCode = 'KES';
// const currentTimestamp = Math.floor(Date.now() / 1000);
// const dueDate = new Date(currentTimestamp + 1800).toISOString(); // due in 30 mins
// const customerEmail = '3@gmail.com';
// const customerFirstName = 'Timothy';
// const customerLastName = 'Waweru';
// const merchantTransactionId = '48';
// const callbackUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6';
// const amount = 300;
// const requestDescription = 'fbthhbnjmn';
// const successRedirectUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad7';
// const failRedirectUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6';
// const languageCode = 'en';
//
// airtimeSDK.sendEncryptedAirtime(
//     msisdn,
//     accountNumber,
//     amount,
//     currencyCode,
//     countryCode,
//     dueDate,
//     customerEmail,
//     customerFirstName,
//     customerLastName,
//     merchantTransactionId,
//     callbackUrl,
//     requestDescription,
//     successRedirectUrl,
//     failRedirectUrl,
//     languageCode
// );
// const checkoutEncrypt = require('./Encryption')
const accessKey = "t9BbimKKJebKnjEya34iN68xtipG7j"
const IVKey = "p6BbimKKJebKnjEya34iN68xtipG7j";
const secretKey = "C6BbimKKJebKnjEya34iN68xtipG7j";
const algorithm = "aes-256-cbc";

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
    merchant_transaction_id: "txn_id_342",
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

const payloadStr = JSON.stringify(payload);

// Create object of the Encryption class
let encryption = new LipadEncryption.Encryption(IVKey, secretKey, algorithm);

// call encrypt method
let encryptedPayload = encryption.encrypt(payloadStr);

// console.log(encryptedPayload);

const checkoutUrl =
    'https://checkout2.dev.lipad.io/?access_key=' +
    encodeURIComponent(accessKey) +
    '&payload=' +
    encodeURIComponent(encryptedPayload);
console.log('Checkout URL', checkoutUrl)
