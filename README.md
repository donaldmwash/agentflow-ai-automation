# AgentFlow

AI-powered workflow automation platform with intelligent agents, visual workflows and task execution.

## Architecture

- **Next.js + TypeScript** for the application and authenticated API.
- **Supabase Auth + Postgres** for accounts and user-owned agent data.
- **Vercel AI SDK + AI Gateway** for model access through a provider-neutral interface.
- **AgentFlow workflow engine** for deterministic, validated workflow steps. It does not run arbitrary code or perform external side effects.
- **Vitest + GitHub Actions** for automated checks.
- **Vercel** for deployment.

AgentFlow should use its own Supabase project and schema. Keep it separate from other applications so data, authentication settings and row-level security policies cannot interfere.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the AgentFlow Supabase project URL and publishable key.
3. Add an AI Gateway key and a currently supported model ID when you are ready to enable live AI.
4. Run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Dedicated AgentFlow Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key |
| `AI_GATEWAY_API_KEY` | Server-only AI Gateway credential |
| `AI_GATEWAY_MODEL` | Current model identifier supported by AI Gateway |

Never commit real credentials. The AI Gateway key must remain server-side and must never use a `NEXT_PUBLIC_` prefix.

## Database setup

Run `supabase/schema.sql` in the SQL Editor of the dedicated AgentFlow Supabase project. The schema enables row-level security and scopes agents, conversations and messages to their owner.

## Reliability and security

- Authenticated API routes verify the current user.
- Database access is protected by row-level security.
- Inputs are validated at API boundaries.
- Authentication callback redirects are restricted to local paths.
- Workflow steps are validated and run without arbitrary code execution.
- External integrations must be implemented as permission-checked adapters.
- Provider credentials are never sent to the browser.

## Current milestone

The app includes a marketing landing page, email/password authentication, an authenticated agent workspace, Supabase-backed agent creation/loading, a streaming AI chat endpoint, an isolated database schema, a health endpoint, and a deterministic workflow engine with tests.

Next: connect the dedicated Supabase project and AI Gateway credentials, then test sign-up, agent persistence, chat streaming, and workflow execution end to end.
