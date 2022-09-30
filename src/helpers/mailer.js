import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

const mailer = {}
const { MAILER_CONNECTION } = process.env

if (MAILER_CONNECTION === 'server') {
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
      to,
      subject,
      html
    })
      .catch(() => {})
  }
} else if (MAILER_CONNECTION === 'sendgrid') {
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
      .catch(() => {})
  }
}

export default mailer
