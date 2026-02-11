# /api/v1/

## [ENDPOINT_NAME]

`[HTTP_METHOD]`

### Action

[Provide a brief and clear description of what this endpoint does. Example: Authenticates a user and returns a JSON Web Token (JWT).]

### Credentials & Security

- **Endpoints required to be called first:** `[NONE]`
- **Required Permissions:** `[No apply]`
- **Required Header:** `application/json`

### Input (Request)

#### Body fields

| Parameter   | Type     | Required | Description  |
| :---------- | :------- | :------- | :----------- |
| `parameter` | `String` | Yes      | Description. |

#### Request Body

```json
{
  "parameter": "value"
}
```

### Output (Response)

#### Body fields

| Parameter | Type      | Description |
| :-------- | :-------- | :---------- |
| `success` | `Boolean` | status.     |

#### Response Body

```json
{ "success": true }
```
