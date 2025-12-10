# User Model

## Get
to get specific fields of the user with the _id

### Parameters
- account string
- projection
you can choose this fields, by putting them with the value "1"
```TypeScript
  _id?: Types.ObjectId
  fullName: string
  account: string
  pwd: string
  nickName?: string
  refreshToken?: string[]
  invitation?: IUserInvitation[]
  group?: IUserGroup[]
```
### Output
returns the fields tou asked for
- Partial<IRefreshToken>
### Error
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|DatabaseError|Failed to access data||

## Create
to create a user

### Parameters:
- data
```TypeScript
  fullName: string
  account: string
  pwd: string
  nickName?: string | null
```
### Output
- IRefreshToken
```TypeScript
  fullName: string
  account: string
  pwd: string
  nickName?: string | null
  invitation?: IUserInvitation[] | null
  group?: IUserGroup[] | null
```
### Error
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|You can not put the _id yourself|
|UserBadRequest|Invalid credentials|You can not put the refreshToken yourself|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|DuplicateData|User already exists|This account belongs to an existing user|
|NotFound|User not found|The user appears to be created but it was not found|
|UserBadRequest|Invalid credentials|x|
|DatabaseError|Failed to save|The user was not created, something went wrong please try again|

## Update
to update a user the next fields are the ones you can update here

### Functions:
- groupModel.member.update()
### Parameters:
- data 
```TypeScript
  fullName: string
  pwd: string
  nickName: string
```
- userId ObjectId
### Output
- IRefreshToken
```TypeScript
  fullName: string
  account: string
  pwd: string
  nickName?: string | null
  invitation?: IUserInvitation[] | null
  group?: IUserGroup[] | null
```
### Error
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|You can not change the account here|
|UserBadRequest|Invalid credentials|You can not change the _id|
|UserBadRequest|Invalid credentials|You can not update the refreshToken|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The account ${updateData.account} is invalid|
|NotFound|Group not found||
|NotFound|User not found||
|DatabaseError|Failed to save|The user was not updated|
|DatabaseError|Failed to save|The user was not updated|something went wrong please try again|

## Delete
to eliminate a user
### Functions
- groupModel.member.remove()
### Parameters
- userId ObjectId
### Output
- boolean
### Error
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${techLeadAccount} is invalid|
|NotFound|Group not found|The group you are trying to access does not exist|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|Forbidden|Access denied|You can not remove the last techLead|
|NotFound|Group not found|The group was not found|
|NotFound|User not found|The user is not in the group|
|DatabaseError|Failed to remove|The member was not remove from the group please try again|
|DatabaseError|Failed to remove|The user was not deleted, something went wrong please try again|

## Account Update
to update user account

### Functions
- groupModel.member.update()
### Parameters:
- userId ObjectId
- account string
### Output
- IRefreshToken
```TypeScript
  fullName: string
  account: string
  pwd: string
  nickName?: string | null
  invitation?: IUserInvitation[] | null
  group?: IUserGroup[] | null
```
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account must match example@service.ext|
|DuplicateData|User already exists|This account belongs to an existing user|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The account ${updateData.account} is invalid|
|NotFound|Group not found||
|NotFound|User not found||
|DatabaseError|Failed to save|The user was not updated|
|DatabaseError|Failed to save|The account was not updated, something went wrong please try again|

## Password Update
to update user pwd

### Parameters:
- account string
- pwd string
### Output
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account must match example@service.ext|
|NotFound|User not found|
|DatabaseError|Failed to save|The password was not updated, something went wrong please try again|

# Invitation

## Get
to get user's invitations

### Parameters:
- userId ObjectId
### Output
- IUserInvitation[]
```TypeScript
  _id: Types.ObjectId
  color: string
  name: string
```
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found|
|DatabaseError|Failed to access data|The invitations were not retrieved, something went wrong please try again|

## Create
to create an invitation to an specific user
> [!WARNING]
> Remember a user belongs to group unless it rejects the invitation so this function actually adds the user to the group

