# Project workflow

How the agent takes a client brief to a finished premium website on its own.

Read this together with [`CLAUDE.md`](CLAUDE.md) (standards, stack, rules)
and [`references/VISUAL-BENCHMARK.md`](references/VISUAL-BENCHMARK.md) (the
quality bar). This document sets out **how the work flows**; those two set out
**what good looks like**. If they conflict, `CLAUDE.md` and the benchmark win.

---

## 1. How it starts

The owner gives a client brief in any form: a paragraph, a list, a
document, links, a folder of assets, or a mix. **No workflow instructions
are needed.** The agent reads the brief and runs this workflow end to end.

The brief may contain any of: business name, industry, location, audience,
brand material, services/products, goals, competitors, existing website,
social media, reference sites, images/video/assets, desired pages,
functionality, budget, deadline and notes. Anything missing is researched or
inferred, following §3.

## 2. Autonomy doctrine

### 2.1 Decide and continue

The agent acts as a senior creative technologist leading the project. It
**makes ordinary professional decisions itself and keeps working**: design,
copy, structure, technique, tooling, file organisation, refactoring, test
strategy, asset processing and scope sequencing. It records significant
decisions in `project/DECISIONS.md` with a one-line rationale, so they can
be reviewed later without being approved in advance.

### 2.2 Ask the owner only when

1. **Critical information is genuinely missing** and can't reasonably be
   researched or inferred (see §3.3).
2. **Money is involved**: payment, a paid service, subscription, API
   credits, paid stock, paid fonts, paid AI generation or paid hosting.
3. **Access is needed**: credentials, passwords, security permissions or
   account authorisation.
   **Installing system packages** (`apt` or similar) also needs approval:
   use tools already available or a legitimate alternative first (see
   `CLIENT-INTAKE.md`, "When an inspection tool is missing").
4. **An action is irreversible or externally consequential**: deploying,
   publishing, DNS changes, sending anything to the client or a third
   party, deleting non-generated work, pushing to `main`, force-pushing, or
   making anything public.
5. **The client's requirements contradict each other** in a way that
   materially changes the project.
6. **There are materially different interpretations** where picking wrong
   would cause significant rework (e.g. "a site for the new restaurant" when
   the brief describes two restaurants).

Everything else is decided without asking.

### 2.3 How to ask

- **Batch questions**: collect them and ask once, not one at a time.
- **Always include a recommended answer and a default**: "I'll proceed with
  X unless you say otherwise."
- **Keep working while waiting** on everything the question doesn't block,
  using the stated default where it's safe and reversible.
- Never ask something the brief, the research or a reasonable inference
  already answers.

### 2.4 When something fails

1. **Diagnose**: read the error, logs and output; find the actual cause.
2. **Retry** if the failure looks transient (network, flaky test, timeout).
3. **Use another legitimate method or tool** (a different library, a
   different asset source, a different technique).
4. **Simplify**: reduce the ambition of the effect while preserving the
   concept (e.g. pre-rendered video instead of real-time 3D, CSS instead of
   WebGL). Record the simplification as a decision.
5. **Ask for help only** when there is genuinely no reasonable autonomous
   path.

**Never** bypass security, licensing, payment, authentication, quotas,
rate limits, robots.txt/terms of service or platform restrictions, and never
weaken a quality gate to make a failure disappear (see `CLAUDE.md`
Workflow).

## 3. Working rules for every project

### 3.1 Project isolation

- `main` is the clean foundation. **Client work never goes on `main`.**
- Each client gets a branch `client/<slug>` created from the latest `main`
  (the slug is a short, lowercase client name).
- All planning lives in a `project/` folder on that branch (§3.2). The site
  itself is built in the normal `src/` structure.
- **Commit** at the end of every stage with a clear message
  (`<stage>: <summary>`).
- **Push** the client branch to `origin` only after confirming the
  repository is private (`gh repo view --json visibility`). Never push to
  `main`, never force-push, and never make anything public without
  approval.

### 3.2 The project dossier (`project/`)

