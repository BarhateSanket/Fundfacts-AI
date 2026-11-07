# FundFacts AI — Mutual Fund Facts FAQ

An educational, facts-only mutual fund FAQ assistant built for the **NextLeap System Design, LLMs & Prompt Engineering milestone (Groww track)**.

FundFacts AI answers factual questions about selected ICICI Prudential mutual fund schemes using a curated collection of official source documents. It provides source links, document dates, verification dates, and abstains when information cannot be verified.

> **Disclaimer:** This is an educational project, not an investment advisory service. It does not provide personalized investment recommendations, return predictions, or buy/sell advice.

## Project Overview

- **Project:** FundFacts AI
- **Product track:** Groww (selected milestone track; independent educational project, not affiliated with Groww)
- **AMC:** ICICI Prudential Mutual Fund
- **Application:** Single-page, browser-based FAQ assistant
- **Supported schemes:** 
  - ICICI Prudential Large Cap Fund (formerly Bluechip Fund)
  - ICICI Prudential Flexi Cap Fund (formerly Flexicap Fund)
  - ICICI Prudential ELSS Tax Saver Fund

## Live Application

**[Open FundFacts AI](https://barhatesanket.github.io/Fundfacts-AI/)**

## Features

- Answers factual mutual fund questions about expense ratios, exit loads, minimum SIP amounts, ELSS lock-in periods, benchmarks, riskometers, and statement downloads.
- Supports scheme identification and common abbreviations such as SIP, TER, and ELSS.
- Uses keyword matching with typo tolerance.
- Provides official source links and available document and verification dates.
- Supports multiple scheme-and-topic questions, subject to a four-answer limit.
- Abstains when an answer cannot be verified using the approved sources.
- Refuses personalized investment advice, return predictions, and unsupported comparisons.
- Includes pattern-based detection for potentially sensitive personal information.

## Documentation

| Document | Description |
|---|---|
| [Sample Q&A](docs/sample-qa.md) | Ten representative questions and expected assistant responses |
| [QA Report](QA-REPORT.md) | Defects, fixes, test results, evaluation and known limitations |
| [Submission Checklist](SUBMISSION.md) | Milestone requirement tracking |
| [Disclaimer](disclaimer.md) | Educational and financial-use limitations |
| [Source Register](sources.csv) | Official source URLs, document dates, data dates and verification status |

## Repository Structure

```text
Fundfacts-AI/
│
├── index.html
├── sources.csv
├── sample_qa.md
├── disclaimer.md
├── QA-REPORT.md
├── SUBMISSION.md
├── README.md
│
└── tests/
    ├── run-tests.js
    ├── qa-probes.js
    └── ui-test.js
```

## How to Run

### 1. Run the application

Download or clone the repository and open:

```text
index.html
```

The application runs directly in a modern browser.

### 2. Run logic tests

Requirements: Node.js 18 or later.

```bash
node tests/run-tests.js
node tests/qa-probes.js
```

### 3. Run UI tests

Install the project dependencies:

```bash
npm install
```

Run:

```bash
npm run test:ui
```

### 4. Deploy using GitHub Pages

1. Open the repository Settings.
2. Navigate to Pages.
3. Select Deploy from a branch.
4. Choose the `main` branch.
5. Select the root folder.
6. Save the configuration.

The deployed application is available at:

```text
https://barhatesanket.github.io/Fundfacts-AI/mf-faq-prototype.html
```

## How the System Works

### 1. Input and privacy checks

The application checks incoming questions for patterns resembling PAN, Aadhaar, mobile numbers, email addresses, account numbers, and OTPs before answer generation.

Detected inputs are excluded from normal answer generation and are not displayed in the chat interface.

Detection is pattern-based and is not guaranteed to identify every form of sensitive information.

### 2. Question classification

The application identifies question intent using predefined keywords, abbreviations, and typo-tolerant matching.

It recognizes categories such as:

- Expense ratio
- Exit load
- Minimum SIP
- ELSS lock-in
- Benchmark
- Riskometer
- Statement download

### 3. Scheme identification

The application matches supported scheme names and their known aliases.

Questions involving unsupported fund houses or categories are handled through the application's refusal logic.

### 4. Answer generation

Answers are retrieved from a predefined mapping of scheme, topic, and approved source information.

Each factual answer:
- Is limited to three sentences.
- Includes an approved source link.
- Displays available document and verification dates.
- Abstains when the required information cannot be verified.

### 5. Safety and refusal handling

The assistant refuses:
- Personalized investment recommendations.
- Buy, sell, or hold decisions.
- Return predictions.
- Unsupported fund comparisons.
- Prompt-injection attempts.

It provides educational or official reference links where applicable.

### 6. Source freshness warnings

The application displays warnings when a source is:
- Older than 45 days before verification.
- Undated.
- Not opened and verified.

## Technical Architecture

| Component | Implementation |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Application structure | Single-file application |
| Matching | Keyword matching and edit-distance typo tolerance |
| Data | Curated scheme and source mappings |
| Source register | CSV |
| Testing | Node.js, custom QA harness, jsdom |
| Hosting | GitHub Pages |
| Backend | Not required |
| External API | Not required |
| LLM integration | Not implemented |
| Semantic search | Not implemented |

**Important technical clarification:** FundFacts AI currently uses deterministic keyword-based matching and predefined answer-to-source mappings. It does not implement document retrieval, RAG, embeddings, vector databases, or LLM-based generation.

## Known Limitations

1. **No RAG implementation:** The current version uses a fixed answer mapping rather than retrieval over the complete document corpus.
2. **Unverified expense ratio:** The current approved source set does not contain a verified Flexi Cap expense-ratio figure.
3. **Riskometer limitations:** Some riskometer information is embedded in images or unavailable in the extracted source text.
4. **Historical figures:** Certain figures are based on older scheme documents and are flagged accordingly.
5. **Source conflicts:** Conflicting exit-load information is handled using the October 2026 AMC Bluebook rather than the older 2023 SID.
6. **Statement download limitations:** The assistant covers Consolidated Account Statements but does not establish the complete process for downloading capital-gains statements.
7. **Pattern-based privacy:** The detection mechanism may miss certain sensitive inputs or flag some non-sensitive patterns.
8. **Fund-house matching:** The current matching logic uses a predefined denylist and may not identify every unsupported fund house.
9. **Content Security Policy:** The single-file architecture requires inline scripts and styles, so `unsafe-inline` remains enabled.
10. **Browser testing:** UI tests use jsdom. Real-browser compatibility, accessibility, screen readers, and mobile behaviour have not been comprehensively tested.

## Quality Assurance

The project includes a dedicated QA suite covering:

- Regression testing
- Question classification
- Scheme identification
- Source mapping
- Unsupported questions and abstention
- Privacy and safety behaviour
- User-interface behaviour

For detailed test evidence, defects, fixes, evaluation results, and unresolved limitations, see:

**[FundFacts AI — Quality Assurance Report](QA-REPORT.md)**

For representative application responses, see:

**[FundFacts AI — Sample Q&A](sample_qa.md)**

Test counts and results should be interpreted against the exact application version on which the tests were executed.

## Source Attribution

FundFacts AI uses a curated collection of official documents and information from:

- ICICI Prudential Mutual Fund
- Association of Mutual Funds in India (AMFI)
- Securities and Exchange Board of India (SEBI)
- Other approved official reference sources

The source register records available document dates, data dates, verification dates, and source status.

Source information may change. Users should consult the latest official scheme documents before making investment decisions.

## Disclaimer

FundFacts AI is an independent educational project developed for learning and demonstration purposes.

It is not affiliated with, endorsed by, or operated by Groww or ICICI Prudential Mutual Fund.

The application provides factual information from selected sources and does not constitute investment advice, financial planning, or a recommendation to buy, sell, or hold any mutual fund.

Users should consult official scheme documents and a SEBI-registered investment adviser when appropriate.

---

**Project:** FundFacts AI  
**Track:** Groww  
**Developer:** Sanket Barhate  
**Repository:** [GitHub — FundFacts AI](https://github.com/BarhateSanket/Fundfacts-AI)  
**Live Demo:** [Open Application](https://barhatesanket.github.io/Fundfacts-AI/mf-faq-prototype.html)
