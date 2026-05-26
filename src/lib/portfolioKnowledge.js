const KNOWLEDGE_BASE_PATH = "/knowledge";

const defaultManifest = {
  files: [
    "profile.json",
    "projects.json",
    "skills.json",
    "experience.json",
    "education.json",
    "achievements.json",
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
  const certificates = knowledge.achievements?.certificates || [];
  const faq = knowledge.faq?.items || [];
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
