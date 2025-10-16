# /auth/v1/

## /request/code/ 
_Method: POST_
### Input

`account`
`TEST_PWD`: this is pwd for test env, it avoids no send the emails, and the code to 'verify', it always will be '1234'

### Output
- `complete`

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

