# /auth/v1/

## /request/code/ 
_Method: POST_
### Input
    `account`
    `TEST_PWD`: this is pwd for test env, it avoids no send the emails, and the code to 'verify', it always will be '1234'

### Output
- `complete`: boolean

`complete`: this say if the email was send and the info to verify it its saved

### Error
`output`

    _body: 
        msg: ''
        complete: boolean

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|Missing or invalid account, the account must match the following pattern example@service.com|the account sent didn't fit the rules to be an actual account|
|500|Server Error|My bad|

### Explanation
this endpoint send and email to verify the account, and make some operations like delete or update de user, check the doc for user-routes

## /verify/code/ 
_Method: POST_
### Input
    first you need to ask for a code
    /auth/v1/request/code/

    `account`
    `code`: if you used the correct TEST_PWD, it always will be '1234'

### Output
- `complete`: boolean

`complete`: it says if the user account was verified

### Error
`output`

    _body: 
        msg: ''
        complete: boolean

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|Missing code|you didn't ask for a code first|
|400|Invalid token|the code-cookie you sent is invalid|
|400|Wrong code|the code that was sent to the account doesn't match with the one you're sending|
|400|You tried to change the account now your banned forever|it happens when you send a different account from the one you asked to verify|
|500|Server Error|My bad|

### Explanation
this endpoint verify the code you're sending its the same the server sent and the account also must match with the one you asked to verify for

## /request/refreshToken/code/ 
_Method: POST_
### Input
    `account`
    `pwd`
    `TEST_PWD`: this endpoint ask for a code to the user email, to MFA, if the TEST_PWD, its the correct one, it wont send the code, and the code will always be '1234',if its wrong it wont send it but the code to verify will be random

### Output
- `complete`: boolean

`complete`: it says if the code was sent and saved to verify it

### Error
`output`

    _body: 
        msg: ''
        complete: boolean

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|Missing or invalid data the account must match the following pattern example@service.ext|the account you sent it isn't even valid, or you're not sending all the input-fields need it|
|404|User not found|the user you're asking to log in doesn't exist|
|400|Incorrect password|everything went fine, but the pwd is incorrect|
|500|Server Error|My bad|

### Explanation
this endpoint its the first step to log in


## /request/refreshToken/ 
_Method: POST_
### Input
    first you need to ask for a code
    /auth/v1/request/refreshToken/code/
    'code'

### Output
- `complete`: boolean

`complete`: it says if you got the refreshToken

### Error
`output`

    _body: 
        msg: ''
        complete: boolean

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|You need to use MFA for login|you didn't asked for a code or you didn't sent one|
|400|Invalid token|the code-cookie you have is invalid and you need to ask for a new one|
|400|Wrong code|the code you sent its different from the one the server sent|
|500|Server Error|My bad|

### Explanation
this endpoint its the second and last step to log in

## /request/accessToken/ 
_Method: GET_
### Input
    doesn't need an input but you to have a valid refreshToken
    ask code for refreshToken: /request/refreshToken/code/
    verify code for refreshToken: /request/refreshToken/

### Output
- `complete`: boolean

`complete`: it says if you got a new accessToken the server handles all the tokens, so you wont get them but this field tells you if everything went right

### Error
`output`

    _body: 
        msg: ''
        complete: boolean

|StatusCode|Message|Issue|
|:-----------|:-----------|-----------:|
|400|You need tyo login|When you don't have a refreshToken|
|500|Server Error|My bad|

### Explanation
this endpoint it's to keep the access to server resource with an accessToken