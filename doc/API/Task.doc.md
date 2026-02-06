# /task/v1/

## [/get/]

`[POST]`

### Action

[Retrieves the details of a specific task.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be a member of the group]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                 |
| :-------- | :------- | :------- | :-------------------------- |
| `_id`     | `String` | Yes      | The unique ID of the task.  |
| `groupId` | `String` | Yes      | The unique ID of the group. |

#### Request Body

```json
{
  "_id": "65b2f1...",
  "groupId": "65b2f1..."
}
```

---

## [/list/]

`[POST]`

### Action

[Lists tasks for a specific group with pagination. TechLeads see all tasks, while other roles only see tasks assigned to them.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[User must be a member of the group]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                                   |
| :-------- | :------- | :------- | :-------------------------------------------- |
| `groupId` | `String` | Yes      | The unique ID of the group.                   |
| `page`    | `Number` | Yes      | Page number for pagination (starting from 0). |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "page": 0
}
```

---

## [/create/]

`[POST]`

### Action

[Creates a new task in a group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter       | Type       | Required | Description                                      |
| :-------------- | :--------- | :------- | :----------------------------------------------- |
| `groupId`       | `String`   | Yes      | The unique ID of the group.                      |
| `data.title`    | `String`   | Yes      | Title of the task.                               |
| `data.content`  | `String`   | Yes      | Detailed content/description of the task.        |
| `data.user`     | `String[]` | Yes      | Array of accounts (emails) assigned to the task. |
| `data.priority` | `String`   | Yes      | Task priority (1-10).                            |
| `data.code`     | `String`   | Yes      | Task priority related code.                      |

#### Request Body

```json
{
  "groupId": "65b2f1...",
  "data": {
    "title": "Fix bug in login",
    "content": "Verify JWT expiration logic",
    "user": ["dev@example.com"],
    "priority": "10",
    "code": {
      "language": "js",
      "content": "export const auth = ..."
    }
  }
}
```

---

## [/update/]

`[PUT]`

### Action

[Updates an existing task.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter          | Type       | Required | Description                       |
| :----------------- | :--------- | :------- | :-------------------------------- |
| `_id`              | `String`   | Yes      | The unique ID of the task.        |
| `groupId`          | `String`   | Yes      | The unique ID of the group.       |
| `data.title`       | `String`   | No       | Updated title.                    |
| `data.description` | `String`   | No       | Updated description.              |
| `data.code`        | `String`   | No       | Updated code.                     |
| `data.user`        | `String[]` | No       | Updated assigned users.           |
| `data.priority`    | `String`   | No       | Updated priority.                 |
| `data.isComplete`  | `Boolean`  | No       | Mark task as complete/incomplete. |

#### Request Body

```json
{
  "_id": "65b2f1...",
  "groupId": "65b2f1...",
  "data": {
    "isComplete": true
  }
}
```

---

## [/delete/]

`[DELETE]`

### Action

[Deletes a task from the group.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[techLead]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                 |
| :-------- | :------- | :------- | :-------------------------- |
| `_id`     | `String` | Yes      | The unique ID of the task.  |
| `groupId` | `String` | Yes      | The unique ID of the group. |

#### Request Body

```json
{
  "_id": "65b2f1...",
  "groupId": "65b2f1..."
}
```
