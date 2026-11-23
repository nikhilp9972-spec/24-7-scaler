export const STORAGE_KEYS = {
  kb: "scaler247.kb",
  bookings: "scaler247.bookings",
  leads: "scaler247.leads",
  thread: "scaler247.thread",
};

export function defaultKnowledge() {
  return {
    institute: "Scaler",
    brandName: "24/7 Scaler",
    assistantName: "Asha",
    city: "Electronic City, Bengaluru (SST Campus) · Live Online Across India",
    counselorHours: "Monday to Saturday, 10:00–19:00 IST (Admissions desk active 24/7)",
    formats:
      "4-year residential campus in Electronic City, Bengaluru for Scaler School of Technology (SST), and live interactive online cohorts across India for working-professional programs.",
    scholarshipNote:
      "Merit scholarships up to full tuition for SST are awarded based on the NSET entrance exam. For Scaler Academy, a scholarship up to ₹25,000 is available via an MCQ assessment. Third-party coupons like 'CS500' found on blogs are unauthorized affiliate promos and not official Scaler offers.",
    emiNote:
      "Working-professional programs start with ₹20,000 upfront, with flexible no-cost EMI options starting around ₹9,791/month. SST education loans are supported by premier lending partners.",
    lastVerifiedDate: "21 November 2026",
    hostelDetails: {
      triple: 123000,
      double: 156000,
      largeDouble: 180000,
      fourYearEstimate: "Hostel and mess are estimated at ~₹5.49 lakh over 4 years.",
    },
    gapsToConfirm: [
      "Current Software Development / Academy fee and batch dates (historical benchmark ₹3.59L).",
      "SST AI & Business program name, fee split, and scholarship rules.",
      "Batch start dates and schedules for every program (to be pulled live from admissions).",
      "Refund terms and exact banking EMI partners.",
      "SST admission fee current amount (₹50,000 in one guide vs ₹75,000 in another).",
    ],
    hotScore: 70,
    qualifiedScore: 45,
    counselors: [
      {
        id: "aakash",
        name: "Aakash Sharma",
        focus: "Scaler School of Technology (SST) & Undergraduate Admissions",
        track: "sst",
        days: [1, 2, 3, 4, 5, 6],
      },
      {
        id: "meera",
        name: "Meera Iyer",
        focus: "Data Science, Machine Learning & Agentic AI",
        track: "data",
        days: [1, 2, 3, 4, 5],
      },
      {
        id: "arjun",
        name: "Arjun Shah",
        focus: "Scaler Academy (Software Development) & DevOps",
        track: "engineering",
        days: [1, 2, 3, 4, 6],
      },
    ],
    courses: [
      {
        id: "sst-cs",
        name: "Scaler School of Technology (SST) — CS & AI",
        shortName: "SST (CS & AI)",
        aliases: [
          "sst",
          "scaler school of technology",
          "cs & ai",
          "computer science and ai",
          "sst cs",
          "btech",
          "undergraduate",
          "ug",
          "bachelor",
          "nset",
          "school of technology",
        ],
        audience: "School students (Class 12) & Parents",
        audienceType: "student_parent",
        duration: "4 years (full-time residential)",
        weeks: 208,
        price: 2299000,
        feeRange: "₹22.99 Lakh to ₹26.5 Lakh (4-year total)",
        feeBreakdown:
          "Breakdown guide: About ₹22.99 Lakh (Tuition ~₹17 Lakh, admission fee ₹50,000 [or ₹75,000 per alternate guide], hostel and mess ~₹5.49 Lakh). Other guides cite ₹23 to ₹24.5 Lakh. Range with parallel degree fees is ₹24 to ₹26.5 Lakh.",
        emiTerms:
          "Education loan assistance with leading banking partners. EMI and flexible payment options available.",
        mode: "Fully residential on-campus in Electronic City, Bengaluru",
        nextBatch: "2027-08-01",
        seats: 150,
        eligibility:
          "High school graduates (Class 12) with Mathematics. Admission strictly through the National Scaler Entrance Test (NSET).",
        degree:
          "Students earn a parallel recognized degree from a partner institution (IIT Madras BS or BITS Pilani BSc). Fees paid directly to the partner institution are in addition to SST fees.",
        level:
          "For high school graduates / Class 12 students aiming for world-class computer science and AI education.",
        outcomes:
          "Direct tech placements in top product companies and global startups, 1-year mandatory paid industry internships, system building mastery.",
        syllabus: [
          "Core Computer Science, Discrete Math & Algorithmic Foundations",
          "Advanced Data Structures & Algorithms in Java / C++",
          "Modern Full Stack Web & Cloud Architectures",
          "Artificial Intelligence, Machine Learning & Deep Learning",
          "Low-Level & High-Level Distributed System Design",
          "1-Year Mandatory Paid Industry Internship",
          "Parallel Degree Coursework (IIT Madras BS / BITS Pilani BSc)",
        ],
        track: "sst",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Admission fee reported as ₹50,000 in one source and ₹75,000 in another. Partner degree fees are paid directly to BITS Pilani or IIT Madras.",
      },
      {
        id: "sst-biz",
        name: "Scaler School of Technology (SST) — AI & Business",
        shortName: "SST (AI & Business)",
        aliases: [
          "ai & business",
          "ai business",
          "sst business",
          "ai and business",
          "sst ai & business",
        ],
        audience: "School students (Class 12) & Parents",
        audienceType: "student_parent",
        duration: "4 years (full-time residential)",
        weeks: 208,
        price: 2299000,
        feeRange: "₹22.99 Lakh to ₹26.5 Lakh (4-year total)",
        feeBreakdown:
          "Tuition ~₹17 Lakh, Admission fee ₹50,000–₹75,000, Hostel & Mess ~₹5.49 Lakh. Partner degree fees separate.",
        emiTerms:
          "Comprehensive education loan support from leading partner banks.",
        mode: "Fully residential on-campus in Electronic City, Bengaluru",
        nextBatch: "2027-08-01",
        seats: 60,
        eligibility:
          "Class 12 graduates with Mathematics. Admission via NSET exam.",
        degree:
          "Parallel recognized undergraduate degree with partner institution (IIT Madras / BITS Pilani).",
        level:
          "For students aiming for AI product management, venture leadership, and tech consulting.",
        outcomes:
          "Leadership roles in AI tech products, business analytics, founder's office, and high-growth ventures.",
        syllabus: [
          "Foundations of Programming, Statistics & Business Analytics",
          "Applied Machine Learning & Generative AI for Enterprise",
          "Product Management, User Experience & Tech Strategy",
          "Financial Modeling, Tech Economics & Venture Incubation",
          "Enterprise Automation & Cloud Business Systems",
          "1-Year Industry Co-op / Venture Lab Internship",
          "Parallel Degree Partner Curriculum",
        ],
        track: "sst",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Program name, fee split, and scholarship rules to be confirmed with Scaler admissions counsellor.",
      },
      {
        id: "dsml",
        name: "Scaler Data Science & Machine Learning (DSML)",
        shortName: "Data Science & ML",
        aliases: [
          "data science",
          "machine learning",
          "dsml",
          "ds",
          "ml",
          "data science and ml",
          "scaler data science",
        ],
        audience: "Working professionals & Tech graduates",
        audienceType: "working",
        duration: "12 months",
        weeks: 52,
        price: 399000,
        feeRange: "₹3,99,000 (all-inclusive program fee)",
        feeBreakdown:
          "₹3,99,000 total. Payment: From ₹9,791/month EMI with ₹20,000 upfront; no-cost EMI options listed.",
        emiTerms:
          "From ₹9,791/month with ₹20,000 upfront; no-cost EMI available across partner banks.",
        mode: "Live online interactive classes (evenings/weekends) with 1:1 mentorship",
        nextBatch: "2026-12-15",
        seats: 40,
        eligibility:
          "College degree or working professional with basic programming or mathematical interest.",
        level:
          "Engineers, analysts, and tech professionals transitioning to Data Scientist or ML Engineer roles.",
        outcomes:
          "Production ML model deployment, portfolio with 5+ real-world industry capstones, and dedicated career placement support.",
        syllabus: [
          "Python for Data Science, NumPy, Pandas & Vectorized Computation",
          "Applied Mathematics: Probability, Statistics & Linear Algebra",
          "Advanced SQL, Data Modeling & Business Analytics",
          "Classical Machine Learning (Regression, Classification, Clustering, Ensembles)",
          "Deep Learning with PyTorch & Computer Vision",
          "Natural Language Processing (NLP) & Foundation Models",
          "MLOps: Model Serving, Docker, FastAPI & CI/CD Pipelines",
          "End-to-End Industry Capstones & 1:1 Mock Interviews",
        ],
        track: "data",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Confirm exact upcoming batch date and specific banking EMI partners with admissions counsellor.",
      },
      {
        id: "agentic-ai",
        name: "Scaler AI & ML with Agentic AI",
        shortName: "Agentic AI & ML",
        aliases: [
          "agentic ai",
          "agentic",
          "ai & ml with agentic ai",
          "generative ai",
          "genai",
          "llm",
          "ai agent",
          "ai agents",
        ],
        audience: "Working professionals, Tech Leads & AI Engineers",
        audienceType: "working",
        duration: "9 to 12 months (Duration not officially confirmed in public list)",
        weeks: 44,
        price: 399000,
        feeRange: "₹3,99,000 (separate program from DSML)",
        feeBreakdown:
          "₹3,99,000 total. A separate program from DSML despite the same fee. EMI options available.",
        emiTerms:
          "EMI options available. Payment details and monthly plans to be confirmed with counsellor.",
        mode: "Live online sessions + hands-on autonomous agent lab builds",
        nextBatch: "2026-12-18",
        seats: 30,
        eligibility:
          "Software engineers, data professionals, or tech leads with Python knowledge wanting to build autonomous AI systems.",
        level:
          "Experienced developers and engineers seeking mastery in autonomous agents, multi-agent frameworks, and RAG.",
        outcomes:
          "Autonomous agent systems in production, enterprise RAG workflows, fine-tuned open-source LLMs, and GenAI architect roles.",
        syllabus: [
          "LLM Architectures, Prompt Engineering & Evaluation Benchmarks",
          "Embeddings, Vector Databases (Pinecone/Chroma/Milvus) & Advanced RAG",
          "Autonomous Agents with LangChain, LangGraph & LlamaIndex",
          "Multi-Agent Orchestration, Tool Calling & Function Execution",
          "Memory Architectures, Reflection Loops & Agent Self-Correction",
          "Open-Source Model Fine-Tuning (LoRA, QLoRA) on HuggingFace",
          "Guardrails, Safety, Cost Optimization & Production Deployment",
          "Real-World Agentic AI Capstone & Architecture Defense",
        ],
        track: "data",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Duration and payment structure are not confirmed on public pages; a separate program from DSML despite matching fee.",
      },
      {
        id: "devops",
        name: "Scaler DevOps & Cloud Computing",
        shortName: "DevOps & Cloud",
        aliases: [
          "devops",
          "cloud",
          "cloud computing",
          "sre",
          "infrastructure",
          "kubernetes",
          "docker",
          "scaler devops",
        ],
        audience: "Working professionals (Developers, Sysadmins, QA, IT)",
        audienceType: "working",
        duration: "14 to 18 months",
        weeks: 64,
        price: 399000,
        feeRange: "₹3,99,000",
        feeBreakdown:
          "₹3,99,000 total fee. Payment: ₹20,000 upfront; flexible EMI plans available.",
        emiTerms:
          "₹20,000 upfront payment, with low monthly EMI options available.",
        mode: "Live online classes + interactive cloud infrastructure sandboxes",
        nextBatch: "2026-12-20",
        seats: 35,
        eligibility:
          "Working professionals with basic IT, Linux, or programming knowledge aiming for DevOps/SRE roles.",
        level:
          "Software engineers, system administrators, and IT engineers moving into Cloud Infrastructure & DevOps.",
        outcomes:
          "Deploying and orchestrating enterprise architectures on AWS/GCP, automated CI/CD pipelines, and SRE incident response.",
        syllabus: [
          "Linux Systems Internals, Networking Protocols & Shell Scripting",
          "Git Version Control, Branching Models & GitHub Actions",
          "Containerization with Docker & Multi-Stage Builds",
          "Kubernetes (K8s) Cluster Orchestration, Ingress & Helm",
          "Infrastructure as Code (IaC) with Terraform & Ansible",
          "Cloud Engineering & Multi-Cloud Services on AWS & GCP",
          "CI/CD Pipeline Design with Jenkins, ArgoCD & GitOps",
          "Observability & Monitoring with Prometheus, Grafana & ELK Stack",
          "Site Reliability Engineering (SRE), Chaos Engineering & Live Drills",
        ],
        track: "engineering",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Batch start dates and schedules are pulled live via admissions.",
      },
      {
        id: "academy",
        name: "Scaler Academy — Software Development / Full Stack",
        shortName: "Scaler Academy",
        aliases: [
          "scaler academy",
          "academy",
          "software development",
          "software engineering",
          "full stack",
          "fullstack",
          "dsa",
          "system design",
          "swe",
          "interviewbit",
        ],
        audience: "Working professionals & college graduates",
        audienceType: "working",
        duration: "12 months live online (9 to 11.5 months by track)",
        weeks: 48,
        price: 359000,
        feeRange: "₹3.59 Lakh (historical benchmark; verify current fee with admissions)",
        feeBreakdown:
          "Current fee not found publicly; an older InterviewBit post listed ₹3.59 Lakh. EMI available; older source mentions a ₹25,000 scholarship via an MCQ test.",
        emiTerms:
          "EMI options available. Up to ₹25,000 scholarship available via an MCQ entrance assessment.",
        mode: "Live online interactive classes + 1:1 mentorship from top tech leaders",
        nextBatch: "2026-12-10",
        seats: 50,
        eligibility:
          "Engineers or college students with basic knowledge of at least one programming language (Java, C++, Python, or JS).",
        level:
          "Developers aiming for SDE-1 / SDE-2 roles at top product companies (FAANG, tier-1 startups).",
        outcomes:
          "Mastery in DSA, Low-Level & High-Level System Design, production Full Stack applications, and 1:1 mock interview clearance.",
        syllabus: [
          "Programming Constructs & Algorithmic Problem Solving",
          "Data Structures & Algorithms: Trees, Graphs, DP & Advanced Topics",
          "Low-Level System Design (LLD): OOP Principles & Design Patterns",
          "High-Level System Design (HLD): Microservices, Caching, Sharding & Scaling",
          "Full-Stack Web Engineering: React, Node.js, Spring Boot & Databases",
          "Production Engineering, Testing, Git & Deployment",
          "1:1 Mock Interviews & Tech Career Mentorship",
        ],
        track: "engineering",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Current official fee not published; historical benchmark is ₹3.59 Lakh. Exact upcoming batch dates and fees must be confirmed with Scaler admissions counsellor.",
      },
      {
        id: "neovarsity",
        name: "Scaler Neovarsity — Master's Degree in CS & AI",
        shortName: "Neovarsity Master's",
        aliases: [
          "neovarsity",
          "masters",
          "master's",
          "ms",
          "master degree",
          "msc",
          "woolf",
          "add on degree",
        ],
        audience: "Scaler learners & Working professionals seeking an accredited Master's degree",
        audienceType: "working",
        duration: "18 months",
        weeks: 72,
        price: 150000,
        feeRange: "About ₹1.5 Lakh add-on (estimated third-party figure, unverified)",
        feeBreakdown:
          "An add-on degree path upgrading a Scaler program to a Master's in CS and AI, with electives from any Scaler program at no extra cost. Estimated third-party figure is ~₹1.5 Lakh for 18 months (treat as unverified benchmark).",
        emiTerms:
          "Flexible installment plans when bundled with a core Scaler program.",
        mode: "Online alongside your core Scaler program",
        nextBatch: "2026-12-15",
        seats: 30,
        eligibility:
          "Enrolled in or completed a Scaler core program with a recognized undergraduate degree.",
        degree:
          "Accredited European Master's degree in Computer Science & AI (ECTS credits via Woolf University).",
        level:
          "Professionals seeking international academic credentials, visa eligibility (e.g. Canada/EU), or research depth.",
        outcomes:
          "European-accredited Master's degree, research thesis, and free elective access across all Scaler programs.",
        syllabus: [
          "Advanced Theoretical Computer Science & Research Methodology",
          "Cross-Disciplinary Electives across DSML, Agentic AI, and DevOps",
          "Applied Master's Thesis & Capstone Research Project",
          "European ECTS Credit Evaluation & Academic Degree Conformance",
        ],
        track: "data",
        lastVerifiedDate: "21 November 2026",
        gapsNote:
          "Estimated figure of about ₹1.5 Lakh for 18 months is unverified; confirm with admissions counsellor.",
      },
    ],
  };
}

