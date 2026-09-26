# BudgetBasics Manual Test Scenarios

These scenarios define sample inputs and expected behavior for manual validation. **No scenario is marked passed until someone runs it in the browser and records the actual result.**

## Calculator and savings

| ID | Scenario / input | Expected result | Actual result |
|---|---|---|---|
| TC-01 | Select USD and enter monthly income `600`; calculate. | Needs `$300`, Wants `$180`, Savings `$120`; progress bars are 50%, 30%, and 20%; educational note is visible. | Not run |
| TC-02 | Submit an empty monthly-income field. | Calculation is rejected with an understandable validation message. | Not run |
| TC-03 | Enter `0` or a negative monthly income. | Calculation is rejected; results are not presented as valid. | Not run |
| TC-04 | Goal `Study Laptop`, target `600`, current `150`, monthly `75`. | Remaining `$450`, estimate `6 months`, progress `25%`, tip visible. | Not run |
| TC-05 | Goal target `200`, current `200`, monthly `50`. | Goal is shown as funded with `0 months` and 100% progress. | Not run |
| TC-06 | Leave the goal name blank or set monthly contribution to `0`. | Required/positive-value validation prevents the estimate. | Not run |

## Learning modules and gallery

| ID | Scenario / input | Expected result | Actual result |
|---|---|---|---|
| TC-07 | Select the On-Campus Dorm Resident sample profile. | Income, 50/30/20 summary, and itemized income/expense table are shown. | Not run |
| TC-08 | Answer a daily Need vs Wants example correctly, then incorrectly. | Immediate feedback explains the answer; Next example changes the scenario. | Not run |
| TC-09 | Open each Money Mistakes accordion. | Each item exposes a description, student scenario, and corrective action. | Not run |
| TC-10 | Filter the infographic gallery by Budgeting, Needs vs Wants, then Savings. | Only matching original visuals are shown; All topics restores the full gallery. | Not run |
| TC-11 | Review infographic captions and alternative text, then open the printable checklist. | The visuals have captions and text alternatives; the monthly checklist opens ready to print or save as PDF. | Not run |

## Expense, search, and assistance

| ID | Scenario / input | Expected result | Actual result |
|---|---|---|---|
| TC-12 | With the sample ledger loaded, inspect the totals. | Tracked total is `14,000`; remaining balance is `16,000` against the `30,000` sample income. | Not run |
| TC-13 | Add a `Food` expense of `100`, edit it to `125`, then delete it. | Row and totals update each time; remaining balance changes accordingly and returns after deletion. | Not run |
| TC-14 | Export expense rows to CSV. | A user-initiated CSV download contains description, date, category, and amount. | Not run |
| TC-15 | Search for `expenses`, filter to a topic, sort by Title A–Z, then search for a unique absent term. | Matching results update; sorting is alphabetical; the empty state is announced in text. | Not run |
| TC-16 | Ask `How much should I save?`, then ask an unrelated question. | A configured educational response appears first; a safe fallback appears second; disclaimer remains visible. | Not run |

## Forms, navigation, and responsive behavior

| ID | Scenario / input | Expected result | Actual result |
|---|---|---|---|
| TC-17 | Submit feedback with missing fields, invalid email, and rating outside 1–5; then submit valid values. | Invalid values are blocked by browser/app validation; valid submission shows confirmation and does not transmit or store the form values. | Not run |
| TC-18 | Submit contact form with a missing message, then a valid message. | Required-field validation runs; valid submission shows confirmation without network submission. | Not run |
| TC-19 | Use every main navigation link and sitemap link. | Link reaches its matching module; Contact and Feedback details open; Chatbot opens its panel. | Not run |
| TC-20 | Use keyboard Tab/Enter through menu, accordions, forms, and theme control. | Focus remains visible; controls are operable without a pointer. | Not run |
| TC-21 | Check widths near 390px, 768px, 1024px, and 1440px in light and dark themes. | No clipped content or unintended horizontal page overflow; mobile navigation opens and closes; text and controls remain readable. | Not run |
| TC-22 | Reload in the same browser session and a new session. | Local visit count increments once per session on that browser only; it is not represented as a global count. | Not run |
| TC-23 | Scroll down until Back to top appears and activate it. | Page smoothly returns to the top. | Not run |
