# Visual Editing Spec — Future Iteration

**Status:** Research / proposal. Not yet implemented.
**Authored:** 2026-05-04
**Scope:** Add true visual / drag-and-drop editing for the shop owner on top of the existing Astro site, using open-source tools.

---

## TL;DR

- **Today** the shop owner can edit text content (bios, prices, hours, services) via Decap CMS at `/admin/`. She **cannot** rearrange page sections, change fonts, swap colors, or do "Wix-style" visual edits.
- **No OSS tool in 2026 gives full Wix/Webflow visual freedom on an Astro static site without significant engineering work.** The realistic OSS path is "constrained drag-and-drop of pre-built blocks."
- **Recommended future stack:** **Sveltia CMS** (drop-in Decap replacement) for content + **Puck** (block-composer visual editor) for layout. Both MIT, both static, both Git-backed. Stays free, stays portable.
- **Estimated effort to implement:** 3–5 dev-days. Material complexity: medium.
- **If OSS stalls, paid escape hatch:** **CloudCannon Standard** ($49/mo annual) — proper visual editing on Astro with content still in Git.

---

## 1. Why we're not doing this now

The current Decap CMS setup gives the owner 90% of the practical editing she'll ever need (bios, prices, hours, photos, services, hours, social links). Visual layout changes are rare for a barber shop and historically risky when given to non-technical owners (designs drift, fonts mismatch, branding decays).

This spec exists so that **if/when** visual editing becomes a real need (e.g. seasonal promotions she wants to lay out herself, or she expresses real frustration with the rigid layout), we have a documented, evaluated path forward instead of starting from scratch.

---

## 2. Current state recap

| Layer | Tool | Status |
|---|---|---|
| Site framework | Astro 6 + Tailwind 4 | Live |
| Hosting | Netlify (free tier) | Live |
| Source control | GitHub (`Woollbert/ACutAboveBarberSC`) | Live |
| Content CMS | Decap CMS via Decap Bridge | Wired, awaiting auth setup |
| Visual editing | **None** | This spec |
| Editor data files | `src/data/site.json`, `services.json`, `barbers.json` | JSON, CMS-editable |

---

## 3. Constraints (must-haves)

1. **Open source primary.** No paid SaaS unless an OSS path is unworkable.
2. **No new servers / databases.** Netlify Functions OK; Postgres / Docker / VPS not OK.
3. **Owner needs zero GitHub knowledge.** Email / magic-link login only.
4. **Custom design must be preserved.** No "blank-canvas Wix" that lets the owner accidentally destroy the brand.
5. **Content must remain in Git** so we can leave any tool without losing data.
6. **Astro must stay** as the framework. We are not rebuilding the site on a different stack.

## Nice-to-haves

- Inline "click on text to edit" feel
- Image upload directly in the editor (no FTP / file manager)
- Mobile-friendly admin UI (so the owner can edit from her phone)
- Component library reusable across pages

---

## 4. Tool landscape (full evaluation 2026-05-04)

### True visual page builders

| Tool | License | Astro fit | Status | Score | Notes |
|---|---|---|---|---|---|
| **Puck** | MIT | Manual integration, viable | Very active | **8/10** | Block-composer, edits props on registered components, JSON output |
| Webstudio | AGPL-3 | Replaces Astro entirely | Very active | 3/10 | Best Webflow-class OSS; outputs Remix, not Astro |
| GrapesJS | BSD-3 | Output mismatches Astro | Active | 4/10 | Library not finished product; HTML/CSS output bypasses components |
| Silex v3 | AGPL-3 | Replaces Astro (uses 11ty) | Active | 2/10 | Wrong generator |
| Plasmic | Mixed | Next-focused | Active | 3/10 | Studio is proprietary; only SDKs are OSS |
| Builder.io OSS | MIT (SDKs only) | Astro SDK exists | Active | 4/10 OSS / 7/10 SaaS | Editor itself is SaaS |
| Onlook | Apache-2 | `.astro` DOM unsupported | Very active | 2/10 today | "Cursor for designers"; Astro support roadmap-only |

### Visual editing layered on existing components

