import {
  allCoursesDetailText,
  availableSlots,
  findCourse,
  formatBatch,
  formatINR,
  scoreLead,
  singleCourseDetailText,
  timelineLabel,
  weeksLabel,
} from "./knowledge.js";

const GOAL_PATTERNS = [
  [/\b(undergrad|undergraduate|12th|class 12|after 12th|high school|btech|bsc|college degree)\b/i, "undergrad"],
  [/\b(career switch|switch career|change career|change roles|new role|transition|switch into)\b/i, "switch"],
  [/\b(agentic|llm|generative ai|genai|ai agent|ai agents)\b/i, "ai"],
  [/\b(upskill|current job|better at|promotion|level up|advance)\b/i, "upskill"],
  [/\b(freelance|client work|clients|consulting)\b/i, "freelance"],
  [/\b(startup|my product|launch|company|founder)\b/i, "launch"],
  [/\b(placement|campus placement|campus)\b/i, "campus"],
  [/\b(just (looking|exploring|browsing)|curious|not sure yet)\b/i, "explore"],
];

const LEVEL_PATTERNS = [
  [/\b(parent|my son|my daughter|my child|my kid|father|mother)\b/i, "parent"],
  [/\b(student|college|school|12th|final year)\b/i, "student"],
  [/\b(working|professional|software engineer|developer|tech lead|sde|analyst|years of experience)\b/i, "working"],
  [/\b(beginner|new to coding|never coded|from scratch)\b/i, "beginner"],
];

export function emptyLead() {
  return {
    name: "",
    email: "",
    phone: "",
    courseId: "",
    goal: "",
    budget: null,
    timeline: "",
    level: "",
    persona: "", // "parent" | "student" | "working"
    summary: "",
  };
}

export function freshThread(kb) {
  const brand = kb?.brandName || "24/7 Scaler";
  const assistant = kb?.assistantName || "Asha";
  const verified = kb?.lastVerifiedDate || "21 November 2026";

  return {
    id: `thread-${Date.now()}`,
    leadId: `lead-${Date.now()}`,
    phase: "chat",
    pendingSlotId: "",
    offeredSlots: [],
    turns: 0,
    lead: emptyLead(),
    messages: [
      {
        id: "hello",
        role: "assistant",
        text:
          `Welcome to **${brand}** admissions desk (active 24/7, figures verified as of ${verified}). I’m ${assistant}, your admissions advisor.\n\n` +
          `I can give you **in-depth details on all Scaler courses**, syllabi, fee splits, hostel accommodation, NSET entrance, or EMI options. ` +
          `Whether you're a parent exploring our 4-year undergraduate campus (SST) or a working professional aiming to upskill in AI, Data Science, Full Stack, or DevOps, how can I help you today?`,
        chips: [
          { label: "📚 Info on all courses in detail", payload: "give info of all the course in detail" },
          { label: "🏛️ SST Undergrad (CS & AI)", payload: "Tell me about Scaler School of Technology in detail" },
          { label: "🤖 AI & Agentic AI", payload: "What is AI & ML with Agentic AI?" },
          { label: "📊 Data Science & ML", payload: "Tell me about Data Science & ML fees and EMI" },
          { label: "💻 Scaler Academy (Full Stack)", payload: "What is Scaler Academy fee and syllabus?" },
          { label: "☁️ DevOps & Cloud", payload: "Tell me about DevOps" },
          { label: "🛏️ Hostel & Mess fees", payload: "What are the hostel fees for SST?" },
          { label: "📞 Book Counselor Callback", payload: "book a counseling call" },
        ],
      },
    ],
  };
}

function chip(label, payload = label) {
  return { label, payload };
}

function assistantMessage(text, extra = {}) {
  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "assistant",
    text,
    ...extra,
  };
}

function parseBudget(text) {
  const lakh = text.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)\b/i);
  if (lakh) return Math.round(Number(lakh[1]) * 100000);
  const k = text.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (k) return Math.round(Number(k[1]) * 1000);
  const amounts = [...text.matchAll(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{2,3})+|\d{4,7})/gi)];
  for (const match of amounts) {
    const value = Number(match[1].replace(/,/g, ""));
    if (value >= 2020 && value <= 2035) continue; // ignore years
    if (value >= 5000 && value <= 5000000) return value;
  }
  if (/under\s*(?:₹|rs\.?)?\s*4\s*(?:lakhs?|l)\b/i.test(text)) return 399000;
  if (/around\s*(?:₹|rs\.?)?\s*4\s*(?:lakhs?|l)\b/i.test(text)) return 400000;
  return null;
}

