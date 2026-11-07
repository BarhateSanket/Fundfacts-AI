# Submission checklist (milestone brief)

| Brief item | Status | Where / note |
|---|---|---|
| Pick ONE product | Met | Groww track (branding only) |
| One AMC, 3 to 5 schemes | Met | ICICI Prudential; Large Cap, Flexi Cap, ELSS Tax Saver |
| Collect 15 to 25 public AMC, SEBI or AMFI pages | Met (16) | `sources.csv`: 7 opened and read, 7 text read from search results, 2 linked but not opened. Status is stated per row. |
| Working prototype link | Met, with action needed | Artifact link (private until you share it). GitHub Pages URL after you enable Pages. |
| Answers factual queries only | Met | Scheme-by-topic answers, refusals for advice |
| One clear source link in every answer | Met for factual answers | System messages (privacy, scope, clarification) carry no link. The Flexi expense-ratio abstention links to a page that was linked but not opened. |
| Refuse opinion or portfolio questions with a polite message and an educational link | Met | Bluebook link on opinion refusals |
| Welcome line, 3 example questions, "Facts-only. No investment advice." | Met | Header and suggestion chips |
| Public sources only, no third-party blogs | Met | Register contains only AMC, AMFI and SEBI pages |
| No PII stored or accepted | Met (pattern-based) | Hidden, not stored, not sent. Tested. |
| No performance claims or return comparisons | Met | Returns refusal |
| Answers ≤ 3 sentences | Met | Tested on all emitted text |
| "Last updated from sources:" label | Met | "Last updated from sources (document date)" and "Last verified" |
| Source list (CSV or MD) | Met | `sources.csv` |
| README with setup, scope, known limits | Met | `README.md` |
| Sample Q&A (5 to 10 queries) | Met (10) | `sample_qa.md`, generated from the shipped code |
| Disclaimer snippet | Met | `disclaimer.md` and the app header |
| Skill W1: identify the fact, decide answer or refuse | Met | Classifier with labelled and holdout tests |
| Skill W2: prompting, concise phrasing, safe refusals, citation wording | Met | Refusal and citation wording in `core` |
| Skill W3: RAG, small-corpus retrieval with citations | Not met | No retrieval over the corpus. Answers come from a fixed, source-mapped table. |

**Before you submit**
1. Share the artifact link so it is visible to others.
2. Create a GitHub repository, push this folder, and enable Pages (see README). Use the Pages URL as the working prototype link.
3. Decide whether the W3 gap is acceptable for this milestone, or whether retrieval over `sources.csv` needs to be added.
