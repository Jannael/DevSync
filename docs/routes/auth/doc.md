# /auth/v1/

## /request/code/

_Method: POST_

### Input

```json
{
  "account": "",
  "TEST_PWD": "" // this is pwd for test env, it avoids no send the emails, and the code to 'verify', it always will be '1234'
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint send and email to verify the account, and make some operations like delete or update the user, check the doc for user-routes

## /verify/code/

_Method: POST_

### Input

> [!IMPORTANT]
> First you need to ask for a code -> **/auth/v1/request/code/**

```json
{
  "account": "",
  "code": "" // If you used the correct TEST_PWD, it always will be '1234'
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint verify the code you're sending its the same the server sent and the account also must match with the one you asked to verify for

## /request/refreshToken/code/

_Method: POST_

### Input

```json
{
  "account": "",
  "pwd": "",
  "TEST_PWD": "" // this endpoint ask for a code to the user email, to MFA, if the TEST_PWD, its the correct one, it wont send the code, and the code will always be '1234',if its wrong it wont send it but the code to verify will be random
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint its the first step to log in

## /request/refreshToken/

_Method: POST_

### Input

> [!IMPORTANT]
> first you need to ask for a code -> **/auth/v1/request/refreshToken/code/**

```json
{ "code": "1234" }
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint its the second and last step to log in

## /request/accessToken/

_Method: GET_

### Input

> [!IMPORTANT]
> You need a refreshToken for this: get code -> **/request/refreshToken/code/**, verify code: **/request/refreshToken/**

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint it's to keep the access to server resource with an accessToken

## /account/request/code/

_Method: PATCH_

### Input

> [!IMPORTANT]
> You need an accessToken: **/auth/v1/request/accessToken/**

```json
{
  "newAccount": "",
  "TEST_PWD": "" // for test environment
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint it helps when you want to change your account but you need to be log in its the only way to change the account, this is the first step

## /account/verify/code/

_Method: PATCH_

### Input

> [!IMPORTANT]
> You need an accessToken: **/auth/v1/request/accessToken/**

> [!TIP]
> You need to ask for a code: **/auth/v1/account/request/code/**

```json
{
  "codeCurrentAccount": "",
  "codeNewAccount": ""
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint its the second step to change the account, once you get the success true, from here you can ask for change it, in /user/v1/update/account/

## /password/request/code/

_Method: PATCH_

### Input

```json
{
  "account": "",
  "TEST_PWD": "" // for test environment
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

this endpoint its for when you want to change the password of the account without been log in, `forgot password`

## /password/verify/code/

_Method: PATCH_

### Input

> [!TIP]
> You need to ask for a code: **/auth/v1/password/request/code/**

```json
{
  "code": "",
  "account": "",
  "newPwd": ""
}
```

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

with this endpoint you verify the account its yours, and you can change the pwd in /user/v1/update/password/

## /request/logout/

_Method: POST_

### Input

> [!NOTE]
> If you do not have a refreshToken it returns an error

### Output

```json
{ "success": true }
```

### Error

```json
{
  "msg": "",
  "success": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

### Explanation

to logout xd
