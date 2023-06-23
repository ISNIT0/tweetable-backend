import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { tweetify } from "./lib/tweetify";

if (!process.env.OPENAI_API_KEY) {
  console.error(`Make sure you set the OPENAI_API_KEY environment variable`);
  throw new Error("OPENAI_API_KEY is not set");
}

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post(`/tweetify`, async (req, res) => {
  const { urls, textContent } = req.body;

  const tweetContent = await tweetify({ urls, textContent });

  res.send({ tweet: tweetContent });
});

app.listen(PORT, () => {
  console.info(`Listening on http://localhost:${PORT}`);
});
