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
  "complete": true,
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
  "complete": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

| StatusCode | Instance       | Message               |                                     Description |
| :--------- | :------------- | :-------------------- | ----------------------------------------------: |
| 404        | NotFound       | Solution not found    |                                                 |
|            |                |                       |                                                 |
| 400        | UserBadRequest | Invalid credentials   |                               taskId is invalid |
| 400        | UserBadRequest | Missing data          |                     You need to send the taskId |
|            |                |                       |                                                 |
| 500        | DatabaseError  | Failed to access data | The solution was not retrieved please try again |

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
  "feature": [""],
  "code": {
    "language": "",
    "content"
  },
  "description": ""
 }
}
```

### Output

```json
{ "_id": "" }
```

### Error

```json
{
  "msg": "",
  "complete": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

| StatusCode | Instance       | Message               |                                                              Description |
| :--------- | :------------- | :-------------------- | -----------------------------------------------------------------------: |
| 400        | UserBadRequest | Missing data          |                                              You need to send the taskId |
| 400        | UserBadRequest | Invalid credentials   |                                                        taskId is invalid |
|            |                |                       |                                                                          |
| 403        | Forbidden      | Access denied         | You can not create a solution to the task because no one is assign to it |
| 403        | Forbidden      | Access denied         |                               You can not create a solution to this task |
|            |                |                       |                                                                          |
| 500        | DatabaseError  | Failed to access data |                              The task was not retrieved please try again |
| 500        | DatabaseError  | Failed to save        |                            The solution was not created please try again |

### Explanation

to create a solution
