# Twacha Clinic Next.js

Dynamic Next.js rebuild of the old PHP Twacha Skin Clinic website.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3001`.

## Admin

Open `/admin`. The seed password is `twacha-admin`; for production set `ADMIN_PASSWORD` in `.env.local`.

The CMS reads and writes website content through MySQL when `DATABASE_URL` or `DB_NAME` is configured. It uses separate module tables in the `twachaclinic` database: `site_settings`, `pages`, `services`, `doctors`, `videos`, `testimonials`, and `appointments`. On first run it seeds these tables from the existing JSON content, then admin changes are saved back into the module tables. If MySQL is unavailable during local development, it falls back to `data/site-data.json` so the site can still run.

## Email setup

Create `.env.local` and add SMTP details:

```env
SMTP_HOST=smtp.example.com
DATABASE_URL=mysql://root:@localhost:3306/twachaclinic
DB_NAME=twachaclinic
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM=your-email@example.com
MAIL_TO=contact@twachaclinic.com
```

Appointment form posts to `/api/appointments`; contact form posts to `/api/contact`. Both use branded HTML email templates.

## Google Ads readiness notes

The new content avoids guaranteed-result claims, removes intrusive ad patterns, includes medical disclaimers, uses clear contact details, and keeps treatment pages educational and consultation-led.
