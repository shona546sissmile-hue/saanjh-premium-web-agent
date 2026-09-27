# Client intake

How the agent turns a messy collection of client material into an organised
project workspace and a normalised brief, then carries on into
[`PROJECT-WORKFLOW.md`](PROJECT-WORKFLOW.md) without being told how.

```
CLIENT MATERIALS → NORMALISED BRIEF → CRITICAL GAPS → PROJECT WORKSPACE → AUTONOMOUS WORKFLOW
```

Intake covers workflow stages **4.0 Client brief** and **4.1 Understand**.
Everything here follows `CLAUDE.md`, `PROJECT-WORKFLOW.md` (autonomy,
approvals, failure handling) and `references/VISUAL-BENCHMARK.md`.

---

## 1. The start command

> **Start client project**

Optionally followed by a name: _"Start client project: Aurum Dental"_.

When the owner says this, the agent runs §3 from start to finish, then moves
straight into `PROJECT-WORKFLOW.md` stage 4.2 (Research). **The owner never
needs to explain the workflow.**

Related phrases:

| Phrase                             | What the agent does                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| **Start client project** [: name]  | Full intake (§3), then the workflow                                                       |
| **Continue client project** [name] | Switch to the existing `client/<slug>` branch, read the dossier, resume where it left off |
| **Add to client project** [name]   | Intake the new material into the existing project and update `BRIEF.md`                   |

## 2. Where client material comes from

The agent looks in all of these, in this order, and uses everything it finds:

1. **The owner's message**: pasted notes, requirements, links, attached
   files.
2. **`inbox/`**: the drop folder for files (git-ignored on `main`; see
   [`inbox/README.md`](inbox/README.md)). If it has one subfolder per
   client, use the one matching the name given; if no name was given and
   several are waiting, ask which one (a genuine ambiguity).
3. **Links** found in the message or in any file (notes, PDFs, email
   exports, documents).
4. **Public sources** about the business, found through research.

## 3. Intake procedure

### Step 1: Find the material

Collect everything from §2. Note the client name and propose a slug: short,
lowercase, hyphenated (`aurum-dental`).

### Step 2: Create the project workspace

1. Check `git status` on `main`. Uncommitted changes outside `inbox/` may be
   the owner's work: don't move, stash or discard them. Report it as a
   **Blocker** and wait.
2. If `client/<slug>` already exists, this is **Continue** or **Add to**
   (§1), not a new project. Never overwrite an existing project.
3. Otherwise: `git switch -c client/<slug> main`.
4. Create the workspace layout (§8).

### Step 3: Preserve the originals

- Copy every supplied file **unchanged** into `project/brief/originals/`,
  keeping the original names and folder structure.
- Save the owner's message text **verbatim** as
  `project/brief/originals/message.md`.
- Never edit, rename, re-encode or delete anything in `originals/`. All
  work happens on copies.
- **Verify the copies**: compare checksums of every copied file against
  its `inbox/` source (e.g. `sha256sum`). Any mismatch is re-copied and
  re-checked before intake continues.
- **Never delete, empty, move or modify anything in `inbox/`.** The inbox
  stays untouched as the owner's backup of the original material, and only
  the owner cleans it. Record in `INVENTORY.md` that the copies were
  verified and the inbox was left in place.
- **Large files:** GitHub rejects files over 100 MB, and files over 50 MB
  slow the repository down. Keep them out of git by listing them in
  `project/.gitignore`, mark them "local only" in the inventory, and
  tell the owner in the intake message. Git LFS has storage quotas that
  can become billable, so suggest it rather than enabling it.

### Step 4: Inspect every file

Run `pnpm intake:inventory project/brief/originals` for a first pass (type,
size, image dimensions, resolution flags, duplicates). Then actually open
and understand each file:

| Type                                | How to inspect (with tools already in the environment)                                                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text, Markdown, notes, email export | Read in full; extract facts, requirements, links, names.                                                                                                                                                                          |
| PDF (brochure, menu, guidelines)    | Read the pages (the Read tool renders PDFs); note which pages matter.                                                                                                                                                             |
| Word, spreadsheets, slides (Office) | `.docx`, `.xlsx` and `.pptx` are ZIP archives of XML: extract the text with `unzip` or Python's `zipfile`, working on a copy. Older binary formats (`.doc`, `.xls`) and `.pages`: see "When an inspection tool is missing" below. |
| Images and screenshots              | View every one. Identify subject, quality, lighting, whether it's the client's own or stock/third-party, and best use.                                                                                                            |
| Logos and brand assets              | Check for vector formats (SVG, AI, EPS, PDF), transparent PNGs, colour codes, font names and licences.                                                                                                                            |
| Video                               | If `ffprobe`/`ffmpeg` exist, use them. Otherwise load the file in Playwright's Chromium to read duration and dimensions and screenshot a few frames (codec support permitting); `file` gives basic details.                       |
| Design files (Figma, PSD, Sketch)   | Use the Figma connector for Figma links if authorised; otherwise record what the file is and ask for exports only if it's critical.                                                                                               |
| Archives                            | Extract into a copy (never into `originals/`), then inspect the contents.                                                                                                                                                         |
| Fonts                               | Record family, format and licence. Never assume a font is licensed for web use.                                                                                                                                                   |

