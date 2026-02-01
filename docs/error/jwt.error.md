| StatusCode | Instance       | Message             |                                        Description |
| :--------- | :------------- | :------------------ | -------------------------------------------------: |
| 400        | UserBadRequest | Missing data        |                                    Missing {token} |
| 400        | UserBadRequest | Invalid credentials |                                    Invalid {token} |
| 400        | UserBadRequest | Invalid credentials |   The token is malformed or has been tampered with |
|            |                |                     |                                                    |
| 401        | Unauthorized   | Expired token       |       The token has expired and is no longer valid |
|            |                |                     |                                                    |
| 403        | Forbidden      | Access denied       | The token is not active yet; check the "nbf" claim |
