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

| StatusCode | Instance       | Message               |                                        Description |
| :--------- | :------------- | :-------------------- | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data          |                                    Missing {token} |
| 400        | UserBadRequest | Missing data          |                             The groupId is missing |
| 400        | UserBadRequest | Missing data          |                        You need to send the taskId |
| 400        | UserBadRequest | Invalid credentials   |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |                                  taskId is invalid |
| 400        | UserBadRequest | Invalid credentials   |   The token is malformed or has been tampered with |
|            |                |                       |                                                    |
| 404        | NotFound       | Group not found       |                            The group was not found |
| 404        | NotFound       | Solution not found    |                                                    |
|            |                |                       |                                                    |
| 401        | Unauthorized   | Expired token         |       The token has expired and is no longer valid |
|            |                |                       |                                                    |
| 403        | Forbidden      | Access denied         |                     You do not belong to the group |
| 403        | Forbidden      | Access denied         |                  You do not have the required role |
| 403        | Forbidden      | Access denied         | The token is not active yet; check the "nbf" claim |
|            |                |                       |                                                    |
| 500        | DatabaseError  | Failed to access data |    The solution was not retrieved please try again |

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
      "content": ""
    },
    "description": ""
  }
}
```

### Output

```json
{ "complete": true, "_id": "" }
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
| 400        | UserBadRequest | Missing data          |                                                          Missing {token} |
| 400        | UserBadRequest | Missing data          |                                              You need to send the taskId |
| 400        | UserBadRequest | Invalid credentials   |                                                          Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |                                                        taskId is invalid |
| 400        | UserBadRequest | Invalid credentials   |                                                   The groupId is invalid |
| 400        | UserBadRequest | Invalid credentials   |                         The token is malformed or has been tampered with |
|            |                |                       |                                                                          |
| 403        | Forbidden      | Access denied         |                                           You do not belong to the group |
| 403        | Forbidden      | Access denied         |                                        You do not have the required role |
| 403        | Forbidden      | Access denied         |                               You can not create a solution to this task |
| 403        | Forbidden      | Access denied         |                       The token is not active yet; check the "nbf" claim |
| 403        | Forbidden      | Access denied         | You can not create a solution to the task because no one is assign to it |
|            |                |                       |                                                                          |
| 404        | NotFound       | Group not found       |                                                  The group was not found |
|            |                |                       |                                                                          |
| 401        | Unauthorized   | Expired token         |                             The token has expired and is no longer valid |
|            |                |                       |                                                                          |
| 500        | DatabaseError  | Failed to save        |                            The solution was not created please try again |
| 500        | DatabaseError  | Failed to access data |                              The task was not retrieved please try again |

### Explanation

to create a solution

## /update/

_Method: PUT_

### Input

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
{ "complete": true }
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

| StatusCode | Instance       | Message               |                                        Description |
| :--------- | :------------- | :-------------------- | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data          |                                    Missing {token} |
| 400        | UserBadRequest | Missing data          |                             The groupId is missing |
| 400        | UserBadRequest | Missing data          |                        You need to send the taskId |
| 400        | UserBadRequest | Missing data          |                You did not send any data to update |
| 400        | UserBadRequest | Invalid credentials   |                                                  x |
| 400        | UserBadRequest | Invalid credentials   |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |                                  taskId is invalid |
| 400        | UserBadRequest | Invalid credentials   |   The token is malformed or has been tampered with |
|            |                |                       |                                                    |
| 404        | NotFound       | Group not found       |                            The group was not found |
| 404        | NotFound       | Solution not found    |                                                    |
|            |                |                       |                                                    |
| 401        | Unauthorized   | Expired token         |       The token has expired and is no longer valid |
|            |                |                       |                                                    |
| 403        | Forbidden      | Access denied         |                     You do not belong to the group |
| 403        | Forbidden      | Access denied         |                  You do not have the required role |
| 403        | Forbidden      | Access denied         |  You can not update a solution you did not created |
| 403        | Forbidden      | Access denied         | The token is not active yet; check the "nbf" claim |
|            |                |                       |                                                    |
| 500        | DatabaseError  | Failed to save        |      The solution was not updated please try again |
| 500        | DatabaseError  | Failed to access data |    The solution was not retrieved please try again |

### Explanation

to update a solution
