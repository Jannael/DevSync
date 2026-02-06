# /user/v1/

## [/get/]

`[GET]`

### Action

[Retrieves the authenticated user's profile information from the token.]

### Credentials & Security

- **Endpoints required to be called first:** `[/auth/v1/verify/code/]` or `[/auth/v1/request/refreshToken/]`
- **Required Permissions:** `[Authenticated]`
- **Required Header:** `[No apply]`

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`

---

## [/get/group/]

`[GET]`

### Action

[Retrieves all groups the authenticated user belongs to.]

### Credentials & Security

- **Endpoints required to be called first:** `[Authenticated]`
- **Required Permissions:** `[Authenticated]`
- **Required Header:** `[No apply]`

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`

---

## [/create/]

`[POST]`

### Action

[Registers a new user account in the system.]

### Credentials & Security

- **Endpoints required to be called first:** `[/auth/v1/verify/code/]` (to verify email)
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter       | Type     | Required | Description       |
| :-------------- | :------- | :------- | :---------------- |
| `data.fullName` | `String` | Yes      | User's full name. |
| `data.nickName` | `String` | No       | User's nickname.  |
| `data.pwd`      | `String` | Yes      | User password.    |

#### Request Body

```json
{
  "data": {
    "fullName": "Joel Miller",
    "nickName": "The best developer",
    "pwd": "1234"
  }
}
```

---

## [/update/]

`[PUT]`

### Action

[Updates the authenticated user's profile information.]

### Credentials & Security

- **Endpoints required to be called first:** `[/auth/v1/verify/code/]`
- **Required Permissions:** `[Authenticated, and verified email]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter       | Type     | Required | Description        |
| :-------------- | :------- | :------- | :----------------- |
| `data.nickName` | `String` | No       | Updated nickname.  |
| `data.fullName` | `String` | No       | Updated full name. |
| `data.pwd`      | `String` | No       | Updated password.  |

#### Request Body

```json
{
  "data": {
    "nickName": "John Updated"
  }
}
```

---

## [/delete/]

`[DELETE]`

### Action

[Deletes the current user's account. This action involves cascading deletes of memberships and invitations. A user cannot delete their account if they are the last techLead in any group.]

### Credentials & Security

- **Endpoints required to be called first:** `[/auth/v1/verify/code/]`
- **Required Permissions:** `[Authenticated]`
- **Required Header:** `[No apply]`

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`
