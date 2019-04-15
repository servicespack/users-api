const nodemailer = require('nodemailer')

const MAILER_HOST   = process.env.MAILER_HOST
const MAILER_PORT   = process.env.MAILER_PORT
const MAILER_SECURE = process.env.MAILER_SECURE === 'true' ? true : false
const MAILER_USER   = process.env.MAILER_USER
const MAILER_PASS   = process.env.MAILER_PASS

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

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: 'example@example.com',
    to: to,
    subject: subject,
    html: html
  })
}

module.exports = {
  sendMail
}
