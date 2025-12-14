# Auth Model

## Login

it validates the given pwd, and if it match with the one in the database

### Parameters:

- account string
- pwd string

### Output:

```TypeScript
  _id: Types.ObjectId
  fullName: string
  account: string
  pwd: string
  nickName?: string | null
  invitation?: IUserInvitation[] | null
  group?: IUserGroup[] | null
```

## Exists

Validates if the user exists

### Parameters:

- account string

### Output:

- boolean

# RefreshToken

## Verify

This function tells you if the token is saved in the db, to get more protection, on the information in it.

### Parameters:

- token string
- userId ObjectId

### Output:

- boolean

## Remove

it removes a refreshToken from user's sessions

### Parameters:

- token string
- userId ObjectId

### Output:

- boolean

## Save

it saves a session in the database

### Parameters:

- token string
- userId ObjectId

### Output:

- boolean