#### When an inspection tool is missing

1. **Use tools already available** in the environment first (the table
   above lists them).
2. If a capability is missing, **try a legitimate alternative** (a
   different available tool, a browser render, the file's own metadata,
   or the owner's description of the file).
3. If intake can continue without it, **continue and record the
   limitation** in `INVENTORY.md` (e.g. "`brochure.pages`: not
   inspectable here; content not extracted").
4. If installing a system package is **genuinely necessary**, meaning the
   file holds critical information (§4.3) that no available method can
   reach, **stop and ask the owner for approval** before installing it. Say
   which package, why, and what it unblocks. Continue the rest of intake
   meanwhile.
5. **Never install or modify system packages silently** (`apt`, `apt-get`,
   `brew`, `pip install --user`, global `npm`/`pnpm` installs or similar).
   A workable alternative is always preferred over changing the
   environment.

Write the results to `project/brief/INVENTORY.md` (§6.3).

### Step 5: Inspect every link

Follow §5. Record what each link is, whether it was accessible, and the key
findings, with the URL, in `BRIEF.md` (existing presence, competitors,
references) and, for anything research-level, `project/RESEARCH.md`.

### Step 6: Organise useful assets

Copy (don't move) the files worth using into `project/assets/`, by role:

```
project/assets/
  logo/          brand/         photography/   video/
  copy/          documents/     references/    other/
```

Use clear names (`photography/interior-reception-01.jpg`) and record every
copy's original path in the inventory. These are working copies for
planning; the implementation stage later processes the final choices into
`src/assets/` (see `PROJECT-WORKFLOW.md` §4.6–4.7).

### Step 7: Write the normalised brief

Create `project/BRIEF.md` from
[`templates/CLIENT-BRIEF.md`](templates/CLIENT-BRIEF.md). Fill in every
section, classifying every fact (§4). Sections with nothing known still
appear, marked `[MISSING]` with the impact and default.

Record significant intake judgements (slug, interpretation of an ambiguous
brief, assets excluded and why) in `project/DECISIONS.md`.

### Step 8: Identify critical gaps

Apply §4.3. List critical gaps and contradictions at the top of
`BRIEF.md`, each with why it matters and the default that would otherwise
be used.

### Step 9: Ask only what's necessary, then keep going

- If there are critical gaps, contradictions or genuine ambiguities, send
  **one consolidated message** (§7).
- **Don't wait for the answer.** Continue immediately with everything the
  questions don't block (usually research, strategy and creative
  exploration). Blocked facts use `[[CONFIRM: …]]` placeholders
  (`PROJECT-WORKFLOW.md` §3.3). Fold answers in when they arrive and note
  the change in `DECISIONS.md`.
- If there are no questions, don't send an intake report; just continue.

### Step 10: Commit and hand over to the workflow

1. Commit on the client branch: `intake: <client name>`.
2. Push per `PROJECT-WORKFLOW.md` §3.1 (private repo only).
3. Proceed to `PROJECT-WORKFLOW.md` stage 4.2 (Research).

---

## 4. Classification rules

### 4.1 The four tags

| Tag                 | Meaning                                                               | Required with it                           |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `[CLIENT-PROVIDED]` | Stated by the client or owner, or present in client-supplied material | The source file or "owner message"         |
| `[RESEARCHED]`      | Verified in a public source the agent inspected                       | The URL (and date if likely to change)     |
| `[INFERRED]`        | A professional judgement, not a fact                                  | The reasoning and a confidence level       |
| `[MISSING]`         | Unknown                                                               | Impact (critical/non-critical) and default |

- **Never present an inference as a client-provided or researched fact.**
  "Probably targets young professionals" is `[INFERRED]`, however
  confident.
- A client statement that research contradicts keeps its
  `[CLIENT-PROVIDED]` tag; add the conflicting `[RESEARCHED]` line and list
  it under **Contradictions**.
- Something seen only on a third-party site (a directory, a review site)
  is `[RESEARCHED]` with that source, and is weaker than the client's own
  statement or site. Say so if it matters.
- Outdated material (an old website, a two-year-old brochure) is still
  tagged by source, with its date noted.

### 4.2 Never invent

The agent never invents or "fills in" any of these. If they're not
client-provided and research can't verify them, they're `[MISSING]`, and
the site uses a `[[CONFIRM: …]]` placeholder, never a plausible-sounding
value:

prices · awards · statistics · testimonials or reviews · business claims
("leading", "#1", "trusted by") · certifications · addresses · services ·
credentials or qualifications · partnerships or client logos ·
performance claims or results · years in business · team members · opening
hours · contact details.

Researched facts about the business (e.g. an address on its Google Business
profile) may be used, tagged `[RESEARCHED]` with the source, and are listed
for client confirmation before launch.

### 4.3 Critical versus non-critical gaps

A gap is **critical** if the answer could materially change the website's:

- **purpose** (what the site is for, which business or project it's for);
- **architecture** (e.g. single page vs multi-page, e-commerce vs
  brochure, multilingual);
- **legal or safety requirements** (regulated industries such as medical,
  legal, financial, alcohol or children; privacy and consent;
  jurisdiction);
- **business objective** (the primary action: call, book, buy, enquire,
  visit);
- **major scope** (integrations, booking or payment systems, content
  volume).

Also critical, per `PROJECT-WORKFLOW.md` §3.3: any factual claim that will
be published, and a real endpoint for the primary action.

Everything else is **non-critical**: the agent infers a sensible
professional default, tags it `[INFERRED]`, lists it under Open questions,
and continues. **An incomplete brief is never a reason to stop.**

| Example gap                                  | Class                  | Handling                                                                                       |
| -------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| Which of two businesses the site is for      | Critical               | Ask                                                                                            |
| Whether customers book or pay online         | Critical               | Ask; meanwhile design for enquiry-first with a placeholder action                              |
| Real phone number, booking link or email     | Critical               | `[[CONFIRM]]` placeholder; ask in the batch; keep building                                     |
| Site language(s) in a multilingual market    | Critical               | Ask; default to the language of the client's own materials                                     |
| Regulated claims (medical results, returns)  | Critical               | Ask; publish nothing unverified                                                                |
| Target audience detail                       | Non-critical           | Infer from the offer, pricing, location and existing presence                                  |
| Tone of voice                                | Non-critical           | Infer from brand material, market position and audience                                        |
| Page list                                    | Non-critical           | Decide in Information architecture (§4.5 of the workflow)                                      |
| Colours or fonts when there's no brand guide | Non-critical           | Derive from the logo and existing materials during Creative direction                          |
| Competitors not named                        | Non-critical           | Research them                                                                                  |
| Budget or deadline not stated                | Non-critical           | Assume the standard budget from `CLAUDE.md` and a normal timeline; note it                     |
| Photography is weak or missing               | Non-critical at intake | Record in Asset gaps with options; it becomes a deviation only if it blocks the premium result |

## 5. Links

### 5.1 For every URL

1. **Open it** when technically possible (web fetch; a Playwright render
   for JavaScript-heavy pages; a screenshot into the git-ignored
   `project/research/captures/` if the visual matters).
2. **Identify what it is**:

   | Link type                            | What to record                                                                                                                          |
   | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
   | Client's existing website            | Pages, offer, copy worth keeping, contact details, tone, visual identity, technical platform, SEO basics (titles, headings), weaknesses |
   | Instagram / Facebook / TikTok        | Handle, follower scale, content themes, visual style, photography quality, tone, audience signals                                       |
   | LinkedIn                             | Company description, size, sector, team, positioning                                                                                    |
   | Google Business profile / Maps       | Address, hours, category, rating and review themes (not copied as testimonials without permission)                                      |
   | Booking platform (Calendly, Fresha…) | Services, durations and prices as the client lists them, booking flow, whether it can be linked or embedded                             |
   | Competitor website                   | Positioning, messaging, visual language, strengths, gaps                                                                                |
   | Reference website                    | What is likely admired (type, motion, layout, mood); the principle, not the design                                                      |
   | Brand resource (guidelines, drive)   | Assets and rules; download only what the owner shared                                                                                   |
   | Social post / article / press        | The claim or story it supports, with its date                                                                                           |

3. **Record** the URL, type, date checked, accessibility and key findings in
   `BRIEF.md`, and research-level detail in `project/RESEARCH.md`.

### 5.2 When a link can't be accessed

1. Try another legitimate method: a Playwright render instead of a plain
   fetch, the mobile page, the site's public sitemap, a search result
   snippet, the page's Open Graph metadata, or the Internet Archive's
   public snapshot.
2. Use alternative public sources where appropriate (e.g. the business's
   Google profile when the Instagram requires login).
3. Record the limitation: "Instagram requires login; profile bio and post
   count from public metadata only."
4. Continue. An inaccessible link is critical only if it held information
   that is critical (§4.3) and unavailable elsewhere.

**Never** bypass logins, paywalls, CAPTCHAs, rate limits, robots.txt,
security controls, licensing or platform restrictions. Don't use the
owner's personal accounts unless the owner explicitly provides access for
that purpose.

### 5.3 Using what's found

Competitor and reference material **informs** decisions and is never copied:
no copy, layouts, imagery, code or distinctive visual treatments. Record
_what works and why_, then solve it differently for this client.

## 6. Files and assets

### 6.1 Quality assessment

For each useful asset, judge its fitness for a premium site:

- **Images:** resolution (the inventory script flags under 1200 px and
  under 2400 px on the long edge), sharpness, lighting, consistency,
  composition, crops available, and whether it looks like the client's own
  work or generic stock.
- **Logos:** vector available? Legible small? Works on light and dark?
- **Video:** resolution, stability, length, usable loops, audio needed?
- **Copy:** accurate, current, usable, and in what voice.

### 6.2 Gaps and substitutes

- Record missing or weak assets in `BRIEF.md` → **Asset gaps**, with the
  recommended fix: ask the client, a free licensed source (with its
  licence), or a paid option (needs approval, per `PROJECT-WORKFLOW.md`
  §3.5).
- **Never silently replace client assets with AI-generated ones.** Any
  AI-generated asset must be proposed as a decision, logged in
  `DECISIONS.md`, and never used to depict the client's real people,
  premises, products or results.
- When licensed stock is needed, research legitimate sources and record
  the source URL, author, licence name and its requirements (attribution,
  restrictions on people, trademarks, sensitive use).

### 6.3 `project/brief/INVENTORY.md`

One table of files and one of links:

- **Files:** original path, what it contains, type and specs (from
  `pnpm intake:inventory`), quality, useful? (yes / maybe / no, and why),
  working copy path in `project/assets/`, notes (duplicate, large file,
  licence doubt).
- **Links:** URL, type, accessible? (yes / partial / no and why), date
  checked, one-line summary.

## 7. Asking questions

One message, only when needed. Format:

> **Intake: {{client}}.** I've set up the project and I'm continuing with
> research and strategy. I need {{n}} answers:
>
> 1. **{{What's missing}}**: {{why it matters, in one line}}. If I don't
>    hear back, I'll {{default}}.
> 2. …
>
> Approval needed (only if applicable): {{system package, why, what it
> unblocks}}.
>
> Also noted (no action needed unless you disagree): {{one line on major
> inferences, large files kept out of git, inaccessible links, files that
> couldn't be inspected}}.

Rules:

- Ask **one at a time** only if a later question depends on an earlier
  answer.
- If a reasonable default exists and the risk is low, use it and **don't
  ask**. List it in `BRIEF.md` → Open questions instead.
- Never ask what the material, research or a sound inference already
  answers.

## 8. Workspace after intake

On branch `client/<slug>`:

```
project/
  BRIEF.md               normalised brief (from templates/CLIENT-BRIEF.md)
  DECISIONS.md           intake decisions (then used throughout the project)
  RESEARCH.md            started if links produced research-level findings
  brief/
    originals/           everything as received, untouched; message.md
    INVENTORY.md         every file and link: what it is, quality, usefulness
  assets/                organised working copies of useful assets
  research/captures/     git-ignored third-party screenshots
  .gitignore             research/captures/ and any files over 50 MB
```

## 9. Intake exit checklist

Intake is done, and the workflow continues at stage 4.2, when:

- [ ] `client/<slug>` branch exists, created from the latest `main`.
- [ ] All material is preserved in `project/brief/originals/`, unchanged,
      with checksums verified against the source.
- [ ] `inbox/` is left untouched (the owner cleans it manually).
- [ ] Every file and link is in `INVENTORY.md` with what it is, and any
      inspection limitations are recorded.
- [ ] No system packages were installed without the owner's approval.
- [ ] Useful assets are organised in `project/assets/`.
- [ ] `BRIEF.md` covers every template section, with every fact tagged and sourced.
- [ ] No inference is tagged as a fact, and nothing from §4.2 is invented.
- [ ] Critical gaps and contradictions are listed, each with a default.
- [ ] Questions (if any) were sent in one consolidated message.
- [ ] Intake is committed on the client branch.
