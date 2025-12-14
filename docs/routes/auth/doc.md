# /auth/v1/

## /request/code/
_Method: POST_
### Input
```json
{
    "account":"",
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Invalid credentials|Missing or invalid account, the account must match the following pattern example@service.ext|
|||
|500|ServerError|||
### Explanation
this endpoint send and email to verify the account, and make some operations like delete or update the user, check the doc for user-routes

## /verify/code/
_Method: POST_
### Input
> [!IMPORTANT]
> First you need to ask for a code -> __/auth/v1/request/code/__

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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|You did not send the code|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|Wrong code|
|400|UserBadRequest|Invalid credentials|You tried to change the account now your banned forever|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
|||
|500|||
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Invalid credentials|Missing or invalid data the account must match the following pattern example@service.ext|
|||
|500|ServerError|||

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account must match example@service.ext|
|UserBadRequest|Invalid credentials|Incorrect password|
|||
|NotFound|User not found||
|||
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|

### Explanation
this endpoint its the first step to log in

## /request/refreshToken/
_Method: POST_
### Input
> [!IMPORTANT]
> first you need to ask for a code -> __/auth/v1/request/refreshToken/code/__
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|You need to send the code|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|Wrong code|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
|||
|500|DatabaseError|Failed to save|The session was not saved please try again|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|||
|NotFound|User not found||
|||
|DatabaseError|Failed to save|The session was not saved, something went wrong please try again|

### Explanation
this endpoint its the second and last step to log in

## /request/accessToken/
_Method: GET_
### Input
> [!IMPORTANT]
> You need a refreshToken for this: get code -> __/request/refreshToken/code/__, verify code: __/request/refreshToken/__
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

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing refreshToken|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials||
|400|UserBadRequest|Invalid credentials|You need to log in|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|||
|NotFound|User not found||
|||
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|
### Explanation
this endpoint it's to keep the access to server resource with an accessToken

## /account/request/code/
_Method: PATCH_
### Input
> [!IMPORTANT]
> You need an accessToken: __/auth/v1/request/accessToken/__

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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing or invalid data check the newAccount you sent|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|The new account can not be the same as the current one|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
### Explanation
this endpoint it helps when you want to change your account but you need to be log in its the only way to change the account, this is the first step

## /account/verify/code/
_Method: PATCH_
### Input
> [!IMPORTANT]
> You need an accessToken: __/auth/v1/request/accessToken/__
 
> [!TIP]
> You need to ask for a code: __/auth/v1/account/request/code/__

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

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Invalid credentials|You need to send the verification codes|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|Current account code is wrong|
|400|UserBadRequest|Invalid credentials|New account code is wrong|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing or invalid account it must match example@service.ext|
|||
|500|ServerError|||

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|||
|NotFound|User not found||
|||
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|
### Explanation
this endpoint its for when you want to change the password of the account without been log in, `forgot password`

## /password/verify/code/
_Method: PATCH_
### Input
> [!TIP]
> You need to ask for a code: __/auth/v1/password/request/code/__

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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|You need to send code, newPwd and account|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|Wrong code|
|400|UserBadRequest|Invalid credentials|You tried to change the account now your banned forever|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
|||
|500|ServerError|||

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|||
|NotFound|User not found||
|||
|DataBaseError|Failed to remove|The session was not removed, something went wrong please try again|
### Explanation
to logout xd