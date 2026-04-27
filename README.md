# Card Verify Backend

Backend intern assessment project: a **Node.js + TypeScript + Express** API with a single endpoint to validate a card number.

## Requirements

- Node.js (recommended: **18+**)

## Setup

Install dependencies:

```bash
npm install
```

## Run

Start the server in development (TypeScript + nodemon):

```bash
npm run dev
```

Build TypeScript to JavaScript (outputs to `dist/`):

```bash
npm run build
```

Run the compiled server:

```bash
npm start
```

## Test

Run unit + integration tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## API

### Health check

`GET /health`

Response:

```json
{ "ok": true }
```

### Validate card number

`POST /validate`

Request body:

```json
{ "cardNumber": "4111 1111 1111 1111" }
```

Success responses:

- Valid:

```json
{ "valid": true, "normalized": "4111111111111111" }
```

- Invalid:

```json
{ "valid": false, "normalized": "4111111111111112", "reason": "LUHN_FAILED" }
```

Error responses (bad request):

- Missing `cardNumber`:

```json
{ "error": { "code": "MISSING_CARD_NUMBER", "message": "`cardNumber` is required" } }
```

## Status codes policy

- **200 OK**: request is well-formed and validation result is returned (valid or invalid).
- **400 Bad Request**: missing/incorrect type/empty-after-normalization input.

## Validation rules (“valid” definition)

The endpoint validates a card number as a *plausible PAN* (it does not verify that the card exists or can be charged).

Rules:

1. `cardNumber` is required and must be a string (otherwise **400**).
2. Normalize by trimming and removing spaces/hyphens.
3. If empty after normalization → **400**.
4. Digits-only check (otherwise invalid).
5. Length must be **13–19** digits (otherwise invalid).
6. Must pass the **Luhn** checksum (otherwise invalid).

Invalid responses include a `reason`:

- `NON_DIGIT_CHARACTERS`
- `INVALID_LENGTH`
- `LUHN_FAILED`

## Project structure (high level)

- `src/app.ts`: Express app, middleware, routes, error/404 handlers (does not listen on a port)
- `src/server.ts`: starts the HTTP server
- `src/validation/cardNumber.ts`: pure validation functions (unit-test friendly)
- `src/integration/*.test.ts`: integration tests using `supertest`

## Key decisions

- **Pure validation module**: keeps logic testable without HTTP concerns, and makes live changes easy.
- **400 vs invalid**: only “bad request” cases get **400**; malformed/unsupported card content returns a normal invalid result.
- **TypeScript strict mode**: enabled to catch mistakes early and keep behavior explicit.

