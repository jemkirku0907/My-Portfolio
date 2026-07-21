import { certificates, profile, projects, skills, timeline } from "@/data/portfolio";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9.+#\s]/g, " ");

const includesAny = (question: string, terms: string[]) => terms.some((term) => question.includes(term));

const formatList = (items: string[]) => items.join(", ");

export function answerPortfolioQuestion(prompt: string) {
  const question = normalize(prompt);

  if (!question.trim()) {
    return "Ask me about Jemkirk's projects, skills, certificates, experience, or contact details.";
  }

  const project = projects.find((item) => {
    const searchable = normalize(`${item.name} ${item.description} ${item.stack.join(" ")}`);
    return searchable.split(/\s+/).some((word) => word.length > 2 && question.includes(word)) || question.includes(normalize(item.name));
  });

  if (project) {
    return `${project.name}: ${project.description} Tech used: ${formatList(project.stack)}. This project is shown as a preview only for privacy.`;
  }

  if (includesAny(question, ["project", "portfolio", "work", "built", "system", "app", "website"])) {
    return `Jemkirk's featured projects are ${projects
      .filter((item) => item.name !== "NC III Graphic Design Work")
      .map((item) => item.name)
      .join(", ")}. The cards are preview-only for privacy, but they show the role, stack, and project scope.`;
  }

  if (includesAny(question, ["skill", "stack", "technology", "technologies", "tech", "language", "framework"])) {
    return skills.map((group) => `${group.group}: ${formatList(group.items)}`).join(" | ");
  }

  if (includesAny(question, ["certificate", "certification", "cert", "nc iii", "tesda", "hackathon"])) {
    return `Certificates include ${certificates.map((item) => `${item.name} (${item.issuer}, ${item.date})`).join("; ")}.`;
  }

  if (includesAny(question, ["experience", "timeline", "officium", "marajo", "job", "intern"])) {
    return timeline.map((item) => `${item.year} - ${item.title}: ${item.body}`).join(" | ");
  }

  if (includesAny(question, ["contact", "email", "linkedin", "github", "reach", "message"])) {
    return `You can contact Jemkirk at ${profile.email}. GitHub: ${profile.github}. LinkedIn is linked in the hero section.`;
  }

  if (includesAny(question, ["who", "about", "jemkirk", "jeo", "utana", "location", "philippines"])) {
    return `${profile.name} is a ${profile.title} based in the ${profile.location}. ${profile.tagline}`;
  }

  return "I can answer questions about Jemkirk's projects, skills, certificates, experience, and contact details. Try asking about Suri.AI, Marajo Group, PharSayo, QUACC, NC III, or his tech stack.";
}
