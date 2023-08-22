import axios from 'axios';
import { encryptPayload} from "../encryption/encryption";

class AirtimeSDK {
    public async sendEncryptedAirtime(
        msisdn: string,
        accountNumber: string,
        amount: number,
        currencyCode: string,
        countryCode: string,
        dueDate: string,
        customerEmail: string,
        customerFirstName: string,
        customerLastName: string,
        merchantTransactionId: string,
        callbackUrl: string,
        requestDescription: string,
        successRedirectUrl: string,
        failRedirectUrl: string,
        languageCode: string
    ): Promise<void> {
        const payload = {
            msisdn,
            account_number: accountNumber,
            country_code: countryCode,
            currency_code: currencyCode,
            due_date: dueDate,
            customer_email: customerEmail,
            customer_first_name: customerFirstName,
            customer_last_name: customerLastName,
            merchant_transaction_id: merchantTransactionId,
            callback_url: callbackUrl,
            request_amount: amount,
            request_description: requestDescription,
            success_redirect_url: successRedirectUrl,
            fail_redirect_url: failRedirectUrl,
            client_code: process.env.CLIENT_CODE,
            service_code: process.env.SERVICE_CODE,
            language_code: languageCode,
        };

        // Encrypt the payload
        const encryptedPayload = encryptPayload(payload, process.env.iv_key, process.env.consumer_secret);

        const checkoutUrl =
            'https://checkout2.dev.lipad.io/?access_key=' +
            process.env.ACCESS_KEY +
            '&payload=' +
            encryptedPayload;

        // Make a request to the checkout URL
        try {
            const response = await axios.get(checkoutUrl);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

const airtimeSDK = new AirtimeSDK();

const msisdn = '+254714254392';
const accountNumber = '+254714254392';
const countryCode = 'KEN';
const currencyCode = 'KES';
const currentTimestamp = Math.floor(Date.now() / 1000);
const dueDate = new Date(currentTimestamp + 1800).toISOString(); // due in 30 mins
const customerEmail = '3@gmail.com';
const customerFirstName = 'Timothy';
const customerLastName = 'Waweru';
const merchantTransactionId = '42';
const callbackUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6';
const amount = 300;
const requestDescription = 'fbthhbnjmn';
const successRedirectUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad7';
const failRedirectUrl = 'https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6';
const languageCode = 'en';

airtimeSDK.sendEncryptedAirtime(
    msisdn,
    accountNumber,
    amount,
    currencyCode,
    countryCode,
    dueDate,
    customerEmail,
    customerFirstName,
    customerLastName,
    merchantTransactionId,
    callbackUrl,
    requestDescription,
    successRedirectUrl,
    failRedirectUrl,
    languageCode
);