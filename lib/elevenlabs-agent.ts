
const DEFAULT_VOICE_ID = "g6xIsTj2HwM6VR4iXFCw";

const clientToolDefinitions = [
  {
    tool_config: {
      type: "client",
      name: "search_products",
      description: "Searches the in-app product catalog and returns matching products with IDs and prices.",
      expects_response: true,
      execution_mode: "immediate",
      response_timeout_secs: 20,
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The user's search term for products.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    tool_config: {
      type: "client",
      name: "add_product_to_cart",
      description: "Adds a product to the cart using the exact productId returned by search_products.",
      expects_response: true,
      execution_mode: "immediate",
      response_timeout_secs: 20,
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "The exact productId to add to the cart.",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    tool_config: {
      type: "client",
      name: "remove_product_from_cart",
      description: "Removes the first matching item from the cart using a productId.",
      expects_response: true,
      execution_mode: "immediate",
      response_timeout_secs: 20,
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "The exact productId to remove from the cart.",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    tool_config: {
      type: "client",
      name: "schedule_delivery",
      description: "Schedules or reschedules the active grocery delivery slot.",
      expects_response: true,
      execution_mode: "immediate",
      response_timeout_secs: 20,
      parameters: {
        type: "object",
        properties: {
          dateLabel: {
            type: "string",
            description: "A human-readable delivery date label like Tomorrow or Friday.",
          },
          windowStart: {
            type: "string",
            description: "Delivery window start time in HH:MM format.",
          },
          windowEnd: {
            type: "string",
            description: "Delivery window end time in HH:MM format.",
          },
        },
        required: ["dateLabel", "windowStart", "windowEnd"],
      },
    },
  },
] as const;

const buildAgentDefinition = (toolIds: string[]) => ({
  name: "Picnic Grocery Assistant",
  conversation_config: {
    tts: {
          voice_id: DEFAULT_VOICE_ID,
        },
    agent: {
      first_message: "Hi! I'm your Picnic assistant. How can I help with your cart today?",
      language: "en",
      prompt: {
        prompt: [
          "You are the Picnic grocery AI assistant.",
          "Be brief, friendly, and helpful. Keep responses under 2 sentences.",
          "Use search_products when the user wants to browse or find products.",
          "Use add_product_to_cart and remove_product_from_cart for cart changes.",
          "Use schedule_delivery when the user wants to set or change delivery timing.",
          "Use the exact productId returned by search_products when adding or removing products.",
          "After any tool call, confirm the result in natural language.",
        ].join(" "),
        tool_ids: toolIds,
      },
    },
  },
});

let cachedAgentId: string | null = null;
let cachedToolIds: string[] | null = null;

async function createClientTool(apiKey: string, toolDefinition: (typeof clientToolDefinitions)[number]) {
  const response = await fetch("https://api.elevenlabs.io/v1/convai/tools", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toolDefinition),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`Failed to create ElevenLabs tool (${response.status}): ${bodyText}`);
  }

  const body = JSON.parse(bodyText) as { id: string };
  return body.id;
}

async function ensureClientToolIds(apiKey: string) {
  if (cachedToolIds) {
    return cachedToolIds;
  }

  cachedToolIds = await Promise.all(clientToolDefinitions.map((toolDefinition) => createClientTool(apiKey, toolDefinition)));
  return cachedToolIds;
}

export async function getElevenLabsAgentId({
  apiKey,
  configuredAgentId,
}: {
  apiKey: string;
  configuredAgentId?: string;
}) {
  if (configuredAgentId) {
    return configuredAgentId;
  }

  if (cachedAgentId) {
    return cachedAgentId;
  }

  const toolIds = await ensureClientToolIds(apiKey);

  const response = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAgentDefinition(toolIds)),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`Failed to create ElevenLabs agent (${response.status}): ${bodyText}`);
  }

  const body = JSON.parse(bodyText) as { agent_id: string };
  cachedAgentId = body.agent_id;
  return cachedAgentId;
}
