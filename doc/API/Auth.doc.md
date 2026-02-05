# /auth/v1/

## [/request/code/]

`[POST]`

---

### Action

[Sends an email to users account and regenerates a token with the code encrypted.]

### Credentials & Security

`[NONE]`

### Input (Request)

#### Body fields

| Parameter  | Type     | Required | Description     |
| :--------- | :------- | :------- | :-------------- |
| `account`  | `String` | Yes      | User's account. |
| `TEST_PWD` | `String` | No       | Test password.  |

#### Request Body

```json
{
  "account": "example@gmail.com"
}
```

## [/verify/code/]

`[POST]`

---

### Action

[Verifies the code sent by /request/code/ and saves the account in a cookie.]

### Credentials & Security

- **Endpoints required to be called first:** `[/request/code/]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description            |
| :-------- | :------- | :------- | :--------------------- |
| `code`    | `String` | Yes      | Code sent to the user. |

#### Request Body

```json
{
  "code": "1234"
}
```

## [/request/accessToken/]

`[GET]`

### Action

[gets a new access token with the refresh token.]

### Credentials & Security

- **Endpoints required to be called first:** `[/request/refreshToken/code/]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `[No apply]`

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`

## [/request/refreshToken/code/]

`[POST]`

`[NEXT: /request/refreshToken/]`

### Action

[First step to login, send the code to the user.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter  | Type     | Required | Description      |
| :--------- | :------- | :------- | :--------------- |
| `account`  | `String` | Yes      | Users's account. |
| `pwd`      | `String` | Yes      | User's password. |
| `TEST_PWD` | `String` | No       | Test password.   |

#### Request Body

```json
{
  "account": "example@gmail.com",
  "pwd": "1234"
}
```

## [/request/refreshToken/]

`[POST]`

### Action

[Verifies the code sent by /request/refreshToken/code/ and returns an access token and refresh token.]

### Credentials & Security

- **Endpoints required to be called first:** `[/request/refreshToken/code/]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                    |
| :-------- | :------- | :------- | :----------------------------- |
| `code`    | `String` | Yes      | The unique ID of the resource. |

#### Request Body

```json
{
  "code": "1234"
}
```

## [/account/request/code/]

`[PATCH]`

`[NEXT: /change/account/]`

### Action

[First step to change account, send the codes to the user, both current and new account.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter    | Type     | Required | Description         |
| :----------- | :------- | :------- | :------------------ |
| `newAccount` | `String` | Yes      | User's new account. |
| `TEST_PWD`   | `String` | No       | Test password.      |

#### Request Body

```json
{
  "newAccount": "example@gmail.com"
}
```

## [/change/account/]

`[PATCH]`

### Action

[Verifies the code sent by /account/request/code/ and updated the account in the database.]

### Credentials & Security

- **Endpoints required to be called first:** `[/account/request/code/]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter            | Type     | Required | Description                       |
| :------------------- | :------- | :------- | :-------------------------------- |
| `codeCurrentAccount` | `String` | Yes      | Code sent to the current account. |
| `codeNewAccount`     | `String` | Yes      | Code sent to the newAccount.      |

#### Request Body

```json
{
  "codeCurrentAccount": "1234",
  "codeNewAccount": "1234"
}
```

## [/password/request/code/]

`[PATCH]`

`[NEXT: /change/password/]`

### Action

[Requests a code to change the password WITHOUT begin logged in(for password reset).]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter  | Type     | Required | Description     |
| :--------- | :------- | :------- | :-------------- |
| `account`  | `String` | Yes      | User's account. |
| `TEST_PWD` | `String` | No       | Test password.  |

#### Request Body

```json
{
  "account": "example@gmail.com"
}
```

## [/change/password/]

`[PATCH]`

### Action

[Updates the password of the user.]

### Credentials & Security

- **Endpoints required to be called first:** `[/password/request/code/]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter | Type     | Required | Description                  |
| :-------- | :------- | :------- | :--------------------------- |
| `code`    | `String` | Yes      | Code sent to user's account. |
| `newPwd`  | `String` | Yes      | New password.                |

#### Request Body

```json
{
  "code": "1234",
  "newPwd": "1234"
}
```

## [/request/logout/]

> [!NOTE]
> if you do not have a refresh token returns an unsuccessful response

`[POST]`

### Action

[Logs out the user.]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

---

### Input (Request)

#### Body fields

`[NONE]`

#### Request Body

`[NONE]`
