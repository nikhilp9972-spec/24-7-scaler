import { useEffect, useMemo, useRef, useState } from "react";
import { freshThread, step } from "./engine.js";
import {
  STORAGE_KEYS,
  availableSlots,
  defaultKnowledge,
  formatBatch,
  formatINR,
  goalLabel,
  leadBand,
  loadJson,
  scoreLead,
  timelineLabel,
  weeksLabel,
} from "./knowledge.js";

const VIEWS = [
  ["desk", "Desk"],
  ["courses", "All Courses"],
  ["leads", "Leads"],
  ["calendar", "Calendar"],
  ["knowledge", "Knowledge"],
];

function stampDay(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function seedState() {
  const kb = defaultKnowledge();
  const sst = kb.courses.find((course) => course.id === "sst-cs");
  const slots = availableSlots(kb, [], { course: sst, count: 1 });
  const slot = slots[0];

  const bookings = slot
    ? [
        {
          id: `book-${slot.id}`,
          slotId: slot.id,
          leadId: "lead-rajesh",
          name: "Rajesh Sharma",
          email: "rajesh.sharma@parent.org",
          phone: "9811022334",
          courseId: "sst-cs",
          courseName: sst.name,
          counselorName: slot.counselorName,
          start: slot.start,
          label: slot.label,
        },
      ]
    : [];

  const leads = [
    {
      id: "lead-rajesh",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@parent.org",
      phone: "9811022334",
      courseId: "sst-cs",
      goal: "undergrad",
      budget: 2500000,
      timeline: "next-month",
      level: "parent",
      persona: "parent",
      note: "Parent inquiring for son in Class 12. Asked about NSET, BITS Pilani parallel degree, and hostel fees.",
      bookingLabel: slot?.label || "",
      counselorName: slot?.counselorName || "",
    },
    {
      id: "lead-vikram",
      name: "Vikram Patel",
      email: "vikram.patel@techcorp.in",
      phone: "9820011223",
      courseId: "agentic-ai",
      goal: "ai",
      budget: 400000,
      timeline: "this-month",
      level: "working",
      persona: "working",
      note: "Senior backend developer (5 yrs exp). Wants to build autonomous LLM agents and multi-agent RAG pipelines.",
      bookingLabel: "",
      counselorName: "",
    },
    {
      id: "lead-ananya",
      name: "Ananya Roy",
      email: "ananya.roy@devmail.com",
      phone: "9988776655",
      courseId: "dsml",
      goal: "switch",
      budget: 399000,
      timeline: "asap",
      level: "working",
      persona: "working",
      note: "Data analyst aiming for Machine Learning Engineer role. Interested in no-cost EMI from ₹9,791/mo.",
      bookingLabel: "",
      counselorName: "",
    },
    {
      id: "lead-amit",
      name: "Amit Deshmukh",
      email: "amit.deshmukh@cloudnet.io",
      phone: "9765432100",
      courseId: "devops",
      goal: "upskill",
      budget: 399000,
      timeline: "this-month",
      level: "working",
      persona: "working",
      note: "QA Automation engineer transitioning to Cloud SRE. Inquired about ₹20,000 upfront booking.",
      bookingLabel: "",
      counselorName: "",
    },
  ];

  return { kb, bookings, leads, thread: freshThread(kb) };
}

function loadInitial() {
  const kb = loadJson(STORAGE_KEYS.kb, null);
  // Re-seed if old Northline kb was present
  if (!kb?.courses?.length || kb.institute !== "Scaler") return seedState();
  return {
    kb,
    bookings: loadJson(STORAGE_KEYS.bookings, []),
    leads: loadJson(STORAGE_KEYS.leads, []),
    thread: loadJson(STORAGE_KEYS.thread, null) || freshThread(kb),
  };
}

function upsertLead(leads, thread, bookings) {
  const lead = thread.lead;
  const touched =
    lead.courseId || lead.goal || lead.email || lead.name || lead.phone || lead.budget != null || lead.timeline;
  if (!touched) return leads;
  const booking = bookings.find((item) => item.leadId === thread.leadId);
  const record = {
    id: thread.leadId,
    ...lead,
    note: leads.find((item) => item.id === thread.leadId)?.note || (lead.persona === "parent" ? "Parent inquiry" : ""),
    bookingLabel: booking?.label || "",
    counselorName: booking?.counselorName || "",
  };
  return [record, ...leads.filter((item) => item.id !== record.id)];
}

function Field({ label, value }) {
  return (
    <div className="field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function App() {
  const initial = useMemo(() => loadInitial(), []);
  const [view, setView] = useState("desk");
  const [kb, setKb] = useState(initial.kb);
  const [bookings, setBookings] = useState(initial.bookings);
  const [leads, setLeads] = useState(initial.leads);
  const [thread, setThread] = useState(initial.thread);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.kb, JSON.stringify(kb));
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
    localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
    localStorage.setItem(STORAGE_KEYS.thread, JSON.stringify(thread));
  }, [kb, bookings, leads, thread]);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [thread.messages, pending, view]);

  const course = kb.courses.find((item) => item.id === thread.lead.courseId);
  const score = scoreLead(thread.lead, kb);
  const band = leadBand(score, kb);
  const activeBooking = bookings.find((item) => item.leadId === thread.leadId);

  function send(text) {
    const payload = text.trim();
    if (!payload || pending) return;
    setPending(true);
    setDraft("");
    const snapshot = { thread, kb, bookings };
    window.setTimeout(() => {
      const result = step(snapshot.thread, payload, snapshot.kb, snapshot.bookings);
      setThread(result.thread);
      setBookings(result.bookings);
      if (result.saved) setLeads((current) => upsertLead(current, result.thread, result.bookings));
      setPending(false);
    }, 240);
  }

  function askAboutCourse(courseQuery) {
    setView("desk");
    send(courseQuery);
  }

  function resetDemo() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    const seeded = seedState();
    setKb(seeded.kb);
    setBookings(seeded.bookings);
    setLeads(seeded.leads);
    setThread(seeded.thread);
    setView("desk");
    setDraft("");
  }

  function newChat() {
    setThread(freshThread(kb));
    setDraft("");
    setView("desk");
  }

  function downloadLeads() {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "24-7-scaler-leads.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark">24/7</span>
          <div>
            <p className="eyebrow">Scaler Admissions</p>
            <h1>24/7 Scaler</h1>
          </div>
        </div>
        <nav className="views">
          {VIEWS.map(([id, label]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)} type="button">
              {label}
              {id === "leads" ? <em>{leads.length}</em> : null}
              {id === "courses" ? <span className="badge-count">{kb.courses.length}</span> : null}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button type="button" onClick={newChat}>
            New chat
          </button>
          <button type="button" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </header>

      {view === "desk" ? (
        <main className="workspace">
          <section className="chat">
            <div className="log" ref={logRef} aria-live="polite">
              {thread.messages.map((message, index) => {
                const last = index === thread.messages.length - 1;
                return (
                  <article key={message.id} className={`bubble ${message.role}`}>
                    <p>{message.text}</p>
                    {message.booking ? (
                      <div className="confirm">
                        <span>On the Admissions Calendar</span>
                        <strong>{message.booking.label}</strong>
                        <em>
                          {message.booking.counselorName} · {message.booking.courseName}
                        </em>
                      </div>
                    ) : null}
                    {last && message.chips?.length ? (
                      <div className="chips">
                        {message.chips.map((item) => (
                          <button key={item.payload} type="button" onClick={() => send(item.payload)} disabled={pending}>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
              {pending ? <article className="bubble assistant waiting">Asha is checking Scaler admissions records…</article> : null}
            </div>
            <form
              className="composer"
              onSubmit={(event) => {
                event.preventDefault();
                send(draft);
              }}
            >
              <label className="sr" htmlFor="ask">
                Message 24/7 Scaler
              </label>
              <input
                id="ask"
                value={draft}
                placeholder="Ask about all courses in detail, fees, hostel, NSET, or EMI…"
                onChange={(event) => setDraft(event.target.value)}
              />
              <button type="submit" disabled={pending || !draft.trim()}>
                Send
              </button>
            </form>
          </section>

          <aside className="slip">
            <p className="eyebrow">Active Inquiry</p>
            <h2>{thread.lead.name || (thread.lead.persona === "parent" ? "Parent (Class 12)" : "Prospective Student")}</h2>
            <div className={`band ${band.toLowerCase()}`}>{band}</div>
            <div className="meter" aria-label={`Fit score ${score}`}>
              <span style={{ width: `${score}%` }} />
            </div>
            <p className="score-label">{score} / 100 fit score (Goal, Budget & Timeline)</p>
            <Field label="Inquiry Type" value={thread.lead.persona === "parent" ? "Parent (SST)" : "Student / Professional"} />
            <Field label="Program" value={course ? course.shortName || course.name : "Exploring all"} />
            <Field label="Primary Goal" value={goalLabel(thread.lead.goal)} />
            <Field label="Budget" value={thread.lead.budget ? formatINR(thread.lead.budget) : "Not shared"} />
            <Field label="Timeline" value={timelineLabel(thread.lead.timeline)} />
            <Field label="Email" value={thread.lead.email || "Not shared"} />
            <Field label="Phone" value={thread.lead.phone ? `+91 ${thread.lead.phone}` : "Not shared"} />
            <Field
              label="Counselor Call"
              value={activeBooking ? `${activeBooking.label} · ${activeBooking.counselorName}` : "Not booked"}
            />
            {course ? (
              <div className="course-note">
                <strong>{course.name}</strong>
                <span>Fee: {course.feeRange || formatINR(course.price)}</span>
                <span>Duration: {course.duration}</span>
                <span>Mode: {course.mode}</span>
              </div>
            ) : null}
          </aside>
        </main>
      ) : null}

      {view === "courses" ? (
        <CoursesView kb={kb} onAskCourse={askAboutCourse} />
      ) : null}

      {view === "leads" ? (
        <main className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Admissions CRM</p>
              <h2>Qualified Leads & Inquiries</h2>
            </div>
            <button type="button" onClick={downloadLeads}>
              Download Leads (JSON)
            </button>
          </div>
          <p className="hint">
            Priority is {kb.hotScore}+ and Qualified is {kb.qualifiedScore}+. Leads qualify by program match, target timeline, contact info, and budget alignment with Scaler fee tiers.
          </p>
          <div className="lead-grid">
            {leads.map((lead) => {
              const leadCourse = kb.courses.find((item) => item.id === lead.courseId);
              const leadScore = scoreLead(lead, kb);
              const leadBandName = leadBand(leadScore, kb);
              return (
                <article key={lead.id} className="lead-card">
                  <header>
                    <h3>{lead.name || "Anonymous Inquiry"}</h3>
                    <span className={`band ${leadBandName.toLowerCase()}`}>{leadBandName}</span>
                  </header>
                  <p className="score-label">{leadScore} / 100 Lead Score</p>
                  <Field label="Program" value={leadCourse ? leadCourse.shortName || leadCourse.name : "All programs"} />
                  <Field label="Goal" value={goalLabel(lead.goal)} />
                  <Field label="Budget" value={lead.budget ? formatINR(lead.budget) : "Not shared"} />
                  <Field label="Timeline" value={timelineLabel(lead.timeline)} />
                  <Field label="Contact" value={[lead.email, lead.phone ? `+91 ${lead.phone}` : ""].filter(Boolean).join(" · ") || "Not shared"} />
                  <Field label="Counselor Call" value={lead.bookingLabel ? `${lead.bookingLabel} · ${lead.counselorName}` : "Not booked"} />
                  {lead.note ? <p className="note">{lead.note}</p> : null}
                </article>
              );
            })}
          </div>
        </main>
      ) : null}

      {view === "calendar" ? <Calendar kb={kb} bookings={bookings} /> : null}
      {view === "knowledge" ? <Knowledge kb={kb} onChange={setKb} /> : null}
    </div>
  );
}

function CoursesView({ kb, onAskCourse }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = kb.courses.filter((c) => {
    if (filter === "sst" && c.audienceType !== "student_parent") return false;
    if (filter === "working" && c.audienceType !== "working") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchSyllabus = c.syllabus.some((s) => s.toLowerCase().includes(q));
      const matchDesc = (c.eligibility + " " + c.outcomes + " " + c.mode).toLowerCase().includes(q);
      return matchName || matchSyllabus || matchDesc;
    }
    return true;
  });

  return (
    <main className="panel courses-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Official Knowledge Base · As of {kb.lastVerifiedDate || "21 Nov 2026"}</p>
          <h2>All Scaler Courses & Detailed Syllabi</h2>
        </div>
        <button
          type="button"
          onClick={() => onAskCourse("give info of all the course in detail")}
        >
          Ask Desk for Full Summary
        </button>
      </div>

      <div className="courses-toolbar">
        <div className="filter-pills">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">
            All Programs ({kb.courses.length})
          </button>
          <button className={filter === "sst" ? "active" : ""} onClick={() => setFilter("sst")} type="button">
            Undergraduate Campus (SST)
          </button>
          <button className={filter === "working" ? "active" : ""} onClick={() => setFilter("working")} type="button">
            Working Professionals
          </button>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search by topic, syllabus, or skill (e.g. AI, DevOps, Python, DSA, Hostel)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="courses-grid">
        {filtered.map((course) => (
          <article key={course.id} className="course-card">
            <header className="course-card-head">
              <span className={`tag ${course.audienceType}`}>{course.audience}</span>
              <h3>{course.name}</h3>
              <div className="fee-highlight">
                <span className="fee-label">Total Fee</span>
                <span className="fee-value">{course.feeRange || formatINR(course.price)}</span>
              </div>
            </header>

            <div className="course-meta-grid">
              <div className="meta-item">
                <span>Duration</span>
                <strong>{course.duration}</strong>
              </div>
              <div className="meta-item">
                <span>Learning Mode</span>
                <strong>{course.mode}</strong>
              </div>
              <div className="meta-item">
                <span>Eligibility</span>
                <strong>{course.eligibility}</strong>
              </div>
              <div className="meta-item">
                <span>EMI / Payment</span>
                <strong>{course.emiTerms}</strong>
              </div>
            </div>

            {course.degree ? (
              <div className="course-degree-badge">
                <span>🎓 Parallel Degree</span>
                <p>{course.degree}</p>
              </div>
            ) : null}

            {course.track === "sst" ? (
              <div className="hostel-table-box">
                <h4>Hostel & Accommodation (Per Year):</h4>
                <div className="hostel-row">
                  <span>Triple Sharing</span>
                  <strong>{formatINR(kb.hostelDetails?.triple || 123000)} / yr</strong>
                </div>
                <div className="hostel-row">
                  <span>Double Sharing</span>
                  <strong>{formatINR(kb.hostelDetails?.double || 156000)} / yr</strong>
                </div>
                <div className="hostel-row">
                  <span>Large Double Sharing</span>
                  <strong>{formatINR(kb.hostelDetails?.largeDouble || 180000)} / yr</strong>
                </div>
                <small className="hostel-note">{kb.hostelDetails?.fourYearEstimate}</small>
              </div>
            ) : null}

            <div className="course-syllabus-section">
              <h4>Detailed Curriculum & Modules ({course.syllabus.length} Modules):</h4>
              <ul className="syllabus-list">
                {course.syllabus.map((module, i) => (
                  <li key={i}>{module}</li>
                ))}
              </ul>
            </div>

            <div className="course-outcomes">
              <span>Career Outcomes</span>
              <p>{course.outcomes}</p>
            </div>

            {course.gapsNote ? (
              <p className="gaps-notice">
                ℹ️ <em>Admissions Advisory: {course.gapsNote}</em>
              </p>
            ) : null}

            <footer className="course-card-actions">
              <button
                type="button"
                className="btn-chat"
                onClick={() => onAskCourse(`Tell me in detail about ${course.name}`)}
              >
                Inquire in 24/7 Chat
              </button>
              <button
                type="button"
                className="btn-book"
                onClick={() => onAskCourse(`I want to book a counseling session for ${course.name}`)}
              >
                Book Counseling
              </button>
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}

function Calendar({ kb, bookings }) {
  const days = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < 6; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  const later = bookings.filter((booking) => !days.some((day) => booking.start.startsWith(stampDay(day))));

  return (
    <main className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Admissions Team Schedule</p>
          <h2>Counseling Calendars</h2>
        </div>
      </div>
      <p className="hint">
        {kb.counselorHours}. The 24/7 Scaler desk qualifies students and reserves verified slots directly on the counselors' calendars.
      </p>
      <div className="counselors">
        {kb.counselors.map((counselor) => (
          <article key={counselor.id}>
            <strong>{counselor.name}</strong>
            <span>{counselor.focus}</span>
          </article>
        ))}
      </div>
      <div className="week">
        {days.map((day) => {
          const key = stampDay(day);
          const items = bookings.filter((booking) => booking.start.startsWith(key));
          return (
            <section key={key}>
              <h3>
                {day.toLocaleDateString("en-IN", { weekday: "short" })}
                <span>{day.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </h3>
              {items.length === 0 ? <p className="empty">Open</p> : null}
              {items.map((booking) => (
                <article key={booking.id} className="hold">
                  <strong>{booking.label.split("·")[1]?.trim() || booking.label}</strong>
                  <span>{booking.name}</span>
                  <em>{booking.courseName}</em>
                  <em>{booking.counselorName}</em>
                </article>
              ))}
            </section>
          );
        })}
      </div>
      {later.length ? (
        <div className="later">
          <h3>Upcoming Later This Month</h3>
          {later.map((booking) => (
            <p key={booking.id}>
              {booking.label} · {booking.name} · {booking.courseName} · {booking.counselorName}
            </p>
          ))}
        </div>
      ) : null}
    </main>
  );
}

function Knowledge({ kb, onChange }) {
  const [courseId, setCourseId] = useState(kb.courses[0].id);
  const course = kb.courses.find((item) => item.id === courseId) || kb.courses[0];

  function patchCourse(partial) {
    onChange({
      ...kb,
      courses: kb.courses.map((item) => (item.id === course.id ? { ...item, ...partial } : item)),
    });
  }

  function patchDesk(partial) {
    onChange({ ...kb, ...partial });
  }

  return (
    <main className="panel knowledge">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Verified Knowledge Base · {kb.lastVerifiedDate || "21 Nov 2026"}</p>
          <h2>Scaler Admissions Facts & Rules</h2>
        </div>
      </div>
      <p className="hint">
        Fees, syllabi, and batch dates in 24/7 Scaler chat dynamically reference this data. Changing values here immediately changes what the chatbot answers.
      </p>
      <div className="kb-grid">
        <form className="kb-card" onSubmit={(event) => event.preventDefault()}>
          <h3>Admissions Desk Settings</h3>
          <label>
            Institute Branding
            <input value={kb.institute} onChange={(event) => patchDesk({ institute: event.target.value })} />
          </label>
          <label>
            Desk Name
            <input value={kb.brandName} onChange={(event) => patchDesk({ brandName: event.target.value })} />
          </label>
          <label>
            Assistant Name
            <input value={kb.assistantName} onChange={(event) => patchDesk({ assistantName: event.target.value })} />
          </label>
          <label>
            Campus & Location
            <input value={kb.city} onChange={(event) => patchDesk({ city: event.target.value })} />
          </label>
          <label>
            Last Verified Date
            <input value={kb.lastVerifiedDate} onChange={(event) => patchDesk({ lastVerifiedDate: event.target.value })} />
          </label>
          <label>
            Official Scholarship Policy
            <textarea
              rows={3}
              value={kb.scholarshipNote}
              onChange={(event) => patchDesk({ scholarshipNote: event.target.value })}
            />
          </label>
          <label>
            EMI Policy
            <textarea rows={3} value={kb.emiNote} onChange={(event) => patchDesk({ emiNote: event.target.value })} />
          </label>
        </form>

        <form className="kb-card" onSubmit={(event) => event.preventDefault()}>
          <h3>Course Knowledge Editor</h3>
          <label>
            Select Program
            <select value={course.id} onChange={(event) => setCourseId(event.target.value)}>
              {kb.courses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fee (Numeric INR)
            <input
              type="number"
              min="0"
              step="1000"
              value={course.price}
              onChange={(event) => patchCourse({ price: Number(event.target.value) })}
            />
          </label>
          <label>
            Fee Range / Display String
            <input
              value={course.feeRange || ""}
              onChange={(event) => patchCourse({ feeRange: event.target.value })}
            />
          </label>
          <label>
            Duration
            <input value={course.duration} onChange={(event) => patchCourse({ duration: event.target.value })} />
          </label>
          <label>
            Next Batch Date
            <input
              type="date"
              value={course.nextBatch}
              onChange={(event) => patchCourse({ nextBatch: event.target.value })}
            />
          </label>
          <label>
            Eligibility
            <input
              value={course.eligibility}
              onChange={(event) => patchCourse({ eligibility: event.target.value })}
            />
          </label>
          <label>
            EMI Terms & Payment Notes
            <input
              value={course.emiTerms || ""}
              onChange={(event) => patchCourse({ emiTerms: event.target.value })}
            />
          </label>
          <label>
            Syllabus (one line per module)
            <textarea
              rows={6}
              value={course.syllabus.join("\n")}
              onChange={(event) => patchCourse({ syllabus: event.target.value.split("\n").filter(Boolean) })}
            />
          </label>
          <label>
            Admissions / Gaps Note
            <input
              value={course.gapsNote || ""}
              onChange={(event) => patchCourse({ gapsNote: event.target.value })}
            />
          </label>
        </form>
      </div>
    </main>
  );
}
