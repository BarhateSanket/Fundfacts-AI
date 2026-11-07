# Mutual Fund Facts FAQ: ICICI Prudential (Groww track)

An educational, facts-only FAQ for three ICICI Prudential schemes. It answers factual questions from a fixed set of official documents, shows one source link per answer, and refuses advice, predictions and comparisons.

- **Product track:** Groww (chosen from the milestone list; branding only, not affiliated).
- **AMC:** ICICI Prudential Mutual Fund.
- **Schemes:** ICICI Prudential Large Cap Fund (formerly Bluechip Fund), ICICI Prudential Flexi Cap Fund (formerly Flexicap Fund), ICICI Prudential ELSS Tax Saver Fund.

## Files
- `mf-faq-prototype.html`: the application. One file, no server, no API key, no browser storage, no network requests. Logic is in `<script id="core">`, the DOM layer in `<script id="ui">`.
- `sources.csv`: source register (16 official URLs) with document date, data date, verification date and status.
- `sample_qa.md`: 10 sample queries with the app's answers, links and dates, generated from the shipped code.
- `disclaimer.md`: the facts-only disclaimer used in the UI.
- `QA-REPORT.md`: defects found, fixes, test results and known limits.
- `SUBMISSION.md`: checklist against the milestone brief.
- `tests/`: regression suite, QA harness and jsdom UI tests.

## Setup
1. **Run the app:** open `mf-faq-prototype.html` in a browser.
2. **Logic tests:** `node tests/run-tests.js` and `node tests/qa-probes.js` (Node 18 or later, no installs needed).
3. **UI tests:** `npm install`, then `npm run test:ui`.
4. **Host on GitHub Pages:** push this folder, then Settings, Pages, deploy from the `main` branch root. The app is at `https://<user>.github.io/<repo>/mf-faq-prototype.html`.

## How answers are produced
1. **Privacy first.** PAN-, Aadhaar-, mobile-, email-, account- and OTP-like patterns are detected before anything else. The message is hidden in the chat and not processed further. Detection is pattern-based only.
2. **Refusals.** Opinion (buy, sell, hold, "should I", "best"), comparisons ("which is better", "vs"), predictions and return questions, and prompt-injection phrasings are refused with an educational or historical reference link.
3. **Scheme and topic matching.** Keyword matching with typo tolerance and abbreviations (TER, SIP, ELSS) picks the scheme and detail. Every scheme-and-detail pair in the question is answered, up to four. Other fund houses and categories are refused.
4. **Answers.** Each factual answer is at most three sentences and shows one link to a mapped official source, with its document date and verification date. Anything that cannot be verified from an approved source is an abstention.
5. **Warnings.** A source older than 45 days before verification, an undated source, or a source never opened carries a visible warning.

Matching is keyword-based. It is not semantic search, embeddings or an LLM.

## Known limits
- **Not a retrieval (RAG) system.** The milestone's W3 skill asks for retrieval over the corpus. This build answers from a fixed table where each answer is mapped to one source. Retrieval over the corpus is not implemented.
- **Unverified facts abstain.** Flexi Cap expense ratio (the TER page was linked but not opened), and the riskometer level for Flexi Cap and ELSS (the levels are in images or missing from the text read).
- **Dated figures.** Large Cap expense ratio is as of 31 March 2025. Flexi Cap minimum SIP comes from a 2023 SID. ELSS minimum SIP comes from an October 2025 SID. Large Cap minimum SIP comes from an undated AMFI sheet. All are flagged in the app.
- **Source conflict.** The 2023 Flexicap SID gives an exit load of 1% within 12 months. The October 2026 Bluebook gives 1% within one month. The app uses the Bluebook and does not use the SID for exit load.
- **Statement question is partial.** The AMFI page covers Consolidated Account Statements. It does not describe a capital-gains statement, and the app says so.
- **Pattern-based privacy.** Bare digit strings with no PII keyword are not detected, and neither are spelled-out digits. Some non-sensitive numbers can match (for example, a 2026 year in an OTP context).
- **Fund-house matching is a denylist.** A fund house not on the list, using a generic name like "ELSS", would match the ICICI scheme. The answer heading always names the ICICI scheme.
- **Content-Security-Policy keeps `'unsafe-inline'`.** The single-file design needs inline scripts and styles.
- **Not tested in real browsers.** UI tests run in jsdom. Mobile layout, screen readers and other browsers were not tested.

## Disclaimer
See `disclaimer.md`. It is shown in the app on every visit.
