# /invitation/v1/

## [/get/user/]

`[POST]`

### Action

[Retrieves all invitations received by the current user.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[NONE]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`

---

## [/get/group/]

`[POST]`

### Action

[Retrieves all invitations emitted by a specific group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                 |
| :-------- | :------- | :------- | :-------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group. |

#### Request Body

```json
{
  "groupId": "65b2f1..."
}
```

---

## [/create/]

`[POST]`

### Action

[Invites a user to a group with a specific role.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter      | Type     | Required | Description                                                 |
| :------------- | :------- | :------- | :---------------------------------------------------------- |
| `groupId`      | `String` | Yes      | The unique ID of the group.                                 |
| `data.account` | `String` | Yes      | The account (email) of the user to invite.                  |
| `data.role`    | `String` | Yes      | The role to assign (`developer`, `documenter`, `techLead`). |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "data": {
    "account": "user@example.com",
    "role": "developer"
  }
}
```

---

## [/update/role/]

`[PATCH]`

### Action

[Updates the role assigned in an existing invitation.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                              |
| :-------- | :------- | :------- | :--------------------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group.              |
| `account` | `String` | Yes      | The account (email) of the invited user. |
| `newRole` | `String` | Yes      | The new role to assign.                  |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "account": "user@example.com",
  "newRole": "techLead"
}
```

---

## [/cancel/]

`[POST]`

### Action

[Cancels an invitation sent by a group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                              |
| :-------- | :------- | :------- | :--------------------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group.              |
| `account` | `String` | Yes      | The account (email) of the invited user. |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "account": "user@example.com"
}
```

---

## [/accept/]

`[POST]`

### Action

[Accepts a group invitation, making the user a member.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[NONE]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                 |
| :-------- | :------- | :------- | :-------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group. |

#### Request Body

```json
{
  "groupId": "65b2f1..."
}
```

---

## [/reject/]

`[POST]`

### Action

[Rejects a group invitation.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[NONE]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                 |
| :-------- | :------- | :------- | :-------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group. |

#### Request Body

```json
{
  "groupId": "65b2f1..."
}
```
