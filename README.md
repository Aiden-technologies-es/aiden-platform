# Aiden Platform

Dashboard SaaS para gestión de dominios, correo, hosting y servicios digitales.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk
- **Base de datos**: Supabase (PostgreSQL)
- **Pagos**: Stripe
- **Email transaccional**: Resend
- **Dominios API**: Name.com
- **Email/Webmail**: Titan Email
- **Deploy**: Vercel

## Setup

### 1. Clonar y instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena todos los valores:

```bash
cp .env.local.example .env.local
```

Necesitarás cuentas en:
- [Clerk](https://clerk.com) — Auth
- [Supabase](https://supabase.com) — Base de datos
- [Stripe](https://stripe.com) — Pagos
- [Name.com](https://www.name.com/reseller) — API de dominios (cuenta reseller)
- [Titan Email](https://titan.email/agency) — Email con webmail

### 3. Base de datos Supabase

En el panel de Supabase → SQL Editor, ejecuta:

```sql
-- Contenido de supabase/schema.sql
```

### 4. Webhooks

**Clerk webhook** → `https://tudominio.com/api/webhooks/clerk`  
Eventos: `user.created`, `user.updated`

**Stripe webhook** → `https://tudominio.com/api/stripe/webhook`  
Eventos: `customer.subscription.created`, `customer.subscription.updated`, `customer.created`

### 5. Deploy en Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

O conecta el repositorio directamente desde vercel.com.

## Estructura

```
src/
├── app/
│   ├── (auth)/          → Login, registro (Clerk)
│   ├── (dashboard)/     → Panel principal
│   │   ├── dashboard/   → Home con stats y tracking
│   │   ├── dominios/    → Gestión y compra de dominios
│   │   ├── correo/      → Buzones y webmail
│   │   ├── hosting/     → Hosting y webs (próximamente)
│   │   ├── suscripcion/ → Plan, tarjetas, facturas (Stripe)
│   │   └── soporte/     → Tickets de soporte
│   └── api/
│       ├── domains/     → Name.com API
│       ├── stripe/      → Subscription, portal, webhook
│       ├── tickets/     → CRUD de tickets
│       └── webhooks/    → Clerk, Stripe
├── components/
│   ├── ui/              → Design system (Button, Card, Badge...)
│   └── dashboard/       → Sidebar, MobileHeader
├── lib/
│   ├── supabase.ts      → Cliente Supabase
│   ├── stripe.ts        → Cliente Stripe
│   ├── namecom.ts       → API Name.com
│   ├── titan.ts         → API Titan Email
│   └── utils.ts         → Utilidades y helpers
└── types/
    └── database.ts      → Tipos TypeScript de Supabase
```

## Módulos

### Dominios
- Búsqueda de disponibilidad vía Name.com API
- Compra y registro automatizado
- Panel de gestión (DNS, renovación, nameservers)

### Correo
- Creación de buzones via Titan Email API
- SSO directo al webmail con un clic
- Gestión de cuentas y cuotas

### Suscripción
- Datos en tiempo real desde Stripe
- Portal de cliente para gestionar plan, tarjetas y cancelación
- Historial de facturas con descarga PDF

### Soporte
- Sistema de tickets con estados y tracking visual
- Integración con Lunnar AI (próximamente)
