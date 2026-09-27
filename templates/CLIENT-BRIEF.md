# Client brief: {{Client / business name}}

<!--
Template for project/BRIEF.md. Filled in by the agent during intake (see
CLIENT-INTAKE.md). Replace every {{placeholder}}; delete these comments.

Every fact is one line, starting with its source tag and ending with where
it came from:

  - [CLIENT-PROVIDED] Fact as the client stated it. (source: originals/notes.txt)
  - [RESEARCHED] Fact verified in public sources. (source: https://…)
  - [INFERRED] Professional judgement. Reason: … (confidence: high/medium/low)
  - [MISSING] What is unknown. Impact: critical | non-critical. Default: …

Never tag an inference as CLIENT-PROVIDED or RESEARCHED. Never invent
prices, awards, statistics, testimonials, business claims, certifications,
addresses, services, credentials, partnerships or performance claims; if
the client didn't provide it and research can't verify it, it is MISSING.

Where a client statement conflicts with research, keep both lines and
add it to "Contradictions".
-->

| Field        | Value                                             |
| ------------ | ------------------------------------------------- |
| Project slug | `{{slug}}`                                        |
| Branch       | `client/{{slug}}`                                 |
| Intake date  | {{YYYY-MM-DD}}                                    |
| Brief status | {{Draft / Awaiting answers / Ready for workflow}} |
| Materials    | See [`brief/INVENTORY.md`](brief/INVENTORY.md)    |

## Summary

{{Three to five sentences: who the client is, what they sell, to whom,
where, and what the website must achieve. Only facts tagged
CLIENT-PROVIDED or RESEARCHED; mark anything else as inferred.}}

## Critical gaps and questions

<!-- Only items that could materially change purpose, architecture,
legal/safety requirements, business objective or major scope. -->

| #   | Missing | Why it matters | Default if unanswered | Blocks                        |
| --- | ------- | -------------- | --------------------- | ----------------------------- |
| 1   | {{…}}   | {{…}}          | {{…}}                 | {{stage(s) or "nothing yet"}} |

## Contradictions

| #   | Statement A (source) | Statement B (source) | Impact | Recommended resolution |
| --- | -------------------- | -------------------- | ------ | ---------------------- |
| 1   | {{…}}                | {{…}}                | {{…}}  | {{…}}                  |

---

## 1. Business

### Client / business name

- {{[TAG] … (source: …)}}

### Industry

- {{[TAG] …}}

### Location / market

<!-- Physical location(s), service area, markets served, languages,
cultural context, time zone. -->

- {{[TAG] …}}

### Business description

- {{[TAG] …}}

### Services / products

<!-- Only services the client offers. Never add plausible-sounding
services. Include prices only if client-provided or published by them. -->

- {{[TAG] …}}

### Market position

<!-- Price tier, differentiation, reputation, how they compare. -->

- {{[TAG] …}}

## 2. Brand

### Brand

<!-- Name usage, logo, colours, typefaces, voice, existing guidelines. -->

- {{[TAG] …}}

### Vision

- {{[TAG] …}}

### Mission

- {{[TAG] …}}

## 3. People

### Target audience

- {{[TAG] …}}

### Customer profile

<!-- Who buys, why, what they fear, what persuades them, devices, language. -->

- {{[TAG] …}}

## 4. Goals

### Business goals

- {{[TAG] …}}

### Website goals

<!-- The primary action the site must drive, and secondary actions. -->

- {{[TAG] …}}

### Success criteria

<!-- How the client (and we) will judge success; measurable where possible. -->

- {{[TAG] …}}

## 5. Scope

### Desired pages

- {{[TAG] …}}

### Required functionality

- {{[TAG] …}}

### Appointment / booking requirements

<!-- Booking platform, calendar, payment at booking, confirmations,
cancellation rules. Endpoints and account access are usually critical. -->

- {{[TAG] …}}

### Integrations

<!-- Booking, CRM, email marketing, payments, maps, analytics, chat. Note
anything that needs accounts, credentials or paid plans. -->

- {{[TAG] …}}

### SEO requirements

<!-- Target searches, locations, languages, existing rankings to protect,
redirects from an old site. -->

- {{[TAG] …}}

### Technical requirements

<!-- Hosting, domain, CMS/editing needs, languages, legal (privacy,
cookies, accessibility), performance. -->

- {{[TAG] …}}

## 6. Existing presence

### Existing website

| URL     | What it is | Accessible?                | Key findings | Keep / change |
| ------- | ---------- | -------------------------- | ------------ | ------------- |
| {{url}} | {{…}}      | {{yes/partial/no: reason}} | {{…}}        | {{…}}         |

### Social media

| Platform | URL     | Accessible? | Key findings (audience, content, tone, visuals) |
| -------- | ------- | ----------- | ----------------------------------------------- |
| {{…}}    | {{url}} | {{…}}       | {{…}}                                           |

### Existing copy

<!-- Where usable copy exists (site, brochure, posts) and its quality. -->

- {{[TAG] …}}

## 7. Market and references

### Competitors

| Competitor | URL     | Source (client-named / researched) | Notes (positioning, strengths, gaps) |
| ---------- | ------- | ---------------------------------- | ------------------------------------ |
| {{…}}      | {{url}} | {{…}}                              | {{…}}                                |

### Reference websites

<!-- Sites the client likes. Record what they like about each; these are
inspiration, never something to copy. -->

| URL     | What the client likes (or likely likes) | Source |
| ------- | --------------------------------------- | ------ |
| {{url}} | {{…}}                                   | {{…}}  |

### Visual references

<!-- Mood boards, photos, screenshots, non-web references. -->

- {{[TAG] …}}

## 8. Assets

### Brand assets

<!-- Logo formats (vector?), colour codes, fonts and licences, guidelines. -->

| Asset | File  | Quality | Usable for web? | Notes |
| ----- | ----- | ------- | --------------- | ----- |
| {{…}} | {{…}} | {{…}}   | {{…}}           | {{…}} |

### Photography / video assets

| Asset | File  | Resolution / length | Quality | Best use | Notes |
| ----- | ----- | ------------------- | ------- | -------- | ----- |
| {{…}} | {{…}} | {{…}}               | {{…}}   | {{…}}    | {{…}} |

### Asset gaps

<!-- What's missing or too weak for a premium result, and the recommended
fix: client supplies, free licensed stock (source + licence), or a paid
option (needs approval). Never silently substitute AI-generated assets. -->

- {{…}}

## 9. Commercial

### Budget

- {{[TAG] …}}

### Deadline

- {{[TAG] …}}

### Client-provided requirements

<!-- Verbatim or close paraphrase of explicit client requirements
("must have", "must not"), each with its source. -->

- {{[CLIENT-PROVIDED] … (source: …)}}

### Constraints

- {{[TAG] …}}

### Known risks

<!-- Scope vs budget, missing assets, unverifiable claims, legal/regulatory,
dependencies on third parties, deadline. -->

- {{…}}

## 10. Open questions

<!-- Non-critical unknowns, with the default being used. These don't block
work; they're listed so the owner can correct them at any time. -->

| #   | Question | Default in use | Reason |
| --- | -------- | -------------- | ------ |
| 1   | {{…}}    | {{…}}          | {{…}}  |

## 11. Sources

<!-- Every file and URL referenced above. Files are relative to project/. -->

- {{brief/originals/… or https://…}}
