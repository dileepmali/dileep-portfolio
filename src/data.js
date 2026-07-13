// =============================================================
//  ALL CONTENT IN ONE PLACE — edit here to change the site
// =============================================================

export const NAV_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "about", label: "About", to: "/about" },
  { id: "services", label: "Services", to: "/services" },
  { id: "resume", label: "Resume", to: "/resume" },
  { id: "projects", label: "Projects", to: "/projects" },
  { id: "blogs", label: "Blogs", to: "/blogs" },
  { id: "contact", label: "Contact", to: "/contact" },
];

export const HERO = {
  greeting: "Hi, I'm David Williamson",
  prefix: "I'm a freelance",
  typed: ["Web Developer.", "UI/UX Designer.", "App Developer.", "Photographer."],
};

export const ABOUT = {
  intro:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  details: [
    { label: "Date of birth", value: "06 june 1989" },
    { label: "Spoken Langages", value: "English - French - German" },
    { label: "Nationality", value: "USA" },
    { label: "Interest", value: "Music, Reading, journey" },
  ],
  skills: [
    { name: "Android", exp: "2 Year Experience", icon: "android" },
    { name: "Angular", exp: "1 Year Experience", icon: "angular" },
    { name: "Bootstrap", exp: "3 Year Experience", icon: "bootstrap" },
    { name: "Vue", exp: "2 Year Experience", icon: "vue" },
    { name: "React", exp: "8 Months Experience", icon: "react" },
    { name: "Mongodb", exp: "3 Months Experience", icon: "mongodb" },
    { name: "Laravel", exp: "1 Year Experience", icon: "laravel" },
    { name: "Node.js", exp: "10 Months Experience", icon: "node" },
  ],
};

export const SERVICES = [
  {
    icon: "layers",
    color: "#f97316",
    title: "Awesome Support",
    desc: "Some quick example text to build on the card title and make up the bulk of the card's content platform.",
  },
  {
    icon: "trending",
    color: "#3b82f6",
    title: "Dynamic Growth",
    desc: "Credibly brand standards compliant users without extensible services. Anibh euismod tincidunt.",
  },
  {
    icon: "check",
    color: "#22c55e",
    title: "Branding Identity",
    desc: "Separated they live in Bookmarksgrove right at the coast of the Semantics, and large.",
  },
];

export const EDUCATION = [
  {
    title: "MSc IT Master Degree",
    period: "2010 - 2012",
    place: "Harvard University, Cambridge, MA, United States",
    desc: "Harvard University is an educational institution that offers graduate, professional, and research programs in the fields of and public health.",
  },
  {
    title: "BCA college complete course",
    period: "2007 - 2010",
    place: "Stanford University, California, United States",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada tellus lorem, et condimentum neque commodo.",
  },
  {
    title: "High / Higher secondary school",
    period: "1999 - 2007",
    place: "St. Xavier's High School",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada tellus lorem, et condimentum neque commodo.",
  },
];

export const EXPERIENCE = [
  {
    title: "ABC themes - Web Design IT Company",
    period: "2020 - 2021",
    place: "A-000 Chambers Street, Suite z-701 New York, NY 10007, United States",
    desc: "Delivered quality code by applying the best development practices.",
    tags: ["ANGULAR", "REACT", "PYTHON"],
  },
  {
    title: "DEF Themes - Creative full stack web design & development",
    period: "2016 - 2019",
    place: "B-101 Market Street, San Francisco, CA, United States",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada tellus lorem.",
    tags: ["VUE", "NODE", "MONGODB"],
  },
  {
    title: "GHI Themes - Web & App IT Company",
    period: "2013 - 2015",
    place: "C-202 Park Avenue, Boston, MA, United States",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada tellus lorem.",
    tags: ["PHP", "LARAVEL", "JQUERY"],
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "I feel confident imposing change on myself. It's a lot more fun progressing than looking back. That's why scelerisque pretium dolor, sit amet vehicula erat pelleque need throw curve balls.",
    name: "LARRY J. AKINS",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 4.5,
  },
  {
    quote:
      "Working with this team was an absolute pleasure. They delivered beyond expectations, with clean code and pixel-perfect design that elevated our entire brand presence online.",
    name: "SARAH M. COLLINS",
    avatar: "https://i.pravatar.cc/120?img=45",
    rating: 5,
  },
  {
    quote:
      "Professional, fast and incredibly creative. The final product exceeded what we imagined and our users love the new experience. Highly recommended for any serious project.",
    name: "MICHAEL B. REED",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
  },
];

