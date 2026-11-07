# FundFacts AI — Final Quality Assurance & Evaluation Report
**Submission Version | 7 November 2026**

## 1. Executive Summary

FundFacts AI is a mutual fund facts FAQ assistant designed to provide factual information about selected ICICI Prudential mutual fund schemes.

The application was evaluated for classification accuracy, scheme identification, source attribution, data freshness, privacy protection, refusal behaviour, security and user-interface functionality.

Two major QA rounds were conducted. The first identified and reproduced defects in v1. The subsequent round incorporated fixes, expanded source coverage, corrected source conflicts and validated the updated application.

### Final test results

| Test suite | Passed | Failed | Result |
|---|---:|---:|---|
| Regression suite | 31 | 0 | PASS |
| QA harness | 14 | 0 | PASS |
| UI tests (jsdom 24.1.3) | 9 | 0 | PASS |
| **Total executions** | **54** | **0** | **PASS** |

These are test execution counts, not necessarily 54 unique test scenarios.

**Overall assessment:** The prototype passes its reported automated test suites. However, factual coverage, retrieval capabilities, real-browser accessibility and several source-verification tasks remain incomplete.

---

## 2. QA Methodology

The testing process followed these steps:

1. Reproduced defects from the previous application version using an independent QA harness (`tests/qa-probes.js`).
2. Defined expected behaviour from the project requirements rather than copying the existing implementation.
3. Fixed reproduced defects in `mf-faq-prototype.html`.
4. Created a 24-question holdout set and executed it before making fixes based on its results.
5. Added regression tests for corrected behaviour.
6. Ran the updated regression suite, QA harness and UI tests.
7. Reviewed source attribution, document dates, staleness warnings, privacy controls and unsupported-question handling.
8. Checked test execution exit codes.

**Important evaluation limitation:** The 30-question unseen set was created during the same development step as the pattern changes. It is not an independent holdout. The original 24-question holdout was subsequently reused as regression data.

---

## 3. Defects Identified and Resolved

### 3.1 Classification and intent detection

**Problems identified in v1:**

- Questions about ordinary exit-load conditions were incorrectly classified as investment opinions.
- "What should I know about exit load?" was incorrectly refused.
- Some riskometer questions were incorrectly classified as factual questions.
- Index-fund questions were incorrectly matched to the Large Cap benchmark.
- Factsheet-download questions were incorrectly routed to statement-download handling.
- Some ELSS-related statement questions triggered incorrect refusals.
- Questions about future returns and predicted investment values were not consistently refused.

**Fixes implemented:**

- Opinion detection now requires more specific action-oriented phrases, such as "should I buy", "buy or sell now" and "good time to buy".
- Punctuation and dots inside keywords are normalized.
- Prediction-related patterns were added to the returns-refusal logic.
- Incorrect benchmark matching for generic index-fund questions was reduced.

### 3.2 Scheme identification

**Problems identified in v1:**

- US Bluechip questions were incorrectly matched to ICICI Prudential Large Cap Fund.
- HDFC ELSS questions were incorrectly matched to ICICI Prudential ELSS Tax Saver Fund.
- Mixed-scheme questions produced misleading answers.
- Large & Mid Cap questions received an inappropriate clarification prompt.

**Fixes implemented:**

- Known external fund houses and unsupported categories are checked before scheme matching.
- Explicit unsupported-scheme questions receive a refusal instead of an ICICI scheme answer.
- Ambiguous scheme matching was improved.

**Remaining limitation:** External fund-house detection still relies on a denylist. Unknown fund houses and generic scheme names can still produce incorrect scheme matching.

### 3.3 Privacy and PII detection

**Problems identified in v1:**

The following sensitive-data formats bypassed the original pattern checks:

- PAN with spaces or separators.
- PAN without conventional word boundaries.
- Fullwidth digits.
- Zero-width Unicode characters.
- Indian phone numbers with spaces and country codes.
- Obfuscated email addresses.
- OTP-related phrases and numbers.

**Fixes implemented:**

- Unicode NFKC normalization.
- Zero-width character removal.
- Expanded separator handling.
- Improved digit-boundary checks.
- Additional OTP-related patterns.

**Remaining limitation:** Bare numerical sequences, spelled-out digits and spaced single-digit sequences are not reliably detected without contextual indicators.

