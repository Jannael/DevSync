# Model

This are the rules the models are based on and should be followed to create a new model

## Rules
### Keep data sync
> [!IMPORTANT]
> A model fn does not necessarily has to make only one query, in order to keep the data sync it can make as much queries as needed.

Example when you are deleting a user and this user belongs to a group, the model fn delete user have to be able to remove, the user from the groups, with a single model fn, putting less work on functions

### Different uses
> [!IMPORTANT]
> A model fn must be able to make the first point optional.

Let me explain, it's not the same removing a user from a group, because the user wants to quit and because the group it's been deleted, so in order to keep it simple, the best option it's add boolean parameters, to avoid, or execute multiple queries

### No security
> [!CAUTION]
> A model fn must not handle any security features.

if you want to know if the user it's allowed to make an operation then should be a model fn, to identify it, but the model function itself must not have this feature