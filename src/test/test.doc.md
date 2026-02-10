# Test Documentation

This project uses **Jest** and **Supertest** for endpoint testing. The goal is to ensure each API route behaves correctly, handles errors gracefully, and returns the expected HATEOAS links.

> ![IMPORTANT]
> Personally i do not like **isolation** of tests (because makes everything verbose and for example if /auth/ endpoint fails and test are isolated, it wont manner the isolation because those test that depend on /auth/ will fail anyway), i like to test the entire flow through the test cases, so test ca not be run individually just as a suit of tests.

## Getting Started

To run the entire test suite:

```bash
pnpm test
```

To run a specific test file (working test):

```bash
pnpm test:w
```

## Test Structure

Each test file follows a hierarchical structure using `describe` blocks:

1.  **Version/Module**: e.g., `describe('/auth/v1/', () => { ... })`
2.  **Endpoint**: e.g., `describe('/request/code/', () => { ... })`
3.  **Scenario Group**: `good request` vs `error request`.

### Template For Endpoint Testing

```typescript
describe("/api/v1/", () => {
  const api = "/api/v1";

  describe("/delete/", () => {
    const endpoint = `${api}/delete/`;

    test("good request", async () => {
      // Use 'agent' if cookies/session are required
      const res = await agent.delete(endpoint).send({ id: "123" });

      ValidateCookie({
        cookieObj: res.header,
        cookies: [CookiesKeys.someToken],
      });

      expect(res.body).toEqual({
        success: true,
        link: [{ rel: "self", href: "/api/v1/delete/" }],
      });
    });

    describe("error request", () => {
      const cases: ISuitErrorCasesResponse = [
        {
          name: "Missing ID",
          fn: () => agent.delete(endpoint).send({}),
          error: {
            code: 400,
            success: false,
            msg: "Missing data",
            description: "Missing id",
          },
        },
      ];

      ValidateResponseError({
        cases,
        link: [{ rel: "self", href: "/api/v1/delete/" }],
      });
    });
  });
});
```

## Key Utilities

### 1. `ValidateCookie`

Ensures that the response contains specific cookies and that they are configured with `HttpOnly`, because all the cookies in the project are HttpOnly.

### 2. `ValidateResponseError`

Automates error scenario testing. It iterates through an array of `cases` and verifies:

- Status Code
- Success flag
- Message (`msg`) and `description`
- The consistency of HATEOAS `link`s across all error cases for that endpoint.

### 3. `CleanDatabase`

Used in `afterAll` or `beforeAll` to ensure the database is empty before running tests. It ignores system collections.

## Mocking

External services (Email, SMS, External APIs) should be mocked to avoid side effects and speed up tests.
Example of mocking the Email service:

```typescript
jest.mock("../../backend/service/SendEmail.service", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));
```

## Best Practices

- **Persistent Sessions**: Use `agent = request.agent(app)` when your test flow depends on cookies set in previous requests (e.g., Login -> Get User).
- **Link Validation**: Always verify the `link` property. It's a key part of our API architecture.
- **Reference**: See `src/test/API/Auth.test.ts` for a comprehensive example of complex flows.