Pattern-based PII detection cannot guarantee identification of every sensitive-data format.

### 3.4 Source accuracy and answer completeness

**Problems identified in v1:**

- Historical figures were presented without sufficient freshness warnings.
- An undated AMFI source was treated without adequate caution.
- An unsupported Flexi Cap lock-in claim was made.
- The Large Cap expense-ratio answer omitted the Other-plan figure.
- Source conflicts were not adequately documented.

**Fixes implemented:**

- Historical and undated facts now receive appropriate warnings.
- Unsupported claims are replaced with partial answers or abstentions.
- Large Cap expense ratio includes both historical plan figures.
- Source conflicts are documented and resolved using the more recent applicable official source.
- Source attribution and citation-host validation were expanded.

---

## 4. Source Verification and Data Integrity

The source registry was reviewed to distinguish current, historical, superseded and unverified documents.

### Important source corrections

| Issue | Resolution |
|---|---|
| Flexi Cap exit-load conflict | October 2026 Bluebook takes precedence over the superseded 2023 SID for exit load. |
| ELSS minimum SIP | ₹500, in multiples of ₹500, with at least six instalments, based on the dated SID. |
| Flexi Cap minimum SIP | ₹100, in multiples of ₹1, with at least six instalments, based on the dated SID. |
| Large Cap expense ratio | Both Direct (0.89%) and Other (1.41%) figures included, with March 2025 historical warning. |
| Capital-gains statement question | AMFI CAS instructions are provided, with an explicit distinction between CAS and capital-gains statements. |
| SEBI source registry | A SEBI URL previously misidentified as a Master Circular was corrected to the Flexi Cap SID. |
| Citation allowlist | `www.amfiindia.com` and `www.sebi.gov.in` were added. |

### Source freshness policy

The application distinguishes:

- Document publication date.
- Underlying data date.
- Last verification date.
- Historical or superseded source status.

A 45-day staleness threshold is used as an application policy, not as a SEBI or regulatory requirement.

The application does not automatically treat an old source as current merely because it was recently opened.

---

## 5. Final QA Results

### 5.1 Regression suite

**File:** `tests/run-tests.js`

| Metric | Result |
|---|---:|
| Passed | 31 |
| Failed | 0 |
| Status | PASS |

Two assertions were updated to reflect the new warning-field implementation rather than the previous historical flag.

### 5.2 QA harness

**File:** `tests/qa-probes.js`

**Result: 14 checks passed, 0 failed.**

The QA harness covers:

- 66-question labelled dataset.
- 30-question additional evaluation set.
- 24-question original holdout reused as regression data.
- PII format variants.
- Citation validity.
- Source staleness.
- Unsupported claims.
- Sentence-length limits.
- Security checks.
- Execution timing.

The 30-question set is not an independent holdout, and the 24-question set is no longer considered unseen evaluation data.

### 5.3 UI tests

**File:** `tests/ui-test.js`

**Environment:** jsdom 24.1.3

| Metric | Result |
|---|---:|
| Passed | 9 |
| Failed | 0 |
| Status | PASS |

These tests validate the supported DOM-level interface behaviour. They do not establish full compatibility across real browsers or assistive technologies.

---

## 6. Evaluation Coverage

The latest coverage review reports:

| Coverage category | Scheme-topic cells |
|---|---:|
| Clean factual coverage | 20 |
| Partial coverage | 3 |
| Abstention | 1 |
| **Total evaluated cells** | **24** |

The results exclude statement-related questions.

Clean coverage means the application has a supported factual answer for the evaluated cell. Partial coverage means the response is restricted by source limitations or incomplete information. Abstention means the application does not provide an unsupported factual figure.

These figures represent coverage classifications, not a measured accuracy percentage.

---

## 7. Previously Identified Holdout Issues

The original 24-question holdout produced five mismatches:

- Four mismatches were fixed.
- One remains a labelling ambiguity.

The unresolved example is:

"Which one gives higher returns, ELSS or Flexi?"

The application refuses this question whether it is classified as a returns request or a comparison request.

The final QA suite accepts either refusal for this particular question. The standalone original holdout script continues to report the mismatch.

Expected labels were written by the developer, so the evaluation may share the developer's assumptions and blind spots.

---

## 8. Remaining Limitations and Known Risks

