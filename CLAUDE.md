# StoryStream web app

StoryStream (www.storystream.mobi) is Vodacom South Africa's audiobook and podcast website. It's a Next.js 15 App Router app in TypeScript, React 19 and Tailwind.

Its API is **myuzeAPI** (`https://api.myuze.app`, a separate repo at `../myuzeapi`). That API is **shared with myuzePlay**, whose Android and iOS apps are already installed on customer devices.

## Commands

```bash
npm run dev              # local dev server (turbopack) on :3000
npm run build            # production build; reads .env.production
npm run start            # serve the production build on :3000
npx tsc --noEmit -p .    # type check (the build skips type errors, so run this yourself)
npm audit --omit=dev     # production dependency audit; keep it at 0
```

- **Testing locally:** `localhost:3000` can call the content routes (home, search), but the `/api/v1/storystream/*` routes refuse any origin except storystream.mobi. Book, episode, login and profile pages therefore only fully work on the live site.

## How it ships

1. **Push.** This machine has no GitHub push login, so the user pushes. Never force-push.
2. **Build on the VM.** The user runs: `cd /var/www/nextjs-app/current && git pull origin main && npm ci && npm run build && pm2 restart next-app`.
3. **Purge the CDN.** Purge Bunny pull zone `4462253` (storystream-mobi).

- The GitHub Actions "Deploy to GCE VM" workflow fails on every push. That's expected; don't report it.
- `NEXT_PUBLIC_*` values are baked in at build time from the committed `.env.production`. Everything there is public, because it ships in the browser bundle anyway. Real secrets never go there.

## Security rules

Don't loosen these without asking.

- **StoryStream's own routes:** login, profile and episode/book content go through StoryStream's own routes. Don't switch these calls to other API routes:
  - `api/v1/storystream/ValidateMDN`, `ValidateOTP`, `ValidateSSO`
  - `GetProfile`, `SetProfile`
  - `GetEpisodeDetail`, `GetPodcastDetailPaging`

  They're all POST, need the `web` API key, and take `Authorization: Bearer <token>` where a user is involved.
- **The login token** lives in `localStorage.ssSessionToken` (`src/utils/sessionToken.ts`). Never store it as `token` or `authToken`: the axios interceptor in `src/lib/axios.ts` sends `localStorage.token` to every route, and the shared routes' CORS rules refuse `Authorization`. An expired or missing token for a logged-in user → `endSessionAndRedirectToLogin()`.
- **One API key only:** `API_KEYS.FEED_AUTH`, the `web` key. The myuzePlay iOS and Android keys must never appear in this repo or its bundle.
- **Premium audio is server-gated.** Non-subscribers get episodes with empty `stream_url`. The UI must handle a missing link (show a message), not assume one.
- **The mobile number is the login identity.** It's read-only in the profile, and `SetProfile` ignores it.
- **The CSP is an allow-list** (`next.config.js` → `headers()`). Add only exact hosts, never wildcards or `https:` for scripts. Vodacom's Tealium tags need their domains added before they can load; Vodacom has been asked to send new domains in advance.

## Code map

- **API calls:** `src/app/api/*` (`auth`, `podcast`, `profile`, `search`, `home`, `category`); the shared request helper is `src/utils/request.ts`.
- **Pages:** `src/app/*`.
- **Big client components:** `src/components/dashboard/*` (`DetailsClient` = book page, `PodcastClient` = episode player).
- **Audio:** `src/context/AudioProvider.tsx`. The `<audio>` element's play and pause events drive `isPlaying`.
- **Offline downloads:** `src/utils/indexDB.ts`.
- **Analytics:** Tealium, in `src/lib/tealiumTracking`.

## Code graph (graphify)

`graphify-out/` holds a local, git-ignored knowledge graph of this repo (code structure, calls, communities).

- **Questions about the code:** start with `graphify query "<question>"`, `graphify explain "<symbol>"` or `graphify god-nodes`, then read files.
- **After code changes:** refresh it with `graphify update .`. That runs locally with no LLM calls.

## Working principles: Andrej Karpathy

These come from Karpathy's notes on common LLM coding mistakes, as collected in the widely used Karpathy-inspired CLAUDE.md. They favour caution over speed, so use judgement on trivial tasks.

1. **Think before coding.** Don't guess silently.
   - State your assumptions.
   - If a request can be read more than one way, lay out the readings instead of picking one.
   - Say so when a simpler approach exists.
   - When something is unclear, stop and ask.
2. **Simplicity first.** Write the least code that solves the problem.
   - No features nobody asked for.
   - No abstractions for one-off code.
   - No configurability "just in case".
   - No handling for situations that can't happen.
   - If it could be a quarter of the size, rewrite it.
3. **Surgical changes.** Change only what the task needs.
   - Leave neighbouring code, comments and formatting alone, and match the existing style.
   - Clean up only what your own change made unused.
   - Point out unrelated dead code rather than deleting it.
4. **Goal-driven execution.** Define what "done" means, then loop until it's verified.
   - Turn a task into a checkable goal, for example a test that reproduces the bug before you fix it.
   - For multi-step work, write a short plan with a verification step for each part.

## Working principles: Boris Cherny

These come from Boris Cherny, creator of Claude Code, on how his team uses it.

1. **Give Claude a way to verify its work.** This is the biggest lever on quality. Here, that means:
   - `npx tsc --noEmit`
   - `npm run build`
   - `npm audit --omit=dev`
   - checking the page in a browser, including the live site after a deploy
2. **Plan first.** Start non-trivial work in plan mode, agree the plan, then implement.
3. **Keep this CLAUDE.md as a team file in git.** When Claude gets something wrong in this repo, add a line here so it doesn't happen again. Delete lines that no longer prevent a real mistake.
4. **Turn repeated workflows into slash commands** (`.claude/commands/`), and use subagents for review, simplification and verification.
5. **Use hooks for mechanical work,** such as formatting after edits, so reviews and CI don't fail on style.
6. **Pre-approve safe commands** in a shared `.claude/settings.json`, instead of skipping permission checks.
7. **Run sessions in parallel for independent work.** Give long-running work its own background agent that verifies the result.
