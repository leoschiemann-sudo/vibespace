# Editor Password Protection Plan

## Goal

Protect the editor on `app/page.tsx` with a global password stored in Sanity.  
Only authenticated users should be able to access the editor.  
Authentication must use a server-side session cookie, not `localStorage` or `sessionStorage`.

## Security Requirements

- Store the editor password in Sanity as a hash, not as plaintext.
- Use **Argon2id** for password hashing and verification.
- Do **not** use `SHA-256` as the final password hashing algorithm.
- Do **not** expose the Sanity token to the browser.
- Keep all password verification logic server-side.
- Use an `httpOnly` cookie for the authenticated editor session.
- Prefer `sameSite: "lax"` and `secure: true` in production.
- Add optional rate limiting for the verify endpoint.

## Architecture

### Sanity
Create a singleton document type called `editorSettings`.

Fields:
- `passwordHash: string`
- `updatedAt: datetime`

Use a fixed document ID:
- `editorSettings`

### Next.js APIs
Create these Route Handlers:

- `POST /api/editor/verify`
- `GET /api/editor/session`
- `POST /api/editor/logout`

### Client UI
Create:
- `components/EditorPasswordGate.tsx`

Update:
- `app/page.tsx`

### Shared auth utilities
Create:
- `lib/editor-auth.ts`

### Setup script
Create:
- `scripts/set-editor-password.ts`

## File Structure

```txt
app/
  api/
    editor/
      verify/
        route.ts
      session/
        route.ts
      logout/
        route.ts
  page.tsx

components/
  EditorPasswordGate.tsx

lib/
  sanity.ts
  editor-auth.ts

sanity/
  schemas/
    editorSettings.ts
    index.ts

scripts/
  set-editor-password.ts
```

## Implementation Details

### 1. Sanity schema

Create `sanity/schemas/editorSettings.ts`.

Requirements:
- Schema name: `editorSettings`
- Type: `document`
- Singleton document behavior
- Fields:
  - `passwordHash`
  - `updatedAt`

Update `sanity/schemas/index.ts` so the schema is exported in `schemaTypes`.

### 2. Auth helper library

Create `lib/editor-auth.ts`.

It should contain:
- `hashEditorPassword(password: string): Promise<string>`
- `verifyEditorPassword(password: string, hash: string): Promise<boolean>`
- session cookie name constant
- session duration constant
- helper to create session payload
- helper to validate session payload
- helper to build cookie options

Requirements:
- Use Argon2id
- Cookie must be `httpOnly`
- Cookie should expire after a fixed duration, for example 12h or 24h

### 3. Verify endpoint

Create `app/api/editor/verify/route.ts`.

Implement `POST`:

Input:
```json
{ "password": "..." }
```

Behavior:
1. Validate request body.
2. Load Sanity singleton document `editorSettings`.
3. If no password hash exists, return:
   ```json
   { "success": false, "error": "Editor password not configured" }
   ```
4. Verify password with Argon2id.
5. If invalid, return status `401`:
   ```json
   { "success": false, "error": "Invalid password" }
   ```
6. If valid:
   - create authenticated editor session
   - set `httpOnly` cookie
   - return:
   ```json
   { "success": true }
   ```

### 4. Session endpoint

Create `app/api/editor/session/route.ts`.

Implement `GET`.

Behavior:
1. Read editor session cookie.
2. Validate cookie contents and expiry.
3. Return:
   ```json
   { "authenticated": true }
   ```
   or
   ```json
   { "authenticated": false }
   ```

### 5. Logout endpoint

Create `app/api/editor/logout/route.ts`.

Implement `POST`.

Behavior:
1. Clear the editor session cookie.
2. Return:
   ```json
   { "success": true }
   ```

### 6. Password gate component

Create `components/EditorPasswordGate.tsx`.

Responsibilities:
- On mount, call `GET /api/editor/session`
- Show loading state while session check is running
- If unauthenticated, show password form
- If authenticated, render `children`

Password form requirements:
- password input
- submit button
- loading state
- error state

Submit flow:
1. Send `POST /api/editor/verify`
2. If successful, set local UI state to authenticated or re-check session
3. If failed, show returned error

Important:
- Do **not** store auth state in `localStorage`
- Do **not** store auth state in `sessionStorage`
- The cookie is the real auth source

### 7. Update editor page

Update `app/page.tsx`.

Wrap the existing editor UI with `EditorPasswordGate`.

Target structure:
```tsx
<EditorPasswordGate>
  <main>
    {/* existing editor UI */}
  </main>
</EditorPasswordGate>
```

Do not keep password verification logic directly inside the editor page.

### 8. Initial password setup script

Create `scripts/set-editor-password.ts`.

Behavior:
1. Read `EDITOR_INITIAL_PASSWORD` from environment.
2. Hash it using Argon2id.
3. Create or update Sanity singleton document `editorSettings`.
4. Set `updatedAt`.

### 9. Environment variables

Add to `.env.example`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_TOKEN=
EDITOR_INITIAL_PASSWORD=
```

Important:
- `SANITY_TOKEN` must only be used in server-side code.
- Never import token-based Sanity code into client components.

## Error Handling

Support these cases:
- missing password in request
- invalid password
- editor password not configured
- invalid session
- expired session
- Sanity fetch failure
- internal server error

## Optional Enhancements

- Add rate limiting to `POST /api/editor/verify`
- Add audit logging for successful and failed editor logins
- Add middleware later if route-level protection is needed beyond the page gate

## Acceptance Criteria

- Visiting `/` without a valid session shows only the password gate.
- Entering a wrong password does not unlock the editor.
- Entering the correct password unlocks the editor.
- Successful login sets an `httpOnly` cookie.
- Reloading the page keeps the editor unlocked while the cookie is valid.
- Logging out removes access again.
- The editor password is stored only as an Argon2id hash in Sanity.
- The Sanity token never appears in browser-side code.

## Instructions for the coding AI

Implement this plan with the following rules:

- Change only the files needed for this feature.
- Return every changed or new file in full.
- Keep the Sanity token server-only.
- Use Route Handlers for all auth actions.
- Use Argon2id for password hashing and verification.
- Use `httpOnly` cookies for editor authentication.
- Do not use `localStorage` or `sessionStorage` for auth.
- Keep the editor UI unchanged as much as possible except for wrapping it with the password gate.
- Add a logout action in the editor UI.
- Include clear error messages for all failure states.