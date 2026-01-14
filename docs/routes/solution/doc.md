# /solution/v1/

## /get/

_Method: POST_

### Input

```json
{ "groupId": "", "taskId": "" }
```

### Output

```json
{
  "success": true,
  "result": {
    "_id": "",
    "user": "",
    "groupId": "",
    "feature": [""],
    "code": {
      "language": "",
      "content": ""
    },
    "description": ""
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

to get a solution with the taskId

## /create/

_Method: POST_

### Input

```json
{
  "groupId": "",
  "taskId": "",
  "data": {
    "feature": [""], // Optional
    "code": {
      // Optional
      "language": "",
      "content": ""
    },
    "description": "" // Optional
  }
}
```

### Output

```json
{ "success": true, "result": "task._id" }
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

to create a solution

## /update/

_Method: PUT_

### Input

> [!IMPORTANT]
> it overwrite the info so if you wanna add new features you should send the current ones as well

```json
{
  "groupId": "",
  "taskId": "",
  "data": {
    "feature": [""],
    "code": {
      "language": "",
      "content": ""
    },
    "description": ""
  }
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

to update a solution

## /delete/

_Method: DELETE_

### Input

```json
{ "taskId": "", "groupId": "" }
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

to delete a solution
