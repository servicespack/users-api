<p align="center">
  <img src="./public/logo.png" width="200"/>
</p>

# Users API

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)
![CI](https://github.com/gabrielrufino/users-api/workflows/ci/badge.svg)

Users microservice ready and flexible for your system

## Getting started

### Setup

```bash
git clone https://github.com/gabrielrufino/users-api/
cd users-api
cp .env.example .env
npm install
```

### Database

Fill correctly the environment variables in .env!

**example:**

```env
# users-api/.env

DB_CONNECTION=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_USER=root
DB_PASS=root
DB_NAME=db_users_api
```

### Users API Ready!

Now, you can start the Users API!

```bash
npm run dev
```

Access http://localhost:3000! Users API is ready.

## LICENSE

The MIT License (MIT)
