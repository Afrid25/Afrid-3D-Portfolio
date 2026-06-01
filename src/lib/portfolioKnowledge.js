const KNOWLEDGE_BASE_PATH = "/knowledge";

const defaultManifest = {
  files: [
    "profile.json",
    "projects.json",
    "skills.json",
    "experience.json",
    "education.json",
    "achievements.json",
    "certificates.json",
    "faq.json",
    "latestUpdates.json",
  ],
};

const toKey = (fileName) => fileName.replace(/\.json$/i, "");

const fetchJson = async (path) => {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }

  return response.json();
};

export const loadPortfolioKnowledge = async () => {
  const manifest = await fetchJson(`${KNOWLEDGE_BASE_PATH}/manifest.json`).catch(
    () => defaultManifest,
  );

  const entries = await Promise.all(
    manifest.files.map(async (fileName) => {
      const data = await fetchJson(`${KNOWLEDGE_BASE_PATH}/${fileName}`);
      return [toKey(fileName), data];
    }),
  );

  return Object.fromEntries(entries);
};

export const flattenKnowledge = (knowledge) => {
  const projects = knowledge.projects?.items || [];
  const skills = knowledge.skills?.groups || [];
  const experience = knowledge.experience?.items || [];
  const education = knowledge.education?.items || [];
  const achievements = knowledge.achievements?.items || [];
  const certificates = knowledge.certificates?.items || knowledge.achievements?.certificates || [];
  const faq = Array.isArray(knowledge.faq) ? knowledge.faq : knowledge.faq?.items || [];
  const latestUpdates = knowledge.latestUpdates?.items || [];

  return {
    profile: knowledge.profile || {},
    projects,
    featuredProjects: projects.filter((project) => project.featured),
    aiProjects: projects.filter((project) =>
      [...(project.tags || []), ...(project.technologies || [])]
        .join(" ")
        .toLowerCase()
        .includes("ai"),
    ),
    skills,
    skillNames: skills.flatMap((group) => group.skills || []),
    experience,
    education,
    achievements,
    certificates,
    faq,
    latestUpdates: [...latestUpdates].sort((a, b) => String(b.date).localeCompare(String(a.date))),
  };
};

const sourcePriority = {
  project: 110,
  certificate: 100,
  skills: 90,
  experience: 80,
  education: 70,
  achievement: 60,
  profile: 50,
  startup: 45,
  contact: 40,
  faq: 30,
  latestUpdate: 20,
};

