import type { INotificationSender, SendEmailNotificationInput } from '../../application/ports/notification-sender.port'
import { logger } from '../../config/logger'

export interface HttpNotificationSenderOptions {
  baseUrl: string
  defaultFrom?: string
  suppressErrors?: boolean
}

export class HttpNotificationSender implements INotificationSender {
  constructor(
    private readonly options: HttpNotificationSenderOptions,
  ) {}

  async sendEmail(input: SendEmailNotificationInput): Promise<void> {
    const from = input.from || this.options.defaultFrom || 'no-reply@servicespack.com'
    const url = `${this.options.baseUrl.replace(/\/$/, '')}/api/emails`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: input.to,
          subject: input.subject,
          content: input.content,
        }),
      })

      if (!response.ok) {
        logger.error({ status: response.status, statusText: response.statusText }, 'Notifications API responded with error')
        if (this.options.suppressErrors === false) {
          throw new Error(`Failed to send email notification: ${response.statusText}`)
        }
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to communicate with notifications-api')
      if (this.options.suppressErrors === false) {
        throw error
      }
    }
  }
}
