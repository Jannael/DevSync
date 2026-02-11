# /group/v1/

## [/get/]

`[POST]`

### Action

[Retrieves information for a specific group.]

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

### Output (Response)

#### Response Body

```json
{
  "success": true,
  "data": {
    "_id": "65b2f1...",
    "name": "My Team",
    "color": "#4f46e5",
    "repository": "https://github.com/user/repo"
  }
}
```

## [/get/invitation/]

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

### Output (Response)

#### Response Body

```json
{
  "success": true,
  "data": [
    {
      "groupId": "65b2f1...",
      "account": "65b2f1...",
      "role": "developer"
    }
  ]
}
```

## [/create/]

`[POST]`

### Action

[Creates a new group. The creator is automatically assigned as the techLead of the group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[NONE]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter         | Type     | Required | Description                          |
| :---------------- | :------- | :------- | :----------------------------------- |
| `data.name`       | `String` | Yes      | The name of the group.               |
| `data.color`      | `String` | Yes      | Hexadecimal color code.              |
| `data.repository` | `String` | No       | URL of the repository (can be null). |

#### Request Body

```json
{
  "data": {
    "name": "My Team",
    "color": "#4f46e5",
    "repository": "https://github.com/user/repo"
  }
}
```

---

### Output (Response)

#### Response Body

```json
{
  "success": true,
  "data": {
    "_id": "65b2f1...",
    "name": "My Team",
    "color": "#4f46e5",
    "repository": "https://github.com/user/repo"
  }
}
```

## [/update/]

`[PUT]`

### Action

[Updates the information of an existing group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter         | Type     | Required | Description                 |
| :---------------- | :------- | :------- | :-------------------------- |
| `groupId`         | `String` | Yes      | The unique ID of the group. |
| `data.name`       | `String` | No       | The new name of the group.  |
| `data.color`      | `String` | No       | The new color hex code.     |
| `data.repository` | `String` | No       | The new repository URL.     |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "data": {
    "name": "Updated Team Name"
  }
}
```

---

### Output (Response)

#### Response Body

```json
{ "success": true }
```

## [/delete/]

`[DELETE]`

### Action

[Deletes a group along with its members and invitations.]

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

### Output (Response)

#### Response Body

```json
{ "success": true }
```

## [/join/]

`[POST]`

### Action

[Allows a user to join a group as a developer.]

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

### Output (Response)

#### Response Body

```json
{
  "success": true,
  "data": {
    "groupId": "65b2f1...",
    "account": "65b2f1...",
    "role": "developer"
  }
}
```

## [/quit/]

`[POST]`

### Action

[Allows a member to leave a group. A technical lead cannot leave if they are the last one in the group.]

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

### Output (Response)

#### Response Body

```json
{ "success": true }
```
