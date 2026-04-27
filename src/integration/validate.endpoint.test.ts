import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../app";

describe("POST /validate", () => {
  it("returns 200 and valid:true for a valid card number", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: "4111 1111 1111 1111" })
      .expect(200);

    expect(res.body).toEqual({ valid: true, normalized: "4111111111111111" });
  });

  it("returns 200 and valid:false for non-digit card content", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: "4111-1111-1111-1111x" })
      .expect(200);

    expect(res.body).toMatchObject({
      valid: false,
      normalized: "4111111111111111x",
      reason: "NON_DIGIT_CHARACTERS",
    });
  });

  it("returns 200 and valid:false for invalid length", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: "4111 1111 1111" })
      .expect(200);

    expect(res.body).toMatchObject({
      valid: false,
      normalized: "411111111111",
      reason: "INVALID_LENGTH",
    });
  });

  it("returns 200 and valid:false for Luhn failure", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: "4111 1111 1111 1112" })
      .expect(200);

    expect(res.body).toMatchObject({
      valid: false,
      normalized: "4111111111111112",
      reason: "LUHN_FAILED",
    });
  });

  it("returns 400 for missing cardNumber", async () => {
    const res = await request(app).post("/validate").send({}).expect(400);

    expect(res.body).toEqual({
      error: { code: "MISSING_CARD_NUMBER", message: "`cardNumber` is required" },
    });
  });

  it("returns 400 for non-string cardNumber", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: 4111111111111111 })
      .expect(400);

    expect(res.body).toEqual({
      error: {
        code: "INVALID_CARD_NUMBER_TYPE",
        message: "`cardNumber` must be a string",
      },
    });
  });

  it("returns 400 for empty/whitespace-only cardNumber", async () => {
    const res = await request(app)
      .post("/validate")
      .send({ cardNumber: "   ---   " })
      .expect(400);

    expect(res.body).toEqual({
      error: { code: "EMPTY_CARD_NUMBER", message: "`cardNumber` must not be empty" },
    });
  });
});

