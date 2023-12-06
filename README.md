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

## Run tests with coverage

```bash
npm run test:coverage
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

```

## Goals

### Backend

- [x] Register
- [x] Login
- [x] Refresh token
- [x] Search with dpe, ges, zip code, surface
- [x] Save search for user
- [x] Get user searches
- [x] Delete user search
- [x] Re run user search
- [x] Swagger
- [x] Tests (without mocking, mockingoose not working with ts, no success with jest.mock or memory mongo db)
- [x] Scrapping on www.immonot.com
- [ ] Batch script

### Frontend

- [x] Register
- [x] Login
- [x] Search with dpe, ges, zip code, surface
- [x] Display on map with markers
- [x] User page with user profile
- [x] User page with user searches (did not have time to implement the delete and re run)