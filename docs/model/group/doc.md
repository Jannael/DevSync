# Group Model

## Get

gets the whole group information

### Parameters:

- id ObjectId

### Output:

```TypeScript
  _id: Types.ObjectId
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

## Exists

it has two different uses

- to check if the group exists
- to check if the group exists and the user is techLead

### Parameters:

- groupId ObjectId
- techLeadAccount? string

### Output:

- boolean

## Create

to create a group

> [!TIP]
> if you do not add the techLead who is creating the group, it will add it for you

> [!IMPORTANT]
> for each techLead/member you add, it will send an invitation

> [!CAUTION]
> it adds the group to user schema

### Functions

this function uses some other functions

- UserModel.invitation.create()
- UserModel.group.add()

### Parameters:

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
    { fullName: string, account: string }
  ```

### Output:

```TypeScript
  _id: Types.ObjectId
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

## Update

to update a group, you only can update the name, color or repository

- it updates the group on user schema
  > [!CAUTION]
  > it does not validate who is making the operation

### Functions:

this function uses some other functions

- UserModel.group.update()

### Parameters

- groupId: ObjectId
- data:

```TypeScript
  name: string
  color: string // hexadecimal
  repository: string //url
```

### Output

```TypeScript
  _id: ObjectId
  name: string
  color: string
  repository?: string
```

## Delete

to delete a group

- it removes the group from user schema
  > [!CAUTION]
  > it does not validate who is making the operation

### Functions:

this functions uses some other functions

- UserModel.group.remove()

### Parameters:

- groupId ObjectId

### Output

- boolean

# Member

## Add

it adds a member to the groups,

> [!TIP]
> remember user's belong to the group unless they reject the invitation

> [!CAUTION]
> this function does not validates who is making the operation, only the data for it

### Parameters:

- groupId ObjectId
- member

```TypeScript
  account: string
  fullName: string
  role: string
```

### Output

- boolean

## Remove

to remove a user in group schema

> [!CAUTION]
> It does not validate that a techLead is removing the member

### Functions:

- authModel.exists()

### Parameters:

- groupId ObjectId
- account string

### Output:

- boolean

## Update

to update a user in group schema

> [!CAUTION]
> it does not validate who is making the operation

### Parameters:

- groupId ObjectId
- data

```TypeScript
{ fullName: string, account: string }
```

- updateData

```TypeScript
{ fullName: string, account: string }
```

### Output

- boolean