function parseTimeline(text) {
  const hay = text.toLowerCase();
  if (/\basap\b|immediately|right away|this week|next week/.test(hay)) return "asap";
  if (/this month/.test(hay)) return "this-month";
  if (/next month|in january|in december|after this batch/.test(hay)) return "next-month";
  if (/two months|2 months|three months|3 months|next quarter|this quarter|couple of months|2027/.test(hay)) {
    return "quarter";
  }
  if (/just (looking|browsing|exploring)|not sure|later|next year|no rush/.test(hay)) return "exploring";
  return "";
}

function parseGoal(text) {
  const hay = text.toLowerCase();
  for (const [pattern, goal] of GOAL_PATTERNS) {
    if (pattern.test(hay)) return goal;
  }
  return "";
}

function parseLevel(text) {
  const hay = text.toLowerCase();
  for (const [pattern, level] of LEVEL_PATTERNS) {
    if (pattern.test(hay)) return level;
  }
  return "";
}

function parseEmail(text) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function parsePhone(text) {
  const match = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}\b/);
  if (!match) return "";
  const digits = match[0].replace(/\D/g, "");
  return digits.slice(-10);
}

function parseName(text) {
  const match = text.match(/\b(?:my name is|i am|i'm|this is|name:)\s+([a-z]+(?:\s+[a-z]+)?)/i);
  if (!match) return "";
  const stop = new Set([
    "and",
    "email",
    "my",
    "phone",
    "from",
    "looking",
    "interested",
    "a",
    "an",
    "the",
    "working",
    "currently",
    "based",
    "student",
    "beginner",
    "parent",
    "switching",
    "planning",
    "trying",
    "keen",
    "happy",
    "with",
  ]);
  const parts = match[1]
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .filter((part) => !stop.has(part));
  if (!parts.length) return "";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function wantsBooking(text) {
  return /\b(book|demo|schedule a|set up a|counsel(?:l)?ing call|(?:a|the) call|talk to (?:someone|a mentor|a counselor|counsellor)|callback|call me)\b/i.test(
    text
  );
}

function isAffirmative(text) {
  return /^(yes|yeah|yep|sure|ok|okay|please|do that|book it|that works)\b/i.test(text.trim());
}

function monthIndex(token) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return months.findIndex((m) => token.toLowerCase().startsWith(m));
}

function parseClock(text) {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const mer = match[3].toLowerCase();
  if (hour === 12) hour = 0;
  if (mer === "pm") hour += 12;
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

function dateFromHint(text, now) {
  const hay = text.toLowerCase();
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  if (/\btoday\b/.test(hay)) return base;
  if (/\btomorrow\b/.test(hay)) {
    base.setDate(base.getDate() + 1);
    return base;
  }
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < weekdays.length; i += 1) {
    if (hay.includes(weekdays[i])) {
      const delta = (i - base.getDay() + 7) % 7 || 7;
      base.setDate(base.getDate() + delta);
      return base;
    }
  }
  const numeric = hay.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  if (numeric) {
    const month = monthIndex(numeric[2]);
    const date = new Date(base.getFullYear(), month, Number(numeric[1]));
    if (date < base) date.setFullYear(date.getFullYear() + 1);
    return date;
  }
  return null;
}

function sameSlotTime(slot, day, clock) {
  if (!day && !clock) return false;
  const [date, time] = slot.start.split("T");
  const [hh, mm] = time.split(":").map(Number);
  if (clock && (hh !== clock.hour || mm !== clock.minute)) return false;
  if (day) {
    const [y, m, d] = date.split("-").map(Number);
    if (y !== day.getFullYear() || m - 1 !== day.getMonth() || d !== day.getDate()) return false;
  }
  return true;
}

function courseById(kb, id) {
  return kb.courses.find((course) => course.id === id) || null;
}

function applyExtractions(lead, text) {
  const next = { ...lead };
  const email = parseEmail(text);
  const phone = parsePhone(text);
  const name = parseName(text);
  const budget = parseBudget(text);
  const timeline = parseTimeline(text);
  const goal = parseGoal(text);
  const level = parseLevel(text);

  if (email) next.email = email;
  if (phone) next.phone = phone;
  if (name) next.name = name;
  if (budget != null) next.budget = budget;
  if (timeline) next.timeline = timeline;
  if (goal) next.goal = goal;
  if (level) {
    next.level = level;
    if (level === "parent") next.persona = "parent";
    else if (level === "student") next.persona = "student";
    else if (level === "working") next.persona = "working";
  }

  // Parent / School student context detection
  if (/my (son|daughter|child|kid)|parent|father|mother|12th grade|class 12/i.test(text)) {
    next.persona = "parent";
    if (!next.courseId) next.courseId = "sst-cs";
  }

  return next;
}

function recommendCourse(kb, lead) {
  if (lead.persona === "parent" || lead.goal === "undergrad") {
    return courseById(kb, "sst-cs") || kb.courses[0];
  }
  const map = {
    ai: "agentic-ai",
    switch: "dsml",
    upskill: "academy",
    freelance: "academy",
    launch: "agentic-ai",
    campus: "academy",
    explore: "dsml",
  };
  const id = map[lead.goal] || kb.courses[0].id;
  return courseById(kb, id);
}

function describeCourse(course, kb) {
  const verified = kb?.lastVerifiedDate || "21 November 2026";
  const feeInfo = course.feeRange || formatINR(course.price);
  return `**${course.name}**\n• Duration: ${course.duration}\n• Fee: ${feeInfo} (as of ${verified})\n• Mode: ${course.mode}\n• Eligibility: ${course.eligibility}\n• Outcomes: ${course.outcomes}`;
}

function missingQuestion(lead, kb) {
  const course = courseById(kb, lead.courseId);

  // If lead is a parent
  if (lead.persona === "parent" && (!lead.name || !lead.phone)) {
    return {
      text:
        `For parent inquiries regarding Scaler School of Technology (SST), our senior undergraduate counsellor can walk you through the Bengaluru residential campus, NSET entrance schedule, and placement records.\n\n` +
        `Could you share your name and mobile number to arrange a personal consultation?`,
      chips: [
        chip("Hostel details", "What are the hostel details?"),
        chip("NSET Exam info", "How does the NSET exam work?"),
        chip("Book parent call", "book a counseling call"),
      ],
    };
  }

  if (!lead.courseId) {
    return {
      text: "Which Scaler program would you like to explore? I can give you detailed syllabi, fee splits, and batch schedules.",
      chips: [
        chip("📚 All Courses in detail", "give info of all the course in detail"),
        chip("🏛️ SST (CS & AI)", "Tell me about Scaler School of Technology in detail"),
        chip("🤖 AI & Agentic AI", "What is AI & ML with Agentic AI?"),
        chip("📊 Data Science & ML", "Tell me about Data Science & ML"),
      ],
    };
  }

  if (!lead.goal) {
    return {
      text: `What is your primary goal with ${course.name} — an undergraduate degree, a career switch, mastering Agentic AI, or upskilling for promotion?`,
      chips: [
        chip("Undergraduate degree (SST)", "I want an undergraduate degree in CS"),
        chip("Career switch", "I want a career switch into tech"),
        chip("Master Agentic AI", "I want to master Agentic AI"),
        chip("Upskill for promotion", "I want to upskill for a promotion"),
      ],
    };
  }

  if (lead.budget == null && course.audienceType === "working") {
    return {
      text: `${course.name} fee is ${course.feeRange || formatINR(course.price)}. Would you prefer paying with our no-cost EMI plan (from ₹9,791/month with ₹20,000 upfront) or an education loan?`,
      chips: [
        chip("Need EMI details", "What are the EMI options?"),
        chip("Self-sponsored", "I am self-sponsored"),
        chip("Check scholarship", "What scholarships are available?"),
      ],
    };
  }

  if (!lead.timeline) {
    return {
      text: `When are you looking to start? Upcoming batches are enrolling now.`,
      chips: [
        chip("Immediate batch", "I want to start immediately"),
        chip("Next month", "I can start next month"),
        chip("Still exploring", "I am still exploring"),
      ],
    };
  }

  return null;
}

function bookingPitch(lead, kb, bookings, now) {
  const course = courseById(kb, lead.courseId) || recommendCourse(kb, lead);
  const slots = availableSlots(kb, bookings, { course, from: now, count: 4 });
  const score = scoreLead({ ...lead, courseId: course.id }, kb);
  const band = score >= kb.hotScore ? "a priority match" : "a great fit";

  if (!slots.length) {
    return {
      course,
      slots,
      text: `${course.name} looks like ${band} for your background. Our admissions calendar is currently busy. Please share your phone and email, and our admissions advisor will contact you during open counseling hours.`,
    };
  }

  return {
    course,
    slots,
    text:
      `Based on your interest in **${course.name}**, this looks like ${band}!\n` +
      `Our admissions counselor **${slots[0].counselorName}** is available for a 1:1 strategy call. Pick a preferred time slot below:`,
  };
}

function contactAsk(slot) {
  return `Slot reserved: **${slot.label}** with **${slot.counselorName}**.\n\nPlease share your **name**, **email address**, and **phone number** to confirm your calendar invite and admissions brochure.`;
}

function confirmText(lead, slot, course) {
  const who = lead.name ? `**${lead.name}**` : "You";
  return (
    `✅ ${who} are confirmed for a counseling call with **${slot.counselorName}** on **${slot.label}**.\n\n` +
    `• Program: ${course ? course.name : "Scaler Admissions Consultation"}\n` +
    `• Calendar invite sent to: **${lead.email}**\n` +
    (lead.phone ? `• Confirmation SMS/WhatsApp to: **+91 ${lead.phone}**\n\n` : `\n`) +
    `Our 24/7 Scaler desk is always open if you'd like to review any syllabus or pricing details beforehand!`
  );
}

function answerQuestion(text, kb, lead) {
  const hay = text.toLowerCase();
  const verified = kb?.lastVerifiedDate || "21 November 2026";
  const named = findCourse(kb, text);
  const course = named || courseById(kb, lead.courseId);

  // CS500 Coupon rejection rule (Section 3 & 4 of PDF)
  if (/cs500|cs-500|coupon|promo code|promo|discount code|voucher/i.test(hay)) {
    return (
      `🚫 **Regarding Promo & Coupon Codes:**\n` +
      `The "CS500" code mentioned on third-party blogs is an unauthorized affiliate promo and is **not an official Scaler offer**. Do not rely on third-party coupons.\n\n` +
      `✨ **Official Scaler Financial Aid & Scholarships:**\n` +
      `• **Scaler School of Technology (SST):** Merit-based scholarships awarded directly through the **NSET exam**.\n` +
      `• **Scaler Academy:** Up to **₹25,000 scholarship** based on an MCQ entrance evaluation.\n` +
      `Official scholarships are evaluated directly with our admissions counsellors.`
    );
  }

  // All courses in detail rule
  if (
    /all (courses|programs)|info of all (the )?course|courses in detail|every course|what courses do you offer|what do you offer|catalogue|catalog|list (all )?courses|show all/i.test(
      hay
    )
  ) {
    return allCoursesDetailText(kb);
  }

  // Hostel details rule
  if (/hostel|room|accommodation|mess|stay|sharing|campus living/i.test(hay)) {
    const h = kb.hostelDetails || { triple: 123000, double: 156000, largeDouble: 180000 };
    return (
      `🛏️ **Scaler School of Technology (SST) — Hostel & Accommodation Fees (Per Year, as of ${verified}):**\n\n` +
      `• **Triple Sharing:** ${formatINR(h.triple)} / year\n` +
      `• **Double Sharing:** ${formatINR(h.double)} / year\n` +
      `• **Large Double Sharing:** ${formatINR(h.largeDouble)} / year\n\n` +
      `📌 **Overall Estimate:** Hostel and mess fees total ~₹5.49 Lakh over the 4 years (included within the ₹22.99L to ₹26.5L estimated 4-year SST budget).\n` +
      `The campus is located in Electronic City, Bengaluru, with full security, high-speed Wi-Fi, sports, and mess facilities.`
    );
  }

  // NSET entrance exam
  if (/nset|national scaler entrance|entrance exam|admission test|selection process|eligibility for sst/i.test(hay)) {
    return (
      `📝 **National Scaler Entrance Test (NSET):**\n\n` +
      `• **What it is:** The mandatory entrance examination for admission into the 4-year undergraduate programs at Scaler School of Technology (CS & AI and AI & Business).\n` +
      `• **Eligibility:** Students who have completed or are appearing for Class 12 / High School with Mathematics.\n` +
      `• **Format:** Tests analytical ability, mathematical aptitude, and problem-solving skills.\n` +
      `• **Scholarship Link:** High scorers in NSET qualify for prestigious merit scholarships covering significant tuition fee waivers.\n` +
      `Would you like to schedule a counselor call to discuss NSET registration and syllabus?`
    );
  }

  // Parallel Degree / Partner Degree (IIT Madras / BITS Pilani)
  if (/parallel degree|partner degree|iit|iit madras|bits|bits pilani|degree/i.test(hay) && /sst|ug|undergrad|college|school of technology/i.test(hay)) {
    return (
      `🎓 **Parallel Recognized Degree at Scaler School of Technology (SST):**\n\n` +
      `• Students enrolled in SST's 4-year residential program earn a parallel recognized bachelor's degree from premier partner institutions: **IIT Madras (BS Degree)** or **BITS Pilani (BSc Degree)**.\n` +
      `• **Important Fee Note:** Fees paid directly to the partner institution (IIT Madras or BITS Pilani) are in addition to SST's tuition fees. When factored together, the total 4-year investment typically ranges from **₹24 Lakh to ₹26.5 Lakh**.\n` +
      `This dual-immersion model ensures graduates receive both a top university credential and real-world tech engineering mastery.`
    );
  }

  // Neovarsity Add-on Master's Degree
  if (/neovarsity|master|ms in cs|woolf|add-on degree|masters degree/i.test(hay)) {
    const neo = courseById(kb, "neovarsity");
    return singleCourseDetailText(neo, kb);
  }

  // Agentic AI
  if (/agentic|ai & ml with agentic|autonomous agents|langchain|rag/i.test(hay)) {
    const agentic = courseById(kb, "agentic-ai");
    return singleCourseDetailText(agentic, kb);
  }

  // DevOps
  if (/devops|cloud|sre|kubernetes|docker|terraform/i.test(hay)) {
    const dev = courseById(kb, "devops");
    return singleCourseDetailText(dev, kb);
  }

  // Scaler Academy (Software Development / Full Stack)
  if (/academy|software development|full stack|dsa|system design|interviewbit/i.test(hay)) {
    const acad = courseById(kb, "academy");
    return singleCourseDetailText(acad, kb);
  }

  // Specific course in detail
  if (named && /detail|syllabus|curriculum|module|breakdown|tell me about|info/i.test(hay)) {
    return singleCourseDetailText(named, kb);
  }

  // SST specific query
  if (/sst|scaler school of technology|cs & ai|ai & business/i.test(hay)) {
    const sst = named || courseById(kb, "sst-cs");
    return singleCourseDetailText(sst, kb);
  }

  // Fees / Pricing questions
  if (/fee|fees|price|pricing|cost|how much|tuition/i.test(hay)) {
    if (course) {
      return (
        `💰 **Fee Information for ${course.name} (as of ${verified}):**\n` +
        `• Program Fee: **${course.feeRange || formatINR(course.price)}**\n` +
        `• Payment & EMI Terms: ${course.feeBreakdown}\n` +
        `• Financing: ${course.emiTerms}\n` +
        (course.gapsNote ? `• Note: ${course.gapsNote}` : "")
      );
    }
    return (
      `💰 **Scaler Programs Fee Overview (as of ${verified}):**\n\n` +
      kb.courses
        .map((c) => `• **${c.name}**: ${c.feeRange || formatINR(c.price)} (${c.duration})`)
        .join("\n") +
      `\n\nAsk me about any specific course to see the detailed breakdown, EMI plans, or hostel options.`
    );
  }

  // EMI / Payment terms
  if (/\bemi\b|installment|down payment|upfront|financing|loan/i.test(hay)) {
    return (
      `💳 **EMI & Payment Terms (verified as of ${verified}):**\n\n` +
      `• **Working-Professional Programs (DSML, Agentic AI, DevOps):** Start with **₹20,000 upfront**, with no-cost EMI options starting from **₹9,791/month**.\n` +
      `• **Scaler Academy:** Flexible EMI options available across multiple NBFC and banking partners.\n` +
      `• **Scaler School of Technology (SST):** Comprehensive education loan assistance covering tuition and hostel, with repayment moratoriums.\n` +
      `Ask our counsellor during your call to get a tailored EMI calculation for your bank.`
    );
  }

  // Scholarships
  if (/scholarship|discount|financial aid|waiver/i.test(hay)) {
    return (
      `🎓 **Scholarships & Financial Aid at Scaler:**\n\n` +
      `1. **Scaler School of Technology (SST):** Up to 100% tuition scholarships based on performance in the **NSET (National Scaler Entrance Test)**.\n` +
      `2. **Scaler Academy:** Up to **₹25,000 scholarship** based on an online MCQ tech assessment.\n` +
      `3. **Note:** Unauthorized third-party coupon codes (e.g. 'CS500') are not accepted.`
    );
  }

  // Human Escalation / Refund / Complaint
  if (/refund|complaint|talk to human|speak to a person|manager|escalat/i.test(hay)) {
    return (
      `⚠️ **Admissions & Student Policy Escalation:**\n` +
      `Inquiries regarding refund policies, special fee arrangements, or formal grievances are handled by our dedicated student advisory committee.\n` +
      `I can flag this request for immediate human follow-up. Would you like to schedule a priority callback with our senior counselor?`
    );
  }

  // Placements / Careers / Hiring
  if (/placement|job|salary|package|hiring|companies|faang|internship/i.test(hay)) {
    if (course && course.track === "sst") {
      return (
        `💼 **SST Placement & Industry Immersion:**\n` +
        `• **1-Year Mandatory Paid Internship:** SST students spend their 3rd and 4th years working at leading tech companies and high-growth unicorns.\n` +
        `• Top recruiters include Google, Microsoft, Amazon, Swiggy, Uber, and tech startups.\n` +
        `• Focus on practical system design, live coding, and product deployment guarantees day-one readiness.`
      );
    }
    return (
      `💼 **Scaler Career Outcomes & Placement Support:**\n` +
      `• Over 900+ hiring partners including Google, Microsoft, Amazon, Flipkart, Walmart, and Adobe.\n` +
      `• Dedicated 1:1 career mentorship, resume reviews, and rigorous mock interviews.\n` +
      `• Real-world capstone projects you can showcase on GitHub and in tech interviews.`
    );
  }

  // Location / Campus / Timings / Hours
  if (/where|location|offline|remote|address|city|hours|after hours|open/i.test(hay)) {
    return (
      `📍 **Scaler Campuses & Hours:**\n\n` +
      `• **SST Residential Campus:** Electronic City, Bengaluru, Karnataka.\n` +
      `• **Working-Professional Programs:** Live online interactive classes held across India (weekday evenings and weekend batches).\n` +
      `• **Desk Availability:** This **24/7 Scaler** desk operates around the clock. Live human counselors sit **${kb.counselorHours}**.\n` +
      `If you are messaging after hours, you can book a callback slot for tomorrow morning!`
    );
  }

  // Batches & Schedules
  if (/batch|start date|schedule|timing|when does/i.test(hay)) {
    if (course) {
      return `📅 **${course.name}** next batch is scheduled for **${formatBatch(course.nextBatch)}** (${course.seats} seats available). ${course.mode}.`;
    }
    return (
      `📅 **Upcoming Scaler Cohorts (as of ${verified}):**\n\n` +
      kb.courses.map((c) => `• **${c.name}**: ${formatBatch(c.nextBatch)} · ${c.mode}`).join("\n") +
      `\n\nAdmissions are rolling. Would you like to check eligibility for an upcoming cohort?`
    );
  }

  // Default to single course detail if named
  if (named) {
    return singleCourseDetailText(named, kb);
  }

  return "";
}

function slotFromMessage(text, offered, kb, bookings, course, now) {
  if (text.startsWith("slot:")) {
    const id = text.slice(5);
    return (
      offered.find((slot) => slot.id === id) ||
      availableSlots(kb, bookings, { course, from: now, count: 12 }).find((slot) => slot.id === id) ||
      null
    );
  }
  const ordinal = text.toLowerCase().match(/\b(first|second|third|fourth|1st|2nd|3rd|4th)\b/);
  if (ordinal && offered.length) {
    const index = { first: 0, "1st": 0, second: 1, "2nd": 1, third: 2, "3rd": 2, fourth: 3, "4th": 3 }[
      ordinal[1]
    ];
    return offered[index] || null;
  }
  const clock = parseClock(text);
  if (!clock) return null;
  const day = dateFromHint(text, now);
  const pool = offered.length ? offered : availableSlots(kb, bookings, { course, from: now, count: 16 });
  return pool.find((slot) => sameSlotTime(slot, day, clock)) || null;
}

function finishBooking(thread, kb, bookings, slot) {
  const course = courseById(kb, thread.lead.courseId);
  const booking = {
    id: `book-${slot.id}`,
    slotId: slot.id,
    leadId: thread.leadId,
    name: thread.lead.name || "Prospective Student / Parent",
    email: thread.lead.email,
    phone: thread.lead.phone,
    courseId: thread.lead.courseId,
    courseName: course ? course.name : "Scaler Admissions Consultation",
    counselorName: slot.counselorName,
    start: slot.start,
    label: slot.label,
  };
  const nextBookings = [...bookings.filter((item) => item.slotId !== slot.id), booking];
  const nextThread = {
    ...thread,
    phase: "done",
    pendingSlotId: "",
    offeredSlots: [],
    messages: [
      ...thread.messages,
      assistantMessage(confirmText(thread.lead, slot, course), {
        booking,
      }),
    ],
  };
  return { thread: nextThread, bookings: nextBookings, saved: true };
}

export function step(thread, rawText, kb, bookings, now = new Date()) {
  const text = rawText.trim();
  if (!text) return { thread, bookings, saved: false };

  const userMessage = {
    id: `u-${Date.now()}`,
    role: "user",
    text: text.startsWith("slot:") ? "Selected preferred time." : text,
  };

  let lead = applyExtractions(thread.lead, text);
  const named = findCourse(kb, text);
  if (named) lead = { ...lead, courseId: named.id };

  let working = {
    ...thread,
    lead,
    turns: thread.turns + 1,
    messages: [...thread.messages, userMessage],
  };

  if (/^(start over|reset|new conversation)$/i.test(text)) {
    return { thread: freshThread(kb), bookings, saved: false };
  }

  if (/(reschedule|move (it|the call)|different time|cancel (the |my )?call)/i.test(text)) {
    const courseForMove = courseById(kb, lead.courseId);
    const kept = bookings.filter((item) => item.leadId !== thread.leadId);
    const slots = availableSlots(kb, kept, { course: courseForMove, from: now, count: 4 });
    const next = {
      ...working,
      phase: "book",
      pendingSlotId: "",
      offeredSlots: slots,
      messages: [
        ...working.messages,
        assistantMessage(
          slots.length
            ? "I have updated the hold. Here are open counseling times with our Scaler advisors:"
            : "I cleared the previous reservation, but there are no open counseling slots in the next few weeks.",
          { chips: slots.map((slot) => chip(`${slot.label} · ${slot.counselorName}`, `slot:${slot.id}`)) }
        ),
      ],
    };
    return { thread: next, bookings: kept, saved: true };
  }

  const course = courseById(kb, lead.courseId);
  const chosen = slotFromMessage(text, thread.offeredSlots, kb, bookings, course, now);

  if (chosen || (thread.pendingSlotId && (lead.email || parseEmail(text)))) {
    const slot =
      chosen ||
      thread.offeredSlots.find((item) => item.id === thread.pendingSlotId) ||
      availableSlots(kb, bookings, { course, from: now, count: 12 }).find(
        (item) => item.id === thread.pendingSlotId
      );
    if (slot && lead.name && (lead.email || lead.phone)) {
      working = { ...working, pendingSlotId: slot.id };
      return finishBooking(working, kb, bookings, slot);
    }
    if (slot) {
      const next = {
        ...working,
        phase: "details",
        pendingSlotId: slot.id,
        offeredSlots: thread.offeredSlots.length ? thread.offeredSlots : [slot],
        messages: [...working.messages, assistantMessage(contactAsk(slot))],
      };
      return { thread: next, bookings, saved: true };
    }
  }

  if (thread.phase === "details" && thread.pendingSlotId) {
    const slot = thread.offeredSlots.find((item) => item.id === thread.pendingSlotId);
    if (slot && lead.name && (lead.email || lead.phone)) {
      return finishBooking(working, kb, bookings, slot);
    }
    const stillNeed = !lead.name ? "your full name and email" : "your email address (or phone number)";
    const next = {
      ...working,
      messages: [
        ...working.messages,
        assistantMessage(`Please provide ${stillNeed} so I can finalize your calendar invitation.`),
      ],
    };
    return { thread: next, bookings, saved: true };
  }

  const factual = answerQuestion(text, kb, lead);
  const bookingIntent = wantsBooking(text) || (isAffirmative(text) && thread.phase === "book");
  const askedClock = parseClock(text);
  const readyForPitch = Boolean(lead.courseId && lead.goal && (lead.budget != null || lead.persona === "parent") && lead.timeline);

  if (askedClock && !chosen && (bookingIntent || thread.phase === "book" || thread.offeredSlots.length)) {
    const slots = availableSlots(kb, bookings, { course, from: now, count: 4 });
    const next = {
      ...working,
      phase: "book",
      offeredSlots: slots,
      messages: [
        ...working.messages,
        assistantMessage("That specific time isn't open on the counselor’s roster. Here are the nearest available slots:", {
          chips: slots.map((slot) => chip(`${slot.label} · ${slot.counselorName}`, `slot:${slot.id}`)),
        }),
      ],
    };
    return { thread: next, bookings, saved: true };
  }

  if (bookingIntent || readyForPitch) {
    const pitchLead = lead.courseId ? lead : { ...lead, courseId: recommendCourse(kb, lead).id };
    const pitch = bookingPitch(pitchLead, kb, bookings, now);
    const next = {
      ...working,
      lead: { ...pitchLead },
      phase: "book",
      offeredSlots: pitch.slots,
      messages: [
        ...working.messages,
        assistantMessage(factual ? `${factual}\n\n${pitch.text}` : pitch.text, {
          chips: pitch.slots.map((slot) => chip(`${slot.label} · ${slot.counselorName}`, `slot:${slot.id}`)),
        }),
      ],
    };
    return { thread: next, bookings, saved: true };
  }

  if (factual) {
    const follow =
      working.turns >= 2 || named || lead.goal || lead.budget != null || lead.persona === "parent"
        ? missingQuestion(lead, kb)
        : null;
    const chips = follow
      ? follow.chips
      : [
          chip("📚 Info on all courses in detail", "give info of all the course in detail"),
          chip("📞 Book a counseling call", "book a counseling call"),
          chip("🛏️ Hostel fees", "What are the hostel fees?"),
        ];

    const next = {
      ...working,
      phase: follow ? "qualify" : "chat",
      messages: [
        ...working.messages,
        assistantMessage(follow ? `${factual}\n\n${follow.text}` : factual, { chips }),
      ],
    };
    return { thread: next, bookings, saved: true };
  }

  const follow = missingQuestion(lead, kb);
  if (follow) {
    const next = {
      ...working,
      phase: "qualify",
      messages: [...working.messages, assistantMessage(follow.text, { chips: follow.chips })],
    };
    return { thread: next, bookings, saved: true };
  }

  const pitch = bookingPitch(lead, kb, bookings, now);
  const next = {
    ...working,
    phase: "book",
    offeredSlots: pitch.slots,
    messages: [
      ...working.messages,
      assistantMessage(pitch.text, {
        chips: pitch.slots.map((slot) => chip(`${slot.label} · ${slot.counselorName}`, `slot:${slot.id}`)),
      }),
    ],
  };
  return { thread: next, bookings, saved: true };
}

export const _test = {
  parseBudget,
  parseTimeline,
  parseName,
  parseEmail,
  answerQuestion,
};
