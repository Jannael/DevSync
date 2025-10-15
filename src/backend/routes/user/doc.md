# /user/v1/

## /get/ 
_Method: GET_
### Input
this endpoint does not actually need an input but accessToken, so make sure to ask for one
if you already have a refreshToken you can get an accessToken from /auth/v1/request/accessToken/

### Output
- `fullName`
- `account`
- `role`
- `personalization`
- `nickName`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing
|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|Missing accessToken|you don't have an accessToken|

### Explanation
this endpoint returns the public user info containing in the accessToken


## /create/ 
_Method: POST_
### Input
first you need to verify your account,
get code: /auth/v1/request/code/
verify code: /auth/v1/verify/code/

- `fullName`
- `account`
- `pwd`
- `role`
- `nickName`
- `personalization`

### Output
- `fullName`
- `account`
- `role`
- `nickName`
- `personalization`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|401|Account not verified|You need to ask for a code|
|400|Invalid token|The verification token account is invalid|
|400|Verified account does not match the send account|You are trying to create a user with a different account instead of the one verified|
|400|Invalid or missing data, the user must match the following rules, pwd-length>=6, account(unique cant be two users with the same account): example@service.com, nickName-length>=3, personalization: {theme: \'\'}, role: ["documenter" or "techLead" or "developer"]||
|500|Server error|My bad|

### Explanation
this endpoint returns an accessToken and refreshToken, none of them are available for you, but for me


## /update/ 
_Method: PUT_
### Input
first you need to verify your account,
get code: /auth/v1/request/code/
verify code: /auth/v1/verify/code/

Here you only can update this fields
- `fullName`
- `role`
- `nickName`
- `personalization`

### Output
- `user`:
  - `fullName`
  - `account`
  - `role`
  - `nickName`
  - `personalization`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|401|Not authorized|You are missing one of these, cookie-account, accessToken, or your sending one of these to update, account, refreshToken, _id|
|403|Forbidden|This error happens when the account saved in the accessToken and the one in the account-cookie does not match|
|400|No data yo update or invalid data|The data sent should follow the same schema that /create/ penultimate error|
|500|Server error|My bad|

### Explanation
this endpoint returns a new accessToken and refreshToken with the new data, and updates it as well, and the account cookie is clear so you can use it again, if you want to ensure the data has been updated, you can use the /get/ route

## /delete/ 
_Method: DELETE_
### Input
first you need to verify your account,
get code: /auth/v1/request/code/
verify code: /auth/v1/verify/code/

### Output
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|401|Account not verified|This happens when you don't verified the account previously|
|403|Forbidden|This error happens when the account saved in the accessToken and the one in the account-cookie does not match|
|500|Server error|My bad|

### Explanation
this endpoint has a simple output, but remember that you need to ask for a code, then verify that code, and then you can delete the account, works the same update


## /update/account/ 
_Method: DELETE_
### Input
realize that the only way to change the account its been logged In

first you need to verify your account,
get code: /auth/v1/account/request/code/
verify code: /auth/v1/account/verify/code/


### Output
- `user`
    - `fullName`
    - `account`
    - `role`
    - `nickName`
    - `personalization`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|401|Not authorized|this happens when you don't have the require credentials check the input section above|
|500|Server error|My bad|

### Explanation
this endpoint only executes the update-account fn, does not authorized or authenticates, it only makes the operation


## /update/password/ 
_Method: DELETE_
### Input

first you need to verify your account,
get code: /auth/v1/password/request/code/
verify code: /auth/v1/password/verify/code/

### Output
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well

### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|401|Not authorized|this happens when you don't have the require credentials check the input section above|
|500|Server error|My bad|

### Explanation
this is the endpoint that will update your password in case you forgot yours
