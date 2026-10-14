# Samrudh S. Sagar — Graphic Designer Portfolio & Admin CMS

A high-performance, full-stack portfolio website and content management system for graphic designer **Samrudh S. Sagar**, built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM, and secure admin authentication.

---

## 1. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Tailwind v4 with curated design tokens)
- **Database & ORM**: PostgreSQL (Neon / Supabase) with [Prisma ORM](https://www.prisma.io/); SQLite for local development
- **Media & Uploads**: Cloudinary (server-signed direct uploads with local dev disk fallback)
- **Email Service**: [Resend](https://resend.com/) with Nodemailer fallback
- **Authentication**: Single-admin credential check against environment variables, bcrypt password verification, signed JWT in an `httpOnly`, `secure`, `sameSite=lax` cookie (7-day expiration)
- **Validation**: [Zod](https://zod.dev/) on client and server
- **Deployment**: Vercel ready

---

## 2. Design System & Aesthetics

Strict adherence to flat, modern design without gradients or drop shadows:

### Palette
- **Teal (`#00A19C`)**: Decorative only (circle behind cutout portrait, short rules, skill bars, quote mark, admin primary buttons)
- **Burgundy (`#80142B`)**: Role label, links, contact icons, CTA border, destructive admin actions
- **Grey (`#C6C6C6`)**: Contact footer background
- **Black (`#111111`)**: Primary text and third project fallback tile
- **Neutrals**:
  - Hero Background: `#F7F7F7`
  - Selected Work Background: `#ECECEC`
  - Hairlines / Dividers: `#BDBDBD`
  - Bar Track: `#D4D4D4`
  - Muted Text: `#4A4A4A`

### Typography
- **Headings**: `Montserrat` (800 for name, 700 for section titles, 600-700 for labels and stat counters)
- **Body**: `Open Sans` (400/500/600 for tagline, descriptions, experience rows, contact values)
- **Name**: Uppercase, extra-bold, ~130px on desktop scaling via `clamp(2.75rem, 7.5vw, 7.8rem)`, line-height ~0.96

---

## 3. Getting Started Locally

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "mama portfolioi"
npm install
```

### 2. Environment Variables Setup
Copy the example environment file to `.env`:
```bash
cp .env.example .env
```

Default local development `.env`:
```env
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Admin Authentication
ADMIN_EMAIL="admin@samrudh.design"
ADMIN_PASSWORD_HASH="$2b$10$.8TexzmrZPPho7ubhEO4QeSUw4H.SI/aIk1neoOoaOZQ/HDznfyLm"
JWT_SECRET="samrudh-portfolio-jwt-secret-key-32-bytes-secure"

# Image Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email Notifications (Resend)
RESEND_API_KEY=""
CONTACT_TO_EMAIL="sagarsamrudh82@gmail.com"
CONTACT_FROM_EMAIL="onboarding@resend.dev"
```

> **Note**: The default local `.env` comes pre-configured with the credentials:
> - **Email**: `admin@samrudh.design`
> - **Password**: `admin12345`

### 3. Database Migration & Seed
Run Prisma migrations to create the local SQLite database, and execute the seed script to populate sample projects:
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. How to Generate a Bcrypt Password Hash

To set a custom password for the admin account:

Run this one-line command in your terminal:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10));"
```

Example output:
```
$2b$10$7sN00x07D5zUjJ5y4l33oex8sZ21qYwY8CjL7G2P1iUjZt2h5aF6i
```
Paste this string into your `.env` (or Vercel environment variables) for `ADMIN_PASSWORD_HASH`.

---

## 5. Email Service & Resend Domain Verification

The contact form sends automated notifications to `CONTACT_TO_EMAIL` (`sagarsamrudh82@gmail.com`) via Resend:

1. Create a free account at [Resend.com](https://resend.com).
2. Generate an API key under **API Keys** and set `RESEND_API_KEY="re_..."`.
3. Add your custom domain under **Domains** in Resend (e.g. `samrudh.design`).
4. Add the provided `MX`, `TXT` (SPF), and `DKIM` records to your DNS provider.
5. Once verified, update `CONTACT_FROM_EMAIL="Samrudh Portfolio <contact@samrudh.design>"`.
6. *(Development note)*: If no API key is provided, contact messages are safely saved to the database and logged to the server console without throwing errors.

---

## 6. Cloudinary Server-Signed Image Uploads

For production media hosting:
1. Sign up for a free account at [Cloudinary.com](https://cloudinary.com).
2. In your Cloudinary Dashboard, obtain your **Cloud Name**, **API Key**, and **API Secret**.
3. Set the environment variables:
   ```env
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
4. The `/api/admin/upload` endpoint generates a secure SHA-1 signature on the server and uploads files directly to Cloudinary. In local development without Cloudinary credentials, files are seamlessly saved to `/public/uploads`.

---

## 7. Admin Dashboard Walkthrough

Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin):

- **Login (`/admin/login`)**:
  - Protected with rate limiting (5 attempts per 15 minutes per IP).
  - Issues signed JWT stored in an `httpOnly`, `sameSite=lax` cookie with 7-day expiration.
- **Projects Management (`/admin/projects`)**:
  - View all projects in a table with thumbnail previews, categories, and published status.
  - Reorder items using **Up/Down** buttons; changes persist immediately.
  - Toggle published state with a single click.
  - Edit project details and delete with confirmation dialog.
- **New / Edit Project (`/admin/projects/new`, `/admin/projects/[id]`)**:
  - Title, Category, Short Description, and Project Link.
  - Cover image upload with live thumbnail preview.
  - Automatic `revalidatePath("/")` on save so the public homepage updates instantly.
- **Messages Inbox (`/admin/messages`)**:
  - View contact form inquiries with sender name, email, submission timestamp, and message.
  - Badge indicator showing unread message count in both the page header and navbar.
  - One-click "Mark Read" / "Mark Unread" toggle and delete button.

---

## 8. Deploying to Vercel with PostgreSQL

### 1. Database Setup (Neon / Supabase)
1. Create a free project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled connection string:
   ```
   postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. In `prisma/schema.prisma`, update the datasource provider for PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations against your PostgreSQL instance:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

### 2. Deploy to Vercel
1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`
4. The `package.json` build command is already configured as:
   ```json
   "build": "prisma generate && next build"
   ```
5. Click **Deploy**. Vercel will build and launch the site globally with Edge caching and route handlers.

---

## 9. Security & SEO

- **Security Headers**: In `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
- **CSRF Protection**: Origin & Host headers are strictly verified on all admin mutation routes.
- **Rate Limiting**:
  - Login: 5 attempts per 15 minutes per IP.
  - Contact Form: 3 submissions per hour per IP.
- **Spam Protection**: Invisible honeypot field traps automated spam bots without interrupting legitimate users.
- **Semantic HTML & SEO**: Semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`), OpenGraph metadata, descriptive heading hierarchy (`h1`, `h2`, `h3`), visible keyboard focus rings (`:focus-visible`), and `prefers-reduced-motion` accessibility support.
# samrudh-s-sagar
