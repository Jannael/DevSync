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