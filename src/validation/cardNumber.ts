export type CardValidationReason =
  | "NON_DIGIT_CHARACTERS"
  | "INVALID_LENGTH"
  | "LUHN_FAILED";

export type CardValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; normalized: string; reason: CardValidationReason };

/**
 * Normalizes a card number input for validation.
 * - trims leading/trailing whitespace
 * - removes spaces and hyphens
 */
export function normalizeCardNumber(input: string): string {
  return input.trim().replace(/[\s-]+/g, "");
}

export function isDigitsOnly(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

export function isValidLength(value: string): boolean {
  return value.length >= 13 && value.length <= 19;
}

export function passesLuhn(value: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i -= 1) {
    const code = value.charCodeAt(i) - 48; // '0' => 48
    // `passesLuhn` assumes digits-only input; guard anyway to keep it pure & safe.
    if (code < 0 || code > 9) return false;

    let digit = code;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function validateCardNumber(input: string): CardValidationResult {
  const normalized = normalizeCardNumber(input);

  if (!isDigitsOnly(normalized)) {
    return { valid: false, normalized, reason: "NON_DIGIT_CHARACTERS" };
  }

  if (!isValidLength(normalized)) {
    return { valid: false, normalized, reason: "INVALID_LENGTH" };
  }

  if (!passesLuhn(normalized)) {
    return { valid: false, normalized, reason: "LUHN_FAILED" };
  }

  return { valid: true, normalized };
}

