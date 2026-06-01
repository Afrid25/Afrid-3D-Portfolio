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
  "certificates.json",
  "faq.json",
  "latestUpdates.json",
];

const priorityOrder = [
  "projects",
  "certificates",
  "skills",
  "experience",
  "education",
  "achievements",
  "profile",
  "startup vision",
  "contact information",
  "faq",
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "can",
  "does",
  "for",
  "from",
  "has",
  "have",
  "he",
  "his",
  "how",
  "i",
  "in",
  "is",
  "me",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "what",
  "with",
  "you",
]);

const tokenize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));

const semanticGroups = {
  projects: ["project", "bookeeds", "built", "work", "demo", "strongest", "best", "startup", "product"],
  certificates: ["certificate", "certification", "certified", "award", "issuer", "verification"],
  skills: ["skill", "technology", "technologies", "stack", "tools", "framework", "know", "use"],
  experience: ["experience", "career", "journey", "internship", "background"],
  education: ["education", "study", "university", "degree", "student", "cse"],
  profile: ["who", "intro", "introduce", "about", "describe", "bio", "afrid", "profile"],
  "contact information": ["contact", "email", "whatsapp", "telegram", "hire", "reach", "phone", "message"],
  "startup vision": ["startup", "vision", "mission", "future", "goal", "users", "product"],
};

const includesIntent = (queryTokens, source) =>
  (semanticGroups[source] || []).some((word) => queryTokens.includes(word));

const toSearchText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(toSearchText).join(" ");
  if (typeof value === "object") return Object.values(value).map(toSearchText).join(" ");
  return String(value);
};

const normalizeKnowledge = (knowledge = {}) => ({
  ...knowledge,
  faq: Array.isArray(knowledge.faq) ? { items: knowledge.faq } : knowledge.faq,
});

const createRetrievalRecords = (knowledge = {}) => {
  const normalized = normalizeKnowledge(knowledge);
  const records = [];
  const pushItems = (source, items = [], titleKey = "title") => {
    items.forEach((item) => {
      records.push({
        source,
        title: item[titleKey] || item.name || item.question || source,
        data: item,
        text: toSearchText(item),
        priority: priorityOrder.indexOf(source) === -1 ? 99 : priorityOrder.indexOf(source),
      });
    });
  };

  pushItems("projects", normalized.projects?.items, "name");
  pushItems("certificates", normalized.certificates?.items || normalized.achievements?.certificates, "name");
  pushItems("skills", normalized.skills?.groups, "name");
  pushItems("experience", normalized.experience?.items);
  pushItems("education", normalized.education?.items, "degree");
  pushItems("achievements", normalized.achievements?.items);
  pushItems("faq", normalized.faq?.items, "question");
  pushItems("latest updates", normalized.latestUpdates?.items);

  if (normalized.profile) {
    records.push({
      source: "profile",
      title: normalized.profile.name || "Profile",
      data: normalized.profile,
      text: toSearchText(normalized.profile),
      priority: priorityOrder.indexOf("profile"),
    });
    records.push({
      source: "contact information",
      title: "Official contact information",
      data: normalized.profile,
      text: toSearchText({
        email: normalized.profile.email,
        phone: normalized.profile.phone,
        methods: normalized.profile.contactMethods,
        links: normalized.profile.links,
      }),
      priority: priorityOrder.indexOf("contact information"),
    });
  }

  return records;
};

const retrieveKnowledge = (knowledge, message, limit = 10) => {
  const queryTokens = tokenize(message);
  const expandedTokens = [
    ...queryTokens,
    ...Object.entries(semanticGroups)
      .filter(([source]) => includesIntent(queryTokens, source))
      .flatMap(([, words]) => words),
  ];

  return createRetrievalRecords(knowledge)
    .map((record) => {
      const recordTokens = tokenize(`${record.title} ${record.text}`);
      const hits = expandedTokens.filter((token) =>
        recordTokens.some(
          (recordToken) =>
            recordToken === token ||
            (token.length >= 4 &&
              recordToken.length >= 4 &&
              (recordToken.includes(token) || token.includes(recordToken))),
        ),
      );
      const intentBonus = includesIntent(queryTokens, record.source) ? 12 : 0;
      const score = hits.length * 6 + intentBonus + (20 - record.priority);
      return { ...record, score };
    })
    .filter((record) => record.score > 20 - record.priority)
    .sort((a, b) => b.score - a.score || a.priority - b.priority)
    .slice(0, limit);
};

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

const createPrompt = ({ message, mode, history, knowledge, retrieved }) => `
You are the official AI assistant for Afrid's portfolio.

You are not a generic chatbot. You are Afrid's Portfolio Intelligence System.

Retrieval-first rules:
- Answer only from the retrieved portfolio knowledge and supplied portfolio knowledge.
- Knowledge priority order: ${priorityOrder.join(" > ")} > AI-generated reasoning.
- Never invent projects, skills, certificates, awards, experience, education, achievements, or private details.
- If verified information does not exist, say exactly: "I couldn't find verified information about that in Afrid's portfolio knowledge base."
- For skills, only mention technologies explicitly stored in the knowledge base.
- For projects, cover purpose, problem solved, technologies, key features, and impact when available.
- For certificates, include certificate name, issuing organization, date, achievement, and verification information when available.
- For contact questions, prioritize official email, WhatsApp, Telegram, and portfolio links.
- For recruiter-style questions, keep the answer concise, technical, and impact-focused.
- End with one short relevant follow-up question.
- Return plain text only. Do not use markdown tables.

Current mode: ${mode}
Current question: ${message}

Recent conversation:
${JSON.stringify(history, null, 2)}

Portfolio knowledge:
${JSON.stringify(knowledge, null, 2)}

Retrieved knowledge, ranked:
${JSON.stringify(retrieved, null, 2)}
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
    const retrieved = retrieveKnowledge(knowledge, message);

    if (!retrieved.length) {
      return response.status(200).json({
        answer: "I couldn't find verified information about that in Afrid's portfolio knowledge base.",
        actions: buildActions(message, knowledge),
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const geminiResponse = await ai.models.generateContent({
      model: MODEL,
      contents: createPrompt({ message, mode, history, knowledge, retrieved }),
      config: {
        temperature: 0.2,
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
