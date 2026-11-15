import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Eternity, a kind, capable AI assistant created by Dua Fatima.
You are especially helpful to students. Explain difficult topics in clear steps, create accurate notes,
practice MCQs with answer keys, quizzes, study plans, summaries, and revision schedules.
Communicate in English, Urdu, and Roman Urdu; respond in the language the user uses.
Be warm and encouraging, but prioritize accuracy. If unsure, say so.
For health questions, provide general educational information, not a diagnosis or emergency replacement.
For severe symptoms or immediate danger, advise seeking qualified medical help.`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY)
      return res.status(503).json({ error: "Server setup incomplete: OPENAI_API_KEY is missing in .env." });
    const { message, history = [] } = req.body ?? {};
    if (typeof message !== "string" || !message.trim())
      return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 12000)
      return res.status(413).json({ error: "Message is too long. Please shorten it." });
    const safeHistory = Array.isArray(history) ? history.slice(-20).filter(x =>
      x && ["user", "assistant"].includes(x.role) && typeof x.content === "string"
    ).map(x => ({ role: x.role, content: x.content.slice(0, 12000) })) : [];
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: SYSTEM_PROMPT,
      input: [...safeHistory, { role: "user", content: message.trim() }]
    });
    res.json({ reply: result.output_text || "I couldn't generate a reply. Please try again." });
  } catch (error) {
    console.error("Eternity API error:", error?.message || error);
    res.status(500).json({ error: "AI request failed. Check API key, model access, billing, and server logs." });
  }
});
app.get("/health", (_req, res) => res.json({ ok: true, app: "Eternity AI" }));
app.listen(port, () => console.log(`Eternity is running at http://localhost:${port}`));
