# External Services & Required Credentials

List of external services and credentials the project will need to operate in development and production.

- MongoDB Atlas connection string: `MONGODB_URI`
- Redis URL (managed or self-hosted): `REDIS_URL`
- SMTP credentials (for Nodemailer): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- WhatsApp Cloud API: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`
- Telegram Bot API: `TELEGRAM_BOT_TOKEN`
- LLM provider API key (OpenAI/Azure/etc): `LLM_API_KEY`
- Domain and TLS: DNS access and TLS cert method (Let’s Encrypt or managed)
- Payment provider (Stripe) keys for subscriptions: `STRIPE_SECRET`
- Docker registry credentials for deployments (if used)
- Sentry DSN or alternative error tracking key

Local/test mocks can be used initially; production requires real credentials.

Sample `.env` variables (see `.env.example` in project root):

```
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
TELEGRAM_BOT_TOKEN=
LLM_API_KEY=
STRIPE_SECRET=
```

Security note: store secrets in a secrets manager (e.g., AWS Secrets Manager, Google Secret Manager, or Vault) for production.