| File                 | Created in stage         | Purpose                                                             |
| -------------------- | ------------------------ | ------------------------------------------------------------------- |
| `brief/originals/`   | Client brief             | The original brief and supplied assets, stored untouched            |
| `brief/INVENTORY.md` | Client brief             | Every supplied file and link: what it is, quality, usefulness       |
| `assets/`            | Client brief             | Organised working copies of useful supplied assets                  |
| `BRIEF.md`           | Understand               | Normalised brief, with each fact's source, gaps and assumptions     |
| `RESEARCH.md`        | Research                 | Findings, sources and implications                                  |
| `STRATEGY.md`        | Strategy                 | Positioning, goals, audience, success measures, scope               |
| `DIRECTION.md`       | Creative direction       | The concept and the full design system rationale                    |
| `SITEMAP.md`         | Information architecture | Pages, sections, narrative, navigation, conversion paths            |
| `CONTENT.md`         | Content/asset plan       | Copy, asset list, sources, licences, open items                     |
| `DECISIONS.md`       | Throughout               | Dated log of significant decisions and simplifications              |
| `QA-REPORT.md`       | Testing → Final QA       | Check results, benchmark scorecard, screenshots, fixes              |
| `qa/`                | Visual QA onward         | Review screenshots (desktop, tablet, mobile; motion on/off)         |
| `DELIVERY.md`        | Delivery                 | Handover summary, open items, how to run and deploy                 |
| `research/captures/` | Research                 | Third-party screenshots for study; **git-ignored, never committed** |

Keep documents short and useful. Every section should serve a decision.
For a small brief, several files can be brief, but none are skipped.

### 3.3 Facts, assumptions and gaps

Every fact in `BRIEF.md` is labelled by source (full rules in
[`CLIENT-INTAKE.md`](CLIENT-INTAKE.md) §4):

- **CLIENT-PROVIDED**: stated in the brief or supplied material.
- **RESEARCHED**: found in public sources (cite the URL).
- **INFERRED**: a reasonable professional judgement (state the reasoning).
- **MISSING**: unknown.

**Critical information** means details that can't be researched or inferred
without risking harm, legal exposure or major rework:

- what the business actually is and offers;
- factual claims that will be published (prices, credentials,
  certifications, awards, addresses, opening hours, licence numbers,
  statistics, client names, testimonials);
- the primary call to action if it requires a real endpoint (booking system,
  phone number, email, form destination);
- the language(s) of the site;
- legally required content for the jurisdiction (e.g. privacy notice
  requirements).

**Never fabricate facts.** Where a critical fact is missing but work can
continue, use a visible placeholder in the form
`[[CONFIRM: what is needed]]` and list it in `CONTENT.md`. Placeholders
block Final QA (§4.15) unless the owner accepts them as known open items.

Non-critical gaps (audience nuance, tone, page list, section order, visual
direction, copy voice, feature ideas) are **inferred**, not asked.

### 3.4 Scope and budget realism

The target is a site that looks like a ₹7–10 lakh build on a $700–$1,000
budget. The agent reaches that by **craft and focus, not volume**:

- Put most of the effort into **one or two signature moments** (usually
  the hero and one narrative set-piece) plus impeccable typography, spacing
  and details everywhere else.
- Prefer a **tight page count** (typically 1–5 pages or a single long-form
  narrative) done superbly over many pages done adequately.
- If the brief asks for more than the budget can support at premium
  quality, flag it as a **deviation** (§5) with a recommended scope.

### 3.5 Asset and licensing rules

- **Client-supplied assets come first.** Assume the client has rights to
  what they supply. If the provenance of something looks doubtful (e.g.
  watermarked stock), flag it.
- **Free, properly licensed sources are fine without asking**, for example
  fonts under the SIL Open Font License or free commercial-use licences, and
  stock under licences that permit commercial use. Record every third-party
  asset's source and licence in `CONTENT.md`.
- **Anything paid** (stock, fonts, 3D models, music, AI generation credits,
  plugins) **needs approval** first.
- **Never** use competitor or reference-site assets, third-party
  trademarks, or anything copied from research.
- AI-generated imagery, when used, must be art-directed and graded into the
  site's world, reviewed for artefacts (hands, text, logos), and never used
  to depict real people, places, products or results as if they were real.

---

## 4. Stages

Each stage lists:

- **Responsible for**: what the agent owns.
- **Decides autonomously**: what it settles without asking.
- **Gathers**: the information it collects.
- **Tools and techniques**: what it may use.
- **Exit outputs**: what must exist before moving on.
- **Needs approval**: the only conditions that stop for the owner.

Stages run in order, but it's normal to revisit earlier ones when
something is learned later (e.g. research changing the direction). Update
the relevant dossier file and log the change when that happens.

### 4.0 Client brief (intake)

Stages 4.0 and 4.1 are carried out by the intake procedure in
[`CLIENT-INTAKE.md`](CLIENT-INTAKE.md), triggered by **"Start client
project"**. The summary below is for reference.

