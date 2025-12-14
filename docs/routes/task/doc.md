# /task/v1/

## /list/

_Method: POST_

### Input

```json
{
  "groupId": "",
  "pagination": 1
}
```

### Output

```json
{
  "success": true,
  "result": {
    "task": [
      {
        "_id": "",
        "name": "",
        "priority": 0,
        "isComplete": false
      }
    ],
    "assign": ["taskId", "taskId"]
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

this endpoint lists the task from the group and in the field assign returns the \_id for those the user is assign to

## /get/

_Method: POST_

### Input

```json
{
  "_id": "taskId",
  "groupId": ""
}
```

### Output

```json
{
  "success": true,
  "result": {
    "_id": "",
    "groupId": "",
    "user": [""],
    "name": "",
    "code": {
      "language": "",
      "content": ""
    },
    "feature": [""],
    "description": "",
    "isComplete": false,
    "priority": 0
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

it returns all the information about the task you are asking for

## /update/

_Method: PUT_

### Input

```json
{
  "groupId": "",
  "taskId": "",
  "data": {
    "user": [""], // Optional
    "name": "", // Optional
    "code": {
      // Optional
      "language": "",
      "content": ""
    },
    "feature": [""], // Optional
    "description": "", // Optional
    "isComplete": false, // Optional
    "priority": 0 // Optional
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

to update a task

## /create/

_Method: POST_

### Input

```json
{
  "groupId": "",
  "user": ["account"], // Optional
  "name": "",
  "code": {
    // Optional
    "language": "",
    "content": ""
  },
  "feature": [""], // Optional
  "description": "", // Optional
  "isComplete": false, // Default = false
  "priority": 0 // Default = 0
}
```

### Output

```json
{
  "success": true,
  "_id": "taskId"
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

this endpoint return the \_id for the created task

## /delete/

_Method: DELETE_

### Input

```json
{
  "groupId": "",
  "_id": ""
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

to delete a task
