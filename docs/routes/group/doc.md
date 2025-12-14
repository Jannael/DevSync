# /group/v1/

## /get/

_Method: POST_

### Input

> [!IMPORTANT]
> You need to be member the group

```json
{
  "_id": "group._id"
}
```

### Output

```json
{
  "success": true,
  "result": {
    "_id": "",
    "techLead": [
      {
        "account": "",
        "fullName": ""
      }
    ], // Optional
    "name": "",
    "color": "",
    "repository": "", // Optional
    "member": [
      {
        "account": "",
        "fullName": "",
        "role": ""
      }
    ] // Optional
  }
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

To retrieve a group you belong to

## /create/

_Method: POST_

### Input

```json
{
  "name": "",
  "color": "",
  "repository": "", // Optional
  "member": [{ "account": "", "role": "" }], // Optional
  "techLead": ["account", "account"] // Optional
}
```

### Output

```json
{
  "success": true,
  "result": {
    "_id": "",
    "techLead": [
      {
        "account": "",
        "fullName": ""
      }
    ], // Optional
    "name": "",
    "color": "",
    "repository": "", // Optional
    "member": [
      {
        "account": "",
        "fullName": "",
        "role": ""
      }
    ] // Optional
  }
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

to create a group

## /update/

_Method: PUT_

### Input

```json
{
  "_id": "group._id",
  "data": {
    "name": "", // Optional
    "color": "", // Optional
    "repository": "" // Optional
  }
}
```

### Output

```json
{
  "success": true,
  "result": {
    "_id": "",
    "techLead": [
      {
        "account": "",
        "fullName": ""
      }
    ], // Optional
    "name": "",
    "color": "",
    "repository": "", // Optional
    "member": [
      {
        "account": "",
        "fullName": "",
        "role": ""
      }
    ] // Optional
  }
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

To update a group, you need to be a techLead

## /delete/

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

to delete a group

## /member/update/role/

_Method: GET_

### Input

```json
{
  "_id": "group._id",
  "role": "",
  "account": ""
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

to update the of one user

## /member/remove/

_Method: DELETE_

### Input

```json
{
  "_id": "group,_id",
  "account": ""
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

to remove a user from the group