| Tool | License | Astro fit | Status | Score | Notes |
|---|---|---|---|---|---|
| TinaCMS | Apache-2 | Visual = experimental | Very active | 5/10 | Inline edits, but requires backend (DB + Auth) — heavy |

### Content editor improvements (not visual layout)

| Tool | License | Astro fit | Status | Score | Notes |
|---|---|---|---|---|---|
| **Sveltia CMS** | MIT | Excellent | Very active | **9/10 as CMS** | Drop-in Decap replacement; better UX, mobile, i18n |
| Pages CMS | MIT | Official Astro docs | Active | 7/10 as CMS | Email-invite editor onboarding |

### Block / rich text editors (complementary widgets)

| Tool | License | Use as | Score | Notes |
|---|---|---|---|---|
| BlockNote | MPL-2 | Notion-style prose inside a Puck block | 6/10 helper | Best modern WYSIWYG for body copy |
| Editor.js | Apache-2 | Vanilla JS block editor | 5/10 helper | Mature, framework-agnostic |
| TipTap | MIT | Lower-level engine for custom editors | 4/10 helper | Powers BlockNote, Novel, etc. |
| Novel.sh | Apache-2 | Notion + AI prose editor | 3/10 helper | Cadence slowing |
| react-page | MIT | Block content editor | 1/10 | Looking for maintainers |

### Paid escape hatches (if OSS stalls)

| Tool | Price | Astro fit | Score |
|---|---|---|---|
| **CloudCannon Standard** | $49/mo annual | Best-in-class | **8/10** | Real visual editing on Astro; content stays in Git |
| Webflow | $$$ | Replaces Astro | n/a | Wrong fit; would mean rebuilding |
| Builder.io hosted | Free tier | Astro SDK | 7/10 | Content lives in Builder's DB (less portable) |

---

## 5. Recommended architecture

### Stack

1. **Migrate content layer:** Decap → **Sveltia CMS** (single-line config swap; same `config.yml` schema).
   - Keeps everything we already built for Decap.
   - Better UX, faster, mobile-friendly, modern.
   - Free win regardless of whether we add visual editing.

2. **Add visual layer:** **Puck** at `/admin/pages/[slug]` for marketing pages where layout flexibility matters (homepage, services page, future landing pages).
   - Pre-build a **component library** of ~6–10 Puck blocks that wrap our existing Astro/Tailwind sections — Hero, ServicePriceList, MeetTheBarbers, HoursAndAddress, CTABand, Testimonial, Gallery, etc.
   - Each block has editable props (heading text, image, sub-copy, alignment, etc.) but **the visual styling is locked** in the underlying Astro component.
   - Owner drags blocks onto the page, edits prop values, reorders, hides — but cannot change fonts, colors, or break the design system.

3. **Inline prose editing inside blocks:** drop **BlockNote** into Puck custom fields wherever long-form text appears (e.g. About bio, blog posts if added).

4. **Storage and persistence:**
   - Each Puck-managed page persists as a JSON document at `src/content/pages/[slug].json`.
   - A **Netlify Function** at `/api/save-page` accepts the JSON and commits it via the GitHub Contents API using a deploy-time PAT.
   - On commit, Netlify rebuilds. Astro renders the page through `<PuckRender />` (a React island) reading the saved JSON.

5. **Auth for the owner:** same GitHub-OAuth proxy used for Sveltia (Decap Bridge handles this today). The owner is a GitHub Collaborator with email-invite flow — never logs into github.com directly.

### High-level data flow

```
Owner opens /admin/                      → Sveltia CMS (Decap-config, content forms)
Owner opens /admin/pages/[slug]          → Puck visual editor
Editor saves                             → POST /api/save-page Netlify Function
Function commits JSON to GitHub          → Push triggers Netlify build
Astro builds + deploys                   → Site live with new layout in ~60 sec
```

### What stays the same vs. changes

