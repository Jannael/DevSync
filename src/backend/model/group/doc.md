# User Model

## Get
gets the whole group information

Parameters:
-account ObjectId

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|Group not found|The group you are trying to access does not exist|
|DatabaseError|Failed to access data|The group was not retrieved, something went wrong please try again|



## Exists
it has two different uses 
- to check if the group exists
- to check if the group exists and the user is techLead

Parameters:
- groupId ObjectId
- techLeadAccount string

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|Group not found|The group you are trying to access does not exist|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|

## Create
to create group
- if you do not add the techLead that is creating the group it will added for you
- for each techLead/member you add it will send an invitation
- adds the group to user schema

### Functions
this function uses some other function
- UserModel.invitation.create()
- UserModel.group.add()

Parameters:
- data 
   ```TypeScript
     techLead?: Array<{
        account: string
        fullName: string
      }>
      name: string
      color: string
      repository?: string
      member?: Array<{
        account: string
        fullName: string
        role: string
      }>
   ```

- techLead 
  ```TypeScript
    { fullName: string, account: string}
  ```

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|User not found||
|Forbidden|Access denied|The user has reached the max number of groups|
|DatabaseError|Failed to save|The group was not created, something went wrong please try again|
