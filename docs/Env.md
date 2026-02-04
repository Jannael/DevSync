# Env variables

> [!IMPORTANT]
> To obtain the **`PASSWORD_ENV`** variable for email functionality, you must generate an application-specific password (App Password) through your personal email settings, as standard passwords are often blocked.

```bash
# Database
DB_URL_ENV=''

# JWT passwords
JWT_ACCESS_TOKEN_ENV=''
JWT_REFRESH_TOKEN_ENV=''
JWT_DATABASE_ENV=''
JWT_AUTH_ENV=''

# For message encryption
CRYPTO_ACCESS_TOKEN_ENV=''
CRYPTO_REFRESH_TOKEN_ENV=''
CRYPTO_DATABASE_ENV=''
CRYPTO_AUTH_ENV=''

# information to send emails
EMAIL_ENV='example@gmail.com'
PASSWORD_ENV=''

# pwd hash
BCRYPT_SALT_HASH='number'

# test
DB_URL_ENV_TEST=''
TEST_PWD_ENV=''

# Sever
PORT=''
HOST=''
```

## Generate JWT passwords

```javascript
  require('crypto').randomBytes(128).toString('hex')
```

## Generate CRYPTO passwords

```javascript
  require('crypto').randomBytes(32).toString('base64')
```

## Host var

must separate with coma each host

```javascript
  // HOST = 'host,host'
  const HOST = process.env.HOST
  const whitelist = HOST.split(',')
```
