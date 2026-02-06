# Secrets

## Secrets Folder Manager

### Purpose
The `src/backend/secret` folder is designed to centralize and encapsulate all logic related to security tokens and sensitive configurations. The primary goal is to **avoid calling environment variables (`process.env`) directly** throughout the application code. This practice:
- Prevents security leaks (variables are only used in one place).
- Simplifies refactoring (changes to env var names only affect one file).
- Provides a clear interface for common security operations.

### Naming Conventions

#### Getters (`GetSomething`)
Functions named `GetAccessToken`, `GetRefreshToken`, or `GetAuth` are responsible for retrieving and decrypting tokens from the request. 
- **The "Something" part:** Refers to the specific environment variable configuration (e.g., `CRYPTO_ACCESS_TOKEN_ENV` and `JWT_ACCESS_TOKEN_ENV`) used to decrypt and verify that specific token.

#### Generators (`GenerateSomething`)
Functions like `GenerateAccessToken`, `GenerateRefreshToken`, or `GenerateAuth` handle the creation of new encrypted tokens.
- Similar to getters, the name identifies which set of environment secrets will be used to sign and then encrypt the resulting token.

### Token Encryption & Decryption

The system implements a double layer of security for tokens:
1. **JWT Signing:** The data is signed using a secret key to ensure integrity.
2. **AES-256-CBC Encryption:** The resulting JWT string is then encrypted using a separate crypto key before being sent to the client.

#### Utilities
- **`EncryptToken.utils.ts`**: Encapsulates the logic to sign a JWT and then encrypt the string using symmetric encryption (`crypto.createCipheriv`).
- **`DecryptToken.utils.ts`**: Handles the decryption of the encrypted string back into a JWT, and then verifies the JWT payload.
