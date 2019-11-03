# UBox

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

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

> POST /users

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
  "success": "User created"
}
```

---

### Auth user

> POST /auth

**Body:**
```json
{
	"username": "gabrielrufino",
	"password": "p@$sw0rd"
}
```

**Response:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIiwic3ViIjoiNWRiZWU4MjZjZjczNTEzNTljNDFjMTIwIiwiaWF0IjoxNTcyNzk0MzM0LCJleHAiOjE1NzI3OTc5MzR9.qsIERF-02_HikpvLNQTsTestfXMfL_z0pytSjK6wyoc"
}
```

---

### List users

> GET /users

**Header:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIiwic3ViIjoiNWRiZWU4MjZjZjczNTEzNTljNDFjMTIwIiwiaWF0IjoxNTcyNzk0MzM0LCJleHAiOjE1NzI3OTc5MzR9.qsIERF-02_HikpvLNQTsTestfXMfL_z0pytSjK6wyoc"
}
```

**Response:**
```json
[
  {
    "verified": false,
    "_id": "5dbee826cf7351359c41c120",
    "name": "Gabriel Rufino",
    "email": "contato@gabrielrufino.com",
    "username": "gabrielrufino",
    "__v": 0
  }
]
```

## LICENSE

The MIT License (MIT)