The following issues remain open and should not be presented as completed functionality.

### 8.1 Retrieval architecture

- Retrieval-Augmented Generation (RAG) over the document corpus is not implemented.
- Current matching relies on keywords and edit-distance-based matching.
- Semantic retrieval across the complete source corpus is not available.
- Generic index-related questions may receive unsupported responses because of restrictions introduced to prevent false-positive benchmark matching.

### 8.2 Incomplete source verification

The following facts remain unverified or incompletely supported:

| Scheme / information | Status |
|---|---|
| Large Cap expense ratio | Historical figures only; March 2025 source |
| Flexi Cap expense ratio | Unverified |
| Flexi Cap riskometer | Unverified |
| ELSS riskometer | Unverified |
| Current riskometer levels | Require readable, current source verification |
| Statement-download guidance | CAS guidance supported; capital-gains statement guidance incomplete |

The ELSS and Flexi Cap minimum SIP answers are now available from their respective dated SIDs. They are no longer classified as complete abstentions, but their freshness limitations remain.

### 8.3 Privacy limitations

- Bare numerical sequences without contextual keywords are not reliably detected.
- Spelled-out numbers are not detected consistently.
- Spaced single-digit sequences may bypass detection.
- Pattern-based privacy checks are not a substitute for comprehensive sensitive-data detection.

### 8.4 Scheme identification limitations

The application uses a denylist of known external fund houses.

An unlisted fund house with a generic scheme name may still be incorrectly associated with an ICICI Prudential scheme. Although the answer heading identifies the matched scheme, this is not a complete safeguard.

### 8.5 Content Security Policy

The single-file implementation still requires `'unsafe-inline'` for inline scripts and styles.

A hash-based or nonce-based CSP strategy has not been implemented.

### 8.6 Browser and accessibility testing

The following have not been validated in a real-browser environment:

- Cross-browser rendering.
- Mobile responsiveness.
- Screen-reader compatibility.
- Keyboard navigation and accessibility.
- Real-device performance.

### 8.7 Evaluation limitations

- The 30-question additional set is not an independent holdout.
- The 24-question original holdout has been reused for regression.
- Expected answers and labels are developer-authored.
- Passing automated tests does not establish complete factual accuracy or financial-data reliability.

---

## 9. Recommended Future Improvements

| Priority | Improvement | Objective |
|---|---|---|
| High | Open and verify the August 2026 complete factsheet | Improve expense-ratio and riskometer coverage |
| High | Implement corpus-level RAG | Improve document retrieval and factual grounding |
| High | Replace denylist-only scheme detection | Reduce cross-fund-house matching errors |
| High | Improve PII detection | Reduce privacy-related bypasses |
| Medium | Verify latest AMFI and AMC statement instructions | Improve statement-related answers |
| Medium | Introduce independent evaluation datasets | Obtain more reliable performance measurements |
| Medium | Test on real browsers and mobile devices | Validate practical usability |
| Medium | Improve CSP configuration | Reduce reliance on unsafe inline execution |
| Medium | Add automated source-freshness monitoring | Identify stale financial information |

---

## 10. Final QA Conclusion

FundFacts AI has undergone two rounds of quality assurance, including defect reproduction, implementation fixes, regression testing, source verification, privacy testing and UI-level validation.

The final reported automated test results are:

- 31 regression tests passed.
- 14 QA harness checks passed.
- 9 UI tests passed.
- Zero reported failures across the three final test suites.

The application demonstrates controlled factual answering, source attribution, dated-source warnings, refusal of unsupported investment advice and basic PII protection.

However, the current implementation remains a keyword-based FAQ prototype rather than a full RAG-based retrieval system. Some scheme-specific facts remain unverified, and privacy, scheme-identification, browser and accessibility limitations are documented.

**Final assessment:** The application passes its current automated QA suites and is suitable for submission as a tested functional prototype, provided its documented limitations are clearly communicated. The reported test results should not be interpreted as proof of complete factual accuracy, regulatory compliance or production readiness.

---

**Report date:** 7 November 2026  
**Application:** FundFacts AI  
**Version:** Submission QA  
**Primary implementation:** `mf-faq-prototype.html`  
**QA scripts:** `tests/run-tests.js`, `tests/qa-probes.js`, `tests/ui-test.js`