| Layer | Today | Future |
|---|---|---|
| Astro framework | ✅ | ✅ unchanged |
| Tailwind design system | ✅ | ✅ unchanged |
| Netlify hosting + auto-deploy | ✅ | ✅ unchanged |
| GitHub repo | ✅ | ✅ unchanged |
| Form-based content edits | Decap CMS | **Sveltia CMS** |
| Visual layout edits | ❌ none | **Puck** at `/admin/pages/[slug]` |
| Storage of layout | n/a | `src/content/pages/*.json` (Git) |
| Backend infra needed | none | one Netlify Function (`/api/save-page`) |
| Owner auth | Decap Bridge | Decap Bridge (unchanged) |

---

## 6. Implementation plan (phased)

### Phase 0 — Prerequisites
- Decap CMS auth fully working (Decap Bridge wired, owner can log in and edit content).
- Confirmed: owner is comfortable with current /admin/ flow and identifies a real need for visual edits.

### Phase 1 — Sveltia migration (½ day)
- Swap `<script src="decap-cms">` → `<script src="@sveltia/cms">` in `public/admin/index.html`.
- Verify all collections still work (config.yml is mostly compatible).
- Test on staging branch.

### Phase 2 — Puck integration foundation (1 day)
- Install `@measured/puck` and React in the Astro project.
- Create `src/components/puck/` with the Puck config (component registry).
- Create `src/pages/admin/pages/[slug].astro` rendering Puck as a `client:only="react"` island.
- Create `src/components/PuckRender.astro` React island that takes a JSON doc and renders it.

### Phase 3 — Block library (1–2 days)
- Build 6–10 Puck blocks wrapping current Astro sections:
  - `HeroBlock` (heading, sub, CTA buttons, optional image)
  - `ServicePriceListBlock` (pull from `services.json` + arrange)
  - `MeetTheBarbersBlock` (filter by slug, layout variants)
  - `HoursAndAddressBlock`
  - `CTABandBlock`
  - `TestimonialBlock`
  - `GalleryBlock`
  - `RichTextBlock` (BlockNote inside)
- Each block exposes only safe, designer-blessed props.

### Phase 4 — Persistence (½–1 day)
- Write `netlify/functions/save-page.ts` that:
  - Validates the auth cookie (Decap Bridge / GitHub OAuth).
  - Accepts `{ slug, json }`.
  - Commits to `src/content/pages/[slug].json` in the GitHub repo via Octokit.
- Wire Puck's `onPublish` to call this function.

### Phase 5 — Page rendering (½ day)
- Create dynamic route `src/pages/[...slug].astro` that loads the JSON for that slug and renders via `PuckRender`.
- Migrate the homepage and services page from hand-coded `.astro` to Puck-managed JSON.

