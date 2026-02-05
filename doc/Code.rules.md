# Code rules

- No query params:
  if you need the frontend to send something change the http method to post and get it from the body
- All tokens are encrypted and stored as http only cookies
- do not send any tokens to the frontend:
  all tokens are handled by the backend