const semanticGroups = [
  {
    intent: "profile",
    words: ["who", "intro", "introduce", "about", "describe", "bio", "afrid", "profile"],
  },
  {
    intent: "skills",
    words: ["skill", "technology", "technologies", "stack", "tools", "framework", "know", "use"],
  },
  {
    intent: "project",
    words: ["project", "bookeeds", "built", "work", "demo", "portfolio", "strongest", "best"],
  },
  {
    intent: "certificate",
    words: ["certificate", "certification", "certified", "award", "issuer", "verification"],
  },
  {
    intent: "contact",
    words: ["contact", "email", "whatsapp", "telegram", "hire", "reach", "phone", "message"],
  },
  {
    intent: "education",
    words: ["education", "study", "university", "degree", "student", "cse"],
  },
  {
    intent: "experience",
    words: ["experience", "career", "journey", "internship", "background"],
  },
  {
    intent: "startup",
    words: ["startup", "vision", "mission", "future", "goal", "users", "product"],
  },
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

const unique = (items) => [...new Set(items.filter(Boolean))];

const detectIntents = (query) => {
  const queryTokens = tokenize(query);
  const queryText = queryTokens.join(" ");

  return semanticGroups
    .filter((group) => group.words.some((word) => queryText.includes(word)))
    .map((group) => group.intent);
};

const createRecord = ({ type, title, summary, data, keywords = [] }) => {
  const text = [title, summary, ...keywords].join(" ");

  return {
    type,
    title,
    summary,
    data,
    keywords: unique([...keywords, ...tokenize(text)]),
    priority: sourcePriority[type] || 0,
  };
};

export const createKnowledgeRecords = (knowledge) => {
  const flat = flattenKnowledge(knowledge || {});
  const records = [];

  flat.projects.forEach((project) => {
    records.push(
      createRecord({
        type: "project",
        title: project.name,
        summary: [
          project.category,
          project.status,
          project.problem,
          project.solution,
          project.summary,
          `Technologies: ${(project.technologies || []).join(", ")}`,
          `Tags: ${(project.tags || []).join(", ")}`,
        ].join(" "),
        data: project,
        keywords: ["startup", "product", project.id],
      }),
    );
  });

  flat.certificates.forEach((certificate) => {
    records.push(
      createRecord({
        type: "certificate",
        title: certificate.name || certificate.title,
        summary: [
          certificate.issuer,
          certificate.issuerDetail,
          certificate.date,
          certificate.achievement || certificate.caption,
          certificate.verification,
          certificate.category,
        ].join(" "),
        data: certificate,
      }),
    );
  });

  flat.skills.forEach((group) => {
    records.push(
      createRecord({
        type: "skills",
        title: group.name,
        summary: (group.skills || []).join(", "),
        data: group,
      }),
    );
  });

  flat.experience.forEach((item) => {
    records.push(
      createRecord({
        type: "experience",
        title: `${item.title} at ${item.organization}`,
        summary: [item.date, item.summary, ...(item.highlights || [])].join(" "),
        data: item,
      }),
    );
  });

  flat.education.forEach((item) => {
    records.push(
      createRecord({
        type: "education",
        title: item.degree || item.institution,
        summary: [item.institution, item.location, item.status, ...(item.focus || [])].join(" "),
        data: item,
      }),
    );
  });

  flat.achievements.forEach((item) => {
    records.push(
      createRecord({
        type: "achievement",
        title: item.title,
        summary: [item.date, item.summary].join(" "),
        data: item,
      }),
    );
  });

  if (flat.profile.name) {
    records.push(
      createRecord({
        type: "profile",
        title: flat.profile.name,
        summary: [
          flat.profile.shortName,
          flat.profile.role,
          flat.profile.location,
          flat.profile.summary,
          ...(flat.profile.highlights || []),
        ].join(" "),
        data: flat.profile,
        keywords: ["about", "intro", "introduce", "who"],
      }),
    );

    records.push(
      createRecord({
        type: "contact",
        title: "Official contact information",
        summary: [
          flat.profile.email,
          flat.profile.phone,
          flat.profile.links?.portfolio,
          ...(flat.profile.contactMethods || []).map(
            (method) => `${method.label} ${method.value} ${method.url} ${method.note || ""}`,
          ),
        ].join(" "),
        data: flat.profile,
      }),
    );
  }

  flat.faq.forEach((item) => {
    records.push(
      createRecord({
        type: "faq",
        title: item.question,
        summary: item.answer,
        data: item,
      }),
    );
  });

  flat.latestUpdates.forEach((item) => {
    records.push(
      createRecord({
        type: "latestUpdate",
        title: item.title,
        summary: [item.date, item.summary].join(" "),
        data: item,
      }),
    );
  });

  return records;
};

export const searchKnowledge = (knowledge, query, limit = 8) => {
  const queryTokens = tokenize(query);
  const intents = detectIntents(query);
  const expandedTokens = unique([
    ...queryTokens,
    ...semanticGroups
      .filter((group) => intents.includes(group.intent))
      .flatMap((group) => group.words),
  ]);

  const scored = createKnowledgeRecords(knowledge).map((record) => {
    const tokenHits = expandedTokens.filter((token) =>
      record.keywords.some(
        (keyword) =>
          keyword === token ||
          (token.length >= 4 && keyword.length >= 4 && (keyword.includes(token) || token.includes(keyword))),
      ),
    );
    const phraseBonus =
      record.title?.toLowerCase() && query.toLowerCase().includes(record.title.toLowerCase())
        ? 30
        : 0;
    const intentBonus =
      intents.includes(record.type) ||
      (record.type === "profile" && intents.includes("profile")) ||
      (record.type === "project" && intents.includes("startup"))
        ? 25
        : 0;

    return {
      ...record,
      score: tokenHits.length * 8 + phraseBonus + intentBonus + record.priority / 10,
    };
  });

  return scored
    .filter((record) => record.score > record.priority / 10)
    .sort((a, b) => b.score - a.score || b.priority - a.priority)
    .slice(0, limit);
};

export const findProjectByQuery = (projects, query) => {
  const normalizedQuery = query.toLowerCase();

  return projects.find((project) => {
    const searchable = [
      project.id,
      project.name,
      project.category,
      project.problem,
      project.solution,
      project.summary,
      ...(project.tags || []),
      ...(project.technologies || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery) || normalizedQuery.includes(project.name.toLowerCase());
  });
};

export const buildCompactKnowledge = (knowledge) => {
  const flat = flattenKnowledge(knowledge);

  return {
    profile: flat.profile,
    projects: flat.projects,
    skills: flat.skills,
    experience: flat.experience,
    education: flat.education,
    achievements: flat.achievements,
    certificates: flat.certificates,
    faq: flat.faq,
    latestUpdates: flat.latestUpdates,
  };
};
