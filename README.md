# Personal Developer Portfolio

Minimal Next.js portfolio with data-driven projects, certificates, design samples, Supabase presence, GitHub stats, and a Gemini-powered command palette assistant.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Edit portfolio content

Update portfolio text and entries in:

```txt
data/portfolio.ts
```

You can add more projects, skills, certificates, design samples, and timeline entries by adding objects to the arrays in that file.

## Add real images

Replace or add files in:

```txt
public/projects
public/certificates
public/design
```

Then point each `image` value in `data/portfolio.ts` to the new public path, for example:

```ts
image: "/projects/my-project-screenshot.png"
```

## AI assistant

The command palette opens from the hero/nav button or with:

```txt
Ctrl+K on Windows
Cmd+K on Mac
```

The browser calls `app/api/chat/route.ts`, which calls Gemini server-side. Set this environment variable locally and in Vercel:

```txt
GEMINI_API_KEY=your_google_gemini_api_key
```

The route currently uses `gemini-1.5-flash`. You can change the model name in `app/api/chat/route.ts` if your Gemini free-tier account exposes a newer preferred model.

## Supabase visitor presence

Set these public environment variables to enable the live visitor counter:

```txt
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these, the badge stays in a harmless placeholder state.

## GitHub stats

Set your GitHub username:

```txt
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
```

Also update `profile.github` in `data/portfolio.ts`.

## Deploy on Vercel

1. Push this project to GitHub.
2. Import it in Vercel as a Next.js app.
3. Add `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_GITHUB_USERNAME` in Vercel Project Settings.
4. Deploy.
