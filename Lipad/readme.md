# Lipad

The Lipad class provides a simple way to encrypt payloads using the given IV key, secret key, and encryption algorithm.

## Installation

This class relies on the built-in crypto module and axios so no additional installations are required.

## Checkout Usage

1.  **Import the Lipad class:**

        ```javascript
        const Lipad = require('../Lipad/Lipad');
        ```

    **Note:** Specify either 'sandbox' or 'production' for the `environment` parameter when creating an instance of the Lipad class.

2.  **Create an instance of Lipad by providing the required parameters:**

    ```javascript
    const IVKey = "your_IV_key";
    const consumerSecret = "your_secret_key";
    const consumerKey = "your_consumer_key";
    const environment = "sandbox";

    let payload = {};
    let lipad = new Lipad(IVKey, consumerSecret, consumerKey, environment);
    ```

3.  **Validate the payload using the validatePayload method:**

    ```javascript
    lipad.validatePayload(payload);
    ```

4.  **Encrypt a payload using the encrypt method:**

    ```javascript
    const payloadStr = JSON.stringify(payload);
    let encryptedPayload = lipad.encrypt(payloadStr);

    console.log("Encrypted Payload:", encryptedPayload);
    ```

5.  **Retrieve checkout status using the getCheckoutStatus method:**

    ```javascript
    lipad
      .getCheckoutStatus(
        payload.merchant_transaction_id,
      )
      .then((checkoutData) => {
        console.log("Checkout Data:", checkoutData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    ```

## Direct API Usage

1.  **Import the Lipad class:**

        ```javascript
        const Lipad = require('../Lipad/Lipad');
        ```

    **Note:** Specify either 'sandbox' or 'production' for the `environment` parameter when creating an instance of the Lipad class.

2.  **Create an instance of Lipad by providing the required parameters:**

    ```javascript
    const IVKey = "your_IV_key";
    const consumerSecret = "your_secret_key";
    const consumerKey = "your_consumer_key";
    const environment = "sandbox";

    let payload = {};
    let lipad = new Lipad(IVKey, consumerSecret, consumerKey, environment);

3.  **Charge using DirectCharge method:**

    ```javascript
    lipad
      .DirectCharge(payload)
      .then((response) => {
        console.log("Direct Charge Response:", response);
      })
      .catch((error) => {
        console.error("Error during Direct Charge:", error);
      });
    ```
4.  **Retrieve the status of a charge request using getChargeRequestStatus method**

    ```javascript
    lipad.getChargeRequestStatus(chargeRequestId)
    .then(status => {
        console.log('Charge Request Status:', status);
    })
    .catch(error => {
        console.error('Error retrieving Charge Request Status:', error);
    });
    ```

The `getCheckoutStatus` and `DirectCharge` methods include access token retrieval. Additionally, make sure to provide the `consumerKey` and `consumerSecret` when creating an instance of the Lipad class.

## API

### `Lipad(IVKey, consumerSecret, consumerKey, environment)`

Creates an instance of the Lipad class.

- `IVKey`: The IV key used for encryption.
- `consumerSecret`: The secret key used for encryption.
- `consumerKey`: The consumer key used for authentication.
- `environment`: Specify either 'sandbox' or 'production' for the desired environment.

### `encrypt(payload)`

Encrypts a given payload.

- `payload`: The payload to be encrypted.

Returns the encrypted payload in base64-encoded format.

### `validatePayload(payload)`

Validates the required properties of a given payload object.

- `payload`: The payload object to be validated.

Throws an error if any required property is missing.

### `getCheckoutStatus(payload.merchant_transaction_id)`

Retrieves checkout status for a specific merchant transaction ID.

- `payload.merchant_transaction_id`: The ID of the merchant transaction in the payload.

Returns a Promise that resolves with the checkout data.

### `DirectCharge(payload)`

Initiates a direct charge using Lipad's API.

- `payload`: The payment payload containing transaction details.

Returns a Promise that resolves with the response from the charge request.

### `getChargeRequestStatus(chargeRequestId)`

Retrieves the status of a charge request.

- `chargeRequestId`: The ID of the charge request.

Returns a Promise that resolves with the status of the charge request.

# License.
## This SDK is open-source and available under the MIT License. 