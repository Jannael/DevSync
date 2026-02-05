# /auth/v1/

## [/request/code/]

`[POST]`

---

### Action

[Sends an email to users account and regenerates a token with the code encrypted.]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/verify/code/]

`[POST]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/request/accessToken/]

`[GET]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/request/refreshToken/code/]

`[POST]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/request/refreshToken/]

`[POST]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/account/request/code/]

`[PATCH]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/change/account/]

`[PATCH]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/password/request/code/]

`[PATCH]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/change/password/]

`[PATCH]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```

## [/request/logout/]

`[POST]`

---

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Authentication Type:** `[Bearer Token / API Key / None]`
- **Required Permissions:** `[User / Admin / Read-only]`
- **Required Header:** `Authorization: Bearer <token>`

---

### Input (Request)

#### Path / Query Parameters

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `id`      | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "field_one": "string",
  "field_two": 123
}
```
