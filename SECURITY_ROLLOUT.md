# GunsevenDraw – staged authentication rollout

**Do not merge or deploy until the frontend and backend changes are both
reviewed and the test environment is verified.** The frontend and backend are
separate repositories/deployments. The backend intentionally rejects all
unauthenticated project API requests after this change.

## Preparation

1. Take a verifiable Supabase/PostgreSQL backup and test restoring it to a
   separate environment. Never test destructive operations on production data.
2. Configure a **staging** Render service with its own staging database.
3. In the staging Render environment, set `SUPABASE_URL`,
   `SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `DIRECT_URL` and
   `ADMIN_USER_ID` (the authorized Supabase user UUID). Do not store
   credentials in this repository or send them through a chat.
4. Use a staging frontend pointing to the staging API and staging Supabase.
5. Run `npm ci && npx prisma generate && npm test` and exercise scenarios:
   missing/invalid token (401), another user's project (404), valid owner,
   valid admin, create, list, read, delete, and legacy owner identification.
6. Review project data saved with `userId = 'anonim'` and migrate ownership
   only with verified evidence of the original account.

## Production release

1. Schedule a maintenance window or a coordinated atomic cutover.
2. Deploy backend and frontend together (the frontend must send the Bearer
   access token; the backend must validate it). Roll back **both** services if
   compatibility checks fail.
3. Run smoke tests as a non-admin and admin user.
4. Monitor auth failures and database errors without logging access tokens.
5. Apply Supabase RLS policies in a separate reviewed database migration.
   Never enable RLS on a live table without compatible policies and tests.

## Security requirements

- Every project endpoint requires a verified Supabase Auth JWT.
- Admin access is determined only by the server-side `ADMIN_USER_ID`.
- A user may access their own projects; older records with `userId = 'anonim'`
  are matched by the verified account email for transitional compatibility.
- Request-body `userId`, `userEmail`, query-string `email` and client-side
  UI checks are **not** considered authorization.
- Admin identity and project data must not be logged in error responses.
