# UBox

A simple and intuitive users API

## Install

<pre>
git clone https://github.com/gabrielrufino/UBox/
cd UBox
npm install
</pre>

## Setup your database

You must create a <pre>.env</pre> file in your root directory to set up an important environment variables: <strong>DATABASE</strong>.

Some like that:
<pre>
# UBox/.env
DATABASE=mongodb://localhost/ubox
</pre>

<small>You can define others environment variables. See below!</small>

## UBox Ready!

Now, you can start the UBox!

<pre>
npm start
</pre>

Access http://localhost:3000! UBox is ready.

## User description

In the UBox API, the user can have the following fields:
<ul>
  <li>NAME *</li>
  <li>BIRTHDAY *</li>
  <li>EMAIL *</li>
  <li>USERNAME *</li>
  <li>PASSWORD *</li>
</ul>

## .env variables

<ul>
  <li>DATABASE *</li>
  <li>PORT</li>
<ul>

## LICENSE

The MIT License (MIT)