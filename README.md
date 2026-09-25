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

The `/api/contact` route sends emails via SMTP.

Set these environment variables:

- `SMTP_HOST` (default: `smtp.gmail.com`)
- `SMTP_PORT` (default: `465`)
- `SMTP_USERNAME` (your Gmail address)
- `SMTP_PASSWORD` (your Gmail App Password, not your normal password)
- `CONTACT_TO_EMAIL` (default: `nebula@oliverms.com`)
- `CONTACT_FROM_EMAIL` (optional, defaults to `SMTP_USERNAME`)
