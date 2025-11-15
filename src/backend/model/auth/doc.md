# Auth Model

## Login
it validates the given pwd, and if it match with the one in the database

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The account must match example@gmail.com|
|NotFound|User not found||
|UserBadRequest|Invalid credentials|Incorrect password|
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|

## Exists
Validates if the user exists

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|User not found||
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|

## RefreshToken

### Verify
This function tells you if the token is saved in the db, to get more protection, on the information in it.

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found||
|DatabaseError|Failed to access data|The user was not retrieved, something went wrong please try again|

### Remove
it removes a refreshToken from user's sessions

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found||
|DataBaseError|Failed to remove|The session was not removed, something went wrong please try again|


### Save
it saves a session in the database
|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|UserBadRequest|Invalid credentials|The _id is invalid|
|NotFound|User not found||
|DatabaseError|Failed to save|The session was not saved, something went wrong please try again|