// Home one-pager projects (old small-card layout, with tags)
export const PROJECTS = [
  {
    title: "Auto Drive Project",
    sub: "Mannat-Themes",
    icon: "angular",
    category: "Angular",
    tags: ["ANGULAR", "REACT", "JQUERY"],
  },
  {
    title: "Creative Dashboard",
    sub: "Mannat-Themes",
    icon: "bootstrap",
    category: "Bootstrap",
    tags: ["BOOTSTRAP", "CSS", "JAVASCRIPT"],
  },
  {
    title: "Data Platform",
    sub: "Mannat-Themes",
    icon: "mongodb",
    category: "Mongodb",
    tags: ["MONGODB", "JAVASCRIPT"],
  },
  {
    title: "Portfolio Builder",
    sub: "Mannat-Themes",
    icon: "angular",
    category: "Angular",
    tags: ["ANGULAR", "TYPESCRIPT"],
  },
  {
    title: "Landing Page Kit",
    sub: "Mannat-Themes",
    icon: "bootstrap",
    category: "Bootstrap",
    tags: ["BOOTSTRAP", "SASS"],
  },
  {
    title: "Realtime Chat App",
    sub: "Mannat-Themes",
    icon: "mongodb",
    category: "Mongodb",
    tags: ["MONGODB", "NODE", "SOCKET"],
  },
];

// Dedicated /projects page (big colored-logo cards)
export const PROJECTS_PAGE = [
  { title: "Farmer Project", sub: "Mannat-Themes", icon: "angular", category: "Angular" },
  { title: "ID Scan Project", sub: "Mannat-Themes", icon: "bootstrap", category: "Bootstrap" },
  { title: "Auto Drive Project", sub: "Mannat-Themes", icon: "mongodb", category: "Mongodb" },
  { title: "Portfolio Builder", sub: "Mannat-Themes", icon: "vue", category: "Angular" },
  { title: "Realtime Chat App", sub: "Mannat-Themes", icon: "react", category: "Mongodb" },
  { title: "Landing Page Kit", sub: "Mannat-Themes", icon: "bootstrap", category: "Bootstrap" },
];

export const PROJECT_FILTERS = ["All", "Angular", "Mongodb", "Bootstrap"];

export const BLOGS = [
  {
    title: "Change the world with small things",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
    date: "12 Feb 2026",
    category: "Design",
  },
  {
    title: "With a clean, minimal and professional look",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop",
    date: "08 Feb 2026",
    category: "Development",
  },
  {
    title: "With a clean, minimal and professional look",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop",
    date: "01 Feb 2026",
    category: "Branding",
  },
];

export const CONTACT = {
  phone: "+1 234 567 89",
  phoneNote: "9:00am to 7:00pm",
  email: "example@example.com",
  emailNote: "Monday to Saturday",
};

export const FOOTER = {
  desc: "In an ideal world this text wouldn't exist, a client would acknowledge the importance of having web copy before the design starts.",
  columns: [
    { title: "Company", links: ["Home", "About", "Services"] },
    { title: "Information", links: ["Resume", "Client Say", "Projects"] },
    { title: "More info", links: ["Blogs", "Contact", "Terms & condition"] },
  ],
  copyright: "© 2026 Selfown. Created with ❤ by Mannatthemes",
};

export const SOCIALS = ["facebook", "twitter", "github", "instagram"];
