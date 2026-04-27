import { Router } from "express";

import { normalizeCardNumber, validateCardNumber } from "../validation/cardNumber";

type ValidateRequestBody = {
  cardNumber?: unknown;
};

export const validateRouter = Router();

validateRouter.post("/validate", (req, res) => {
  const body = req.body as ValidateRequestBody;

  if (body.cardNumber === undefined) {
    return res.status(400).json({
      error: {
        code: "MISSING_CARD_NUMBER",
        message: "`cardNumber` is required",
      },
    });
  }

  if (typeof body.cardNumber !== "string") {
    return res.status(400).json({
      error: {
        code: "INVALID_CARD_NUMBER_TYPE",
        message: "`cardNumber` must be a string",
      },
    });
  }

  const normalized = normalizeCardNumber(body.cardNumber);
  if (normalized.length === 0) {
    return res.status(400).json({
      error: {
        code: "EMPTY_CARD_NUMBER",
        message: "`cardNumber` must not be empty",
      },
    });
  }

  const result = validateCardNumber(body.cardNumber);
  return res.status(200).json(result);
});

