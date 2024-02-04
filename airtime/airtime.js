const Lipad = require("../Lipad/Lipad");
const accessKey = "4DzJhGEGp89WDL5iS81GXQcRamseRC";
const IVKey = "6YtAjICPCERfBQr319ZD9HLFWH918I";
const consumerSecret = "BpfvZ6PLR4xGrDSFTxVfbbbaEuPfoT";
const consumerKey = "DWdJ2eWLVCXJ5vHVSpSoyzUg19a3pe";
const chargeRequestId = "2043";
const environment = "sandbox";
let payload = {
  msisdn: "+254714254393",
  account_number: "oid45243",
  country_code: "KEN",
  currency_code: "KES",
  client_code: "TIM-LSO40I3",
  due_date: new Date("2024-03-02T17:00:00Z").toISOString(),
  customer_email: "johndoe@mail.com",
  customer_first_name: "John",
  customer_last_name: "Doe",
  merchant_transaction_id: "48783",
  preferred_payment_option_code: "",
  callback_url: "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
  request_amount: "202",
  request_description: "Dummy merchant transaction",
  success_redirect_url:
    "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
  fail_redirect_url:
    "https://webhook.site/6c933f61-d6da-4f8e-8a44-bf0323eb8ad6",
  invoice_number: "",
  language_code: "en",
  service_code: "TIMSAF418"
};

// let payload = {
//   external_reference: "123456",
//   origin_channel_code: "API",
//   originator_msisdn: "254714254393",
//   payer_msisdn: "254714254393",
//   service_code: "TIMSAF418",
//   client_code: "TIM-LSO40I3",
//   account_number: "85219",
//   invoice_number: "852",
//   currency_code: "KES",
//   country_code: "KEN",
//   amount: "4",
//   add_transaction_charge: false,
//   paybill: "4087453",
//   transaction_charge: "0",
//   payer_email: "1@gmail.com",
//   payment_method_code: "MPESA_KEN",
//   extra_data: {},
//   notify_client: false,
//   notify_originator: false,
// };
let checkout = new Lipad(IVKey, consumerSecret, consumerKey, environment);
async function main() {
  try {
    // await checkout.DirectCharge(payload);
    // const result = await checkout.getChargeRequestStatus(chargeRequestId);
    // console.log('Charge Request Result', result);
    // Validate payload before encrypting
    checkout.validatePayload(payload);

    const payloadStr = JSON.stringify(payload);

    // Encrypt the payload
    let encryptedPayload = checkout.encrypt(payloadStr);
    console.log('Encrypted Payload', encryptedPayload);

    // Build the checkout URL
    const checkoutUrl =
      "https://checkout2.dev.lipad.io/?access_key=" +
      encodeURIComponent(accessKey) +
      "&payload=" +
      encodeURIComponent(encryptedPayload);

    console.log("Checkout URL", checkoutUrl);

    // Get checkout status and Access Token
    const checkoutData = await checkout.getCheckoutStatus(
      payload.merchant_transaction_id,
    );
    console.log("Checkout Status", checkoutData);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
