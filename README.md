Mutual Fund Facts FAQ: ICICI Prudential (v2)

Educational, facts-only FAQ for three ICICI Prudential schemes. One HTML file, no API key, no backend, no browser storage, no network requests.

Scope: Large Cap Fund (formerly Bluechip), Flexi Cap Fund (formerly Flexicap), ELSS Tax Saver Fund. Product track: Groww (branding only, not affiliated).

Files
mf-faq-prototype.html: the application. Script id="core" is the logic; id="ui" is the DOM layer.
QA-REPORT.md: defects found, fixes, test results and limitations.
sources.csv: source register (document date, data date, verification date, status).
tests/run-tests.js: regression suite (31 cases).
tests/qa-probes.js: QA harness (classifier sets, PII, citations, staleness, security, timing).
tests/ui-test.js: UI tests in jsdom (9 cases).
Run
Open mf-faq-prototype.html in a browser.
node tests/run-tests.js and node tests/qa-probes.js
npm install jsdom, then NODE_PATH=$(npm root) node tests/ui-test.js. The UI test polyfills scrollIntoView (missing in jsdom, present in browsers).
Answer rules
Factual answers have at most three sentences and one link to an allowlisted official host.
Each source shows its document date, its verification date and a warning when its data is undated, more than 45 days older than verification, or never opened.
Privacy warnings, scope notices and clarifications carry no link.
Anything that cannot be verified from an approved source is an abstention.
Known limits

See QA-REPORT.md. Main points: keyword matching only (no semantic search); pattern-based privacy checks cannot catch every format; the fund-house list is a denylist; unverified facts abstain.
