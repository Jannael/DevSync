# /task/v1/

## /get/

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
| 400        | UserBadRequest | Invalid credentials   |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials   |   The token is malformed or has been tampered with |
| 400        | UserBadRequest | Invalid credentials   |                             The groupId is invalid |
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
