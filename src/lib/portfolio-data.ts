export type SkillGroup = {
  id?: string;
  title: string;
  items: string[];
  orderNo?: number;
  isVisible?: boolean;
};

export type ExperienceItem = {
  id?: string;
  company: string;
  period: string;
  role: string;
  focus: string;
  bullets: string[];
  orderNo?: number;
  isVisible?: boolean;
};

export type ProjectCategory = "OTA" | "CMS" | "AI" | "Ecommerce";

export type Project = {
  id?: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  liveUrl?: string;
  featured?: boolean;
  tech: string[];
  images?: string[];
  highlights: string[];
  visualLabel: string;
  orderNo?: number;
  isVisible?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
};

export type HeroMetric = {
  id?: string;
  label: string;
  value: string;
  href?: string;
  orderNo?: number;
  isVisible?: boolean;
};

export type FlagshipPoint = {
  id?: string;
  title: string;
  description: string;
  orderNo?: number;
  isVisible?: boolean;
};

export type ContactLink = {
  id?: string;
  label: string;
  value: string;
  href: string;
  orderNo?: number;
  isVisible?: boolean;
};

export type AdditionalProject = {
  id?: string;
  text: string;
  orderNo?: number;
  isVisible?: boolean;
};

export type PortfolioData = {
  navItems: NavItem[];
  heroMetrics: HeroMetric[];
  skillGroups: SkillGroup[];
  experiences: ExperienceItem[];
  projectFilters: Array<ProjectCategory | "All">;
  projects: Project[];
  additionalProjects: AdditionalProject[];
  flagshipPoints: FlagshipPoint[];
  contactLinks: ContactLink[];
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const heroMetrics = [
  { label: "Flagship domain", value: "AI travel tech" },
  { label: "Core systems", value: "OTA, CMS, CRM" },
  { label: "Delivery lens", value: "Coordination + QA + system design" },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Product & Coordination",
    items: [
      "Project Coordination",
      "Workflow Design",
      "Cross-team alignment",
      "Requirement translation",
      "Delivery planning",
    ],
  },
  {
    title: "Technical & Development",
    items: [
      "React",
      "Next.js",
      "Supabase",
      "PHP",
      "API Testing",
      "QA Testing",
    ],
  },
  {
    title: "Systems & Tools",
    items: [
      "CMS / CRM",
      "System Design",
      "AI Features",
      "OCR workflows",
      "Eligibility systems",
      "Operational dashboards",
    ],
  },
];

export const experiences: ExperienceItem[] = [
  {
    company: "Ryoko Ltd.",
    period: "Current role",
    role: "Technical Project Coordinator",
    focus: "Leading coordination across OTA, CRM, CMS, and AI-enabled travel operations.",
    bullets: [
      "Coordinated an advanced OTA platform for visa and tour products with dynamic workflows, document collection, status tracking, and payment approval flows.",
      "Helped shape a dynamic visa system with multi-condition logic covering family, profession, sponsorship, and eligibility scenarios.",
      "Supported AI-driven product features including OCR-assisted processing, travel assistant experiences, and eligibility decision workflows.",
      "Worked across CRM and CMS systems to connect business operations, developer execution, and QA validation.",
    ],
  },
  {
    company: "Steadfast Courier",
    period: "Previous experience",
    role: "Operations & Technical Support Exposure",
    focus: "Developed execution discipline around workflow handling, coordination, and service reliability.",
    bullets: [
      "Supported process-oriented work that strengthened operational thinking and quality control.",
      "Built practical experience in structured coordination, issue follow-up, and delivery awareness.",
    ],
  },
];

export const projectFilters: Array<ProjectCategory | "All"> = [
  "All",
  "OTA",
  "CMS",
  "AI",
  "Ecommerce",
];

