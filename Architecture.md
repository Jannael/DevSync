# Architecture Overview

> ![NOTE]
> To see the how error handling is done check the [Error Handling](/doc/error/ErrorHandling.doc.md) doc.

The flow for each request is simple and structured:

Router → Adapter → Controller → Model

## Folder Structure

for each endpoint the flow is always the same: for example if you're working
with the `user` route:

router/user/user.router.ts → Defines the route for user-related endpoints.

adapter/user/user.adapter.ts → Handles request format and HATEOS for error
handling.

controller/user/user.controller..ts → Manages token operations, encryption, and
calls the model.

model/user/user.model.ts → Interfaces directly with the database for user data.

```bash
.
├── docs
└── src
    ├── backend
    │   ├── adapter
    │   ├── config
    │   ├── constant
    │   ├── controller
    │   ├── database
    │   │   ├── mongodb
    │   │   └── node
    │   ├── error
    │   ├── interface
    │   ├── middleware
    │   ├── model
    │   ├── route
    │   ├── secret
    │   ├── service
    │   ├── utils
    │   │   ├── auth
    │   │   └── helper
    │   └── validator
    │       └── schemas
    └── test
```

### File naming convention

I use the following naming convention for files:

File.distinction.ts example: user.router.ts => singular

distinctions:

- router
- adapter
- controller
- model
- utils
- schema (this also contains the validators for those schemas)
- validator (validators that does not need a zod schema)
- d (for typescript declarations)
- constructor
- handler
- instance
- constant

### Naming convention

I use the following naming convention for variables:

- variableName
- SetOfFunctions example: UserController.Update
- mostly singular, but you may find plurals in variables ONLY

## Layer Responsibilities

### Adapter

- Handles request format and HATEOS for error handling.

### Controller

- business logic
- Manages token operations: encryption, decryption, and JWT handling.
- Configures options related to authentication and security.
- Delegates data operations to the model layer.

### Model

- Interfaces directly with the database.
- Executes queries.
- Handles data encryption and related errors the encryption to save in the
  database ONLY (like passwords, because it's something only the db needs it has
  no business logic related).
