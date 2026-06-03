import { findProjectByQuery, flattenKnowledge, searchKnowledge } from "./portfolioKnowledge.js";

const contactKeywords = [
  "contact",
  "email",
  "hire",
  "reach",
  "message",
  "whatsapp",
  "telegram",
  "quick chat",
  "chat",
  "phone",
  "call",
  "connect",
  "talk",
];
const projectKeywords = ["project", "work", "portfolio", "build", "built", "demo", "showcase"];
const skillKeywords = ["skill", "skills", "technology", "technologies", "stack", "tools", "use", "tech", "framework"];
const educationKeywords = ["education", "study", "university", "degree", "student"];
const experienceKeywords = ["experience", "journey", "background", "internship", "career"];
const achievementKeywords = ["achievement", "achievements", "certificate", "certificates", "certification", "award", "awards", "accomplishment"];
const profileKeywords = ["who", "about", "introduce", "describe", "profile", "bio"];
const unsupportedPersonalKeywords = ["favorite", "favourite", "age", "birthday", "religion", "family", "relationship"];
const resumeKeywords = ["resume", "cv", "download"];
const greetingKeywords = ["hi", "hello", "hey", "good morning", "good evening"];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasAny = (query, keywords) =>
  keywords.some((keyword) => {
    const escaped = escapeRegExp(keyword);
    const pattern = keyword.includes(" ") ? escaped : `\\b${escaped}\\b`;
    return new RegExp(pattern, "i").test(query);
  });

const faqStopWords = new Set([
  "about",
  "afrid",
  "and",
  "are",
  "can",
  "does",
  "for",
  "has",
  "have",
  "how",
  "is",
  "me",
  "the",
  "what",
  "with",
  "you",
  "your",
]);

const formatList = (items = [], limit = 6) => items.slice(0, limit).join(", ");

const createAction = (label, type, value) => ({ label, type, value });

const getContactMethods = (profile = {}) => {
  const methods = profile.contactMethods || [];
  const findMethod = (label) =>
    methods.find((method) => method.label?.toLowerCase() === label.toLowerCase());

  return {
    whatsapp: findMethod("WhatsApp") || {
      label: "WhatsApp",
      value: "01849667752",
      url: profile.links?.whatsapp || "https://wa.me/8801849667752",
    },
    telegram: findMethod("Telegram") || {
      label: "Telegram",
      value: "01849667752",
      url: profile.links?.telegram || "tg://resolve?phone=8801849667752",
    },
    email: findMethod("Email") || {
      label: "Email",
      value: profile.email || "25afridfoisal00@gmail.com",
      url: `mailto:${profile.email || "25afridfoisal00@gmail.com"}`,
    },
  };
};

const createContactActions = (profile = {}) => {
  const methods = getContactMethods(profile);

  return [
    createAction("WhatsApp", "link", methods.whatsapp.url),
    createAction("Telegram", "link", methods.telegram.url),
    createAction("Email Afrid", "link", methods.email.url),
    createAction("Download Resume", "download", profile.resume?.url),
  ].filter((action) => action.value);
};

const summarizeProject = (project) => {
  if (!project) {
    return "";
  }

  return `${project.name} is ${project.category?.toLowerCase() || "a portfolio project"}. It addresses ${project.problem} The solution: ${project.solution}`;
};

const createProjectActions = (project) => {
  const actions = [createAction("View Projects", "scroll", project?.sectionId || "projects")];

  if (project?.links?.live) {
    actions.push(createAction("Open Live Demo", "link", project.links.live));
  }

  if (project?.links?.github) {
    actions.push(createAction("GitHub", "link", project.links.github));
  }

  return actions;
};

const contactText = (profile = {}) => {
  const methods = getContactMethods(profile);

  return `For a quick chat, connect with Afrid on WhatsApp at ${methods.whatsapp.value} or Telegram using the same number. For detailed messages, email ${methods.email.value}. ${profile.availability || "He is open to relevant opportunities."}`;
};

const appendFollowUp = (text, followUp) => `${text}\n\n${followUp}`;

const missingInfoReply = (profile = {}) => ({
  text: "I couldn't find verified information about that in Afrid's portfolio knowledge base. For a direct answer, contact Afrid via WhatsApp, Telegram, or email.",
  actions: createContactActions(profile),
});

