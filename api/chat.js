import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MODEL = "gemini-2.5-flash";
const visitors = new Map();

const knowledgeFiles = [
  "profile.json",
  "projects.json",
  "skills.json",
  "experience.json",
  "education.json",
  "achievements.json",
  "faq.json",
  "latestUpdates.json",
];

const getClientId = (request) =>
  request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  request.socket?.remoteAddress ||
  "unknown";

const isRateLimited = (request) => {
  const clientId = getClientId(request);
  const now = Date.now();
  const recent = (visitors.get(clientId) || []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    visitors.set(clientId, recent);
    return true;
  }

  visitors.set(clientId, [...recent, now]);
  return false;
};

const getBaseUrl = (request) => {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const protocol = request.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};

const loadKnowledge = async (request, fallbackKnowledge) => {
  if (fallbackKnowledge) {
    return fallbackKnowledge;
  }

  const baseUrl = getBaseUrl(request);
  const entries = await Promise.all(
    knowledgeFiles.map(async (file) => {
      const response = await fetch(`${baseUrl}/knowledge/${file}`);

      if (!response.ok) {
        throw new Error(`Unable to load ${file}`);
      }

      return [file.replace(".json", ""), await response.json()];
    }),
  );

  return Object.fromEntries(entries);
};

const buildActions = (message = "", knowledge = {}) => {
  const normalized = message.toLowerCase();
  const profile = knowledge.profile || {};

  if (
    normalized.includes("contact") ||
    normalized.includes("hire") ||
    normalized.includes("email") ||
    normalized.includes("whatsapp") ||
    normalized.includes("telegram") ||
    normalized.includes("quick chat") ||
    normalized.includes("phone")
  ) {
    return [
      { label: "WhatsApp", type: "link", value: profile.links?.whatsapp || "https://wa.me/8801849667752" },
      { label: "Telegram", type: "link", value: profile.links?.telegram || "https://t.me/+8801849667752" },
      { label: "Email Afrid", type: "link", value: `mailto:${profile.email || "25afridfoisal00@gmail.com"}` },
      { label: "Download Resume", type: "download", value: profile.resume?.url },
    ].filter((action) => action.value);
  }

  if (normalized.includes("bookeeds") || normalized.includes("project")) {
    return [
      { label: "View Projects", type: "scroll", value: "projects" },
      { label: "Download Resume", type: "download", value: profile.resume?.url },
    ];
  }

  if (normalized.includes("skill") || normalized.includes("technology") || normalized.includes("stack")) {
    return [{ label: "View Skills", type: "scroll", value: "skills" }];
  }

  return [
    { label: "View Projects", type: "scroll", value: "projects" },
    { label: "Quick Chat", type: "prompt", value: "Quick chat with Afrid" },
  ];
};

const createPrompt = ({ message, mode, history, knowledge }) => `
You are Afrid's professional portfolio assistant.

Rules:
- Answer concisely and intelligently using only the supplied portfolio knowledge.
- Prioritize latest updates first.
- Be recruiter-friendly and practical.
- For quick-chat/contact questions, clearly mention WhatsApp 01849667752, Telegram with the same number, and email 25afridfoisal00@gmail.com when present in the supplied knowledge.
- If information is missing, say what is known and suggest contacting Afrid.
- Never invent private details.
- Return plain text only. Do not use markdown tables.

Current mode: ${mode}
Current question: ${message}

Recent conversation:
${JSON.stringify(history, null, 2)}

Portfolio knowledge:
${JSON.stringify(knowledge, null, 2)}
`;

const getGeminiText = (geminiResponse) => {
  if (typeof geminiResponse.text === "string") {
    return geminiResponse.text.trim();
  }

  if (typeof geminiResponse.text === "function") {
    return geminiResponse.text().trim();
  }

  return "";
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (isRateLimited(request)) {
    return response.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  const { message, mode = "general", history = [], knowledge: fallbackKnowledge } = request.body || {};

  if (!message || typeof message !== "string" || message.length > 800) {
    return response.status(400).json({ error: "A valid message is required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({ error: "Gemini API key is not configured." });
  }

  try {
    const knowledge = await loadKnowledge(request, fallbackKnowledge);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const geminiResponse = await ai.models.generateContent({
      model: MODEL,
      contents: createPrompt({ message, mode, history, knowledge }),
      config: {
        temperature: 0.45,
        maxOutputTokens: 420,
      },
    });
    const answer = getGeminiText(geminiResponse);

    return response.status(200).json({
      answer:
        answer ||
        "I can help with Afrid's projects, skills, experience, education, achievements, CV, and contact details.",
      actions: buildActions(message, knowledge),
    });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return response.status(500).json({
      error: "Portfolio assistant failed to respond.",
      detail: "The Gemini request could not be completed.",
    });
  }
}
