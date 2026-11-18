export const profile = {
  name: "Jemkirk L. Utana",
  title: "Full-Stack Web Developer | Graphic Designer",
  tagline: "I build practical web systems across frontend, backend, databases, and deployment.",
  location: "Philippines",
  email: "jemkirku0907@gmail.com",
  github: "jemkirku0907",
  linkedin: "https://www.linkedin.com/in/jemkirk-utana-825892420",
  resume: "/resume/Jemkirk-Utana-CV.pdf"
};

export const services = [
  {
    title: "Full-Stack Web Apps",
    description: "End-to-end production websites and SaaS platforms with Next.js, React, PostgreSQL, and Vercel."
  },
  {
    title: "Dashboards & Auth",
    description: "Multi-role portals, booking flows, OTP verification, and database-backed CRUD admin systems."
  },
  {
    title: "AI & Web3 Prototypes",
    description: "Practical Gemini/Anthropic AI tools, RAG search, and smart-contract integrations on EVM chains."
  },
  {
    title: "UI & Graphic Design",
    description: "Clean responsive interfaces, layouts, and branding backed by TESDA NC III certification."
  }
];

export const projects = [
  {
    name: "Marajo Group",
    description:
      "Real estate company website migrated from PHP/MySQL/XAMPP to Next.js, Supabase, and Vercel, with listings, booking flows, an admin dashboard, and third-party integrations.",
    stack: ["Next.js", "Supabase", "Tailwind CSS", "Vercel"],
    href: "",
    image: "/projects/marajo-group-preview.png",
    status: "Preview Only",
    role: "Full-Stack Web Developer Intern",
    problem: "Legacy PHP/XAMPP setup made deployments slow and property/booking updates manual.",
    highlights: [
      "Migrated frontend and database workflows to Next.js, Supabase, and PostgreSQL",
      "Built responsive property listings, booking flows, and admin dashboard updates",
      "Handled production deployment checks and third-party integrations on Vercel"
    ]
  },
  {
    name: "TAGA-asK AI",
    description:
      "AI-powered verified campus knowledge companion and student assistant for the University of Makati (UMak). Built with Team DoErrorIn, providing instant citation-backed answers grounded strictly in official institutional documents and the UMak Student Handbook, interactive campus map visualization, and Taglish natural language query resolution. Awarded 2nd Runner Up in the hackathon.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel", "RAG / AI", "Vector Search"],
    href: "https://taga-askai.vercel.app",
    image: "/projects/taga-ask-preview.png",
    status: "Hackathon 2nd Runner Up",
    role: "Full-Stack & AI Developer (Team DoErrorIn)",
    problem: "Students struggled to find verified rules, schedules, and locations across scattered UMak documents.",
    highlights: [
      "Grounded AI responses strictly in official UMak Student Handbook citations via RAG",
      "Added Taglish natural-language query support and interactive campus map navigation",
      "Won 2nd Runner Up in the University of Makati hackathon"
    ]
  },
  {
    name: "OrgVault",
    description:
      "Guarded AI treasury platform for student organizations built for the Binance Hackathon on BNB Smart Chain Testnet (Chain ID 97). Supports MockPHP dues collection, Gemini AI receipt extraction, EIP-712 typed attestations, and on-chain category budget and vendor allowlist enforcement via OrgVault.sol.",
    stack: ["Next.js", "TypeScript", "Solidity", "BNB Smart Chain", "Gemini AI", "EIP-712", "Tailwind CSS", "Vercel"],
    href: "https://orgvault-eosin.vercel.app/",
    image: "/projects/orgvault-preview.png",
    status: "Binance Hackathon",
    role: "Full-Stack & Web3 Developer",
    problem: "Student organizations lacked transparent, verifiable tracking for member dues and expense approvals.",
    highlights: [
      "Built MockPHP dues payments and public ledger transparency on BSC Testnet (Chain ID 97)",
      "Integrated Gemini AI receipt extraction paired with backend EIP-712 typed attestations",
      "Enforced category spending caps and allowlisted vendors on-chain via OrgVault.sol"
    ]
  },
  {
    name: "Suri.AI",
    description:
      "AI-powered fact-checking platform built for the InterCICSkwela hackathon. Users submit a news article or claim, then Suri.AI cross-checks it with reliable sources and surfaces connected articles based on the result, showing credible sources for legitimate claims or related debunked misinformation for false or misleading ones.",
    stack: ["Next.js", "TypeScript", "Node.js", "Express", "Anthropic API", "Tailwind CSS"],
    href: "",
    image: "/projects/suri-ai-preview.png",
    status: "Hackathon Preview",
    role: "Full-Stack Developer (InterCICSkwela Hackathon)",
    problem: "Readers needed a fast way to verify claims and see supporting or debunking evidence side by side.",
    highlights: [
      "Built the Next.js submission UI and Node.js/Express verification API pipeline",
      "Integrated Anthropic API claim analysis with cross-referenced article matching",
      "Surfaced credible citations or related debunked misinformation clearly per claim"
    ]
  },
  {
    name: "Queen of Angels (QUACC)",
    description:
      "Multi-role community and childcare system with admin, staff, and guardian dashboards, password hashing, scholarship application flows, file uploads, and OTP verification.",
    stack: ["PHP", "Bootstrap 5", "MySQL", "Session Auth"],
    href: "",
    image: "/projects/quacc-preview.png",
    status: "Private/Not Deployed",
    role: "Full-Stack PHP Developer",
    problem: "Childcare and scholarship tracking relied on manual forms without role-based access or verification.",
    highlights: [
      "Implemented separate dashboards for Admin, Staff, and Guardians with session auth",
      "Added OTP verification, password hashing, document uploads, and scholarship workflows",
      "Designed normalized MySQL schemas for student, staff, and application records"
    ]
  },
  {
    name: "Street Fighter Arcade (.NET / C#)",
    description:
      "Classic 2D retro arcade fighting game developed in Visual Studio using C# and Windows Forms, featuring custom character sprite sheets (Ryu, Rene, Fumiko, Elena, Vincent), real-time combat physics, rage meters, stage selection, sound effects, and CPU AI. Recreated as an interactive playable arcade mini-game right in this portfolio.",
    stack: ["C#", ".NET", "WinForms", "Visual Studio", "Game Dev", "HTML5 Canvas"],
    href: "/game",
    image: "/projects/street-fighter-preview.jpg",
    status: "Playable Mini Game",
    role: "Game & Software Developer",
    problem: "Built as a desktop .NET fighting game and ported to the web so visitors can play directly in-browser.",
    highlights: [
      "Created multi-character sprite animation, hitboxes, rage meters, and CPU AI logic",
      "Recreated the combat engine in HTML5 Canvas as a playable portfolio mini-game",
      "Supports keyboard controls, stage selection, and arcade sound effects"
    ]
  },
  {
    name: "PharSayo",
    description:
      "Medication management PWA for barangay health units with role-based access, AI-assisted medication scanning, adherence tracking, and dashboards.",
    stack: ["PWA", "React", "AI", "Healthcare"],
    href: "",
    image: "/projects/pharsayo-preview.png",
    status: "Preview Only",
    role: "Frontend & Product Developer",
    problem: "Barangay health units needed mobile-friendly tools to track patient medication schedules and adherence.",
    highlights: [
      "Built an installable React PWA tailored for low-bandwidth community health workflows",
      "Added AI-assisted medication scanning and patient adherence dashboards",
      "Designed role-based views for health workers and patients"
    ]
  },
  {
    name: "Assignify",
    description:
      "Assignment management web app for organizing tasks, tracking progress, and keeping academic submissions easier to monitor in one focused workspace.",
    stack: ["Web App", "Task Management", "Dashboard", "Productivity"],
    href: "",
    image: "/projects/assignify-preview.png",
    status: "Preview Only",
    role: "Web Developer",
    problem: "Students juggling multiple deadlines lacked a distraction-free submission tracker.",
    highlights: [
      "Designed a clean status-driven dashboard for upcoming and completed coursework",
      "Organized tasks by priority, subject, and submission deadline"
    ]
  },
  {
    name: "BasuCash",
    description:
      "Cash flow and budget tracking project for managing transactions, monitoring expenses, and keeping simple financial records easier to review.",
    stack: ["Web App", "Finance", "Dashboard", "Tracking"],
    href: "",
    image: "/projects/basucash-preview.png",
    status: "Preview Only",
    role: "Web Developer",
    problem: "Everyday personal budgeting needed a quick, straightforward transaction and balance tracker.",
    highlights: [
      "Built income/expense logging with clear category summaries",
      "Focused on readable financial tables and mobile-friendly entry"
    ]
  },
  {
    name: "NC III Graphic Design Work",
    description:
      "A collection of layout, poster, and branding samples that shows visual design range alongside software development work.",
    stack: ["Graphic Design", "Layout", "Branding"],
    href: "",
    image: "/projects/design-work.svg",
    status: "Gallery",
    role: "Graphic Designer (TESDA NC III)",
    problem: "Showcasing visual hierarchy, typography, and layout fundamentals alongside engineering.",
    highlights: [
      "Poster compositions, brand identity concepts, and layout grids",
      "Applies directly to UI polish and product presentation"
    ]
  }
];

