# AI Agents Project Guide (`AGENTS.md`)

This document serves as the primary technical guide and reference manual for AI agents and human developers working on, maintaining, or extending this repository.

---

## 1. Project Overview

`@servicespack/users-service` is a microservice dedicated to user management, authentication, and credential verification. Its core responsibilities include:
- **User Management**: Creation, paginated listing with text search capabilities, retrieval by ID, profile updates, password modification, and user deletion.
- **Authentication**: Issuing and verifying JSON Web Tokens (JWT).
- **Email Verification**: Verification flow using unique, temporary keys (`emailVerificationKey`).
- **Security**: Strong password hashing with **Argon2** (`@node-rs/argon2`), input sanitization against XSS (`xss`), and defense against ReDoS (Regular Expression Denial of Service) via `safe-regex`.

---

## 2. Technology Stack

- **Runtime & Language**: [Node.js](https://nodejs.org/) (ES Modules), [TypeScript](https://www.typescriptlang.org/) (5.x, target `ES2022`, module/resolution `NodeNext`).
- **Web Framework**: [Express](https://expressjs.com/) (v5.x) with native async route handling.
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) managed via [Mongoose](https://mongoosejs.com/) (v8.x).
- **Validation & Transformation**: [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer).
- **Cryptography & Tokens**: `@node-rs/argon2`, `jsonwebtoken`.
- **API Documentation**: OpenAPI 3.0 served via `swagger-ui-express` at `/docs`.
- **Security Middlewares**: `helmet`, `cors`, `xss`, `safe-regex`.
- **Logging**: [Pino](https://getpino.io/) and `pino-http` (with `pino-pretty` for development output).
- **Testing Suite**:
  - [Vitest](https://vitest.dev/) (fast, native TypeScript test runner).
  - [Supertest](https://github.com/ladjs/supertest) for HTTP endpoint e2e testing.
  - [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) providing isolated, ephemeral in-memory MongoDB instances.
  - [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html) for code coverage analysis.
  - [Stryker Mutator](https://stryker-mutator.io/) for mutation testing.
- **Build & Development Tools**: `tsdown` (bundler), `tsx` (TypeScript execution & watch).
- **Linter & Formatter**: [ESLint](https://eslint.org/) configured with [@antfu/eslint-config](https://github.com/antfu/eslint-config).

---

## 3. Directory Structure and Architecture

The codebase adheres to a modular, layered architecture designed for separation of concerns and high testability.

```
├── .agents/
│   └── rules/
│       └── coding-style.md     # ESLint code style rules and conventions
├── src/
│   ├── http.server.ts          # Express setup, global middlewares, and error handler
│   ├── index.ts                # Application entrypoint (bootstraps DB, validation, HTTP listener)
│   ├── config/                 # Application configuration, logger, and lifecycle hooks
│   │   ├── configuration.ts    # Loads, validates, and exports environment config
│   │   ├── cooldown.ts         # Handles termination signals (SIGHUP, SIGINT, SIGTERM)
│   │   ├── database.ts         # MongoDB connection & schema validation enforcement
│   │   ├── index.ts
│   │   └── logger.ts           # Pino logger configuration
│   ├── controllers/            # Decoupled controllers with injected dependencies
│   │   ├── root.controller.ts
│   │   ├── tokens.controller.ts
│   │   ├── users.controller.ts
│   │   └── verifications.controller.ts
│   ├── docs/                   # OpenAPI / Swagger specification
│   │   └── swagger.ts
│   ├── dto/                    # Data Transfer Objects with validation decorators
│   │   ├── configuration.dto.ts
│   │   ├── create-token.dto.ts
│   │   ├── create-user.dto.ts
│   │   ├── create-verification.dto.ts
│   │   ├── update-password.dto.ts
│   │   ├── update-user-password.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/               # Mongoose schemas, models, and collection validation rules
│   │   ├── index.ts
│   │   └── user.ts
│   ├── middlewares/            # Express middlewares (JWT auth, DTO validation)
│   │   ├── auth.ts
│   │   └── validator.ts
│   └── router.ts               # Express router definition and route-level middleware binding
└── tests/                      # End-to-end tests, configuration tests, and test utilities
    ├── __mocks__/              # Mock factories and fixtures
    ├── e2e/                    # Integration / E2E endpoint tests using supertest
    │   ├── docs.test.ts
    │   ├── tokens.test.ts
    │   ├── update-password.test.ts
    │   └── users.test.ts
    ├── configuration.test.ts
    ├── http.server.test.ts
    ├── setup.ts                # Global test setup (spawns mongodb-memory-server)
    └── teardown.ts             # Global test teardown (disconnects and stops mongo server)
```

### Architectural Details

- **`src/controllers/`**:
  - Class-based controllers receiving database models (e.g., `Model<IUser>`) via dependency injection in their constructors.
  - Action methods are declared as arrow functions (e.g. `create = async (req, res) => { ... }`), preserving the lexical `this` binding without requiring manual `.bind(this)`.
  - Keep controllers isolated from direct network or database concerns to facilitate fast, clean unit testing with mocked models.
- **`src/dto/`**:
  - Encapsulate incoming request payloads and validate them using `class-validator` (e.g., `@IsString()`, `@IsEmail()`, `@MinLength(8)`) and `class-transformer` (e.g., `@Type()`).
  - **Definite Assignment Assertion**: Because TypeScript enforces `strictPropertyInitialization`, all DTO properties must use the definite assignment assertion operator (`!`):
    ```typescript
    export class CreateUserDto {
      @IsString()
      name!: string

      @IsEmail()
      email!: string
    }
    ```
- **`src/entities/`**:
  - Houses Mongoose schemas and model definitions.
  - Implements `toJSON` transforms to convert `_id` to string `id` and purge sensitive/internal attributes (`password`, `emailVerificationKey`, `__v`, `createdAt`, `updatedAt`).
  - Exports BSON schema validation rules (`userValidationRules`) applied directly to the MongoDB collection on startup.
- **`src/middlewares/`**:
  - `auth({ onlyTheOwner?: boolean })`: Inspects the `Authorization: Bearer <token>` header, verifies the JWT with `TOKEN_SECRET`, and optionally checks if the token subject (`sub`) matches `request.params.id`. Returns `401` on unauthorized access.
  - `validator({ Dto: ClassConstructor })`: Instantiates the DTO from `request.body` (or `request.query` for `GET` requests) via `plainToInstance` and validates it with `validate()`. Responds with `400` containing validation errors if invalid.
- **`src/router.ts`**:
  - Centralized Express router mounted on `/api`.
  - Connects validation and authentication middlewares prior to invoking controller actions.
- **`src/config/`**:
  - `configuration.ts`: Loads and validates environment variables.
  - `logger.ts`: Pino logger configuration and instance.
  - `database.ts`: Establishes Mongoose connection and ensures MongoDB collection validation rules are applied.
  - `cooldown.ts`: Listens for `SIGHUP`, `SIGINT`, and `SIGTERM` signals to cleanly close HTTP connections and disconnect from MongoDB before exiting.
- **`src/docs/`**:
  - `swagger.ts`: Defines the OpenAPI 3.0 specification (`swaggerDocument`) detailing all endpoints (`/api`, `/api/tokens`, `/api/users`, `/api/verifications`), request/response schemas (`User`, DTOs, `ErrorResponse`), and Bearer JWT security scheme (`bearerAuth`).
- **`src/http.server.ts`**:
  - Initializes the Express instance, mounts security middlewares (`cors`, `helmet`, `pino-http`, `express.json`), and mounts router.
  - Serves OpenAPI documentation via Swagger UI at `/docs` and as raw JSON at `/docs/swagger.json` (with redirect aliases at `/api/docs`). Configures `helmet` with `contentSecurityPolicy: false` so that Swagger UI assets are not blocked.
  - Global error handler catches unexpected exceptions and formats standard responses, including mapping MongoDB duplicate key violations (`MongoServerError` code 11000) to HTTP `409 Conflict`.
- **`tests/`**:
  - Uses `mongodb-memory-server` in `tests/setup.ts` to spin up a live MongoDB instance in memory for end-to-end tests without requiring external database dependencies.

---

## 4. Commands and Scripts

| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Runs the server in development mode with live watch (`tsx watch --env-file=.env`) piped to `pino-pretty`. |
| `npm run build` | Builds the project for production into `dist/` using `tsdown`. |
| `npm start` | Executes the built production bundle (`dist/index.js`). |
| `npm run build:check` | Validates TypeScript types across the project without emitting output (`tsc --noEmit`). |
| `npm run lint` | Checks code formatting and linter rules with ESLint (`@antfu/eslint-config`). |
| `npm run lint:fix` | Automatically fixes linting and style errors where supported. |
| `npm test` | Runs the complete test suite once using [Vitest](https://vitest.dev/). |
| `npm run test:watch` | Runs Vitest in interactive watch mode for active test-driven development. |
| `npm run test:cov` | Runs tests and computes detailed code coverage using `@vitest/coverage-v8`. |
| `npm run test:mutation`| Executes mutation testing via [Stryker Mutator](https://stryker-mutator.io/) to evaluate test suite quality. |

---

## 5. Coding Standards and Style Guide

The project strictly follows the `@antfu/eslint-config` rules documented in `.agents/rules/coding-style.md`:

1. **No Semicolons**: Do not place semicolons at the ends of statements (rely on Automatic Semicolon Insertion).
2. **Single Quotes**: Use single quotes (`'`) for string literals, unless double quotes reduce escaping.
3. **Indentation**: Use **2 spaces** consistently (never tabs).
4. **Trailing Commas**: Always include trailing commas in multiline object literals, arrays, imports, exports, and function parameter lists.
5. **Arrow Functions**: Consistently prefer arrow functions for controller methods, handlers, and anonymous callbacks.
6. **Strict TypeScript**:
   - `strict: true` is enabled in `tsconfig.json`.
   - Avoid `any`. Prefer explicit types, interfaces, or `unknown` when input is unvalidated.
   - Accurately type Express requests and responses (`Request<Params, ResBody, ReqBody, ReqQuery>`).
   - Retain decorator support (`experimentalDecorators` and `emitDecoratorMetadata` enabled for `class-validator` and `class-transformer`).

---

## 6. Testing & Coverage Guidelines

- **Coverage Target**: Maintain high test coverage (>95% lines, statements, functions, and branches).
- **Unit Tests**:
  - Located side-by-side with source files (e.g., `src/controllers/users.controller.test.ts`).
  - Unit tests must mock external libraries, databases, and encryption utilities (`vi.mock('@node-rs/argon2')`, mocked Mongoose models).
- **End-to-End (E2E) Tests**:
  - Located in `tests/e2e/`.
  - Must test full HTTP request-response lifecycles against real in-memory MongoDB storage.
  - Cover both success scenarios (HTTP `200`, `201`, `204`) and standard error conditions:
    - `400 Bad Request`: Validation failure from `validator` middleware or unsafe search query.
    - `401 Unauthorized`: Missing token, invalid token, incorrect password, wrong verification key, or forbidden owner access (`onlyTheOwner`).
    - `404 Not Found`: Querying non-existent entity IDs.
    - `409 Conflict`: Unique index violation (duplicate username or email).

---

## 7. Mandatory AI Agent Guidelines

Whenever an AI agent modifies or adds code in this repository, it must adhere to the following workflow:

1. **Preserve Code & Documentation Integrity**:
   - Do not remove or alter existing comments, docstrings, or type definitions unless directly required by the task.
   - Maintain naming conventions (`kebab-case` for DTOs and middlewares, `*.controller.ts` for controllers, `*.test.ts` for unit tests).
2. **Mandatory Verification Routine**:
   Before marking any task as complete, you must run and ensure zero errors on:
   ```bash
   npm run build:check
   npm run lint
   npm test
   ```
   If lint issues can be fixed automatically, run `npm run lint:fix` and rerun the checks.
3. **Feature Addition Protocol**:
   - Define DTOs in `src/dto/` with `class-validator` rules and `!` assertions.
   - Update Mongoose models/schemas in `src/entities/` if schema changes are involved.
   - Implement business logic in `src/controllers/` using constructor dependency injection.
   - Bind routes and middlewares in `src/router.ts`.
   - Add comprehensive unit tests and e2e tests covering both happy and error paths.
4. **API Documentation Maintenance Protocol**:
   - Sempre que houver adição, alteração ou exclusão de rotas, a especificação Swagger/OpenAPI deve ser obrigatoriamente atualizada.

