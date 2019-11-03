# UBox

A simple and intuitive users API

## Install

```
$ git clone https://github.com/gabrielrufino/UBox/
$ cd UBox
$ npm install
```

## Setup your database

You must create a <code>.env</code> file in your root directory to set up an important environment variables: <strong>DATABASE</strong>.

Some like that:
```env
# UBox/.env

PORT=3000
SECRET=d41d8cd98f00b204e9800998ecf8427e

DB_USER=
DB_PASS=
DB_HOST=localhost
DB_PORT=27017
DB_NAME=db_ubox
```

<em>You can define others environment variables. <a href="#env-variables">See below</a>!</em>

## UBox Ready!

Now, you can start the UBox!

```
npm run dev
```

Access http://localhost:3000! UBox is ready.

## User description

In the UBox API, the user can have the following fields:

- NAME *
- EMAIL *
- USERNAME *
- PASSWORD *

## .env variables

- PORT
- SECRET
- DB_USER
- DB_PASS
- DB_HOST
- DB_PORT
- DB_NAME

## API Docs

### Create user

**Method:** POST
**Body:**
```json
{
  "name": "Gabriel Rufino",
  "email": "contato@gabrielrufino.com",
  "username": "gabrielrufino",
  "password": "p@$sw0rd"
}
```

**Response:**
```json
{
  "verified": false,
  "created_at": "2019-11-03T14:45:51.000Z",
  "updated_at": "2019-11-03T14:45:51.000Z",
  "_id": "5dbee826cf7351359c41c120",
  "name": "Gabriel Rufino",
  "email": "contato@gabrielrufino.com",
  "username": "gabrielrufino",
  "password": "$2a$10$vFeXY6emPm.zJJTHvpe5uOdxmUtWjnqCoRViwOeeb.8HLVlDM6fV6",
  "__v": 0
}
```

## LICENSE

The MIT License (MIT)