- **Responsible for:** receiving the brief in any form and preserving it.
- **Decides autonomously:** the project slug, how to organise supplied
  files, and when to start.
- **Gathers:** everything supplied (text, links, files, assets), from the
  owner's message and `inbox/` (copied and checksum-verified; `inbox/`
  itself is never modified).
- **Tools and techniques:** `git switch -c client/<slug> main`; copy the
  brief and assets untouched into `project/brief/originals/`;
  `pnpm intake:inventory`; organise working copies into `project/assets/`.
- **Exit outputs:** the client branch; `project/brief/originals/`,
  `project/brief/INVENTORY.md` and `project/assets/`.
- **Needs approval:** nothing, unless the brief is ambiguous about which
  business or project it's for (§2.2 item 6).

### 4.1 Understand

- **Responsible for:** a complete, honest picture of the client and the
  job.
- **Decides autonomously:** how to interpret the brief; which gaps are
  critical versus inferable; working assumptions.
- **Gathers:** business model, offer, audience, location and culture,
  brand assets and voice, goals, constraints (deadline, budget,
  functionality, integrations), existing web and social presence.
- **Tools and techniques:** read all supplied material; view every supplied
  image and video frame; fetch the existing site and public social profiles;
  classify facts per §3.3.
- **Exit outputs:** `BRIEF.md` (from
  [`templates/CLIENT-BRIEF.md`](templates/CLIENT-BRIEF.md)) with labelled
  facts, assumptions, gaps and a list of critical questions (if any).
- **Needs approval:** only for critical gaps (§3.3) or contradictions and
  ambiguities (§2.2 items 5–6), all batched into one message. Non-blocking
  work continues meanwhile.

### 4.2 Research

- **Responsible for:** an evidence base for strategy and creative
  decisions, as `CLAUDE.md` requires.
- **Decides autonomously:** what to research, how deep to go, which
  sources are credible, what is relevant.
- **Gathers:**
  - the client's existing brand (site, social, reviews, press) and its
    strengths to keep;
  - three to six competitors: positioning, messaging, visual language,
    weaknesses and gaps to exploit;
  - premium and award-winning sites in and beyond the industry
    (e.g. Awwwards, FWA, CSS Design Awards, Godly, Siteinspire);
  - industry conventions to respect or deliberately break;
  - audience expectations, including local and cultural context and the
    devices the audience likely uses;
  - interaction patterns and technologies suited to the ideas;
  - visual references (photography, architecture, film, print, art)
    beyond the web.
- **Tools and techniques:** web search and page fetching; Playwright
  screenshots of public pages at low volume for study (saved to the
  git-ignored `project/research/captures/`); reading public case studies
  and documentation. Respect robots.txt and terms of service; no logins, no
  scraping behind authentication, no bulk downloading.
- **Exit outputs:** `RESEARCH.md` with, for each area, **findings → sources →
  implications for this client**, and a short "what we will not do" list
  (patterns that are generic in this market).