### Functions
- groupModel.member.add()
### Parameters:
- user
```TypeScript
    account: string
    fullName: string
    role: string
```
- invitation
```TypeScript
  _id: Types.ObjectId
  color: string
  name: string
```
- addMember boolean
> [!TIP]
> if you want to call the groupModel to add the user to the group document, set it to true
### Output
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${user.account} is invalid|
|UserBadRequest|Invalid credentials|x|
|NotFound|User not found||
|Forbidden|Access denied|The user with the account ${user.account} already belongs to the group|
|Forbidden|Access denied|The user with the account ${user.account} already has an invitation for the group|
|Forbidden|Access denied|The user with the account ${user.account} has reached the maximum number of invitations|
|UserBadRequest|Invalid credentials|The account ${member.account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|Group not found|The group you are trying to access was not found|
|Forbidden|Access denied|The group has reached the max number of members|
|DatabaseError|Failed to save|the member with the account ${member.account} was not added|
|DatabaseError|Failed to save|The user was not invited, something went wrong please try again|


## Reject
to reject an invitation
> [!CAUTION]
> remember a user belongs to the group unless it rejects the invitation so this function deletes the user, from the group

### Functions
- groupModel.member.remove()
### Parameters:
- userAccount string
- invitationId ObjectId
### Output
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${userAccount} is invalid|
|UserBadRequest|Invalid credentials|The invitation _id is invalid|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|You do not have an invitation for the group you want to reject|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${techLeadAccount} is invalid|
|NotFound|Group not found|The group you are trying to access does not exist|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|Forbidden|Access denied|You can not remove the last techLead|
|NotFound|Group not found|The group was not found|
|NotFound|User not found|The user is not in the group|
|DatabaseError|Failed to remove|The member was not remove from the group please try again|
|DatabaseError|Failed to remove|The invitation was not removed from the user, something went wrong please try again|

## Remove
to remove an invitation
> [!IMPORTANT]
> This function its made to be call for other models in order to keep the data sync, which means it does not delete the user from the group the invitation came from

### Parameters
- userAccount string
- invitationId ObjectId
### Output 
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The invitation _id is invalid|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|The invitation _id is invalid|
|DatabaseError|Failed to remove|The invitation was not removed from the user, something went wrong please try again|

## Accept
to accept an invitation
### Parameters
- userAccount string
- invitationId ObjectId
### Output 
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${userAccount} is invalid|
|UserBadRequest|Invalid credentials|The invitation _id is invalid|
|NotFound|User not found||
|NotFound|Invitation not found||
|DatabaseError|Failed to save|The invitation was not accepted please try again|

# Group
## Get
to get all the groups the user is in
### Parameters
- userId ObjectId
### Output
- IUserGroup[]
```TypeScript
  _id: Types.ObjectId
  color: string
  name: string
```
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found|
|DatabaseError|Failed to access data|The groups were not retrieved, something went wrong please try again|

## Add
to add a group to the user
> [!TIP]
> This function its to join a group with the id of it without invitation

> [!IMPORTANT]
> The user that are added with this function will by default be add as the config file says

- if its an invitation it will remove it
### Functions
- groupModel.exists()
- groupModel.member.add()
### Parameters:
- account string
- group
```TypeScript
  _id: Types.ObjectId
  color: string
  name: string
```
- addToTheGroup boolean
> [!TIP]
> if you want to call the groupModel to add the user to the group document then set it to true
### Output:
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|x|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${techLeadAccount} is invalid|
|NotFound|Group not found|The group you are trying to access does not exist|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|NotFound|User not found|The user with the account ${account} was not found|
|Forbidden|Access denied|The user with the account ${account} already belongs to the group|
|Forbidden|Access denied|The user with the account ${account} has reached the maximum number of groups|
|UserBadRequest|Invalid credentials|The user with the account ${account} has an invitation for the group and should be accept to be part of it|
|UserBadRequest|Invalid credentials|The account ${member.account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|Group not found|The group you are trying to access was not found|
|Forbidden|Access denied|The group has reached the max number of members|
|DatabaseError|Failed to save|the member with the account ${member.account} was not added|
|NotFound|User not found|The user with the account ${account} was not found|
|DatabaseError|Failed to save|The group was not added to the user, something went wrong please try again|

## Remove
to remove a group from the user

> [!IMPORTANT]
> removeMember: indicates if you want to remove the user from the group, ik its sound weird, but this function its called by the delete group fn, that means its not the same, removing a group from the user, because the user wants to quit and because the group its been deleted

### Functions
- groupModel.member.remove()
### Parameters
- account string
- groupId ObjectId
- removeMember boolean
### Output
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account is invalid|
|UserBadRequest|Invalid credentials|The group _id is invalid|
|UserBadRequest|Invalid credentials|The account ${account} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|UserBadRequest|Invalid credentials|The account ${techLeadAccount} is invalid|
|NotFound|Group not found|The group you are trying to access does not exist|
|Forbidden|Access denied|The group exists but the user is not a techLead|
|DatabaseError|Failed to access data|The group existence could not be verified, something went wrong please try again|
|Forbidden|Access denied|You can not remove the last techLead|
|NotFound|Group not found|The group was not found|
|NotFound|User not found|The user is not in the group|
|NotFound|User not found|The user with the account ${account} was not found|
|DatabaseError|Failed to remove|The member was not remove from the group please try again|
|DatabaseError|Failed to remove|The group was not removed from the user, something went wrong please try again|

## Update
to update a group the user is in 
> [!TIP]
> if the group you are trying to update it is still an invitation it will update it as well
### Parameters
- userAccount string
- groupId ObjectId
- data
```TypeScript
  { name: string, color: string }
```
### Output
- boolean
### Errors
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account ${userAccount} is invalid|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|Group not found|The user it\'s not in the group|
|DatabaseError|Failed to save|The user was not updated|
