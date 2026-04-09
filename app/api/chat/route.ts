import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI API key not configured. Please add it to your secrets." },
      { status: 500 }
    );
  }

  try {
    const { message, cartSummary } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Picnic grocery AI assistant. Be brief, friendly, and helpful.
The user's cart currently has: ${cartSummary}.
If the user asks to change the cart to be vegan, cheaper, eco-friendly, premium/chef's choice, fill minimum order, remove duplicates, or add hamburgers, call the adjust_cart tool.
Keep responses under 2 sentences.`,
        },
        { role: "user", content: message },
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
                  enum: ["vegan", "money-saver", "eco", "chef", "min-order", "duplicate", "add-hamburger"],
                },
              },
              required: ["adjustmentType"],
            },
          },
        },
      ],
    });

    const responseMessage = completion.choices[0].message;
    let action: string | null = null;
    let reply = responseMessage.content;

    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const fn = (toolCall as any).function;
      if (fn?.name === "adjust_cart") {
        const args = JSON.parse(fn.arguments);
        action = args.adjustmentType;
        if (!reply) {
          reply = `Okay, I've applied the ${action} adjustment to your cart.`;
        }
      }
    }

    return NextResponse.json({ reply, action });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