export const projects: Project[] = [
  {
    title: "Travel OTA + CRM System",
    category: "OTA",
    featured: true,
    liveUrl: "#flagship-system",
    summary:
      "A high-complexity travel operations platform for visa and tour processing, combining customer application flows, finance approvals, and CRM visibility in one system.",
    tech: ["Next.js", "TypeScript", "Supabase", "Workflow Logic", "CRM"],
    images: [
      "/projects/travelotahome.png",
      "/projects/travelOTAvisadetails.png",
      "/projects/travelotavisaapply.png",
      "/projects/travelOTAdocupload.png",
      "/projects/travelotaapplicationdetails.png"
    ],
    visualLabel: "Visa workflow + CRM dashboard",
    highlights: [
      "Dynamic visa application system with destination-based and visa-type-based logic.",
      "Multi-condition workflows for family, profession, sponsorship, and supporting document rules.",
      "Document upload, coupon support, payment approval, result document delivery, and status tracking.",
      "Admin CRM for visa control, visibility management, financial approvals, and process monitoring.",
    ],
  },
  {
    title: "CreativeFlow",
    category: "CMS",
    liveUrl: "https://digital-marketing-website-wine.vercel.app/",
    summary:
      "A CMS-driven digital agency site with dynamic company content, admin-managed queries, appointments, and fully configurable site settings.",
    tech: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    images: [
      "/projects/creativeflowhome.png"
    ],
    visualLabel: "Dynamic agency CMS",
    highlights: [
      "Admin-controlled step-based query system for guided lead capture.",
      "Dynamic appointment booking with configurable date and time availability.",
      "Projects, branding assets, metadata, footer details, and site settings managed from CMS.",
      "Designed with a distinct modern visual identity and dark mode support.",
    ],
  },
  {
    title: "Curve&Fit E-commerce",
    category: "Ecommerce",
    liveUrl: "https://curve-fit.vercel.app/",
    summary:
      "A modern lingerie ecommerce experience with full authentication, guest checkout, product variants, coupon logic, and post-order tracking.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Resend"],
    images: [
      "/projects/curveandfitstorefront.png"
    ],
    visualLabel: "E-commerce Store",
    highlights: [
      "Secure auth flows plus guest checkout for low-friction purchasing.",
      "Advanced filtering, category-driven browsing, quick add-to-cart, and size/color variant handling.",
      "Coupon-enabled checkout and profile-based order status tracking.",
      "Email delivery workflows integrated for transactional touchpoints.",
    ],
  },
  {
    title: "Curve&Fit Admin CMS",
    category: "CMS",
    liveUrl: "https://curven-fit-admin.vercel.app/",
    summary:
      "A complete ecommerce control center for products, orders, revenue visibility, banners, coupons, and business settings.",
    tech: ["React", "Supabase", "Analytics", "Admin CMS"],
    images: [
      "/projects/curvenfitadmindashboard.png",
      "/projects/curvenfitcoupon.png",
    ],
    visualLabel: "Commerce admin suite",
    highlights: [
      "Product lifecycle control including create, edit, hide, unhide, and best-feature curation.",
      "Order management with delivery status updates and invoice download support.",
      "Revenue reporting focused on paid deliveries and operational finance summaries.",
      "Dynamic category, coupon, banner, size guide, and site settings management.",
    ],
  },
  {
    title: "Ryoko Career Site + CMS",
    category: "CMS",
    liveUrl: "https://career.ryoko.com.bd/",
    summary:
      "A modern hiring platform with public job discovery and an admin-side HR CMS for applicant review, status updates, and email automation.",
    tech: ["Next.js", "Supabase", "Tailwind CSS", "Resend"],
    visualLabel: "Hiring platform",
    highlights: [
      "Dynamic job listing experience with modern drawer-based detail views and streamlined application flows.",
      "Future-role applications, contact details, and mapped office information.",
      "Admin CMS for jobs, sector filtering, applicant review, CV preview, archive states, and email templates.",
      "Recruitment coordination improved through status controls and direct interview or rejection workflows.",
    ],
  },
  {
    title: "Environnest Engineering Website + Admin",
    category: "CMS",
    liveUrl: "https://environestltd.com/",
    summary:
      "A PHP-based company site and CMS for a research and consultancy business, with dynamic landing content, projects, and query handling.",
    tech: ["PHP", "MySQL", "Custom CMS"],
    visualLabel: "Business website CMS",
    highlights: [
      "Business profile website with dynamic pages, project content, and inquiry handling.",
      "Admin panel for landing content, projects, contact submissions, partner data, and user roles.",
      "Built for practical site ownership without developer dependency for routine changes.",
      "Combined content flexibility with business-facing control tools.",
    ],
  },
];

export const additionalProjects = [
  "Resume Builder for structured profile generation and export workflows.",
  "Vehicle Detection AI system focused on applied computer vision use cases.",
  "Eligibility checker tools for guided decision logic and operational data collection.",
  "Internal data collection, shopping list, and printable budget utility systems.",
];

export const flagshipPoints = [
  {
    title: "What it solves",
    description:
      "The OTA centralizes fragmented visa and tour operations into one guided customer journey, reducing manual clarification, document confusion, and disconnected admin follow-up.",
  },
  {
    title: "Workflow complexity",
    description:
      "The system handles branching logic across visa types, traveler conditions, sponsor states, family context, payment approvals, document validation, and post-submission tracking.",
  },
  {
    title: "My role",
    description:
      "I worked at the intersection of technical coordination, system design thinking, QA, and business-process alignment to ensure the platform stayed usable, scalable, and operationally realistic.",
  },
];

export const contactLinks = [
  {
    label: "Email",
    value: "mnym71@gmail.com",
    href: "mailto:mnym71@gmail.com",
  },
  {
    label: "Phone",
    value: "+880 1844944411",
    href: "tel:+8801844944411",
  },
  {
    label: "GitHub",
    value: "github.com/mehedi-nym",
    href: "https://github.com/mehedi-nym/",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/mehedi-nym",
    href: "https://www.linkedin.com/in/mehedi-nym/",
  },
];

export const staticPortfolioData: PortfolioData = {
  navItems,
  heroMetrics,
  skillGroups,
  experiences,
  projectFilters,
  projects,
  additionalProjects: additionalProjects.map((text) => ({ text })),
  flagshipPoints,
  contactLinks,
};
