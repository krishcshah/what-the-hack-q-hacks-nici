import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  let openai: OpenAI | null = null;
  try {
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  } catch (e) {
    console.warn("OpenAI API key missing or invalid");
  }

  app.post("/api/chat", async (req, res) => {
    if (!openai) {
      return res.status(500).json({ error: "OpenAI API key not configured. Please add it to your secrets." });
    }
    try {
      const { message, cartState } = req.body;
      const cartSummary = cartState ? cartState.categories.map((c: any) => c.items.map((i: any) => i.name).join(", ")).join(", ") : "empty";

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `You are the Picnic grocery AI assistant. Be brief, friendly, and helpful. 
The user's cart currently has: ${cartSummary}. 
If the user asks to change the cart to be vegan, cheaper, eco-friendly, premium/chef's choice, fill minimum order, remove duplicates, or add hamburgers, call the adjust_cart tool.
IMPORTANT: If you call the adjust_cart tool, you MUST also provide a natural conversational reply (e.g. "Adding hamburgers to your cart", "Making your cart vegan", etc.). Do not mention the internal function name. Keep responses under 2 sentences.` 
          },
          { role: "user", content: message }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "adjust_cart",
              description: "Adjust the user's cart based on their request",
              parameters: {
                type: "object",
                properties: {
                  adjustmentType: {
                    type: "string",
                    enum: ["vegan", "money-saver", "eco", "chef", "min-order", "duplicate", "add-hamburger"]
                  }
                },
                required: ["adjustmentType"]
              }
            }
          }
        ]
      });

      const responseMessage = completion.choices[0].message;
      let action = null;
      let reply = responseMessage.content;

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        const toolCall = responseMessage.tool_calls[0];
        if (toolCall.type === "function" && toolCall.function.name === "adjust_cart") {
          const args = JSON.parse(toolCall.function.arguments);
          action = args.adjustmentType;
          if (!reply) {
            const actionToText: Record<string, string> = {
              "vegan": "vegan",
              "money-saver": "money-saving",
              "eco": "eco-friendly",
              "chef": "chef's choice",
              "min-order": "minimum order",
              "duplicate": "duplicate removal",
              "add-hamburger": "hamburger"
            };
            const actionText = actionToText[action] || action;
            if (action === "add-hamburger") {
              reply = `Adding hamburgers to your cart.`;
            } else {
              reply = `Okay, I've applied the ${actionText} adjustment to your cart.`;
            }
          }
        }
      }

      res.json({ reply, action });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tts", async (req, res) => {
    if (!openai) {
      return res.status(500).json({ error: "OpenAI API key not configured." });
    }
    try {
      const { text } = req.body;
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString()
      });
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

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
