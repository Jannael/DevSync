# /member/v1/

## [/get/]

`[POST]`

### Action

[Retrieves all members of a specific group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be a member of the group]`
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

## [/update/role/]

`[PATCH]`

### Action

[Updates the role of a member within a group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                                           |
| :-------- | :------- | :------- | :---------------------------------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group.                           |
| `account` | `String` | Yes      | The account (email) of the member.                    |
| `newRole` | `String` | Yes      | The new role (`developer`, `documenter`, `techLead`). |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "account": "user@example.com",
  "newRole": "techLead"
}
```

---

## [/remove/]

`[DELETE]`

### Action

[Removes a member from a group. A technical lead cannot be removed if they are the last one in the group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                                  |
| :-------- | :------- | :------- | :------------------------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group.                  |
| `account` | `String` | Yes      | The account (email) of the member to remove. |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "account": "user@example.com"
}
```
