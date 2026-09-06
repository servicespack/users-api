export interface SendEmailNotificationInput {
  readonly to: string
  readonly subject: string
  readonly content: string
  readonly from?: string
}

export interface INotificationSender {
  sendEmail: (input: SendEmailNotificationInput) => Promise<void>
}
