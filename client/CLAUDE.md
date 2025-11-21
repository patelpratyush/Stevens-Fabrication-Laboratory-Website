# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for the Stevens Visual Art & Technology Fabrication Laboratory. The site serves as a platform for students and staff to manage fabrication services, equipment checkouts, and orders.

**Tech Stack:**
- Next.js 16.0.3 (App Router)
- React 19.2.0
- Tailwind CSS v4 with PostCSS
- ESLint for code quality

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Architecture

### Application Structure

The application uses Next.js App Router with a clear separation between public, student, and staff areas:

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.jsx          # Root layout with Navigation header
│   ├── page.jsx            # Public homepage
│   ├── login/              # Login page (public)
│   ├── fabrication/        # Services catalog (public)
│   ├── order/              # Student order placement
│   ├── dashboard/          # Student dashboard
│   └── staff/              # Staff-only pages
│       ├── dashboard/      # Staff order/checkout management
│       └── catalog/        # Staff catalog management
└── components/             # Shared React components
    └── Navigation.jsx      # Main navigation header
```

### User Roles & Routes

**Public Routes:**
- `/` - Homepage with hero section and service overview
- `/fabrication` - Public services catalog
- `/login` - Authentication page

**Student Routes:**
- `/dashboard` - Student dashboard (orders, checkouts, account summary)
- `/order` - Order creation and price calculator

**Staff Routes:**
- `/staff/dashboard` - Staff dashboard (incoming orders, active checkouts, activity stats)
- `/staff/catalog` - Manage services, materials, and equipment

**Authentication Flow:**
According to `src/app/login/page.jsx:59-64`, the planned authentication logic will:
- Use Firebase for authentication
- Check user role from Firestore or custom claims
- Redirect staff users to `/staff/dashboard`
- Redirect student users to `/dashboard`

### Styling & Branding

**Stevens Brand Colors** are defined in `src/app/globals.css`:
- `stevens-maroon`: `#9d1535` (primary brand color)
- `stevens-maroon-dark`: `#7d1029`
- `stevens-maroon-light`: `#c41d45`
- `stevens-gray`: `#949594`

These colors are available as Tailwind utility classes:
- `text-stevens-maroon`, `bg-stevens-maroon`, `border-stevens-maroon`
- `hover:bg-stevens-maroon-dark`, `hover:text-stevens-maroon`

Custom card and button styles are also defined in globals.css with `.card`, `.card-feature`, and `.btn-primary` classes.

### Component Patterns

**Client Components:**
Components requiring interactivity (useState, event handlers) must use the `'use client'` directive:
- `src/components/Navigation.jsx` - Uses useState for mobile menu toggle

**Server Components (default):**
All page components are currently server components by default unless they need client-side interactivity.

## Current State & TODO Items

This is an early-stage project. Most features display placeholder content with "Coming Soon" or "No data" messages. Key areas marked for future implementation:

1. **Authentication (src/app/login/page.jsx:59-64):**
   - Firebase auth integration needed
   - Role-based routing logic
   - Session management

2. **Order System (src/app/order/page.jsx):**
   - Price calculator implementation
   - File upload functionality
   - Material/option selection
   - Cart and checkout flow

3. **Services Content (src/app/fabrication/page.jsx):**
   - Service descriptions and policies
   - Pricing details
   - Available materials/papers
   - Email request functionality

4. **Dashboard Functionality:**
   - Real-time order tracking
   - Equipment checkout management
   - Account statistics
   - Activity logging

5. **Staff Tools (src/app/staff/):**
   - Order queue management
   - Catalog CRUD operations
   - Inventory management
   - Checkout tracking

## Code Style Guidelines

- Use `.jsx` extension for components (not `.tsx` - project is not using TypeScript)
- Follow existing naming conventions: PascalCase for components, camelCase for variables
- Maintain responsive design patterns (mobile-first with Tailwind)
- Use Stevens brand colors consistently
- Prefer semantic HTML and accessible markup
- Use Next.js Link component for internal navigation
