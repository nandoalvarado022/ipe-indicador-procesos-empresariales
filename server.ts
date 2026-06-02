import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for EDD Gemini Copilot
  app.post("/api/edd-copilot", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Add specialized system instructions on EDD to ensure custom Next.js/Zod guidance
      const systemInstruction = `You are a world-class architecture advisor specializing in Expectation-Driven Development (EDD) for Next.js (App Router, v14/v15).
Your goals are:
1. Guide developers in defining strict Zod API/Server Action schemas (Contratos).
2. Help design visual error states, Error Boundaries, Suspense loading patterns, and graceful handling of dynamic outages.
3. Help map user flows to Playwright visual / behavioral integration expectation tests.
4. Provide clean, copyable Next.js TypeScript boilerplate code.
Keep your tone concise, encouraging, highly professional, and in alignment with clean minimalism. Respond in Spanish if the user's input is in Spanish, or adapt to the user's language. Use markdown formatting.`;

      // Translate chat messages to @google/genai chat format
      const formattedContents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        }
      });

      const reply = response.text || "No response generated.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "Internal Server Error in Gemini Proxy." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
