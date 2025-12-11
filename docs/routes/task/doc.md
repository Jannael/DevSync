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
  "complete": true,
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
  "complete": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

| StatusCode | Instance       | Message               |                                        Description |
| :--------- | :------------- | :-------------------- | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data          |                                    Missing {token} |
| 400        | UserBadRequest | Missing data          |                             The groupId is missing |
| 400        | UserBadRequest | Invalid credentials   |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |                             The groupId is invalid |
| 400        | UserBadRequest | Invalid credentials   |   The token is malformed or has been tampered with |
|            |                |                       |                                                    |
| 404        | NotFound       | Group not found       |                            The group was not found |
| 404        | NotFound       | Group not found       |                   The group may not have any tasks |
|            |                |                       |                                                    |
| 401        | Unauthorized   | Expired token         |       The token has expired and is no longer valid |
|            |                |                       |                                                    |
| 403        | Forbidden      | Access denied         |                     You do not belong to the group |
| 403        | Forbidden      | Access denied         |                  You do not have the required role |
| 403        | Forbidden      | Access denied         | The token is not active yet; check the "nbf" claim |
|            |                |                       |                                                    |
| 500        | DatabaseError  | Failed to access data |        The task was not retrieved please try again |

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
  "complete": true,
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
  "complete": false,
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

| StatusCode | Instance       | Message               |                                        Description |
| :--------- | :------------- | :-------------------- | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data          |                                    Missing {token} |
| 400        | UserBadRequest | Missing data          |                             The groupId is missing |
| 400        | UserBadRequest | Missing data          |    You need to send the \_id for the task you want |
| 400        | UserBadRequest | Invalid credentials   |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |                             The groupId is invalid |
| 400        | UserBadRequest | Invalid credentials   |                   The \_id for the task is invalid |
| 400        | UserBadRequest | Invalid credentials   |   The token is malformed or has been tampered with |
|            |                |                       |                                                    |
| 400        | NotFound       | Task not found        |                                                    |
| 404        | NotFound       | Group not found       |                            The group was not found |
|            |                |                       |                                                    |
| 401        | Unauthorized   | Expired token         |       The token has expired and is no longer valid |
|            |                |                       |                                                    |
| 403        | Forbidden      | Access denied         |                     You do not belong to the group |
| 403        | Forbidden      | Access denied         |                  You do not have the required role |
| 403        | Forbidden      | Access denied         | The token is not active yet; check the "nbf" claim |
|            |                |                       |                                                    |
| 500        | DatabaseError  | Failed to access data |        The task was not retrieved please try again |

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

| StatusCode | Instance       | Message             |                                        Description |
| :--------- | :------------- | :------------------ | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data        |                                    Missing {token} |
| 400        | UserBadRequest | Missing data        |                             The groupId is missing |
| 400        | UserBadRequest | Missing data        |                        You need to send the taskId |
| 400        | UserBadRequest | Invalid credentials |                                                  x |
| 400        | UserBadRequest | Invalid credentials |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials |                              The taskId is invalid |
| 400        | UserBadRequest | Invalid credentials |                             The groupId is invalid |
| 400        | UserBadRequest | Invalid credentials |   The token is malformed or has been tampered with |
|            |                |                     |                                                    |
| 404        | NotFound       | Group not found     |                            The group was not found |
|            |                |                     |                                                    |
| 401        | Unauthorized   | Expired token       |       The token has expired and is no longer valid |
|            |                |                     |                                                    |
| 403        | Forbidden      | Access denied       |                     You do not belong to the group |
| 403        | Forbidden      | Access denied       |                  You do not have the required role |
| 403        | Forbidden      | Access denied       | The token is not active yet; check the "nbf" claim |
|            |                |                     |                                                    |
| 500        | DatabaseError  | Failed to save      |         The task was not updated, please try again |

| Instance       | Error                                                     |                                                           Message |
| :------------- | :-------------------------------------------------------- | ----------------------------------------------------------------: |
| UserBadRequest | Invalid credentials                                       |                                 The account ${account} is invalid |
| UserBadRequest | Invalid credentials                                       | The user with the account ${account} does not belong to the group |
|                |                                                           |                                                                   |
| NotFound       | User not found                                            |                                                                   |
| DatabaseError  | Failed to access data                                     | The user was not retrieved, something went wrong please try again |
| DatabaseError  | Failed to access data', 'The user may not be in the group |                                                                   |

### Explanation

to update a task
