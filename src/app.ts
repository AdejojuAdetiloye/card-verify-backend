import express, { type NextFunction, type Request, type Response } from "express";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Keep details minimal; don’t leak internals.
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected error",
    },
  });
});

