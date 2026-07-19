import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for post generation
  app.post("/api/generate-posts", async (req, res) => {
    try {
      const { idea, tone } = req.body;
      
      const prompt = `You are a social media expert. The user wants to write social media posts about this idea: "${idea}"
The tone should be: ${tone}.
Generate 3 distinct drafted posts tailored to:
1. LinkedIn (long-form, professional, insightful).
2. Twitter/X (short, punchy, engaging, under 280 characters).
3. Instagram (visual-focused, includes emojis and 5-7 relevant hashtags).

For each platform, also write a highly detailed, descriptive image generation prompt (describing style, composition, lighting, subject) that perfectly matches the post's content and platform vibe.

Return the output strictly as a JSON object with this exact structure:
{
  "linkedin": { "text": "...", "imagePrompt": "..." },
  "twitter": { "text": "...", "imagePrompt": "..." },
  "instagram": { "text": "...", "imagePrompt": "..." }
}
Do not include any other text or markdown formatting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text || "{}";
      const posts = JSON.parse(text);
      res.json(posts);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for image generation
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio, imageSize } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1",
            imageSize: imageSize || "1K"
          }
        },
      });

      let imageUrl = null;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || "image/png";
            imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
            break;
          }
        }
      }

      if (imageUrl) {
        res.json({ imageUrl });
      } else {
        res.status(500).json({ error: "Failed to generate image. No inlineData found." });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
