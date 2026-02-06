# Helper Utilities

## CreateAdapter

### Description

Wraps a controller function to handle standard Express responses and error catching. It automatically formats the JSON response based on whether the result is a boolean or data.

### Parameters

| Parameter    | Type                                                | Description                                         |
| :----------- | :-------------------------------------------------- | :-------------------------------------------------- |
| `controller` | `(req: Request, res: Response) => Promise<unknown>` | The controller function to execute.                 |
| `link`       | `Array<{ rel: string; href: string }>`              | Optional HATEOAS links to include in case of error. |

### Returns

`Function` - An asynchronous Express middleware function `(req: Request, res: Response) => Promise<void>`.

### Usage Example

```typescript
const Get = CreateAdapter({ controller: GroupController.Get });
```

---

## CreateModel

### Description

Wraps a model function to provide standardized error handling via `ErrorHandler.Model`. If the operation fails, it uses the provided `DefaultError`.

### Parameters

| Parameter      | Type                                     | Description                                                                |
| :------------- | :--------------------------------------- | :------------------------------------------------------------------------- |
| `Model`        | `(params: T) => Promise<R \| undefined>` | The model function that performs the database operation.                   |
| `DefaultError` | `CustomError`                            | The error to throw if the operation fails and no specific error is caught. |

### Returns

`Function` - An asynchronous function that takes `params: T` and returns `Promise<R \| undefined>`.

### Usage Example

```typescript
const Get = CreateModel({
  Model: GroupCollection.Get,
  DefaultError: new NotFound("Group not found"),
});
```

---

## CreateValidator

### Description

Creates a validator function based on a Zod schema. If validation fails, it throws a `UserBadRequest` error with the specific Zod error message.

### Parameters

| Parameter | Type        | Description                         |
| :-------- | :---------- | :---------------------------------- |
| `schema`  | `ZodSchema` | The Zod schema to validate against. |

### Returns

`Function` - A function that takes `data: T` and returns the validated data or throws an error.

### Usage Example

```typescript
const GroupValidator = CreateValidator(GroupSchema);
```
