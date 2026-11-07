# QA report: Mutual Fund Facts FAQ (v2)

## Method
1. Reproduced defects in the previous version (v1) with an independent harness (`tests/qa-probes.js`). Expected behaviour was written from the requirements, not from the code.
2. Fixed the reproduced defects in `mf-faq-prototype.html`.
3. Ran a fresh 24-question holdout once, before any fixes to it. It was used as regression data afterwards, so it no longer counts as a holdout.

## Defects reproduced in v1 and fixed
| Area | Reproduced in v1 | Fix in v2 |
|---|---|---|
| Classifier, false positives | 6: "If I sell after 1 month…" refused as opinion; "What should I know about exit load?" refused; "Is the riskometer … risky?" answered as factual; "index fund" answered with benchmark; "Download the Flexi Cap factsheet" routed to statements; "sell ELSS" in a statement question refused | Opinion patterns now require action phrases ("should I buy", "buy or sell now", "good time to buy"), not bare verbs |
| Classifier, false negatives | 3: "What should I know about the ELSS lock-in?"; "e.l.s.s lock-in"; "If I sell…" (same as above) | Dots and hyphens inside words are removed before matching; "should I know" is no longer opinion |
| Scheme selection | 3: "ICICI Prudential US Bluechip" answered as Large Cap; "HDFC ELSS Tax Saver" answered as ELSS; "Large Cap and US bluechip expense ratio" answered as Large Cap | Other fund houses and categories are checked first and get a refusal |
| Scheme selection, ambiguity | "Large & Mid Cap" got a misleading "which scheme?" prompt | Explicit other-scheme refusal |
| Predictions missed | "Will … grow next year?"; "How much money will I get back?" routed to "unsupported" | Prediction patterns added to the returns refusal |
| Injection | "pretend", "reset your instructions", "share/show your instructions" not refused | Added; the last two were in the fresh holdout |
| PII bypass | 7 reproduced: spaced PAN; PAN with no word boundary; fullwidth digits; zero-width characters; "+91 (98765) 43210"; "name [at] example [dot] com"; "one time password 482913". 4 more with hyphen, dot or underscore separators | Input normalised (NFKC, zero-width removed); separators allowed; digit boundaries instead of `\b`; OTP-phrase patterns |
| Incorrect citation | None reproduced (every factual item had one allowlisted source) | Unchanged; verified by Q3 and U8 |
| Historical or dated facts shown as current | 3 outputs: ELSS factsheet (NAV 31 Aug 2026, 68 days before verification) and the undated AMFI sheet, with no warning | Warnings computed from each source's data date; undated and never-opened sources are labelled |
| Unsupported answer | Flexi lock-in asserted "no lock-in", which the Bluebook does not say | Now a partial answer that states what the document does and does not say |
| Incomplete answer | Large Cap expense ratio gave only the Direct plan figure | Both plans from the one-pager (0.89% Direct, 1.41% Other), dated |
| Sentences over three | None found (110 texts checked) | Unchanged; enforced by Q7 and test 17 |
| Security | No injection sinks, no network calls, no storage. Worst pathological input: 46 ms (limit 250 ms) | Data objects frozen so they cannot be changed at runtime |
| Tests | The regression suite had no coverage of the defects above | Regression suite plus QA harness and jsdom UI tests |

## Results (all executed; exit codes checked)
- Regression suite (`tests/run-tests.js`): **31 passed, 0 failed**. Two assertions changed from the old `historical` flag to the new warning field.
- QA harness (`tests/qa-probes.js`): **14 checks passed, 0 failed**. Includes the 66-question labelled set, 30 questions from an unseen set, 24 holdout round-1 questions as regression cases, PII variants, citations, staleness, claims, sentence limit, security and timing.
- UI tests (`tests/ui-test.js`, jsdom 24.1.3): **9 passed, 0 failed**.

## Caveats on the evidence
- The 30-question "unseen" set (Q12) was written in the same step as the pattern changes, so it is not a clean holdout.
- The 24-question holdout found 5 mismatches. 4 were fixed. 1 is a labelling ambiguity: "Which one gives higher returns, ELSS or Flexi?" is refused either way (as returns or as compare). The standalone holdout script still reports it; the QA suite accepts any refusal for it.
- Expected labels were written by me, so they can share my blind spots.

## Remaining limitations (not fixed)
- **Matching is keyword and edit-distance based.** "index" was removed from benchmark terms because it caused false positives on "index fund" questions. The cost is that "Which index does ELSS track?" gets an unsupported notice.
- **Bare digits with no PII keyword are not detected** (e.g. "482913" on its own). Pattern matching cannot distinguish these from ordinary numbers.
- **Spelled-out digits** ("nine eight seven …") and **spaced single digits** are not detected.
- **Other fund houses:** the list is a denylist. A fund house not on it, using a generic name such as "ELSS", would be matched to the ICICI scheme. The answer heading always names the ICICI scheme, so the mismatch is visible to the user.
- **Content-Security-Policy still needs `'unsafe-inline'`** because the single-file design uses inline scripts and styles. Hash-based CSP would break whenever the page is republished or wrapped.
- **Browser rendering, mobile layout and screen readers were not tested** in a real browser.
- **Unverified facts still abstain:** Flexi Cap expense ratio, Flexi Cap and ELSS minimum SIP, Flexi Cap and ELSS riskometer levels, statement-download steps.
- **The 45-day staleness threshold is a policy choice,** not a regulatory rule.