export const createLocalAssistantReply = ({ query, knowledge, mode = "general" }) => {
  const flat = flattenKnowledge(knowledge || {});
  const retrieved = searchKnowledge(knowledge || {}, query, 8);
  const normalizedQuery = query.trim().toLowerCase();
  const bookeedsMode = mode === "bookeeds" || normalizedQuery.includes("bookeeds");
  const matchedProject = bookeedsMode
    ? flat.projects.find((project) => project.id === "bookeeds")
    : findProjectByQuery(flat.projects, normalizedQuery);

  if (hasAny(normalizedQuery, greetingKeywords)) {
    return {
      text: `Hi, I'm Afrid's portfolio assistant. I can help with his projects, skills, experience, CV, or contact details. For quick chat, I can connect you through WhatsApp, Telegram, or email.`,
      actions: [
        createAction("Quick Chat", "prompt", "Quick chat with Afrid"),
        createAction("View Projects", "scroll", "projects"),
        createAction("Download Resume", "download", flat.profile.resume?.url),
      ],
    };
  }

  if (bookeedsMode && matchedProject) {
    return {
      text: `${summarizeProject(matchedProject)} It is Afrid's strongest product direction because it connects a real student problem with a focused, practical productivity workflow.`,
      actions: [
        createAction("View Bookeeds", "scroll", "projects"),
        createAction("Download Resume", "download", flat.profile.resume?.url),
        ...createContactActions(flat.profile).slice(0, 3),
      ],
    };
  }

  if (hasAny(normalizedQuery, profileKeywords)) {
    const highlights = (flat.profile.highlights || []).slice(0, 3).join(" ");

    return {
      text: appendFollowUp(
        `${flat.profile.name || "Afrid"} is ${flat.profile.role || "a developer"}. ${
          flat.profile.summary || highlights
        } ${highlights}`,
        "Would you like to see Afrid's strongest project next?",
      ),
      actions: [
        createAction("View Projects", "scroll", "projects"),
        createAction("Download Resume", "download", flat.profile.resume?.url),
      ],
    };
  }

  if (hasAny(normalizedQuery, contactKeywords)) {
    return {
      text: appendFollowUp(contactText(flat.profile), "Would you like to download Afrid's resume too?"),
      actions: createContactActions(flat.profile),
    };
  }

  if (hasAny(normalizedQuery, resumeKeywords)) {
    return {
      text: `You can download Afrid's CV/resume here. For a faster conversation after reviewing it, use WhatsApp, Telegram, or email.`,
      actions: [
        createAction("Download Resume", "download", flat.profile.resume?.url),
        ...createContactActions(flat.profile).slice(0, 3),
      ],
    };
  }

  if (normalizedQuery.includes("best project") || normalizedQuery.includes("strongest project")) {
    const project = flat.featuredProjects[0] || flat.projects[0];

    return {
      text: appendFollowUp(
        `${summarizeProject(project)} For recruiters, it shows Afrid's ability to think beyond UI and shape a product around a clear user problem.`,
        "Would you like to learn about the technologies used in Bookeeds?",
      ),
      actions: createProjectActions(project),
    };
  }

  if (normalizedQuery.includes("ai project") || normalizedQuery.includes("automation")) {
    const projects = flat.aiProjects.length ? flat.aiProjects : flat.projects;

    return {
      text: `Afrid's AI-focused work includes ${projects
        .map((project) => project.name)
        .join(", ")}. ${projects[0] ? summarizeProject(projects[0]) : ""}`,
      actions: [createAction("View AI Projects", "scroll", "projects")],
    };
  }

  if (matchedProject || hasAny(normalizedQuery, projectKeywords)) {
    const project = matchedProject || flat.featuredProjects[0] || flat.projects[0];

    return {
      text: project
        ? appendFollowUp(
            `${summarizeProject(project)} Technologies used: ${formatList(project.technologies || [])}. Key features and impact are represented through its focus on ${project.summary}`,
            "Would you like to see more projects that demonstrate Afrid's skills?",
          )
        : "Afrid's portfolio includes practical frontend, product, and AI automation work. The projects section has the strongest examples.",
      actions: createProjectActions(project),
    };
  }

  if (hasAny(normalizedQuery, achievementKeywords) && retrieved.some((record) => record.type === "certificate")) {
    const certificates = retrieved.filter((record) => record.type === "certificate").slice(0, 4);

    return {
      text: appendFollowUp(
        certificates
          .map(({ data }) => {
            const name = data.name || data.title;
            return `${name} - Issuer: ${data.issuer}. Date: ${data.date}. Achievement: ${
              data.achievement || data.caption
            } Verification: ${data.verification || "Certificate file is available in the portfolio."}`;
          })
          .join("\n"),
        "Would you like a summary of Afrid's technical certifications?",
      ),
      actions: [],
    };
  }

  if (hasAny(normalizedQuery, skillKeywords)) {
    const groupedSkills = flat.skills
      .map((group) => `${group.name}: ${formatList(group.skills || [], 8)}`)
      .join(". ");

    return {
      text: appendFollowUp(
        `Afrid's core stack is ${formatList(flat.skillNames, 10)}. ${groupedSkills}`,
        "Would you like to see projects that demonstrate those skills?",
      ),
      actions: [createAction("View Skills", "scroll", "skills")],
    };
  }

  if (hasAny(normalizedQuery, experienceKeywords)) {
    return {
      text: flat.experience
        .map((item) => `${item.title} at ${item.organization}: ${item.summary}`)
        .join(" "),
      actions: [createAction("View Journey", "scroll", "journey")],
    };
  }

  if (hasAny(normalizedQuery, educationKeywords)) {
    return {
      text: flat.education
        .map(
          (item) =>
            `${item.degree || item.institution} is ${item.status?.toLowerCase() || "ongoing"}. Focus areas include ${formatList(item.focus || [])}.`,
        )
        .join(" "),
      actions: [],
    };
  }

  if (hasAny(normalizedQuery, achievementKeywords)) {
    return {
      text: flat.achievements.length
        ? flat.achievements.map((item) => `${item.title}: ${item.summary}`).join(" ")
        : "Afrid's current achievements are project-focused, especially building and deploying practical web products.",
      actions: [],
    };
  }

  const faqHit = (flat.faq || [])
    .map((item) => {
      const questionText = (item.question || item.intent || "").toLowerCase();
      const keywordText = Array.isArray(item.keywords) ? item.keywords.join(" ").toLowerCase() : "";
      const intentText = (item.intent || "").toLowerCase();
      return { raw: item, questionText, keywordText, intentText };
    })
    .find(({ raw, questionText, keywordText, intentText }) => {
      const combinedText = `${questionText} ${keywordText} ${intentText}`.replace(/[?]/g, "");
      const faqWords = combinedText
        .split(/\s+/)
        .filter((word) => word.length > 2 && !faqStopWords.has(word));
      const queryWords = normalizedQuery.split(/\s+/).filter((word) => !faqStopWords.has(word));
      const overlap = faqWords.filter((word) => queryWords.includes(word));

      return overlap.length >= 2 || (overlap.length >= 1 && faqWords.length <= 4);
    })?.raw;

  if (faqHit) {
    return {
      text: faqHit.answer,
      actions: hasAny(faqHit.answer.toLowerCase(), contactKeywords)
        ? createContactActions(flat.profile)
        : [createAction("Contact Afrid", "prompt", "Quick chat with Afrid")],
    };
  }

  if (hasAny(normalizedQuery, unsupportedPersonalKeywords)) {
    return missingInfoReply(flat.profile);
  }

  if (!retrieved.length) {
    return missingInfoReply(flat.profile);
  }

  const latest = flat.latestUpdates[0];

  return {
    text: `I can help with Afrid's projects, skills, experience, education, achievements, CV, and contact details. ${
      latest ? `Latest update: ${latest.title} - ${latest.summary}` : ""
    } Try asking about Bookeeds, AI projects, or quick chat with Afrid.`,
    actions: [
      createAction("Ask About Bookeeds", "prompt", "What problem does Bookeeds solve?"),
      createAction("View Projects", "scroll", "projects"),
      createAction("Quick Chat", "prompt", "Quick chat with Afrid"),
    ],
  };
};
