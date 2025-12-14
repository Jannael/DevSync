# /user/v1/

## /get/

_Method: GET_

### Input

> [!IMPORTANT]
> this endpoint does not actually need an input but accessToken, so make sure to ask for one

> [!TIP]
> if you already have a refreshToken you can get an accessToken from **/auth/v1/request/accessToken/**

### Output

```json
{
  "fullName": "",
  "account": "",
  "nickName": "",
  "success": true
}
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

this endpoint returns the public user info containing in the accessToken

## /create/

_Method: POST_

### Input

> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**

```json
{
  "fullName": "",
  "account": "",
  "pwd": "",
  "nickName": ""
}
```

### Output

```json
{
  "fullName": "",
  "account": "",
  "nickName": "",
  "success": true
}
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

this endpoint returns an accessToken and refreshToken, none of them are available for you, but for me

## /update/

_Method: PUT_

### Input

> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**

```json
{
  // Here you only can update this fields
  "fullName": "",
  "nickName": ""
}
```

### Output

```json
{
  "user": {
    "fullName": "",
    "account": "",
    "nickName": ""
  },
  "success": true
}
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

this endpoint returns a new accessToken and refreshToken with the new data, and updates it as well, and the account cookie is clear so you can not use it again, if you want to ensure the data has been updated, you can use the /get/ route

## /delete/

_Method: DELETE_

### Input

> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/request/code/** -> **/auth/v1/verify/code/**

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

this endpoint has a simple output, but remember that you need to ask for a code, then verify that code, and then you can delete the account, works the same as update

## /update/account/

_Method: PATCH_

### Input

> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/account/request/code/** -> **/auth/v1/account/verify/code/**

### Output

```json
{
  "user": {
    "fullName": "",
    "account": "",
    "nickName": ""
  },
  "success": true
}
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

this endpoint only executes the update-account fn, does not authorized or authenticates, it only makes the operation

## /update/password/

_Method: PATCH_

### Input

> [!IMPORTANT]
> first you need to verify your account: **/auth/v1/password/request/code/** -> **/auth/v1/password/verify/code/**

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

this is the endpoint that will update your password in case you forgot yours

## /get/invitation/

_Method: GET_

### Input

> [!IMPORTANT]
> this endpoint does not actually need an input but accessToken, so make sure to ask for one

> [!TIP]
> if you already have a refreshToken you can get an accessToken from **/auth/v1/request/accessToken/**

### Output

```json
{
  "success": true,
  "invitation": [
    {
      "name": "name",
      "_id": "",
      "color": "#------"
    }
  ]
}
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

this endpoints returns an array for the invitations you have

## /create/invitation/

_Method: POST_

### Input

```json
{
  "account": "",
  "role": "",
  "_id": "group._id"
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

To invite a user to an existing group

## /accept/invitation/

_Method: POST_

### Input

```json
{ "_id": "group._id" }
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

to accept an invitation xd

## /reject/invitation/

_Method: DELETE_

### Input

```json
{ "_id": "group._id" }
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

to reject an invitation xd

## /get/group/

_Method: GET_

### Input

> [!IMPORTANT]
> this endpoint does not actually need an input but accessToken, so make sure to ask for one

> [!TIP]
> if you already have a refreshToken you can get an accessToken from **/auth/v1/request/accessToken/**

### Output

```json
{
  "success": true,
  "group": [
    {
      "name": "",
      "_id": "",
      "color": "#------"
    }
  ]
}
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

to get the groups you are in

## /delete/group/

_Method: DELETE_

### Input

```json
{ "_id": "group._id" }
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

to quit a group

## /add/group/

_Method: POST_

### Input

```json
{ "_id": "group._id" }
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

to add a group without invitation
