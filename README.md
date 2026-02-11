# Devsync

## Objective

DevSync is a robust backend application designed to streamline collaboration
within technical teams. It provides a platform for **assigning tasks** and
managing the creation and tracking of **coding solutions**.

## Stack

| Category             | Technology                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------- |
| Language             | [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](Typescript)        |
| Framework            | [![Express.js](https://img_shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](Express) |
| Database             | [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](MongoDB)           |
| Package Manager      | [![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](pnpm)                                |
| **LINTER/FORMATTER** |                                                                                                                  |
| Linter/formatter     | [![Biome](https://img.shields.io/badge/Biome-60a5fa?logo=biome&logoColor=white)](https://biomejs.dev)            |
| Markdown Formatter   | [![prettier](https://img.shields.io/badge/prettier-FF69B4?logo=prettier&logoColor=fff)](prettier)                |
| **TESTING**          |                                                                                                                  |
| Jest                 | [![Jest](https://img.shields.io/badge/Jest-99424F?logo=jest&logoColor=fff)](Jest)                                |
| ts-jest              | [![ts-jest](https://img.shields.io/badge/ts-jest-99424F?logo=jest&logoColor=fff)](ts-jest)                       |
| supertest            | [![supertest](https://img.shields.io/badge/supertest-99424F?logo=jest&logoColor=fff)](supertest)                 |

## Install

Developed using Node.js 24.11.0.

Check the [Env doc](doc/Env.md).

Check the [Database doc](doc/Database.md).

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start your MongoDB service:**

   ```bash
   mongod --replSet "rs0"
   ```

3. **Run tests (optional):**

   ```bash
   pnpm test
   ```

## Scripts

```json
  "test": "pnpm jest --verbose --detectOpenHandles",
  "test:w": "pnpm jest --verbose --detectOpenHandles src/test/API/Solution.test.ts", // it means test:working

  // test a specific API
  "test:auth": "pnpm jest --verbose --detectOpenHandles src/test/API/Auth.test.ts",
  "test:group": "pnpm jest --verbose --detectOpenHandles src/test/API/Group.test.ts",
  "test:invitation": "pnpm jest --verbose --detectOpenHandles src/test/API/Invitation.test.ts",
  "test:member": "pnpm jest --verbose --detectOpenHandles src/test/API/Member.test.ts",
  "test:solution": "pnpm jest --verbose --detectOpenHandles src/test/API/Solution.test.ts",
  "test:task": "pnpm jest --verbose --detectOpenHandles src/test/API/Task.test.ts",
  "test:user": "pnpm jest --verbose --detectOpenHandles src/test/API/User.test.ts",

  "build": "pnpm tsc",
  "type-check": "pnpm tsc -noEmit",
  "start": "node ./dist/backend/server.js",


  // linters and formatters
  "format": "pnpm biome check --write",
  "lint": "pnpm biome check",

  "format:md": "prettier --write \"**/*.md\"",
  "check:md": "prettier --check \"**/*.md\"",

  // runs all linters, formatters and checks
  "fix:all": "pnpm type-check && pnpm lint && pnpm format && pnpm check:md  && pnpm format:md"
```

## Doc

The full API documentation, including route definitions and required parameters,
is located in the [API](doc/API) folder.

If you want to know how the code works check the [architecture](Architecture.md)

## Features

- **Authentication**: Secure JWT-based authentication with robust cookie
  management (Access & Refresh tokens).
- **User Management**: Comprehensive profile updates, account administration,
  and enhanced password security.
- **Groups**: Collaborative workspaces featuring a seamless invitation system.
- **Tasks**: Efficient management and tracking of assigned tasks.
- **Solutions**: Streamlined submission and tracking of coding solutions.

## Challenges

This project represents my first medium-sized application, and the greatest
challenge was maintaining architectural coherence. I initially chose the MVC
(Model-View-Controller) pattern but later struggled to maintain clear separation
of concerns, especially regarding cookie management.

### Facing the Challenge

To address this initial architectural struggle, I recognized the need for
immediate correction and applied the lessons learned to subsequent modules. The
APIs for the solution and task resources, for example, were implemented with a
correct and strictly separated MVC structure from the outset, ensuring clear
boundaries.

Additionally, I introduced an architectural enhancement: the Service Layer
(/src/backend/service/). This layer abstracts all complex business logic, state
management (such as cookie handling and token refreshing), and data interactions
away from the controllers.

UPDATE: i've work in refactoring the entire project, and i fixed all the issues i found when i created the first version of the frontend, but also all the problems i created in the backend with the first version of the backend (architecture, code quality, etc)

## Future work

- Logger running in the background
- limitations for group and pretty much everything (limited resources)
- indexes for db
- resilient patterns

(low priority)

- unit tests for utils (mostly)
- middleware to validate missing fields, avoid things like this in controllers:

  ```typescript
  if (!_id) throw new UserBadRequest("Missing data", "Missing task id");
  if (!Types.ObjectId.isValid(_id))
    throw new UserBadRequest("Invalid credentials", "Invalid task id");

  if (page === undefined)
    throw new UserBadRequest("Missing data", "Missing page number");
  if (typeof page !== "number")
    throw new UserBadRequest("Invalid credentials", "Invalid page");
  ```
