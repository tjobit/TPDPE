# TPDPE

## Init project
> at root directory
```bash
npm install
```

Create a `.env` file at root directory and add the variables as in `.env.example`

## Run project

```bash
npm run dev
```

## Run tests

```bash
npm run test
```

## See api doc (swagger)
> localhost:3030/docs

## Project structure

```
|── __test__ # Tests
├── src # Source code
│   ├── controllers # Controllers for each route
│   ├── exceptions # Custom exceptions
│   ├── interfaces # Interfaces for each entity
│   ├── middlewares # Middlewares like error handler or auth
│   ├── models # Models for each entity
│   ├── ressources # Different ressources (swagger, mails, etc.)
│   ├── routes # Routes for requests
│   ├── services # Services for data manipulation and logic
│   ├── utils # Utils for common functions
│   └── server.ts # App entry point
|── .env # Environment variables