### Phase 6 — Polish (½ day)
- Mobile UX check on /admin/.
- Image upload flow (use Sveltia's existing media handling, store in `public/uploads/`).
- Owner training — short Loom video walkthrough.

**Total estimate: 3–5 dev-days for a competent React/Astro engineer.**

---

## 7. Architectural patterns worth borrowing

- **TinaCMS's "click rendered text to edit"**: approximate this with Puck's inline edit mode on text fields.
- **Sveltia's GitHub GraphQL bulk fetch** vs Decap's per-file REST: faster admin loads.
- **Pages CMS's email-invite editor onboarding**: friendliest non-technical UX in OSS world. Mimic with Decap Bridge invitations.
- **Builder.io's symbol/component model**: define each block once, reuse across pages.

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Puck makes a breaking change | Medium | Medium | Pin version; review release notes before upgrading |
| Owner finds the block library too restrictive | Medium | Low | Add more block variants on request; never remove the rigid-design rationale |
| GitHub PAT expires / rotated | Low | High | Use long-lived fine-grained PAT; document rotation procedure |
| Netlify Function cold-start lag | Low | Low | Functions wake fast on free tier; save action tolerates 1–2 sec delay |
| Sveltia v1.0 GA slips further | Low | Low | Beta is production-stable for many sites; can always revert to Decap |

---

## 9. Decision triggers

**Implement this spec WHEN any of these is true:**

- Owner explicitly asks for visual editing (e.g. "I want to rearrange the homepage myself").
- Layout-related update requests start exceeding 1/month (the dev-touch tax becomes annoying).
- A seasonal/promotional landing page need emerges where the owner wants to design it herself.
- We hire a designer/marketer who needs to ship pages without dev involvement.

**Skip this spec if:**

- Owner remains content with form-based content editing only.
- Update frequency stays low (a handful of changes a year).
- Budget for engineering time is zero and visual editing isn't a real ask yet.

---

## 10. Watch list (re-evaluate ~Nov 2026)

1. **Puck — official Astro recipe (issue [#1140](https://github.com/puckeditor/puck/issues/1140)).** If shipped, integration cost drops, score → 9/10.
2. **Sveltia CMS v1.0 GA.** Currently public beta.
3. **Onlook's `.astro` DOM support** (issue [#41](https://github.com/onlook-dev/onlook/issues/41)). Could reshape the entire landscape.
4. **Webstudio static export → Astro components.** Unlikely but possible.
5. **Writenex Astro** and other Astro-native visual editors emerging in 2026.
6. **TinaCMS Astro visual editing** moving from experimental to stable.
7. **Astro's first-party authoring story post-Cloudflare acquisition** (Jan 2026).

---

## 11. References

### Tools
- [Puck — measuredco/puck](https://github.com/measuredco/puck) · [docs](https://puckeditor.com/docs) · [Astro recipe issue](https://github.com/puckeditor/puck/issues/1140)
- [Sveltia CMS — sveltia/sveltia-cms](https://github.com/sveltia/sveltia-cms) · [site](https://sveltiacms.app/) · [astro-sveltia-cms](https://github.com/majesticostudio/astro-sveltia-cms)
- [Webstudio — webstudio-is/webstudio](https://github.com/webstudio-is/webstudio) · [self-hosting docs](https://docs.webstudio.is/university/self-hosting)
- [GrapesJS — GrapesJS/grapesjs](https://github.com/GrapesJS/grapesjs) · [tailwindcss plugin](https://github.com/fasenderos/grapesjs-tailwindcss-plugin)
- [Silex v3 — silexlabs/Silex](https://github.com/silexlabs/Silex)
- [Plasmic — plasmicapp/plasmic](https://github.com/plasmicapp/plasmic)
- [Builder.io — builderio/builder](https://github.com/builderio/builder) · [Astro docs](https://docs.astro.build/en/guides/cms/builderio/)
- [Onlook — onlook-dev/onlook](https://github.com/onlook-dev/onlook) · [Astro support issue](https://github.com/onlook-dev/onlook/issues/41)
- [TinaCMS — tinacms/tinacms](https://github.com/tinacms/tinacms) · [Astro setup](https://tina.io/docs/frameworks/astro) · [Astro docs](https://docs.astro.build/en/guides/cms/tina-cms/)
- [BlockNote — TypeCellOS/BlockNote](https://github.com/TypeCellOS/BlockNote)
- [Editor.js — codex-team/editor.js](https://github.com/codex-team/editor.js)
- [TipTap — ueberdosis/tiptap](https://github.com/ueberdosis/tiptap)
- [Novel.sh — steven-tey/novel](https://github.com/steven-tey/novel)
- [Pages CMS](https://pagescms.org/) · [Astro docs](https://docs.astro.build/en/guides/cms/pages-cms/)

### Paid alternatives
- [CloudCannon Astro CMS](https://cloudcannon.com/astro-cms/) · [pricing](https://cloudcannon.com/pricing/) · [Astro+Bookshop blog](https://cloudcannon.com/blog/how-cloudcannons-live-editing-works-with-astro-and-bookshop/)

### Surveys & background
- [Awesome React Visual Editors](https://github.com/JPrisk/awesome-react-visual-editors)
- [Decap CMS alternatives 2026](https://sitepins.com/blog/decapcms-alternatives)
- [Visual editor for Astro websites](https://sitepins.com/blog/visual-editor-for-astro-websites)
- [Sveltia migration write-up](https://dubasipavankumar.com/blog/sveltia-cms-migration-decap-replacement)
- [Astro + Decap in 2026](https://dev.to/migsarnavarro/astro-decap-in-2026-3mj3)
