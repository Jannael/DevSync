# 📁 Architecture Overview

The flow for each request is simple and structured:

Router → Controller → Service → Model

---

## 🧩 Layer Responsibilities

### 📍 Controller

- response format
- Errors are caught and propagated here.

### 🔐 service

- business logic
- Manages token operations: encryption, decryption, and JWT handling.
- Configures options related to authentication and security.
- Delegates data operations to the model layer.

### 🗄️ Model

- Interfaces directly with the database.
- Executes queries.
- Handles data encryption and related errors the encryption to save in the database ONLY.

---

## 📁 Folder Structure

**Flow:** `Router → Controller → service → Model`

For example, if you're working with the `user` route:

- `router/user/router.ts` → Defines the route for user-related endpoints.
- `controller/user/controller.ts` → Handles request format and HATEOS for error handling.
- `service/user/service.ts` → Manages token operations, encryption, and calls the model.
- `model/user/model.ts` → Interfaces directly with the database for user data.
