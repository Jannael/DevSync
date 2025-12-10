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
  "_id": "",
  "techLead"?: [{
    "account": "",
    "fullName": ""
  }],
  "name": "",
  "color": "",
  "repository"?: "",
  "member"?: [{
    "account": "",
    "fullName": "",
    "role": ""
  }]
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|You need to send the _id for the group you want|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|
|403|Forbidden|Access denied|You do not belong to any group|
|403|Forbidden|Access denied|You do not belong to the group you are trying to access|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|||
|NotFound|User not found|
|NotFound|Group not found|The group you are trying to access does not exist|
|||
|DatabaseError|Failed to access data|The groups were not retrieved, something went wrong please try again|
|DatabaseError|Failed to access data|The invitations were not retrieved, something went wrong please try again|
|DatabaseError|Failed to access data|The group was not retrieved, something went wrong please try again|
### Explanation
To retrieve a group you belong to