export const skills = [
  { group: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Responsive design"] },
  { group: "Backend", items: ["C# / .NET", "Supabase", "PostgreSQL", "PHP", "MySQL", "REST APIs", "Node.js"] },
  { group: "Tools", items: ["Visual Studio", "VS Code", "Git/GitHub", "Vercel", "Netlify", "Figma", "Adobe Illustrator", "Adobe Photoshop"] },
  { group: "Design", items: ["Graphic design", "NC III certified", "Figma"] }
];

export const certificates = [
  {
    name: "NC III Graphic Design",
    issuer: "TESDA",
    date: "05/2025",
    category: "Certifications",
    image: "/certificates/nc-iii-graphic-design.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/nc-iii-graphic-design.jpg"
  },
  {
    name: "Batang Techno: Building the Minds of Tomorrow's Innovators Hackathon - Participant",
    issuer: "Batangas State University - The National Engineering University",
    date: "03/2026",
    category: "Hackathons",
    image: "/certificates/batang-techno-hackathon.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/batang-techno-hackathon.pdf"
  },
  {
    name: "InfoTechnOlympics 2025 Web Design Category - Participant",
    issuer: "University of Makati - College of Computing and Information Sciences",
    date: "10/2025",
    category: "Hackathons",
    image: "/certificates/infotechnolympics-2025.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/infotechnolympics-2025.pdf"
  },
  {
    name: "Math and Physics Quiz Bee 2025 - Participant",
    issuer: "University of Makati - Department of Math and Physics",
    date: "10/2025",
    category: "Hackathons",
    image: "/certificates/ai-tech-cover-participation.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/ai-tech-cover-participation.pdf"
  },
  {
    name: "AI Tech 2.0 - Participant",
    issuer: "University of Makati - College of Computing and Information Sciences",
    date: "04/2026",
    category: "Seminars & Webinars",
    image: "/certificates/ai-tech-2-participant.jpg",
    verifyUrl: "",
    fileUrl: "/certificates/ai-tech-2-participant.pdf"
  },
  {
    name: "Data Privacy Awareness (Cybersecurity Awareness Month 2026) - Participant",
    issuer: "Department of Information and Communications Technology (DICT) – Caraga Region",
    date: "10/2026",
    category: "Seminars & Webinars",
    image: "/certificates/dict-data-privacy-awareness-2026.png",
    verifyUrl: "",
    fileUrl: "/certificates/dict-data-privacy-awareness-2026.pdf"
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
    year: "2026 - Present",
    title: "Officium Inc. / Marajo Group",
    body: "Currently working on real-world web projects for Officium Inc. and Marajo Group across Next.js, Supabase, Vercel, booking flows, dashboards, and integrations."
  },
  {
    year: "Nov 2026",
    title: "OrgVault — Binance Hackathon",
    body: "Built OrgVault, a guarded AI treasury for student organizations on BNB Smart Chain Testnet (Chain ID 97) combining Gemini AI receipt verification, EIP-712 attestations, and smart contract budget enforcement."
  },
  {
    year: "Oct 2026",
    title: "TAGA-asK AI — Hackathon 2nd Runner Up",
    body: "Built TAGA-asK AI with Team DoErrorIn, an authentic AI knowledge companion and interactive campus map for the University of Makati community, earning 2nd Runner Up honors in the hackathon."
  },
  {
    year: "May 2025",
    title: "NC III Graphic Design",
    body: "Developed layout, visual design, and presentation skills that support product and interface work."
  }
];

export const assistantKnowledge = `
Portfolio owner: ${profile.name}
Title: ${profile.title}
Summary: ${profile.tagline}
Projects:
${projects.map((project) => `- ${project.name}: ${project.description} Tech: ${project.stack.join(", ")}. Status: ${project.status}.`).join("\n")}
Skills:
${skills.map((skill) => `- ${skill.group}: ${skill.items.join(", ")}`).join("\n")}
Certificates:
${certificates.map((certificate) => `- ${certificate.name}, ${certificate.issuer}, ${certificate.date}`).join("\n")}
`;