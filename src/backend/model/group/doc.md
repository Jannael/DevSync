# User Model

## Get
gets the whole group information

Parameters:
-account ObjectId

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|Group not found|The group you are trying to access does not exist|
|DatabaseError|Failed to access data|The group was not retrieved, something went wrong please try again|



## Exists
it has two different uses 
- to check if the group exists
- 

Parameters:
-account ObjectId

|Instance|Error|Message|
|:-----------|:-----------|-----------:|
|NotFound|Group not found|The group you are trying to access does not exist|
|DatabaseError|Failed to access data|The group was not retrieved, something went wrong please try again|