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
  "complete": true,
  "result": {
    "_id": "",
    "techLead": [{
      "account": "",
      "fullName": ""
    }], // Optional
    "name": "",
    "color": "",
    "repository": "", // Optional
    "member": [{
      "account": "",
      "fullName": "",
      "role": ""
    }] // Optional
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
  "complete": true,
  "result": {
    "_id": "",
    "techLead": [{
      "account": "",
      "fullName": ""
    }], // Optional
    "name": "",
    "color": "",
    "repository": "", // Optional
    "member": [{
      "account": "",
      "fullName": "",
      "role": ""
    }] // Optional
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
|StatusCode|Instance|Message|Description|
|:-----------|:-----------|:-----------|-----------:|
|400|UserBadRequest|Missing data|Missing {token}|
|400|UserBadRequest|Invalid credentials|Invalid {token}|
|400|UserBadRequest|Invalid credentials|The token is malformed or has been tampered with|
|400|UserBadRequest|Invalid credentials|x|
|400|UserBadRequest|Missing data|You need to send at least the name and color for the group you want to create|
|||
|401|Unauthorized|Expired token|The token has expired and is no longer valid|
|||
|403|Forbidden|Access denied|The token is not active yet; check the "nbf" claim|

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|x|
|UserBadRequest|Invalid credentials|The user with the account ${account} has an invitation for the group and should be accept to be part of it|
|||
|Forbidden|Access denied|The user with the account ${account} already belongs to the group|
|Forbidden|Access denied|The user has reached the max number of groups|
|Forbidden|Access denied|The user with the account ${account} already belongs to the group|
|Forbidden|Access denied|The user with the account ${account} already has an invitation for the group|
|Forbidden|Access denied|The user with the account ${account} has reached the maximum number of groups|
|Forbidden|Access denied|The user with the account ${account} has reached the maximum number of invitations|
|Forbidden|Access denied|The group has reached the max number of members|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|||
|NotFound|User not found|The user with the account ${account} was not found|
|NotFound|User not found||
|NotFound|Group not found|The group you are trying to access was not found|
|NotFound|Group not found|The group you are trying to access does not exist|
|||
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|DatabaseError|Failed to access data|The invitations were not retrieved, something went wrong please try again|
|DatabaseError|Failed to save|The user was not invited, something went wrong please try again|
|DatabaseError|Failed to save|the member with the account ${member.account} was not added|
|DatabaseError|Failed to save|The group was not added to the user, something went wrong please try again|
|DatabaseError|Failed to save|The group was not created, something went wrong please try again|
### Explanation
to create a group

## /update/ 
_Method: GET_
### Input
```json
```
### Output
```json
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
|||||

### Explanation
