# User Model

## Get

to get specific fields of the user with the \_id

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

## Delete

to eliminate a user

### Functions

- groupModel.member.remove()

### Parameters

- userId ObjectId

### Output

- boolean

### Error

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

## Password Update

to update user pwd

### Parameters:

- account string
- pwd string

### Output

- boolean

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

## Remove

to remove an invitation

> [!IMPORTANT]
> This function its made to be call for other models in order to keep the data sync, which means it does not delete the user from the group the invitation came from

### Parameters

- userAccount string
- invitationId ObjectId

### Output

- boolean

## Accept

to accept an invitation

### Parameters

- userAccount string
- invitationId ObjectId

### Output

- boolean

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
