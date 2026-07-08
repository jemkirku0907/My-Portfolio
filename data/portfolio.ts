export const profile = {
  name: "Jemkirk L. Utana",
  title: "Web Developer | Full-Stack Next.js & PHP",
  tagline: "I build practical web systems across frontend, backend, databases, and deployment.",
  location: "Philippines",
  email: "jemkirku0907@gmail.com",
  github: "jemkirku0907",
  linkedin: "https://www.linkedin.com/in/jemkirk-utana-825892420",
  resume: "#"
};

export const projects = [
  {
    name: "Marajo Group",
    description:
      "Real estate company website migrated from PHP/MySQL/XAMPP to Next.js, Supabase, and Vercel, with listings, booking flows, an admin dashboard, and third-party integrations.",
    stack: ["Next.js", "Supabase", "Tailwind CSS", "Vercel"],
    href: "https://marajogroup.vercel.app",
    image: "/projects/marajo-group-preview.png",
    status: "Live Site"
  },
  {
    name: "PharSayo",
    description:
      "Medication management PWA for barangay health units with role-based access, AI-assisted medication scanning, adherence tracking, and dashboards.",
    stack: ["PWA", "React", "AI", "Healthcare"],
    href: "https://pharsayo.netlify.app",
    image: "/projects/pharsayo-preview.png",
    status: "Live Site"
  },
  {
    name: "Queen of Angels (QUACC)",
    description:
      "Multi-role community and childcare system with admin, staff, and guardian dashboards, password hashing, scholarship application flows, file uploads, and OTP verification.",
    stack: ["PHP", "Bootstrap 5", "MySQL", "Session Auth"],
    href: "",
    image: "/projects/quacc-preview.png",
    status: "Private/Not Deployed"
  },
  {
    name: "NC III Graphic Design Work",
    description:
      "A collection of layout, poster, and branding samples that shows visual design range alongside software development work.",
    stack: ["Graphic Design", "Layout", "Branding"],
    href: "#design",
    image: "/projects/design-work.svg",
    status: "Gallery"
  }
];

export const skills = [
  { group: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Responsive design"] },
  { group: "Backend", items: ["Supabase", "PostgreSQL", "PHP", "MySQL", "REST APIs"] },
  { group: "Tools", items: ["Git/GitHub", "Vercel", "Netlify"] },
  { group: "Design", items: ["Graphic design", "NC III certified", "Figma"] }
];

export const certificates = [
  {
    name: "NC III Graphic Design",
    issuer: "TESDA",
    date: "05/2025",
    image: "/certificates/nc-iii-graphic-design.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/nc-iii-graphic-design.pdf"
  },
  {
    name: "Batang Techno: Building the Minds of Tomorrow's Innovators Hackathon - Participant",
    issuer: "Batangas State University - The National Engineering University",
    date: "03/2026",
    image: "/certificates/batang-techno-hackathon.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/batang-techno-hackathon.pdf"
  },
  {
    name: "InfoTechnOlympics 2025 Web Design Category - Participant",
    issuer: "University of Makati - College of Computing and Information Sciences",
    date: "10/2025",
    image: "/certificates/infotechnolympics-2025.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/infotechnolympics-2025.pdf"
  },
  {
    name: "Math and Physics Quiz Bee 2025 - Participant",
    issuer: "University of Makati - Department of Math and Physics",
    date: "10/2025",
    image: "/certificates/ai-tech-cover-participation.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/ai-tech-cover-participation.pdf"
  },
  {
    name: "AI Tech 2.0 - Participant",
    issuer: "University of Makati - College of Computing and Information Sciences",
    date: "04/2026",
    image: "/certificates/ai-tech-2-participant.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/ai-tech-2-participant.pdf"
  }
];

export const designSamples = [
  {
    title: "Poster Layout Sample",
    category: "Poster",
    image: "/design/poster-sample.svg"
  },
  {
    title: "Branding Sample",
    category: "Branding",
    image: "/design/branding-sample.svg"
  }
];

export const timeline = [
  {
    year: "Academic",
    title: "PHP and MySQL foundations",
    body: "Built academic systems and database labs, including Queen of Angels / QUACC with multi-role workflows."
  },
  {
    year: "Certification",
    title: "NC III Graphic Design",
    body: "Developed layout, visual design, and presentation skills that support product and interface work."
  },
  {
    year: "Current",
    title: "Officium / Marajo Group work",
    body: "Working on real-world web projects across Next.js, Supabase, Vercel, booking flows, dashboards, and integrations."
  },
  {
    year: "Current",
    title: "PharSayo",
    body: "Building health-tech PWA features around medication management, role-based access, and AI-assisted scanning."
  }
];

export const assistantKnowledge = `
Portfolio owner: ${profile.name}
Title: ${profile.title}
Summary: ${profile.tagline}
Projects:
${projects.map((project) => `- ${project.name}: ${project.description} Tech: ${project.stack.join(", ")}.`).join("\n")}
Skills:
${skills.map((skill) => `- ${skill.group}: ${skill.items.join(", ")}`).join("\n")}
Certificates:
${certificates.map((certificate) => `- ${certificate.name}, ${certificate.issuer}, ${certificate.date}`).join("\n")}
`;
