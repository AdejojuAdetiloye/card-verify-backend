import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, message: "card-verify-backend running" });
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});

