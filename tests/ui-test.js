"use strict";
// Loads the real page in jsdom and drives its form. Requires jsdom (see README). Exit 2 if jsdom is missing.
const fs = require("fs"), path = require("path");
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require("jsdom")); }
catch (e) { console.error("jsdom not available; UI tests not executed."); process.exit(2); }

const html = fs.readFileSync(path.join(__dirname, "..", "mf-faq-prototype.html"), "utf8");
const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => errors.push(String(e && e.message || e)));
vc.on("error", e => errors.push(String(e)));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(win) { win.Element.prototype.scrollIntoView = function () {}; } // not implemented in jsdom; present in browsers
});
const w = dom.window, d = w.document;
const wait = ms => new Promise(r => setTimeout(r, ms));
const rows = [];
function rec(id, name, ok, actual) { rows.push({ id, name, ok: !!ok, actual: String(actual) }); }

async function ask(q) {
  d.getElementById("q").value = q;
  d.getElementById("f").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await wait(260);
}
const bots = () => Array.from(d.querySelectorAll("#chat .msg.bot"));
const users = () => Array.from(d.querySelectorAll("#chat .msg.me"));

(async () => {
  await wait(50);
  rec("U1", "Page loads with 3 suggested questions and a labelled input", d.querySelectorAll("#ex button").length === 3 && !!d.querySelector('label[for="q"]') && !!d.getElementById("q"),
      "chips=" + d.querySelectorAll("#ex button").length + ", label present=" + !!d.querySelector('label[for="q"]'));

  await ask("   ");
  rec("U2", "Empty input shows a prompt and adds no user bubble", bots().length === 1 && users().length === 0 && /type a question/.test(bots()[0].textContent),
      "bots=" + bots().length + ", users=" + users().length + ", text=" + (bots()[0] && bots()[0].textContent));

  const PAN = "ABCDE1234F";
  await ask("My PAN is " + PAN + " please check the exit load");
  const lastUser = users()[users().length - 1].textContent;
  rec("U3", "Sensitive input is masked in the chat and not present anywhere on the page",
      lastUser.includes("[Message hidden") && !d.body.textContent.includes(PAN) && bots()[bots().length - 1].textContent.includes("didn’t process"),
      "user bubble=\"" + lastUser + "\"; PAN in page=" + d.body.textContent.includes(PAN));

  await ask("What is the expense ratio of the Large Cap Fund?");
  const fact = bots()[bots().length - 1];
  const links = fact.querySelectorAll("a");
  rec("U4", "Factual answer shows exactly one source link with document date, verification date and historical flag",
      links.length === 1 && /Document date: March 2025/.test(fact.textContent) && /Last verified: 7 Nov 2026/.test(fact.textContent) && /Dated source/.test(fact.textContent),
      "links=" + links.length + "; href=" + (links[0] && links[0].href.slice(0, 60)) + "…");

  await ask("Exit load of Large Cap and ELSS?");
  const two = bots().slice(-2);
  rec("U5", "Multi-scheme question renders one answer per scheme, each with one link",
      two.length === 2 && two.every(b => b.querySelectorAll("a").length === 1),
      "answers=" + two.length + ", links=" + two.map(b => b.querySelectorAll("a").length).join(","));

  const beforeChip = bots().length;
  d.querySelector("#ex button").click();
  await wait(260);
  rec("U6", "Suggested question chip submits and returns an answer", bots().length === beforeChip + 1 && bots()[bots().length - 1].querySelectorAll("a").length === 1,
      "bots before=" + beforeChip + " after=" + bots().length);

  await ask("Should I buy the ELSS fund?");
  const ref = bots()[bots().length - 1];
  rec("U7", "Advice request gets a refusal with no source figures", /buy, sell or hold/.test(ref.textContent), ref.textContent.slice(0, 90));

  const factBots = bots().filter(b => /Last verified:/.test(b.textContent));
  rec("U8", "Every answer that shows a source has exactly one link", factBots.length > 0 && factBots.every(b => b.querySelectorAll("a").length === 1),
      "answers with source=" + factBots.length + "; link counts=" + factBots.map(b => b.querySelectorAll("a").length).join(","));

  rec("U9", "No uncaught JavaScript errors while using the page", errors.length === 0, errors.length ? errors.join(" | ") : "none");

  let failed = 0;
  for (const r of rows) { if (!r.ok) failed++; console.log(`${r.id.padEnd(4)} ${(r.ok ? "PASS" : "FAIL").padEnd(5)} ${r.name}\n     actual: ${r.actual}`); }
  console.log(`${rows.length - failed} passed, ${failed} failed, ${rows.length} total (jsdom ${require("jsdom/package.json").version})`);
  w.close();
  process.exit(failed ? 1 : 0);
})();
