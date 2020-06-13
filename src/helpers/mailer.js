'use strict'

const mailer = {}
const { MAILER_CONNECTION } = process.env

if (MAILER_CONNECTION === 'server') {
  const nodemailer = require('nodemailer')

  const {
    MAILER_HOST,
    MAILER_PORT,
    MAILER_SECURE,
    MAILER_USER,
    MAILER_PASS
  } = process.env

  const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: MAILER_SECURE,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASS
    }
  })

  mailer.sendMail = (to, subject, html) => {
    transporter.sendMail({
      from: 'example@example.com',
      to: to,
      subject: subject,
      html: html
    })
      .catch(console.log)
  }
} else if (MAILER_CONNECTION === 'sendgrid') {
  const sgMail = require('@sendgrid/mail')

  const { MAILER_SENDGRID_API_KEY, MAILER_SENDGRID_SENDER } = process.env

  sgMail.setApiKey(MAILER_SENDGRID_API_KEY)

  mailer.sendMail = (to, subject, html) => {
    const mail = {
      from: MAILER_SENDGRID_SENDER,
      to,
      subject,
      html
    }

    sgMail.send(mail)
      .catch(console.log)
  }
}

module.exports = mailer
