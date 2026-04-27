import { describe, expect, it } from "vitest";

import {
  isDigitsOnly,
  isValidLength,
  normalizeCardNumber,
  passesLuhn,
  validateCardNumber,
} from "./cardNumber";

describe("normalizeCardNumber", () => {
  it("trims and removes spaces/hyphens", () => {
    expect(normalizeCardNumber("  4111-1111 1111-1111  ")).toBe("4111111111111111");
  });
});

describe("isDigitsOnly", () => {
  it("returns true for digits-only", () => {
    expect(isDigitsOnly("012345")).toBe(true);
  });

  it("returns false for non-digits", () => {
    expect(isDigitsOnly("12a3")).toBe(false);
    expect(isDigitsOnly("12-3")).toBe(false);
    expect(isDigitsOnly("")).toBe(false);
  });
});

describe("isValidLength", () => {
  it("accepts 13..19 digits", () => {
    expect(isValidLength("0".repeat(13))).toBe(true);
    expect(isValidLength("0".repeat(19))).toBe(true);
  });

  it("rejects <13 and >19 digits", () => {
    expect(isValidLength("0".repeat(12))).toBe(false);
    expect(isValidLength("0".repeat(20))).toBe(false);
  });
});

describe("passesLuhn", () => {
  it("returns true for a known valid Luhn number", () => {
    expect(passesLuhn("4111111111111111")).toBe(true);
  });

  it("returns false for a known invalid Luhn number", () => {
    expect(passesLuhn("4111111111111112")).toBe(false);
  });

  it("returns false when given non-digit characters", () => {
    expect(passesLuhn("4111-1111")).toBe(false);
  });
});

describe("validateCardNumber", () => {
  it("returns valid:true for a normalized number that passes Luhn and length", () => {
    expect(validateCardNumber("4111 1111 1111 1111")).toEqual({
      valid: true,
      normalized: "4111111111111111",
    });
  });

  it("returns NON_DIGIT_CHARACTERS when normalized contains non-digits", () => {
    expect(validateCardNumber("4111-1111-1111-1111x")).toEqual({
      valid: false,
      normalized: "4111111111111111x",
      reason: "NON_DIGIT_CHARACTERS",
    });
  });

  it("returns INVALID_LENGTH when normalized length is outside 13..19", () => {
    expect(validateCardNumber("4111 1111 1111")).toEqual({
      valid: false,
      normalized: "411111111111",
      reason: "INVALID_LENGTH",
    });
  });

  it("returns LUHN_FAILED when Luhn fails", () => {
    expect(validateCardNumber("4111 1111 1111 1112")).toEqual({
      valid: false,
      normalized: "4111111111111112",
      reason: "LUHN_FAILED",
    });
  });
});

