# paiio - Municipal Workflow Platform

## Product Overview
Building a SaaS platform for municipal government workflows, starting with PR/communications as the initial module. Future modules planned: Permits, Public Records, Council Meetings, 311/Complaints.

## Product Name & Branding
- Name: paiio
- Tagline:Your AI-powered PIO assistant.
- Primary Color: #1e2e5c (Custom paiio Blue)
- Target: Cities with 50,000-250,000 residents
- Current focus: Communications teams (1-3 person PR departments)
- Vision: Become the operating system for small city governments

## Design System
- Primary: paiio Blue (#1e2e5c) - Headers, primary buttons
- Secondary: Sky Blue (#0ea5e9) - Links, secondary CTAs  
- Success: Emerald (#10b981) - Approved states, success messages
- Warning: Amber (#f59e0b) - Pending states, warnings
- Danger: Red (#ef4444) - Errors, urgent items
- Background: Light Gray (#f8fafc)

UI components use Tailwind CSS v3.4.0 with custom color classes defined in tailwind.config.ts

## Tech Stack
- Next.js 14 with App Router (TypeScript)
- Tailwind CSS 3.4.0 for styling
- Supabase for database, auth, and storage
- React Hook Form + Zod for form validation
- OpenAI API for AI content generation
- Vercel for deployment
- Git/GitHub for version control

## File Structure
```
pr-ops-saas/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth layout group
│   │   ├── layout.tsx     # Auth pages wrapper
│   │   ├── signup/        # Signup page
│   │   └── login/         # Login page (pending)
│   ├── actions/           # Server actions
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # Reusable React components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities and configs
│   │   └── supabase/     # Supabase clients
│   └── types/            # TypeScript definitions
├── tailwind.config.ts     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

Note: Imports use @/src/ prefix (e.g., @/src/lib/supabase/client)

## Database Schema
All tables have Row Level Security (RLS) enabled for data isolation.

### Core Tables
- **organizations** - Multi-tenant organizations with subscription tracking
- **profiles** - Users with roles (admin, reviewer, legal, submitter)
- **comms_requests** - Communication/announcement requests from departments
- **artifacts** - Generated press releases and social posts
- **attachments** - Files uploaded with requests
- **reviews** - Approval workflow with comments
- **workflow_events** - Status change tracking for audit trail
- **publications** - Tracking where content was published
- **templates** - Reusable content templates
- **brand_memory** - RAG vector storage for AI context
- **audit_logs** - Immutable audit trail for SOC 2 compliance

### Enums
- user_role: 'admin' | 'reviewer' | 'legal' | 'submitter'
- request_type: 'road_closure' | 'event' | 'emergency' | 'policy' | 'meeting' | 'general'
- request_status: 'draft' | 'in_review' | 'legal_review' | 'approved' | 'scheduled' | 'published'
- request_priority: 'low' | 'medium' | 'high' | 'urgent'

## Authentication Flow
- Sign-up creates: auth user → profile record → organization record → audit log entry
- Email verification required for new accounts
- Password requirements: 12+ characters, 1 uppercase, 1 lowercase, 1 number (SOC 2 compliance)
- Session timeout: 30 minutes of inactivity
- Government email validation preferred (.gov, .state, .city domains)
- All auth events logged to audit_logs table with IP address

## SOC 2 Compliance Requirements
Built-in from the start:
- Comprehensive audit logging on all data operations (audit_logs table)
- Row Level Security (RLS) on all tables for data isolation
- Session timeout after 30 minutes of inactivity  
- Password complexity requirements (12+ chars with mixed case and numbers)
- Immutable audit trail for all user actions
- Soft deletes with data retention policies (pending implementation)
- Environment-based configuration (no hardcoded secrets)
- Input validation and sanitization on all forms
- Failed login attempt tracking (pending implementation)
- Account lockout after 5 failed attempts (pending implementation)

## Current Implementation Status
### ✅ Completed
- Project setup with Next.js, TypeScript, Tailwind CSS
- Database schema with all tables and RLS policies
- Supabase authentication configuration
- paiio branding and color system
- Auth layout with signup form UI
- Basic file structure

### 🚧 In Progress
- Signup form functionality with validation
- Server actions for authentication
- Email verification flow

### 📋 Next Up
- Login page
- Dashboard after authentication
- Communications request form
- AI integration for content generation

## Common Patterns
- Server Components by default, Client Components only when state/interactivity needed
- Server Actions for form submissions and data mutations
- Supabase Row Level Security for all data access
- Toast notifications for user feedback (pending implementation)
- Loading states for all async operations
- Error boundaries for graceful error handling (pending implementation)
- Audit log entry for every data modification

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key (pending)
NEXT_PUBLIC_APP_NAME=paiio
NEXT_PUBLIC_APP_TAGLINE=Your AI-powered PIO assistant.
NEXT_PUBLIC_PRIMARY_COLOR=#1e2e5c
```

## Development Workflow
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- Commit to Git regularly with descriptive messages
- Deploy to Vercel on push to main branch

## Known Issues & Notes
- Using Tailwind CSS v3.4.0 (not v4) for stability
- TypeScript strict mode enabled
- All datetime fields use TIMESTAMPTZ for timezone consistency
- Vector extension enabled in Supabase for future AI features