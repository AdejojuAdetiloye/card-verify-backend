# Card Verify Backend — Step-by-step TODO (no code yet)

Goal: Build a **Node.js + TypeScript + Express** API with **one POST endpoint** that validates a card number, plus **unit + integration tests**, and a **README**. `tsconfig.json` must have **"strict": true**.

---

## Definition of “valid” (rules to implement)

Use these rules (simple, common, easy to explain/modify):

1. **Required**: request JSON must include `cardNumber`.
   - Missing → return **400** with an error JSON.
2. **Type**: `cardNumber` must be a **string**.
   - Not a string → **400** with an error JSON.
3. **Normalize**:
   - `trim()`
   - remove spaces and hyphens (e.g. `"4111-1111 1111 1111"` → `"4111111111111111"`)
   - if empty after normalization → **400** with an error JSON
4. **Digits-only**:
   - if normalized value is not digits-only (`^[0-9]+$`) → treat as **invalid card** (not a request error)
5. **Length**:
   - normalized length must be **13–19**
   - otherwise invalid
6. **Luhn checksum**:
   - pass → valid
   - fail → invalid

HTTP behavior:
- **400** only for **missing/incorrect type/empty** `cardNumber`.
- **Invalid card** should return a consistent “invalid” JSON response (decide whether that is **200** or **422** and keep it consistent across all “invalid” cases).

---

## API contract (decide once, use everywhere)

Pick and stick to these shapes (recommended):

- Request:
  - `POST /validate`
  - JSON body: `{ "cardNumber": "..." }`

- Success response (well-formed request, validity computed):
  - `{ "valid": true, "normalized": "..." }`
  - `{ "valid": false, "normalized": "...", "reason": "..." }` (optional `reason`)

- Error response (bad request):
  - `{ "error": { "code": "...", "message": "...", "details": ... } }`

Note: Keep the response shape stable; tests should assert it.

---

## Task breakdown (do these one-by-one)

### Task 0 — Repo init + hygiene (Commit 1)

- [ ] Initialize git repo.
- [ ] Add `.gitignore` for Node/TypeScript (node_modules, dist, coverage, .env).
- [ ] Add `.editorconfig` (optional but nice).
- [ ] Create empty `README.md` scaffold (title + short description + “How to run” placeholders).

Deliverable: clean repo baseline with a small first commit.

---

### Task 1 — Project scaffolding (Commit 2)

- [ ] Create `package.json`.
- [ ] Add dependencies:
  - runtime: `express`
  - dev: `typescript`, `ts-node-dev` (or `tsx`), `@types/node`, `@types/express`
- [ ] Add scripts:
  - `dev` (run server in watch mode)
  - `build` (tsc)
  - `start` (run compiled JS)
  - `test` (run all tests)
- [ ] Create `tsconfig.json` with:
  - `"strict": true`
  - output to `dist/`, input `src/`

Deliverable: `npm run dev` boots something trivial (even a placeholder), strict TS enabled.

---

### Task 2 — App structure + health route (Commit 3)

Create a simple structure (example):

- [ ] `src/app.ts` (express app instance, middleware, routes)
- [ ] `src/server.ts` (listen on port, start app)
- [ ] `src/routes/*` (routes)

Add basic app wiring:
- [ ] JSON body parsing
- [ ] A `GET /health` route returning `{ ok: true }`
- [ ] Central error handler skeleton (even if minimal)

Deliverable: integration tests later can use the `app` without starting a real server.

---

### Task 3 — Validation logic as pure functions (Commit 4)

Build the validation as **pure** functions so unit testing is easy:

- [ ] `normalizeCardNumber(input: string): string`
- [ ] `isDigitsOnly(value: string): boolean`
- [ ] `isValidLength(value: string): boolean` (13–19)
- [ ] `passesLuhn(value: string): boolean`
- [ ] `validateCardNumber(input: string): { valid: boolean; normalized: string; reason?: string }`

Deliverable: the core logic can be explained line-by-line and changed quickly.

---

### Task 4 — Unit tests for validation (Commit 5)

Pick a test runner (recommended: **Jest** or **Vitest**) and set it up.

- [ ] Add test tooling deps and config.
- [ ] Unit test coverage:
  - normalization: spaces/hyphens
  - digits-only: rejects letters/symbols
  - length boundaries: 12 (fail), 13 (pass if Luhn), 19 (pass if Luhn), 20 (fail)
  - Luhn known valid/invalid numbers
  - “all invalid” scenarios return `valid:false` with expected `reason` (if you include `reason`)

Deliverable: `npm test` runs unit tests and they are deterministic.

---

### Task 5 — Implement the POST endpoint (Commit 6)

- [ ] Add `POST /validate`.
- [ ] Validate request:
  - missing `cardNumber` → 400 error JSON
  - non-string `cardNumber` → 400 error JSON
  - empty after normalization → 400 error JSON
- [ ] For non-digit / bad length / Luhn fail:
  - return the **invalid card JSON** (consistent status code + body shape)
- [ ] For pass:
  - return valid JSON

Deliverable: endpoint matches the contract and uses correct status codes.

---

### Task 6 — Integration tests (Commit 7)

Use a request testing library (recommended: **supertest**).

Test end-to-end behavior:
- [ ] `POST /validate` valid payload → success status + `{ valid:true }`
- [ ] non-digit payload (string) → invalid status + `{ valid:false }`
- [ ] bad length → invalid
- [ ] Luhn fail → invalid
- [ ] missing `cardNumber` → 400 error shape
- [ ] non-string `cardNumber` → 400 error shape
- [ ] empty string / whitespace-only → 400 error shape

Deliverable: endpoint behavior is locked in by tests.

---

### Task 7 — README polish + decisions (Commit 8)

Update `README.md`:
- [ ] Setup steps (Node version recommendation, install, dev, build, start)
- [ ] How to run tests
- [ ] Endpoint docs (request/response examples)
- [ ] Validation rules (copy the “Definition of valid” section)
- [ ] Status codes policy (what returns 400 vs invalid response)
- [ ] Brief design decisions (why strict TS, why pure function validation, why chosen status code)

Deliverable: a reviewer can run the project quickly and understands your choices.

---

### Task 8 — Final checks (Commit 9)

- [ ] Ensure `npm run build` passes
- [ ] Ensure `npm test` passes
- [ ] Ensure no secrets, no `.env` committed
- [ ] Optional: add CI workflow (GitHub Actions) to run tests

Deliverable: merge-ready repo suitable for public GitHub.

---

## Suggested “live review” readiness checklist

- [ ] You can explain Luhn step-by-step from memory.
- [ ] You can explain why you return 400 only for missing/type/empty.
- [ ] You can change length bounds or normalization rules quickly without touching the route code.
- [ ] You can point to which tests cover which rule.

