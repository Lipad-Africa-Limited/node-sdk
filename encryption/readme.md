# LipadEncryption Class

The LipadEncryption class provides a simple way to encrypt payloads using the given IV key, secret key, and encryption algorithm.

## Installation

This class relies on the built-in `crypto` and `https` modules, so no additional installations are required.

## Usage

1. **Import the LipadEncryption class and other required modules:**

    ```javascript
    const crypto = require("crypto");
    const https = require('https');
    const querystring = require('querystring');
    const { LipadEncryption } = require('./path/to/LipadEncryption'); // Adjust the path accordingly
    ```

2. **Create an instance of LipadEncryption by providing the required parameters:**

    ```javascript
    const ivKey = "your_IV_key";
    const consumerSecret = "your_secret_key";
    const encryption = new LipadEncryption(ivKey, consumerSecret);
    ```

3. **Validate a payload using the `validatePayload` method:**

    ```javascript
    const payload = {
        // Your payload properties
    };

    try {
        encryption.validatePayload(payload);
        console.log("Payload is valid.");
    } catch (error) {
        console.error("Payload validation error:", error.message);
    }
    ```

4. **Encrypt a payload using the `encrypt` method:**

    ```javascript
    const payload = "your_payload";
    const encryptedPayload = encryption.encrypt(payload);

    console.log("Encrypted Payload:", encryptedPayload);
    ```

5. **Retrieve access token using the `getAccessToken` method:**

    ```javascript
    const consumerKey = "your_consumer_key";
    const consumerSecret = "your_consumer_secret";

    try {
        const accessToken = await encryption.getAccessToken(consumerKey, consumerSecret, payload);
        console.log('Access Token:', accessToken);
    } catch (error) {
        console.error('Error:', error);
    }
    ```

6. **Retrieve checkout status using the `getCheckoutStatus` method:**

    ```javascript
    const merchant_transaction_id = "your_transaction_id";

    try {
        const checkoutData = await encryption.getCheckoutStatus(merchant_transaction_id, consumerKey, consumerSecret, payload);
        console.log('Checkout Status:', checkoutData);
    } catch (error) {
        console.error('Error:', error);
    }
    ```

## API

### `LipadEncryption(IVKey, consumerSecret)`

Creates an instance of the LipadEncryption class.

- `IVKey`: The IV key used for encryption.
- `consumerSecret`: The secret key used for encryption.

### `encrypt(payload)`

Encrypts a given payload.

- `payload`: The payload to be encrypted.

Returns the encrypted payload in base64-encoded format.

### `validatePayload(payload)`

Validates the required properties of a given payload object.

- `payload`: The payload object to be validated.

Throws an error if any required property is missing.

### `getAccessToken(consumerKey, consumerSecret, payload)`

Retrieves an access token for authentication.

- `consumerKey`: The consumer key for authentication.
- `consumerSecret`: The consumer secret for authentication.
- `payload`: The payload to be included in the request.

Returns a Promise that resolves with the access token.

### `getCheckoutStatus(merchant_transaction_id, consumerKey, consumerSecret, payload)`

Retrieves checkout status for a specific merchant transaction ID.

- `merchant_transaction_id`: The ID of the merchant transaction.
- `consumerKey`: The consumer key for authentication.
- `consumerSecret`: The consumer secret for authentication.
- `payload`: The payload to be included in the request.

Returns a Promise that resolves with the checkout data.
