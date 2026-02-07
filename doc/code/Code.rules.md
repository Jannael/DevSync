# Code rules

- No query params:
  if you need the frontend to send something change the http method to post and get it from the body
- All tokens are encrypted and stored as http only cookies
- do not send any tokens to the frontend:
  all tokens are handled by the backend

## When to use a transaction

this is not something about the project but i've seen that even AI does not understand how to properly use a transaction in mongodb

- When the operation involves more than one collection
- When the operations are write operations

this are the only two rules you need to decide wether or not to use a transaction, an operation can read multiple collections but if it only write to one collection it is not a transaction unless it read.. after the write operation, only if its writes into multiple collections it is a transaction
