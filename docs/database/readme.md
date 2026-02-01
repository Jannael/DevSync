# 📁 Schemas

Inside the `schemas` folder, you'll find two separate directories, each serving a distinct purpose:

- **Mongoose Schemas**: These are designed to work with Mongoose in Node.js applications. They provide validation at the application level
- **Mongosh Schemas**: These are written for use directly in the MongoDB shell (`mongosh`). They enforce validation rules at the database level, protecting data consistency even when inserted outside the application.

✅ **Best Practice**: When initializing your database instance, make sure to apply the `mongosh` schemas. This gives you two layers of validation:
