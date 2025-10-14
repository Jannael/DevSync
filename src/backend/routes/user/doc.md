# /user/v1/

## /get/
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
|StatusCode|Name|issue|
|:-----------|:-----------|-----------:|
|400|Missing accessToken|you don't have an accessToken|

### Explanation
this endpoint returns the public user info containing in the accessToken
