# Error Handling System

## Purpose

The main purpose of the Error Handling system is to provide a standardized, way to manage errors across the entire application. By using custom error classes and a centralized handler.

## Effectiveness

This system is highly effective because:

- **Centralization:** All error-to-response conversion logic lives in one place (`ErrorHandler`).
- **Type Safety:** The use of TypeScript and a factory pattern ensures that errors thrown in the code are predictable and well-defined.
- **Improved UX/DX:** Clients receive clear, structured error messages and descriptions, while developers benefit from a simple `throw new ErrorInstance()` syntax.
- **HATEOAS Support:** Errors can include links to guide users or developers on how to resolve the issue.

---

## Error Constructor (`CreateError`)

The system uses a factory function to generate custom error classes. This avoids repetitive boilerplate for each new error type.

### How it works

The `CreateError` function takes a status code and a name, and returns a class that extends the native `Error` class, adding a `code`, `description`, and optional `link`.

```typescript
export function CreateError<T extends string>(code: number, name: string) {
  // Returns a constructor for a CustomError
}
```

---

## Creating Instances

To create a new category of error, define a type for the allowed messages and use the `CreateError` factory in `Error.instance.ts`.

### Steps

1. Define a type union with the allowed string messages.
2. Call `CreateError` with the status code and the internal name.

**Example:**

```typescript
type ICustomNotFound = "Resource not found" | "Page missing";
export const CustomNotFound = CreateError<ICustomNotFound>(
  404,
  "customNotFound",
);
```

---

## Standard Error Instances

The following instances are currently available:

| Instance         | HTTP Code | Allowed Messages Examples                                   |
| :--------------- | :-------- | :---------------------------------------------------------- |
| `UserBadRequest` | `400`     | `Missing data`, `Invalid credentials`                       |
| `Forbidden`      | `403`     | `Invalid account`, `Access denied`                          |
| `NotFound`       | `404`     | `User not found`, `Group not found`, `Task not found`, etc. |
| `DuplicateData`  | `409`     | `User already exists`                                       |
| `DatabaseError`  | `500`     | `Connection error`, `Failed to save`, etc.                  |
| `ServerError`    | `500`     | `Operation Failed`                                          |

---

## Usage in Code

### Throwing Errors

You can throw errors anywhere in the business logic (controllers, models, helpers). The system will automatically capitalize the message and description.

```typescript
if (!group) {
  throw new NotFound(
    "Group not found",
    "The requested group ID does not exist in our database.",
  );
}
```

### Handling in Controllers (via Adapters)

When using the `CreateAdapter` helper, errors are automatically caught and passed to `ErrorHandler.Response`.

### Using the Model Handler

In parts of the code where you want to catch specific database errors and re-throw them or fallback to a default error, use `ErrorHandler.Model`.

```typescript
try {
  return await Model.Get({ _id });
} catch (e) {
  ErrorHandler.Model({
    error: e as CustomError,
    DefaultError: new ServerError("Operation Failed"),
  });
}
```
