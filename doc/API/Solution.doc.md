****# /solution/v1/

## [/get/]

`[POST]`

### Action

[Retrieves the details of a specific solution.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be a member of the group]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `_id`     | `String` | Yes      | The unique ID of the solution. |
| `groupId` | `String` | Yes      | The unique ID of the group.    |

#### Request Body

```json
{
  "_id": "65b2f1...",
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
    "user": "65b2f1...",
    "groupId": "65b2f1...",
    "description": "Implemented auth service with JWT",
    "feature": "Login process",
    "code": {
      "language": "typescript",
      "content": ""
  }
}
```

## [/create/]

`[POST]`

### Action

[Creates a solution for a task. The task must belong to the group, and the user must be assigned to the task or be a techLead.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be a member of the group, assigned to the task OR techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter          | Type     | Required | Description                                   |
| :----------------- | :------- | :------- | :-------------------------------------------- |
| `groupId`          | `String` | Yes      | The unique ID of the group.                   |
| `data._id`         | `String` | Yes      | The ID of the task this solution belongs to.  |
| `data.description` | `String` | Yes      | Detailed description of the solution.         |
| `data.feature`     | `String[]` | No      | List of implemented features. |
| `data.code.language`        | `String` | No     | The language code.                      |
| `data.code.content`        | `String` | No      | The content code.                      |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "data": {
    "_id": "65b2f1...",
    "feature": "Login process",
    "description": "Implemented auth service with JWT",
    "code": {
      "language": "typescript",
      "content": "console.log('devsync')"
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
    "user": "65b2f1...",
    "groupId": "65b2f1...",
    "description": "Implemented auth service with JWT",
    "feature": "Login process",
    "code": "export const auth = ..."
  }
}
```

## [/update/]

`[PUT]`

### Action

[Updates an existing solution.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be assigned to the task OR techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter          | Type     | Required | Description                               |
| :----------------- | :------- | :------- | :---------------------------------------- |
| `_id`              | `String` | Yes      | The ID of the solution (same as Task ID). |
| `groupId`          | `String` | Yes      | The unique ID of the group.               |
| `data.feature`     | `String[]` | No       | Updated feature description.              |
| `data.description` | `String` | No       | Updated solution description.             |
| `data.code.language`        | `String` | No       | Updated language code.                             |
| `data.code.content`        | `String` | No       | Updated content code.                             |

#### Request Body

```json
{
  "_id": "65b2f1...",
  "groupId": "65b2f1...",
  "data": {
    "feature": "Improved Login process"
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

[Deletes a solution and marks the task as incomplete.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be assigned to the task OR techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                       |
| :-------- | :------- | :------- | :-------------------------------- |
| `_id`     | `String` | Yes      | The ID of the solution to delete. |
| `groupId` | `String` | Yes      | The unique ID of the group.       |

#### Request Body

```json
{
  "_id": "65b2f1...",
  "groupId": "65b2f1..."
}
```

---

### Output (Response)

#### Response Body

```json
{ "success": true }
```
