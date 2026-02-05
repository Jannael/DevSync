## Objective

DevSync is a robust backend application designed to streamline collaboration within technical teams. It provides a platform for **assigning tasks** and managing the creation and tracking of **coding solutions**.

## Stack

This project is built using a modern, scalable backend stack:

| Category            | Technology                                                                                                 | Purpose                                                                      |
| :------------------ | :--------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Language**        | [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)           | Provides static typing for highly maintainable and less error-prone code.    |
| **Framework**       | [![Express.js](https://img_shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#) | Minimalist web server framework used for route management and API endpoints. |
| **Database**        | [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)           | Used for flexible and scalable data storage.                                 |
| **Package Manager** | [![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](#)                             | Ensures fast, efficient, and space-saving dependency management.             |

## Install

The project requires **Node.js version 24.x** (developed using 24.11.0).

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#) 24.x

1. **Install dependencies:**

    ```bash
    pnpm install
    ```

2. **Start your MongoDB service:**

    ```bash
    mongod
    ```

3. **Run tests (optional):**

    ```bash
    pnpm test
    ```

## Scripts

```bash
  pnpm test
  pnpm test:w # i created this one to run a single test test:working
  pnpm build
  pnpm start
  pnpm lint
  pnpm type-check
```

## Doc

The full API documentation, including route definitions and required parameters, is located in the **`/docs/routes/`** folder.

**Note on Architecture:** The models are currently more complex than intended. The **`/docs/model/`** folder contains information regarding this. A refactoring of the `model` and `service` layers is planned for future updates.

## Features

- **Authentication**: Secure JWT-based authentication with robust cookie management (Access & Refresh tokens).
- **User Management**: Comprehensive profile updates, account administration, and enhanced password security.
- **Groups**: Collaborative workspaces featuring a seamless invitation system.
- **Tasks**: Efficient management and tracking of assigned tasks.
- **Solutions**: Streamlined submission and tracking of coding solutions.

## Responses

The API uses two standardized response formats for consistency:

```json
{
  "success": true,
  "result": {}
}
```

```json
{
  "success": false,
  "msg": "",
  "description": "",
  "link": [] //here you will get all the routes you need to make the operation correctly in case something is missing
}
```

## Challenges

This project represents my first medium-sized application, and the greatest challenge was maintaining architectural coherence. I initially chose the MVC (Model-View-Controller) pattern but later struggled to maintain clear separation of concerns, especially regarding cookie management.

### Facing the Challenge

To address this initial architectural struggle, I recognized the need for immediate correction and applied the lessons learned to subsequent modules. The APIs for the solution and task resources, for example, were implemented with a correct and strictly separated MVC structure from the outset, ensuring clear boundaries.

Additionally, I introduced an architectural enhancement: the Service Layer (/src/backend/service/). This layer abstracts all complex business logic, state management (such as cookie handling and token refreshing), and data interactions away from the controllers. A key design decision was making the service functions directly receive the req and res objects. This choice was deliberate, as it allows for a much smoother future integration with GraphQL (specifically using Apollo Server), where the Service Layer can be easily reused and adapted by the GraphQL resolvers without significant refactoring. This approach significantly improved the overall modularity and separation of concerns.

## Future work

- invitations abort
rework in invitations logic, instead of a member been part of the group until it reject the invitation, this will be removed, its going to be added as an invitation status
- limitations for group and pretty much everything