- **Needs approval:** only for paid research tools or access to private
  accounts (e.g. the client's analytics).

Research informs decisions; it is never a source to copy (see the
benchmark §7).

### 4.3 Strategy

- **Responsible for:** what the site must achieve and for whom.
- **Decides autonomously:** positioning statement, primary and secondary
  audiences, the one primary action (and secondary actions), key messages,
  proof points available, success measures, scope and page count within
  budget (§3.4).
- **Gathers:** synthesis of Understand and Research.
- **Tools and techniques:** positioning against competitors; mapping
  audience needs to messages; identifying the single most persuasive story
  the client can truthfully tell.
- **Exit outputs:** `STRATEGY.md`: positioning, audiences, primary action,
  message hierarchy, proof, scope, success measures.
- **Needs approval:** only if the recommended scope materially differs from
  what the brief requested (report as a deviation, §5), or if goals
  conflict (§2.2 item 5).

### 4.4 Creative direction

- **Responsible for:** a new, client-specific creative concept and design
  system. Every project is a new creative problem; nothing is reused
  because it worked before.
- **Decides autonomously:** everything below, with reasons:
  - **concept**: one sentence (benchmark principle 1);
  - **visual direction and atmosphere**, including the light;
  - **typography**: families, scale, voice shift, details;
  - **colour system**: neutral field, accent, usage rules; contrast-checked;
  - **composition and spacing** principles and grid;
  - **imagery**: style, subjects, grading, sourcing approach;
  - **motion language**: easing, timing, choreography rules, reduced-motion
    equivalents;
  - **interaction model**: signature interactions, cursor, hover, controls;
  - **3D and depth strategy**: whether 3D earns a place, and the static
    fallback;
  - **storytelling structure**: beginning, build and payoff.
- **Gathers:** strategy, research implications, the benchmark.
- **Tools and techniques:** read `references/VISUAL-BENCHMARK.md` first;
  explore two or three genuinely different directions in writing (and, if
  useful, quick static sketches in `project/`), then choose one; check the
  choice against benchmark §5 and §6 and against previous client projects
  (via `git branch --list 'client/*'` and their `DIRECTION.md`) to avoid
  repeating a style.
- **Exit outputs:** `DIRECTION.md` containing the concept, the chosen
  direction, why it fits _this_ client, the rejected alternatives and why,
  the full design system, the benchmark principles it expresses, the §6
  techniques it uses and why, and a **swap test** statement explaining why
  this couldn't be another client's site.
- **Needs approval:** not required by default. Ask only if the brief
  explicitly requires sign-off on direction, or if two directions are
  equally strong but materially different in cost or risk (§2.2 item 6).

### 4.5 Information architecture

- **Responsible for:** structure, narrative and navigation.
- **Decides autonomously:** pages, section order, narrative chapters,
  navigation model, URL structure, conversion paths, footer, 404, and
  legal pages needed.
- **Gathers:** strategy, direction, content inventory.
- **Tools and techniques:** narrative mapping (what the visitor should
  feel and know at each chapter); mobile-first ordering; checking every page
  earns its place.
- **Exit outputs:** `SITEMAP.md` with the page list, per-page section plan
  and purpose, navigation, primary action placement, and SEO basics (titles,
  descriptions, headings).
- **Needs approval:** only if the page list materially differs from pages
  the client explicitly requested.

### 4.6 Content and asset plan

- **Responsible for:** every word and asset the site needs, with its source.
- **Decides autonomously:** copywriting (from verified facts only), tone
  of voice, microcopy, alt text, which supplied assets to use, image
  treatment, crops, grading, free licensed sources, font choices within
  free licences, and 3D/video production approach.
- **Gathers:** supplied assets (reviewed for quality, resolution, rights),
  verified facts, the gaps list.
- **Tools and techniques:** writing copy to the message hierarchy; sharp
  and `astro:assets` for images; `pnpm optimize:3d` for models; ffmpeg for
  video transcoding and posters if available (installing it needs
  approval; pre-encoded client files or browser-captured posters are
  alternatives); variable font
  subsetting; recording licences.
- **Exit outputs:** `CONTENT.md` with copy per section, an asset list
  (source, licence, treatment, status), and an open-items list of
  `[[CONFIRM: …]]` placeholders.
- **Needs approval:** paid assets (§3.5); any fact that would be published
  but can't be verified.

### 4.7 Implementation

- **Responsible for:** building the site on the existing foundation to
  `CLAUDE.md` standards.
- **Decides autonomously:** component structure, code organisation,
  tokens, which foundation utilities to use, refactoring, and adding small
  dev dependencies that are free, maintained and justified (logged in
  `DECISIONS.md`; never React, Tailwind, UI kits or templates per
  `CLAUDE.md`).
- **Gathers:** direction, sitemap, content.
- **Tools and techniques:**
  - design tokens in `src/styles/tokens.css`; fonts in
    `src/styles/fonts.css`;
  - `BaseLayout.astro`, `astro:assets` `<Image>`/`<Picture>`;
  - `setupGsap()` / `MOTION_CONDITIONS`, `initSmoothScroll()`;
  - `<LazyScene>` + `registerScene()` for 3D, with an art-directed
    fallback;
  - add every page to `tests/routes.ts` **and** to `pages` in
    `lighthouserc.cjs`;
  - `pnpm dev` for iteration; `pnpm check` and `pnpm lint` continuously.
- **Exit outputs:** all pages built with real content (or tracked
  placeholders), static layout complete at all breakpoints, `pnpm check`
  and `pnpm lint` clean.
- **Needs approval:** paid services or integrations; third-party scripts
  that send visitor data (analytics, chat, embeds), which also affect
  privacy and the zero-third-party budget; any backend or form endpoint
  needing accounts or credentials.

### 4.8 Interaction and motion

- **Responsible for:** the choreography defined in `DIRECTION.md`.
- **Decides autonomously:** timelines, easing, triggers, scroll pacing,
  hover and cursor behaviour, transitions, shader and 3D details, and the
  reduced-motion variant of each.
- **Gathers:** direction, the built pages.
- **Tools and techniques:** GSAP, ScrollTrigger, SplitText (with
  accessible labels), Flip, CustomEase, Lenis, Three.js and GLSL; animate
  only `transform`/`opacity`; pause off-screen work; test with motion on and
  reduced throughout.
- **Exit outputs:** every signature moment working; each effect's purpose
  stated in `DIRECTION.md`; reduced-motion equivalents implemented; no jank
  in a Chromium performance trace.
- **Needs approval:** never for creative motion decisions.

### 4.9 Responsive design

- **Responsible for:** a composed experience at every size, especially
  mobile.
- **Decides autonomously:** mobile re-staging (crops, layer order, type
  scale), touch alternatives to hover/cursor interactions, and what to
  simplify on small or low-power devices.
- **Gathers:** the likely device mix for the audience (from research).
- **Tools and techniques:** Playwright at 390×844, 768×1024, 1440×900 and
  1920×1080, plus a narrow 360-wide check; touch emulation; landscape
  phone check.
- **Exit outputs:** no horizontal scroll, no overlap or clipped text,
  comfortable tap targets, and a mobile layout that is designed rather than
  shrunk (benchmark principle 16).
- **Needs approval:** never.

### 4.10 Testing

- **Responsible for:** automated coverage using the repository's tools.
- **Decides autonomously:** which tests to add, and re-baselining visual
  snapshots after intended changes.
- **Tools and techniques:**
  - `pnpm test` (functional, a11y, visual projects);
  - new functional tests for key behaviours (navigation, forms, primary
    action, any interactive scene), plus harness pages in `tests/harness/`
    where needed;
  - `pnpm test:visual:update` only after deliberately reviewing that the
    change is intended.
- **Exit outputs:** all tests passing; results summarised in
  `QA-REPORT.md`.
- **Needs approval:** never. Tests are fixed, not skipped or weakened.

### 4.11 Visual QA

- **Responsible for:** looking at the site as a demanding art director
  would, not just checking that it renders.
- **Decides autonomously:** what to fix and how.
- **Tools and techniques:** capture Playwright screenshots into
  `project/qa/`:
  - desktop 1440×900, tablet 768×1024, mobile 390×844;
  - motion on and reduced;
  - full page, key scroll positions, hover/focus/open states, and the 3D
    fallback.

  **Open and look at every screenshot.** Score the site against the
  benchmark with this scorecard (1–5) in `QA-REPORT.md`:

  | Dimension                  | Checks against                   |
  | -------------------------- | -------------------------------- |
  | Concept clarity            | Benchmark §3 item 1, principle 1 |
  | Art direction and light    | §2.1, §3 item 4                  |
  | Typography                 | §2.3, principles 3–4             |
  | Composition and focus      | §2.4, principle 2                |
  | Spacing                    | §2.5, principle 8                |
  | Colour discipline          | §2.6, principle 5                |
  | Imagery                    | §2.7                             |
  | Depth and layering         | §2.10, principle 7               |
  | Motion purpose and quality | §2.11, principle 12              |
  | Interaction and details    | §2.14, principle 10              |
  | Storytelling               | §2.15, principle 14              |
  | Mobile composition         | Principle 16                     |
  | Free of generic/AI tells   | §4 (every listed tell)           |
  | Swap test                  | Principle 17                     |

- **Exit outputs:** every dimension scores **4 or higher**, with a
  one-line justification each, or the site goes back to Refinement.
- **Needs approval:** never.

### 4.12 Accessibility

- **Responsible for:** WCAG 2.2 AA, as required in `CLAUDE.md`.
- **Tools and techniques:** `pnpm test:a11y` (axe, motion on and reduced);
  a manual keyboard pass (tab order, visible focus, skip link, no traps,
  menus and dialogs); checking headings and landmarks; contrast of the
  accent on every background; alt text quality; SplitText labels; checking
  that no information is conveyed only by motion, colour or 3D.
- **Exit outputs:** zero axe violations and a manual checklist recorded
  in `QA-REPORT.md`.
- **Needs approval:** never.

### 4.13 Performance

- **Responsible for:** meeting the budgets in `lighthouserc.cjs`.
- **Tools and techniques:** `pnpm lhci` (every page listed); bundle
  inspection; image, font and 3D optimisation; lazy loading; video posters
  and preload strategy; checking the LCP element is intentional.
- **Exit outputs:** all Lighthouse assertions pass. Any budget change needs
  a stated reason in `DECISIONS.md`; the default is to optimise, not to
  loosen.
- **Needs approval:** loosening an accessibility threshold is never
  allowed. Loosening a performance budget beyond a small, justified margin
  must be reported as a deviation (§5).

### 4.14 Refinement

- **Responsible for:** closing every gap found in stages 4.10–4.13,
  especially Visual QA.
- **Decides autonomously:** everything within the approved scope.
- **Tools and techniques:** fix → re-screenshot → re-score, repeated. If
  a dimension can't reach the bar after three focused iterations because of
  an external constraint (e.g. low-quality supplied photos), stop iterating
  on it, make the best achievable version, and report it as a deviation
  with a concrete remedy (e.g. "a half-day product shoot would lift
  imagery from 3 to 5").
- **Exit outputs:** an updated scorecard with all dimensions ≥ 4, or
  documented deviations.
- **Needs approval:** never, except to report deviations.

### 4.15 Final QA

- **Responsible for:** proving the whole site is complete.
- **Tools and techniques:**
  - `pnpm verify` passes (format, lint, type-check, all tests, Lighthouse);
  - a final screenshot set and benchmark scorecard;
  - a search for leftover `[[CONFIRM:` placeholders, lorem ipsum, TODOs,
    console errors, broken links and missing alt text;
  - meta tags, favicon, social preview image, 404 page, `site` URL in
    `astro.config.mjs`;
  - the `CLAUDE.md` Definition of done, item by item.
- **Exit outputs:** `QA-REPORT.md` complete.
- **Needs approval:** any open placeholders must be accepted by the owner
  as known items; otherwise the project isn't complete.

**A site is complete only when it passes the technical checks and the
premium benchmark.** Building successfully is not completion.

### 4.16 Delivery

- **Responsible for:** a clean, understandable handover.
- **Decides autonomously:** the structure of the handover documentation
  and final commit organisation on the client branch.
- **Tools and techniques:** write `DELIVERY.md`; commit; push the client
  branch (private repo only, §3.1).
- **Exit outputs:** `DELIVERY.md` with: what was built and why (concept in
  one paragraph), page list, key screenshots, QA summary, deviations from
  the brief, open items for the client, how to run, build and deploy, and
  recommended next steps.
- **Needs approval:** **deploying, publishing, connecting domains, sending
  anything to the client, and merging to `main` all require explicit
  approval.** The agent prepares everything and asks once.

---

## 5. Communicating with the owner

Communication is brief. During a project, the agent surfaces only four
kinds of message:

| Type           | When                                                    | Format                                                                     |
| -------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Decision**   | A §2.2 condition that needs the owner's choice          | The question, the options, a recommendation, and the default it will use   |
| **Blocker**    | Work can't continue without access, payment or approval | What's blocked, why, exactly what's needed, and what it's doing meanwhile  |
| **Deviation**  | The result will differ materially from the brief        | What changed, why, the impact, and the recommended path                    |
| **Completion** | Final QA passed, or delivery is ready for approval      | A summary, the scorecard, key screenshots, open items and approvals needed |

Progress updates, design rationale and routine choices go into the
dossier, not the conversation.

## 6. Approval matrix (quick reference)

| Situation                                                         | Agent's action                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| Design, copy, structure, motion, 3D, technique, tooling decisions | Decide, log, continue                                       |
| Free, properly licensed fonts, images, libraries                  | Use, record licence, continue                               |
| Inferable gaps (tone, audience nuance, page list, section order)  | Infer, label in `BRIEF.md`                                  |
| A test, lint or budget failure                                    | Diagnose and fix; never weaken                              |
| A tool or install fails                                           | Diagnose, retry, use another legitimate method, or simplify |
| Critical fact missing (§3.3)                                      | Placeholder, keep working, ask once in a batch              |
| Paid anything (services, assets, credits, subscriptions)          | **Ask**                                                     |
| Credentials, account access, permissions                          | **Ask**                                                     |
| Installing system packages (`apt` or similar)                     | Try available tools and alternatives first; else **Ask**    |
| Deploy, publish, DNS, send externally, push/merge to `main`       | **Ask**                                                     |
| Contradictory client requirements with material impact            | **Ask**, with a recommendation                              |
| Materially different interpretations risking major rework         | **Ask**, with a recommendation                              |
| Scope or budget can't support the brief at premium quality        | Report as a **deviation**                                   |
| No autonomous path after diagnosis, retries and alternatives      | **Blocker**                                                 |
