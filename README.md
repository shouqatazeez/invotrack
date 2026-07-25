# InvoTrack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=vercel)](https://myinvotrack.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

**A full-stack invoice management system for small businesses, freelancers, and service providers.**

I built InvoTrack because small businesses and freelancers often manage customers, invoices, payments, and tax calculations manually — in WhatsApp messages and Excel sheets. They forget who paid, who has pending payment, and what the monthly revenue is.

InvoTrack gives them one simple system: add customers, create invoices with automatic tax and discount calculations, track payment status, download branded PDF invoices, and see everything at a glance on a clean dashboard.

<p align="center">
  <img src="screenshots/dashboard.png" alt="InvoTrack Dashboard" width="100%" />
</p>

---

## Live Demo

**App:** [https://myinvotrack.vercel.app](https://myinvotrack.vercel.app/)

---

## The Problem

Every small business owner, tuition teacher, freelancer, and repair shop deals with:

- Forgetting who paid and who didn't
- Manually calculating tax, discounts, and totals
- No professional invoices to send customers
- No overview of monthly revenue vs pending payments
- Managing everything in WhatsApp groups or messy spreadsheets

InvoTrack solves all of this with a clean billing dashboard that takes 2 minutes to set up.

---

## How It Works

### 1. Add Your Products/Services
Define what you charge for — "Math Tuition ₹500", "Laptop Repair ₹2000", "Web Design ₹15000". Set it once, use it forever when creating invoices.

### 2. Add Your Customers
Store customer details — name, email, phone, address. Only the name is required. Add more details later.

### 3. Create an Invoice
Pick a customer, add line items (select products, set quantity), apply tax rate and discount. The app calculates subtotal, tax amount, and final total automatically.

### 4. Track & Download
Mark invoices as Paid, Unpaid, or Overdue. Download a branded PDF invoice to share with customers via WhatsApp or email. Dashboard shows revenue, pending, and overdue amounts at a glance.

---

## Features

### Dashboard with Revenue Analytics
- Total Revenue, Unpaid Amount, Overdue Amount at a glance
- Invoice Status Breakdown (progress bars showing paid/unpaid/overdue split)
- Revenue Summary (collected vs pending vs overdue)
- Recent Invoices table with clickable rows
- Quick action buttons (New Invoice, Add Customer, Add Product)

### Invoice Management
- Create invoices with multiple line items
- Auto-calculated subtotal, GST/tax, discount, and final total
- Sequential invoice numbers (INV-001, INV-002, INV-003...)
- Status management: mark as PAID, UNPAID, or OVERDUE
- Delete invoices with confirmation dialog

<p align="center">
  <img src="screenshots/invoices.png" alt="Invoices List" width="100%" />
</p>

### PDF Invoice Export
- Download branded PDF invoices with one click
- Blue themed header with InvoTrack branding
- Customer details, line items table, tax breakdown
- Professional layout ready to send to customers

<p align="center">
  <img src="screenshots/invoice-pdf.png" alt="Invoice PDF" width="100%" />
</p>

<p align="center">
  <img src="screenshots/invoice-detail.png" alt="Invoice Detail" width="100%" />
</p>

### Customer & Product CRUD
- Full create, read, update, delete for customers and products
- Table view with edit/delete actions
- Toast notifications for all operations
- Alert dialog confirmation before deleting

### AI Payment Reminders
- Generate AI-powered payment reminder messages using Google Gemini
- Two versions: WhatsApp (short) and Email (professional)
- One-click send via WhatsApp (opens WhatsApp Web with pre-filled message)
- One-click send via Email (Resend) with invoice PDF attached
- Only appears on unpaid/overdue invoices

<p align="center">
  <img src="screenshots/ai-reminder.png" alt="AI Payment Reminder" width="100%" />
</p>

### CSV Export & Search
- Export all invoices as CSV file for accounting/tax purposes
- Search invoices by customer name or invoice number
- Filter by status (All, Paid, Unpaid, Overdue)

### Authentication & Security
- User registration and login with email/password
- JWT-based sessions (30-day expiry)
- All data scoped to the logged-in user (multi-tenant)
- Users can never see each other's data
- Route protection via middleware

### UI/UX
- Responsive sidebar navigation
- Dark mode support (follows system theme)
- Shimmer skeleton loading states
- Toast notifications (success/error feedback)
- Styled confirmation dialogs for destructive actions
- Landing page with hero, features, and how-it-works sections

---

## Use Cases

**A tuition teacher with 20 students**
She adds each student as a customer, creates monthly invoices for "Math Tuition x 4 classes = ₹2000", downloads the PDF, and sends it on WhatsApp. When they pay via UPI, she marks it PAID. End of month — dashboard shows exactly how much she earned vs what's still pending.

**A freelance web developer**
He creates invoices for each project milestone — "Frontend Development ₹25000 + Backend API ₹15000 + Tax 18%". Downloads a professional PDF to email the client. Tracks which clients have overdue payments.

**A laptop repair shop**
Walk-in customer needs a repair. Owner creates a quick invoice: "Screen Replacement x 1 = ₹5000 + GST 18%". Prints or WhatsApps the PDF. Marks it paid when customer pays.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | Full-stack React with API routes, server components |
| Language | TypeScript 5 | Type safety, catches bugs at compile time |
| Database | PostgreSQL (NeonDB) | Cloud-native, serverless-compatible |
| ORM | Prisma 7 | Type-safe database queries, easy migrations |
| Auth | NextAuth 4 (JWT) | Session management, credential provider |
| UI | shadcn/ui + Radix UI | Accessible, customizable component library |
| Styling | Tailwind CSS 4 | Utility-first, fast iteration |
| PDF | jsPDF | Server-side PDF generation |
| AI | Google Gemini API | AI-powered reminder message generation |
| Email | Resend | Transactional email delivery with attachments |
| Icons | Lucide React | Consistent, lightweight icon set |
| Deployment | Vercel | Zero-config Next.js deployment |

---

## Database Schema

```
User (id, email, password, name)
  └── has many → Customer (id, name, email, phone, address, userId)
  └── has many → Product (id, name, description, price, userId)
  └── has many → Invoice (id, invoiceNumber, status, subtotal, taxRate, taxAmount, discount, total, userId, customerId)
                    └── has many → InvoiceItem (id, quantity, price, total, invoiceId, productId)
```

**Key design decisions:**
- Every entity has a `userId` foreign key — ensures complete data isolation between users
- Invoice status is an enum: PAID, UNPAID, OVERDUE
- Invoice items cascade delete when invoice is deleted
- Invoice number auto-generates as INV-001, INV-002 per user

---

## API Endpoints

All endpoints require authentication (JWT via middleware).

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/auth/[...nextauth]` | Login (NextAuth) |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers` | List all |
| POST | `/api/v1/customers` | Create |
| GET | `/api/v1/customers/:id` | Get one |
| PUT | `/api/v1/customers/:id` | Update |
| DELETE | `/api/v1/customers/:id` | Delete |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List all |
| POST | `/api/v1/products` | Create |
| GET | `/api/v1/products/:id` | Get one |
| PUT | `/api/v1/products/:id` | Update |
| DELETE | `/api/v1/products/:id` | Delete |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/invoices` | List all with items |
| POST | `/api/v1/invoices` | Create with line items |
| GET | `/api/v1/invoices/:id` | Get with full details |
| DELETE | `/api/v1/invoices/:id` | Delete |
| PUT | `/api/v1/invoices/:id/status` | Update payment status |
| GET | `/api/v1/invoices/:id/pdf` | Download PDF |
| POST | `/api/v1/invoices/:id/reminder` | AI reminder + send email |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/stats` | Revenue, counts, breakdowns |

---

## Project Structure

```
mini-invoice-app/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # SQL migration files
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout (fonts, providers)
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Sidebar layout
│   │   │   ├── dashboard/     # Dashboard with stats + charts
│   │   │   ├── customers/     # List, create, edit pages
│   │   │   ├── products/      # List, create, edit pages
│   │   │   └── invoices/      # List, create, detail pages
│   │   └── api/v1/
│   │       ├── auth/          # Registration endpoint
│   │       ├── customers/     # CRUD endpoints
│   │       ├── products/      # CRUD endpoints
│   │       ├── invoices/      # CRUD + status + PDF endpoints
│   │       └── dashboard/     # Stats endpoint
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   └── providers.tsx      # Session + Theme + Toast providers
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       ├── prisma.ts          # Prisma client singleton
│       ├── get-user-id.ts     # Session helper
│       └── utils.ts           # Utility functions
├── .env                       # Environment variables (not committed)
├── middleware.ts              # Route protection
└── package.json
```

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or use [Neon](https://neon.tech/) free tier)

### Installation

```bash
git clone https://github.com/shouqatazeez/mini-invoice-app.git
cd mini-invoice-app
npm install
```

Create `.env`:
```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
RESEND_API_KEY="your-resend-api-key"
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deployed on Vercel with zero configuration:

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`)
4. Deploy — Vercel auto-detects Next.js and builds

Database hosted on Neon (free tier, serverless PostgreSQL).

---

## Contact

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mdshouqatazeez@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shouqat-azeez-mohammad/)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=react&logoColor=61DAFB)](https://mohammadshouqatazeez.vercel.app/)

---

## License

MIT License
