import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '../../config/logger'
import { HttpNotificationSender } from './http-notification-sender'

describe(HttpNotificationSender.name, () => {
  const baseUrl = 'http://localhost:3001'

  beforeEach(() => {
    vi.spyOn(logger, 'error').mockImplementation(() => logger)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should successfully post email to notifications-service', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    })
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl })

    await sender.sendEmail({
      to: 'john@example.com',
      subject: 'Welcome',
      content: 'Hello World',
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'no-reply@servicespack.com',
        to: 'john@example.com',
        subject: 'Welcome',
        content: 'Hello World',
      }),
    })
  })

  it('should use input from when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    })
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl, defaultFrom: 'default@example.com' })

    await sender.sendEmail({
      from: 'custom@example.com',
      to: 'john@example.com',
      subject: 'Custom',
      content: 'Hello',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          from: 'custom@example.com',
          to: 'john@example.com',
          subject: 'Custom',
          content: 'Hello',
        }),
      }),
    )
  })

  it('should throw error when suppressErrors is false and response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Error',
    })
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl, suppressErrors: false })

    await expect(
      sender.sendEmail({
        to: 'john@example.com',
        subject: 'Fail',
        content: 'Fail',
      }),
    ).rejects.toThrow('Failed to send email notification: Internal Error')

    expect(logger.error).toHaveBeenCalled()
  })

  it('should suppress error when suppressErrors is true and response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Error',
    })
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl, suppressErrors: true })

    await expect(
      sender.sendEmail({
        to: 'john@example.com',
        subject: 'Fail',
        content: 'Fail',
      }),
    ).resolves.toBeUndefined()

    expect(logger.error).toHaveBeenCalled()
  })

  it('should throw error when suppressErrors is false and network error occurs', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl, suppressErrors: false })

    await expect(
      sender.sendEmail({
        to: 'john@example.com',
        subject: 'Fail',
        content: 'Fail',
      }),
    ).rejects.toThrow('Network error')

    expect(logger.error).toHaveBeenCalled()
  })

  it('should suppress error when suppressErrors is true and network error occurs', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', fetchMock)

    const sender = new HttpNotificationSender({ baseUrl, suppressErrors: true })

    await expect(
      sender.sendEmail({
        to: 'john@example.com',
        subject: 'Fail',
        content: 'Fail',
      }),
    ).resolves.toBeUndefined()

    expect(logger.error).toHaveBeenCalled()
  })
})
