import assert from "node:assert/strict";
import test from "node:test";
import { freshThread, step, _test } from "./engine.js";
import { defaultKnowledge, formatINR } from "./knowledge.js";

const now = new Date(2026, 10, 21, 12, 0, 0, 0);

test("parses budget, timeline, and ignores false names", () => {
  assert.equal(_test.parseBudget("Budget is 4 lakh"), 400000);
  assert.equal(_test.parseBudget("around 80k"), 80000);
  assert.equal(_test.parseBudget("the fee is 399000"), 399000);
  assert.equal(_test.parseTimeline("I can start next month"), "next-month");
  assert.equal(_test.parseName("I am a beginner"), "");
  assert.equal(_test.parseName("My name is Nikhil P"), "Nikhil P");
  assert.equal(_test.parseEmail("mail me at nikhil@example.com today"), "nikhil@example.com");
});

test("answers fees, EMI, and syllabus from the Scaler knowledge base", () => {
  const kb = defaultKnowledge();
  const thread = freshThread(kb);
  const priced = step(thread, "What is the fee for data science?", kb, [], now);
  const reply = priced.thread.messages.at(-1).text;
  assert.match(reply, /3,99,000/);
  assert.match(reply, /9,791/);
  assert.match(reply, /20,000/);

  const syllabus = step(freshThread(kb), "Show the data science syllabus in detail", kb, [], now);
  assert.match(syllabus.thread.messages.at(-1).text, /Python/);
  assert.match(syllabus.thread.messages.at(-1).text, /MLOps/);
});

test("gives info of all courses in detail", () => {
  const kb = defaultKnowledge();
  const thread = freshThread(kb);
  const result = step(thread, "give info of all the course in detail", kb, [], now);
  const text = result.thread.messages.at(-1).text;
  assert.match(text, /Scaler School of Technology/);
  assert.match(text, /Data Science & Machine Learning/);
  assert.match(text, /AI & ML with Agentic AI/);
  assert.match(text, /DevOps & Cloud/);
  assert.match(text, /Scaler Academy/);
  assert.match(text, /Neovarsity/);
  assert.match(text, /1,23,000/); // hostel triple sharing
});

test("provides detailed hostel fee breakdown for SST", () => {
  const kb = defaultKnowledge();
  const thread = freshThread(kb);
  const result = step(thread, "What are the hostel fees?", kb, [], now);
  const text = result.thread.messages.at(-1).text;
  assert.match(text, /Triple Sharing.*1,23,000/);
  assert.match(text, /Double Sharing.*1,56,000/);
  assert.match(text, /Large Double Sharing.*1,80,000/);
  assert.match(text, /5.49 Lakh/);
});

test("rejects unauthorized CS500 coupon code as required by admissions policy", () => {
  const kb = defaultKnowledge();
  const thread = freshThread(kb);
  const result = step(thread, "Can I use CS500 coupon code for discount?", kb, [], now);
  const text = result.thread.messages.at(-1).text;
  assert.match(text, /CS500/);
  assert.match(text, /not an official Scaler offer/i);
});

test("qualifies a lead and books an admissions counseling slot", () => {
  const kb = defaultKnowledge();
  let bookings = [];
  let thread = freshThread(kb);
  const first = step(
    thread,
    "I want to transition into data science. My budget is 4 lakh and I can start next month.",
    kb,
    bookings,
    now
  );
  thread = first.thread;
  const offer = thread.messages.at(-1);
  assert.equal(thread.phase, "book");
  assert.ok(offer.chips.length >= 3);
  assert.match(offer.text, /Meera Iyer/);
  assert.match(offer.text, /3,99,000/);
  assert.equal(thread.lead.budget, 400000);
  assert.equal(thread.lead.goal, "switch");

  const held = step(thread, offer.chips[0].payload, kb, bookings, now);
  thread = held.thread;
  assert.match(thread.messages.at(-1).text, /name.*email/i);
  assert.equal(thread.phase, "details");

  const booked = step(
    thread,
    "My name is Nikhil and my email is nikhil@example.com. Phone 9876543210",
    kb,
    bookings,
    now
  );
  assert.equal(booked.bookings.length, 1);
  assert.equal(booked.bookings[0].email, "nikhil@example.com");
  assert.equal(booked.bookings[0].counselorName, "Meera Iyer");
  assert.match(booked.thread.messages.at(-1).text, /confirmed for a counseling call with.*Meera Iyer/);
});

test("uses an edited fee from the knowledge base", () => {
  const kb = defaultKnowledge();
  kb.courses = kb.courses.map((course) =>
    course.id === "dsml" ? { ...course, price: 380000, feeRange: "₹3,80,000" } : course
  );
  const result = step(freshThread(kb), "What is the fee for data science?", kb, [], now);
  assert.match(result.thread.messages.at(-1).text, /3,80,000/);
});
