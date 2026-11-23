

export const projects = [
  {
    name: "Bazar Dor",
    image: "/projects/bazar-dor.webp",
    description: "Compare daily prices of essential goods in Bangladesh. Browse categories, sort prices and sign in to see market-by-market comparisons.",
    tags: ["Next.js", "React", "MongoDB", "Better Auth"],
    source_code_link: "https://github.com/Afrid25/Bazar-Dor",
    live_link: "https://bazar-dor-goem.vercel.app/"
  },
  {
    name: "Bookeeds",
    description: "A student learning platform for organizing courses into chapters, tracking study sessions and getting personalized mentorship.",
    tags: ["PHP", "JavaScript", "HTML", "CSS"],
    image: "/projects/bookeeds.webp",
    source_code_link: "https://github.com/Afrid25/BOOK-OF-DEEDS-update-",
    live_link: "https://bookofdeeds.great-site.net/"
  },
  {
    name: "ImpactHub",
    source_code_link: "https://github.com/Afrid25/impacthub-client-",
    image: "/projects/impacthub.webp",
    description: "Discover local volunteer events, join an initiative, or organize a community event of your own.",
    tags: ["Next.js", "TypeScript", "React"],
    live_link: "https://impacthub-frontend-gold.vercel.app/"
  }
].map(project => ({ ...project, tags: project.tags.map(name => ({ name })) }));
