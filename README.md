# portfolio

Personal portfolio migrated to Next.js (App Router) with TailwindCSS v4 and preserved custom CSS/animations.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm run start
```

## Contact form email setup

The contact form chooses a delivery method automatically:

1. **Resend** — if `RESEND_API_KEY` is set (recommended on Vercel)
2. **SMTP** — if `SMTP_USERNAME` and `SMTP_PASSWORD` are set
3. **FormSubmit** — default fallback when neither is configured (no secrets required)

### Default (FormSubmit)

No environment variables are required in Vercel. The form posts to FormSubmit and emails `CONTACT_TO_EMAIL` (default: `olimasad@gmail.com`).

After deploy:

1. Submit the contact form once from the live site
2. Open the activation email in that inbox and confirm it
3. Later submissions will deliver normally

### Optional: Resend (recommended for Vercel)

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (default: `olimasad@gmail.com`)
- `CONTACT_FROM_EMAIL` (optional; defaults to Resend onboarding sender)

### Optional: SMTP

- `SMTP_HOST` (default: `smtp.gmail.com`)
- `SMTP_PORT` (default: `465`)
- `SMTP_USERNAME` (your Gmail address)
- `SMTP_PASSWORD` (your Gmail App Password, not your normal password)
- `CONTACT_TO_EMAIL` (default: `olimasad@gmail.com`)
- `CONTACT_FROM_EMAIL` (optional, defaults to `SMTP_USERNAME`)
