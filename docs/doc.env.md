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