export function formatINR(amount) {
  if (amount == null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBatch(isoDate) {
  if (!isoDate) return "Admissions Open";
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function weeksLabel(weeks) {
  if (!weeks) return "";
  if (weeks >= 52) {
    const years = (weeks / 52).toFixed(weeks % 52 === 0 ? 0 : 1);
    return `${years} year${years === "1" ? "" : "s"} (~${weeks} weeks)`;
  }
  if (weeks % 4 === 0) {
    const months = weeks / 4;
    return `${months} month${months === 1 ? "" : "s"} (${weeks} weeks)`;
  }
  return `${weeks} weeks`;
}

export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function counselorForCourse(kb, course) {
  if (!course) return kb.counselors[0];
  return kb.counselors.find((c) => c.track === course.track) || kb.counselors[0];
}

const SLOT_TIMES = ["10:00", "11:30", "15:00", "16:30", "18:00"];

export function stampLocal(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function parseStamp(stamp) {
  const [date, time] = stamp.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function formatSlot(stamp) {
  const date = parseStamp(stamp);
  const day = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

export function availableSlots(
  kb,
  bookings,
  { course, from = new Date(), count = 6, counselorId } = {}
) {
  const counselor = counselorId
    ? kb.counselors.find((c) => c.id === counselorId) || counselorForCourse(kb, course)
    : counselorForCourse(kb, course);
  const taken = new Set(bookings.map((b) => b.slotId));
  const slots = [];
  const startDay = new Date(from);
  startDay.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < 28 && slots.length < count; offset += 1) {
    const day = new Date(startDay);
    day.setDate(startDay.getDate() + offset);
    if (!counselor.days.includes(day.getDay())) continue;
    for (const time of SLOT_TIMES) {
      const [hh, mm] = time.split(":").map(Number);
      const at = new Date(day);
      at.setHours(hh, mm, 0, 0);
      if (at.getTime() < from.getTime() + 60 * 60 * 1000) continue;
      const slotId = `${counselor.id}|${stampLocal(at)}`;
      if (taken.has(slotId)) continue;
      slots.push({
        id: slotId,
        counselorId: counselor.id,
        counselorName: counselor.name,
        start: stampLocal(at),
        label: formatSlot(stampLocal(at)),
      });
      if (slots.length >= count) break;
    }
  }
  return slots;
}

export function findCourse(kb, text) {
  const hay = text.toLowerCase();
  let best = null;
  let bestLen = 0;
  for (const course of kb.courses) {
    const names = [course.name, course.shortName, ...(course.aliases || [])];
    for (const name of names) {
      if (name && hay.includes(name.toLowerCase()) && name.length > bestLen) {
        best = course;
        bestLen = name.length;
      }
    }
  }
  return best;
}

export function scoreLead(lead, kb) {
  let score = 0;
  const course = kb.courses.find((c) => c.id === lead.courseId);
  if (lead.goal) score += 20;
  if (lead.courseId) score += 15;
  if (lead.level) score += 5;
  if (typeof lead.budget === "number") {
    if (!course || lead.budget >= course.price) score += 30;
    else if (lead.budget >= course.price * 0.7) score += 18;
    else score += 8;
  }
  if (lead.timeline === "asap" || lead.timeline === "this-month") score += 25;
  else if (lead.timeline === "next-month") score += 18;
  else if (lead.timeline === "quarter") score += 10;
  else if (lead.timeline === "exploring") score += 4;
  if (lead.email) score += 7;
  if (lead.name) score += 3;
  return Math.min(100, score);
}

export function leadBand(score, kb) {
  if (score >= kb.hotScore) return "Priority";
  if (score >= kb.qualifiedScore) return "Qualified";
  if (score > 0) return "Exploring";
  return "New";
}

export function timelineLabel(timeline) {
  return (
    {
      asap: "Within two weeks",
      "this-month": "This month",
      "next-month": "Next month",
      quarter: "In the next quarter",
      exploring: "Still exploring",
    }[timeline] || "Not shared"
  );
}

export function goalLabel(goal) {
  return (
    {
      undergrad: "Undergraduate degree & campus placement (SST)",
      switch: "Career switch into tech / data",
      upskill: "Upskill in current role & promotion",
      ai: "Master Generative & Agentic AI",
      freelance: "Freelance or high-paying client work",
      launch: "Build a product or tech startup",
      campus: "College campus placement prep",
      explore: "Exploring programs and curricula",
    }[goal] || "Not shared"
  );
}

export function singleCourseDetailText(course, kb) {
  const verified = kb?.lastVerifiedDate || "21 November 2026";
  const syllabusLines = course.syllabus.map((s) => `  • ${s}`).join("\n");
  const degreeLine = course.degree ? `\n🎓 Degree: ${course.degree}` : "";
  const gapsLine = course.gapsNote ? `\n⚠️ Admissions Note: ${course.gapsNote}` : "";

  return (
    `📘 **${course.name}**\n` +
    `• Target Audience: ${course.audience}\n` +
    `• Duration: ${course.duration}\n` +
    `• Mode: ${course.mode}\n` +
    `• Eligibility: ${course.eligibility}\n` +
    `• Program Fee: ${course.feeRange || formatINR(course.price)} (verified as of ${verified})\n` +
    `• Fee Breakdown & Payment: ${course.feeBreakdown}\n` +
    `• EMI & Financing: ${course.emiTerms}\n` +
    `• Key Outcomes: ${course.outcomes}${degreeLine}\n\n` +
    `📚 **Core Curriculum & Syllabus:**\n${syllabusLines}${gapsLine}`
  );
}

export function allCoursesDetailText(kb) {
  const verified = kb?.lastVerifiedDate || "21 November 2026";
  const sstCourses = kb.courses.filter((c) => c.audienceType === "student_parent");
  const proCourses = kb.courses.filter((c) => c.audienceType === "working");

  let out = `🎓 **24/7 Scaler — Comprehensive Course Directory (As of ${verified})**\n\n`;
  out += `Here is the verified, in-depth guide to all Scaler programs, curricula, fees, and admission paths:\n\n`;

  out += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  out += `🏛️ **1. UNDERGRADUATE CAMPUS PROGRAMS (Scaler School of Technology - SST)**\n`;
  out += `*Target: Class 12 / High school students & parents. 4-year residential campus in Electronic City, Bengaluru.*\n\n`;

  for (const c of sstCourses) {
    out += `▶ **${c.name}**\n`;
    out += `  • Duration: ${c.duration} | Mode: ${c.mode}\n`;
    out += `  • Total 4-Year Fee: ${c.feeRange}\n`;
    out += `  • Fee Split: Tuition ~₹17 Lakh, Admission fee ₹50k–₹75k, Hostel & Mess ~₹5.49 Lakh (Triple ₹1.23L/yr, Double ₹1.56L/yr, Large Double ₹1.80L/yr).\n`;
    out += `  • Degree: Parallel degree with IIT Madras (BS) or BITS Pilani (BSc). Partner degree fee paid directly to partner institution.\n`;
    out += `  • Admission: Strictly via NSET entrance exam.\n`;
    out += `  • Curriculum Highlights: DSA, AI/ML, Full Stack, Distributed Systems, 1-Year Mandatory Paid Internship.\n\n`;
  }

  out += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  out += `💼 **2. WORKING-PROFESSIONAL TECH PROGRAMS (Live Online + 1:1 Mentorship)**\n`;
  out += `*Target: Developers, tech leads, analysts, and IT professionals looking to switch or upskill.*\n\n`;

  for (const c of proCourses) {
    out += `▶ **${c.name}**\n`;
    out += `  • Duration: ${c.duration} | Mode: ${c.mode}\n`;
    out += `  • Fee: ${c.feeRange} (as of ${verified})\n`;
    out += `  • Payment / EMI: ${c.emiTerms}\n`;
    out += `  • Focus: ${c.syllabus.slice(0, 4).join(", ")}...\n`;
    if (c.gapsNote) out += `  • Admissions Note: ${c.gapsNote}\n`;
    out += `\n`;
  }

  out += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  out += `💡 **Hostel Room Rates for SST (per year):**\n`;
  out += `  • Triple Sharing: ₹1,23,000 / year\n`;
  out += `  • Double Sharing: ₹1,56,000 / year\n`;
  out += `  • Large Double Sharing: ₹1,80,000 / year\n\n`;

  out += `💬 *Note: As per Scaler admissions policy, figures should be confirmed with our admissions counsellors. Third-party coupons like 'CS500' are unauthorized and not accepted. Would you like to check syllabus modules for any specific program or book a 1:1 counseling callback?*`;

  return out;
}
