# Mail Sending Setup

Expensave sends email through the backend Symfony Mailer integration. Email is currently required for password reset links.

## Required Environment Variables

Configure these variables for the backend runtime:

| Variable       | Required | Description                                                                                                |
|----------------|----------|------------------------------------------------------------------------------------------------------------|
| `MAILER_DSN`   | Yes      | Symfony Mailer DSN for the SMTP server or provider transport.                                              |
| `MAILER_FROM`  | Yes      | Sender address used for Expensave emails.                                                                  |
| `FRONTEND_URL` | Yes      | Public URL of the frontend. Password reset links are built as `FRONTEND_URL/auth/reset-password?hash=...`. |

Example:

```bash
MAILER_DSN=smtp://user:password@smtp.example.com:587
MAILER_FROM="Expensave <no-reply@example.com>"
FRONTEND_URL=https://expensave.example.com
```

Do not commit real mailbox passwords or provider tokens. Put production values in your deployment environment, Docker secrets, or another secret manager.

## Generic SMTP

Use this format for most SMTP providers:

```bash
MAILER_DSN=smtp://USERNAME:PASSWORD@SMTP_HOST:587
MAILER_FROM="Expensave <sender@example.com>"
FRONTEND_URL=https://expensave.example.com
```

For implicit TLS on port `465`, use `smtps`:

```bash
MAILER_DSN=smtps://USERNAME:PASSWORD@SMTP_HOST:465
```

If the username or password contains special characters such as `@`, `:`, `/`, `?`, `#`, `%`, or spaces, URL-encode it before putting it in the DSN.

## Gmail Mailbox Setup

Gmail is convenient for a personal self-hosted instance or testing. For a public, shared, or high-volume deployment, a transactional email provider is usually a better operational choice.

### 1. Prepare The Gmail Account

1. Create or choose the Gmail mailbox that should send Expensave mail.
2. Enable 2-Step Verification on that Google Account.
3. Create an app password for Expensave in the Google Account security settings.
4. Save the app password somewhere safe while configuring the server. Google shows it only once.

Google documents app passwords here: [Sign in with app passwords](https://support.google.com/accounts/answer/185833).

### 2. Configure Expensave

Expensave includes Symfony's Google Mailer bridge, so the recommended Gmail DSN is:

```bash
MAILER_DSN=gmail+smtp://your.address%40gmail.com:YOUR_APP_PASSWORD@default
MAILER_FROM="Expensave <your.address@gmail.com>"
FRONTEND_URL=https://expensave.example.com
```

Notes:

- URL-encode the email address in the DSN. For example, `your.address@gmail.com` becomes `your.address%40gmail.com`.
- Use the app password, not your normal Google Account password.
- If Google displays the app password with spaces, remove the spaces or URL-encode them as `%20`.
- `MAILER_FROM` should usually match the Gmail mailbox to avoid sender validation and deliverability problems.

### 3. Alternative Gmail SMTP DSN

If you do not want to use the Symfony Google transport shortcut, configure Gmail as normal SMTP:

```bash
MAILER_DSN=smtps://your.address%40gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465
MAILER_FROM="Expensave <your.address@gmail.com>"
FRONTEND_URL=https://expensave.example.com
```

Google's SMTP server settings are documented in Google's Gmail and Google Workspace help pages:

- [Check Gmail through other email platforms](https://support.google.com/mail/answer/7126229)
- [Send email from a printer, scanner, or app](https://support.google.com/a/answer/176600)

## Docker Compose Example

Add the variables to the backend service environment in your deployment compose file or `.env` used by Docker Compose:

```yaml
services:
  app:
    environment:
      MAILER_DSN: "gmail+smtp://your.address%40gmail.com:YOUR_APP_PASSWORD@default"
      MAILER_FROM: "Expensave <your.address@gmail.com>"
      FRONTEND_URL: "https://expensave.example.com"
```

Restart the application after changing environment variables.

## How To Test

1. Open the Expensave login page.
2. Click the forgot-password link.
3. Submit an email address that belongs to an existing Expensave user.
4. Confirm that the mailbox receives a reset link.
5. Open the link, reset the password, and confirm that the frontend redirects to login.

If no email arrives, check the backend logs first. Mail provider authentication errors, blocked SMTP access, invalid DSN encoding, or a wrong `FRONTEND_URL` are the most common setup issues.
