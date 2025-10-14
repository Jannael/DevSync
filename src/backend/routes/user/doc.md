# /user/v1/

## /get/ 
_Method: GET_
### Input
this endpoint does not actually need an input but accessToken, so make sure to ask for one

### Output
- `fullName`
- `account`
- `role`
- `personalization`
- `nickName`
- `complete`

`complete` field its to help frontend developer to handle the response

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
- `complete`

`complete` field its to help frontend developer to handle the response

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