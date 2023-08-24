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
    const secretKey = "your_secret_key";
    const algorithm = "aes-256-cbc";

    const lipadEncryptor = new Encryption(ivKey, secretKey, algorithm);
    ```

3. **Encrypt a payload using the encrypt method:**

    ```javascript
    const payload = "your_payload";
    const encryptedPayload = lipadEncryptor.encrypt(payload);

    console.log("Encrypted Payload:", encryptedPayload);
    ```

## API

### `LipadEncryption(ivKey, secretKey, algorithm)`

Creates an instance of the LipadEncryption class.

- `ivKey`: The IV key used for encryption.
- `secretKey`: The secret key used for encryption.
- `algorithm`: The encryption algorithm to use (e.g., "aes-256-cbc").

### `encrypt(payload)`

Encrypts a given payload.

- `payload`: The payload to be encrypted.

Returns the encrypted payload in base64-encoded format.

## Example

```javascript
const { Encryption } = require("lipad-encryption");

const ivKey = "your_IV_key";
const secretKey = "your_secret_key";
const algorithm = "aes-256-cbc";

const lipadEncryptor = new Encryption(ivKey, secretKey, algorithm);

const payload = "your_payload";
const encryptedPayload = lipadEncryptor.encrypt(payload);

console.log("Encrypted Payload:", encryptedPayload);
