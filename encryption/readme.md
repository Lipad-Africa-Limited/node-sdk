# LipadEncryption Class

The LipadEncryption class provides a simple way to encrypt payloads using the given IV key, secret key, and encryption algorithm.

## Installation

This class relies on the built-in crypto module, so no additional installations are required.

## Usage

1. **Import the LipadEncryption class:**

    ```javascript
    const Encryption = require("lipad-encryption");
    ```

2. **Create an instance of LipadEncryption by providing the required parameters:**

    ```javascript
    const ivKey = "your_IV_key";
    const consumerSecret = "your_secret_key";

   let payload = {};
    let encryption = new LipadEncryption.Encryption(IVKey, consumerSecret);
    ```

3. **Validate a payload using the validatePayload method:**

    ```javascript
    encryption.validatePayload(payload);
    ```

4. **Encrypt a payload using the encrypt method:**

    ```javascript
    const payload = "your_payload";
    let encryptedPayload = encryption.encrypt(payloadStr);

    console.log("Encrypted Payload:", encryptedPayload);
    ```

5. **Retrieve checkout status using the getCheckoutStats method:**

    ```javascript
    encryption.getCheckoutStats(payload.merchant_transaction_id, accessToken)
    .then(checkoutData => {
        console.log('Checkout Data:', checkoutData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    ```

## API

### `LipadEncryption(ivKey, consumerSecret)`

Creates an instance of the LipadEncryption class.

- `ivKey`: The IV key used for encryption.
- `consumerSecret`: The secret key used for encryption.
### `encrypt(payload)`

Encrypts a given payload.

- `payload`: The payload to be encrypted.

Returns the encrypted payload in base64-encoded format.

### `validatePayload(payload)`

Validates the required properties of a given payload object.

- `payload`: The payload object to be validated.

Throws an error if any required property is missing.

### `getCheckoutStats(merchant_transaction_id, accessToken)`

Retrieves checkout status for a specific merchant transaction ID.

- `merchant_transaction_id`: The ID of the merchant transaction.
- `accessToken`: The access token for authentication.

Returns a Promise that resolves with the checkout data.

## Example

```javascript
const { Encryption } = require("lipad-encryption");

const IVKey = "your_IV_key";
const consumerSecret = "your_secret_key";

const lipadEncryption = new Encryption(IVKey, consumerSecret);

const payload = "your_payload";
const encryptedPayload = lipadEncryptor.encrypt(payload);

console.log("Encrypted Payload:", encryptedPayload);

const payloadToValidate = {
    // your payload properties
};

try {
    lipadEncryption.validatePayload(payloadToValidate);
    console.log("Payload is valid.");
} catch (error) {
    console.error("Payload validation error:", error.message);
}

const merchant_transaction_id = "your_transaction_id";
const accessToken = "your_access_token";

lipadEncryption.getCheckoutStats(merchant_transaction_id, accessToken)
    .then(checkoutData => {
        console.log("Checkout Data:", checkoutData);
    })
    .catch(error => {
        console.error("Error:", error);
    });
