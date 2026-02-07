# Response

## Typescript interface

this is the interface for the response obj

```typescript
interface Response {
  success: true;
  data?: {
    [key: string]: any;
    metadata?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      nextPageUrl: string | null;
      prevPageUrl: string | null;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }
  } & any[];
  link?: Array<{rel: string; href: string}>;
} & {
  success: false;
  msg: string;
  description?: string;
  link?: Array<{rel: string; href: string}>;
}
```

## Usage

- those endpoint with pagination return a metadata objet inside the data object
- for those that does not need pagination you will get all the data in data object
- response that returns an array(like get group, which is an array with all the users groups), data will be an array thats why the data type is any[]

