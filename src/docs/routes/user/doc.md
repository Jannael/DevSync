# /user/v1/

## /get/
_Method: GET_
### Input
> [!IMPORTANT]
> this endpoint does not actually need an input but accessToken, so make sure to ask for one

> [!TIP]
> if you already have a refreshToken you can get an accessToken from __/auth/v1/request/accessToken/__
### Output
- `fullName`
- `account`
- `nickName`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
### Explanation
this endpoint returns the public user info containing in the accessToken


## /create/
_Method: POST_
### Input
> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**

- `fullName`
- `account`
- `pwd`
- `nickName`
### Output
- `fullName`
- `account`
- `nickName`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|You did not send any information|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|Verified account does not match the sent account|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|You can not put the _id yourself|
|UserBadRequest|Invalid credentials|You can not put the refreshToken yourself|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|x|
|||
|DuplicateData|User already exists|This account belongs to an existing user|
|||
|NotFound|User not found|The user appears to be created but it was not found|
|||
|DatabaseError|Failed to save|The user was not created, something went wrong please try again|
### Explanation
this endpoint returns an accessToken and refreshToken, none of them are available for you, but for me


## /update/
_Method: PUT_
### Input
> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**

Here you only can update this fields
- `fullName`
- `nickName`
### Output
- `user`:
  - `fullName`
  - `account`
  - `nickName`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Invalid credentials|You can not update _id, account, refreshToken|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Missing data|No data to update or invalid data|
|400|UserBadRequest|Invalid credentials|The account verified and your account does not match|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
|||
|500|DatabaseError|Failed to save|Something went wrong please try again|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|You can not change the account here|
|UserBadRequest|Invalid credentials|You can not change the _id|
|UserBadRequest|Invalid credentials|You can not update the refreshToken|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The account ${updateData.account} is invalid|
|||
|NotFound|Group not found||
|NotFound|User not found||
|||
|DatabaseError|Failed to save|The user was not updated||
|DatabaseError|Failed to save|The user was not updated|something went wrong please try again|
### Explanation
this endpoint returns a new accessToken and refreshToken with the new data, and updates it as well, and the account cookie is clear so you can use it again, if you want to ensure the data has been updated, you can use the /get/ route

## /delete/
_Method: DELETE_
### Input
> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**
### Output
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|The verified account and yours does not match|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${techLeadAccount} is invalid|
|||
|Forbidden|Access denied|The group exists but the user is not a techLead|
|Forbidden|Access denied|You can not remove the last techLead||
|||
|NotFound|Group not found|The group was not found|
|NotFound|Group not found|The group you are trying to access does not exist|
|NotFound|User not found|The user is not in the group|
|NotFound|User not found||
|||
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|DatabaseError|Failed to remove|The member was not remove from the group please try again|
|DatabaseError|Failed to remove|The user was not deleted, something went wrong please try again|
### Explanation
this endpoint has a simple output, but remember that you need to ask for a code, then verify that code, and then you can delete the account, works the same update


## /update/account/
_Method: PATCH_
### Input
> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/account/request/code/** -> **/auth/v1/account/verify/code/**
### Output
- `user`
    - `fullName`
    - `account`
    - `nickName`
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim||500|Server error|My bad|
|||
|500|DatabaseError|Failed to save|Something went wrong please try again|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account must match example@service.ext|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|||
|DuplicateData|User already exists|This account belongs to an existing user|
|||
|NotFound|Group not found||
|NotFound|User not found||
|||
|DatabaseError|Failed to save|The user was not updated|
|DatabaseError|Failed to save|The account was not updated, something went wrong please try again|
### Explanation
this endpoint only executes the update-account fn, does not authorized or authenticates, it only makes the operation


## /update/password/ 
_Method: PATCH_
### Input
> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/password/request/code/** -> **/auth/v1/password/verify/code/**
### Output
- `complete`: boolean

`complete` field its to help frontend developer to handle the response its in error output as well
### Error
`output`

    _body: 
        msg: '',
        complete: false,
        `link`: here you will get all the routes you need to make the operation correctly in case something is missing

|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account must match example@service.ext|
|||
|NotFound|User not found|
|||
|DatabaseError|Failed to save|The password was not updated, something went wrong please try again|
### Explanation
this is the endpoint that will update your password in case you forgot yours
