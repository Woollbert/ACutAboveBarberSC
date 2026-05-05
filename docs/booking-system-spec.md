# Custom Booking System Spec — Future Iteration

**Status:** Research / proposal. Not yet implemented.
**Authored:** 2026-05-04
**Scope:** Replace Fresha (or any third-party booking) with a self-built, fully-featured appointment booking system owned end-to-end. Designed to match or exceed Fresha's feature set, with a realistic phased implementation plan.

---

## TL;DR

- **A real booking system is hard.** It looks simple on the surface but has dozens of edge cases (timezones, double-booking, no-shows, reschedules, recurring availability, holidays). This is not a weekend project.
- **Realistic full-build effort: 500–800 engineering hours** to match Fresha's feature set and not need ongoing weekly debugging. This is months of focused work.
- **A scoped MVP can ship in ~80–120 hours** if we accept "request to book" rather than "real-time book," and that's the recommended starting point if we ever want to leave Fresha.
- **Architecture:** Astro frontend + React islands, Netlify Functions (serverless API), Supabase (Postgres + auth), Resend (email), Twilio (SMS). Expected running cost at small-shop scale: $0–25/month.
- **Decision trigger:** only build this if Fresha (or a similar SaaS) becomes genuinely unworkable. The cost-per-feature of building from scratch is brutal compared to using free tiers of established platforms.

---

## 1. Why this spec exists

We currently use Fresha (free tier) for booking. Fresha is excellent and free for our needs. But owning the booking system would give us:

- 100% brand consistency (no Fresha logo/UX leakage)
- Full data control (customer DB, booking history)
- Zero risk of pricing changes or platform sunset
- Custom flows tailored exactly to a barbershop (not generic salon software)
- One unified codebase for everything (site + booking)

This document is a prebuilt blueprint so that if/when we decide to leave Fresha, we don't start from zero.

---

## 2. Goals

1. Match Fresha's core capabilities (real-time availability, multi-staff, automated reminders, customer database).
2. Add capabilities that make sense for a small barbershop specifically.
3. Stay on free/cheap tiers of best-in-class services for everything we don't build ourselves (auth, DB, SMS, email).
4. Be maintainable by a single developer ongoing — no exotic tech, no fragile pieces.
5. Survive 5+ years without a rewrite.

## Non-goals

- Multi-tenant SaaS (this is one shop's tool, not a Fresha competitor product).
- Mobile native apps (PWA is sufficient).
- POS / inventory management.
- Payroll / commission tracking integrations.
- White-label resale to other shops.

---

## 3. Constraints

- **No paid SaaS for core CRUD operations.** Database, auth, hosting must be free at our scale.
- **Astro stays as the framework.** No rewrite to Next.js / Remix.
- **Stripe optional and only for Phase 4+.** Cash-first shop; deposits would be opt-in.
- **No new servers we run.** Serverless functions only. Self-hosting Postgres is out.
- **Owner is non-technical.** Admin UI must be friendly, mobile-friendly, and forgiving.

---

## 4. Feature set

Organized by phase. Each phase is independently shippable; you could stop after any phase and have something useful.

### Phase 1 — Booking Request (MVP) — ~80–120 hr

The minimum viable system: customers submit a structured booking request that the shop confirms manually.

**Customer-facing:**
- ☐ Service selection (name, duration, starting price, description)
- ☐ Barber selection (with photo + specialty tags) or "first available"
- ☐ Preferred date picker (calendar widget)
- ☐ Preferred time slot (morning / afternoon / evening, or specific time)
- ☐ Backup time slot (if first not available)
- ☐ Customer info: name, phone, email
- ☐ Optional notes ("first time," "needs a fade for inspection Friday")
- ☐ Submit → confirmation page ("we'll text you within 30 min to confirm")

**Owner/staff-facing:**
- ☐ Email + SMS to shop with booking details
- ☐ Simple "pending requests" dashboard at `/admin/bookings`
- ☐ Mark request as confirmed / declined → triggers SMS to customer

**System:**
- ☐ Spam / bot prevention (honeypot field + Cloudflare Turnstile)
- ☐ Rate limiting (3 requests per phone per day)
- ☐ Request stored in Supabase
- ☐ Email via Resend
- ☐ SMS via Twilio

**What you DON'T get yet:**
- ❌ Real-time availability (relies on shop confirming back)
- ❌ Customer self-service rescheduling
- ❌ Automated reminders

**Why ship this first:** delivers actual value quickly, validates the whole stack works, and most barbershop bookings still go through phone/text anyway — this is just a structured intake form that pre-fills the conversation.

---

### Phase 2 — Real-Time Booking — ~150–200 hr

The big jump. Customers see actual availability and book instantly without manual confirmation.

**Customer-facing:**
- ☐ Service selection with full duration logic (60 min cut blocks 60 min, not 30)
- ☐ Barber picker that filters availability calendar
- ☐ Real calendar showing only open slots
- ☐ Time slot picker (15-min granularity, configurable)
- ☐ Instant booking confirmation (no shop-side approval needed)
- ☐ "Add to calendar" .ics download
- ☐ Confirmation email + SMS sent immediately
- ☐ Cancellation link in confirmation (with cancel-window enforcement)

**Owner/staff-facing:**
- ☐ Per-barber working hours (different schedules per day of week)
- ☐ One-off blocks (vacation, sick day, lunch)
- ☐ Buffer time per service (5-min cleanup between cuts)
- ☐ Lead time enforcement ("must book at least 1 hour ahead")
- ☐ Live calendar view (day / week)
- ☐ Manual booking entry (for walk-ins or phone bookings)
- ☐ Cancel any booking on customer's behalf

**System features:**
- ☐ Concurrency-safe booking (DB transaction prevents double-booking when 2 customers click "Book" at the same time)
- ☐ Timezone handling (PT enforced, daylight savings handled)
- ☐ Holiday calendar (auto-block major US holidays, owner can override)
- ☐ Multi-step booking flow with progress indicator
- ☐ Customer database lookup by phone (returning customer pre-fills info)

**Notifications:**
- ☐ Booking confirmation (email + SMS) — instant
- ☐ Reminder #1 (SMS, 24hr before)
- ☐ Reminder #2 (SMS, 2hr before)
- ☐ Cancellation confirmation
- ☐ New-booking ping to assigned barber's phone

**This phase is when we reach Fresha parity for the basics.**

---

### Phase 3 — Owner & Customer Quality of Life — ~100–150 hr

The polish that makes Fresha feel professional rather than functional.

**Customer-facing:**
- ☐ Customer accounts (optional, magic-link login via email)
- ☐ Booking history view ("your past appointments")
- ☐ One-click rebook ("book again with [Barber]")
- ☐ Self-service rescheduling (within window)
- ☐ Service upsell at checkout ("add a beard trim for $5?")
- ☐ Loyalty tracking ("after 4 cuts, your 5th is half off")
- ☐ Gift card purchase + redemption
- ☐ Photo upload for style references
- ☐ Post-appointment review request (1-5 stars + comment)
- ☐ Wait list (notify if an earlier slot opens up)

**Owner/staff-facing:**
- ☐ Day schedule printable view (one-page each day for the front desk)
- ☐ Customer database with notes per customer
- ☐ Customer history per record (last 10 cuts, total spend, no-show count)
- ☐ Mark no-show → auto-flags customer for deposit on next booking
- ☐ Email blast tool (newsletter to opted-in list)
- ☐ Manual SMS to any customer ("running 10 min late today")
- ☐ Per-barber daily/weekly stats (cuts done, revenue assisted)
- ☐ Audit log (who changed what, when)

**System:**
- ☐ Custom intake questions per service (e.g., "any allergies?" for chemical services)
- ☐ Branded confirmation emails (logo, colors, custom copy)
- ☐ Service-specific reminder copy (e.g., "wash your hair before color services")

---

### Phase 4 — Payments, Deposits, Premium Features — ~150–200 hr

Optional layer for shops wanting to reduce no-shows or accept tips digitally.

**Payments:**
- ☐ Stripe integration for deposits (e.g., $10 hold for chemical services)
- ☐ Pay-in-full option (some clients prefer)
- ☐ Tipping flow (post-service email with tip link)
- ☐ Refund flow on cancellation
- ☐ Receipts (auto-emailed)

**Recurring & Advanced:**
- ☐ Recurring appointment scheduling (every 4 weeks at the same time)
- ☐ Group bookings (couples coming together)
- ☐ Subscription/membership (e.g., "Cuts Club" — unlimited cuts $X/month)
- ☐ Referral tracking (refer a friend, get a discount)
- ☐ Promo codes / discount engine

**Marketing automation:**
- ☐ Lapsed-customer re-engagement (auto-email customers who haven't booked in 6 weeks)
- ☐ Birthday discounts (auto-text on customer birthday)
- ☐ Seasonal campaigns (drag-drop builder)
- ☐ A/B test booking page variants

---

### Phase 5 — Power Features (only if scale demands it) — ~100–200 hr

Most barbershops never need any of this. Listed for completeness.

- ☐ PWA install prompt (Kristy's clients can "add to home screen")
- ☐ AI chatbot for booking ("text us 'fade tomorrow at 3pm'")
- ☐ Multi-location support (if shop expands)
- ☐ Staff payroll exports
- ☐ Advanced analytics (heat map of busy hours, customer cohort retention, customer LTV)
- ☐ Webhook system (Zapier / Make integrations)
- ☐ Public API (third-party developer integrations)
- ☐ Two-factor auth for staff
- ☐ Multi-language site (Spanish for Camp Pendleton clients)
- ☐ Customer self-uploadable inspiration photos / portfolio
- ☐ Embeddable widget for putting on Instagram bio link, etc.
- ☐ SEO landing pages auto-generated per service per barber

---

## 5. Recommended architecture

### Stack

| Layer | Choice | Why | Cost at our scale |
|---|---|---|---|
| Frontend | Astro 6 + React islands | Already what we use | $0 |
| Hosting | Netlify | Already what we use | $0 |
| API | Netlify Functions (serverless) | No servers to manage | $0 (within free tier limits) |
| Database | **Supabase Postgres** (free tier: 500MB, 2GB bandwidth) | Real Postgres, real auth built-in, real-time subscriptions | $0 |
| Auth (customer + staff) | **Supabase Auth** (magic links, OAuth) | Same vendor as DB; no separate account | $0 |
| Email | **Resend** (free: 3k/mo, 100/day) | Modern API, deliverability | $0 → $20/mo if we grow |
| SMS | **Twilio** (pay-as-you-go) | Reliable; ~$0.0079/SMS US | ~$5–25/mo for a busy shop |
| Payments (Phase 4+) | Stripe | Industry standard | 2.9% + 30¢ per txn |
| Image storage | Supabase Storage (1GB free) | Lives next to the DB | $0 |
| Calendar widget | **react-day-picker** or **@daypilot/react** | Battle-tested, accessible | $0 OSS |
| Analytics | Plausible (light) or PostHog free | Privacy-respecting | $0 |
| Anti-spam | Cloudflare Turnstile | Free, no CAPTCHA UX | $0 |
| Error monitoring | Sentry free tier | Catch bugs before customers do | $0 |
| Backups | Supabase nightly + GitHub | Automatic | $0 |

**Total expected monthly running cost at busy-small-shop scale (200–600 bookings/mo):**
$5–30/month, dominated by SMS.

### Data model (sketch)

```
customers
  id, name, phone, email, created_at, notes, opted_in_marketing,
  total_visits, total_spend, no_show_count, last_visit_at

barbers
  id, slug, name, role, photo_url, bio, specialties[], active

services
  id, slug, name, description, duration_min, base_price_cents,
  buffer_min, requires_deposit, deposit_amount_cents

barber_services (which barbers do which services + per-barber pricing)
  barber_id, service_id, override_price_cents

availability_rules (recurring weekly schedule per barber)
  barber_id, day_of_week, start_time, end_time

availability_overrides (one-off blocks/openings)
  barber_id, date, start_time, end_time, type (block | open)

bookings
  id, customer_id, barber_id, service_id, start_time, end_time,
  status (pending | confirmed | completed | cancelled | no_show),
  price_cents, deposit_paid_cents, notes, created_at, source (online | phone | walk_in)

booking_history (audit log)
  booking_id, action, actor_id, before_json, after_json, at

reviews
  id, booking_id, rating, comment, created_at, public

gift_cards
  id, code, balance_cents, purchaser_email, recipient_email, created_at, expires_at

notifications_log
  id, customer_id, channel (email|sms), template, sent_at, status, provider_id
```

### Key technical decisions

- **Postgres for the DB** (not Firebase, not DynamoDB): real ACID transactions are non-negotiable for booking conflict prevention. Booking creation must be atomic.
- **Pessimistic locking for concurrent bookings**: when 2 customers try to grab the same slot, one wins, the other gets a clean retry, no double-bookings ever.
- **Server-side time math**: never trust client clocks; all "is this slot available" runs in the function with `now()` from the DB.
- **Idempotent endpoints**: every booking action carries a request ID so retry doesn't double-book.
- **Transactional outbox pattern for notifications**: SMS/email sent through a queue read by a scheduled function so a Twilio outage doesn't break booking.

---

## 6. Phased implementation plan

| Phase | Description | Effort | Dependencies | Outcome |
|---|---|---|---|---|
| 0 | Architecture + DB schema + Supabase setup | 10–15 hr | – | Foundation |
| 1 | Booking request form (MVP) | 80–120 hr | Phase 0 | Replaces a phone call |
| 2 | Real-time booking + reminders | 150–200 hr | Phase 1 | Reaches Fresha parity |
| 3 | Owner/customer QoL | 100–150 hr | Phase 2 | Pulls ahead of Fresha basic |
| 4 | Payments + recurring + marketing | 150–200 hr | Phase 3 | Covers Fresha's paid features |
| 5 | Power features (PWA, multi-loc, etc.) | 100–200 hr | As needed | Optional polish |

**Total to "feature parity with Fresha":** Phase 0 + 1 + 2 = ~240–335 hr (~6–8 dev-weeks full-time).
**Total to "exceeds Fresha":** add Phase 3 + 4 = ~490–680 hr (~3–4 months full-time).
**Total "everything":** add Phase 5 = ~590–880 hr.

For context: Fresha's current full team is dozens of engineers. We're not racing them to a feature-complete product — we're matching the 90% of features a single shop actually uses.

---

## 7. Decision triggers — when to actually build this

Build Phase 1 if **any** of these:
- Fresha removes their free tier or raises prices uncomfortably.
- Fresha sunsets / sells / pivots in a way that breaks our flow.
- We want first-class brand control more than convenience.
- We move to a niche (e.g., concierge home cuts) that no off-the-shelf tool serves well.

Build Phase 2 if Phase 1 is shipped AND the manual confirmation step becomes a bottleneck.

Build Phase 3+ if there's a specific customer-experience or revenue gap that Fresha can't fill.

**Skip the entire spec if:**
- Fresha continues to work and stays free.
- We don't have ~6+ months of engineering capacity to allocate.
- The shop's booking volume doesn't justify the build.

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Double-booking bug in production | Medium | Severe (angry customers) | Heavy unit tests on availability logic; staging environment; pessimistic locking |
| Twilio cost spike from spam | Medium | Medium ($) | Rate limiting, Turnstile, daily SMS budget cap |
| Supabase free tier limits hit | Low | Low | Migrate to paid Supabase ($25/mo) — plenty of headroom |
| Owner can't figure out admin UI | Medium | High (reverts to Fresha) | Invest in UX phase 3 polish; user-test with Kristy directly |
| Lead developer disappears | Low | Severe | Keep tech stack boring (no exotic deps); document well |
| Email deliverability issues | Medium | Medium | SPF/DKIM/DMARC properly set up; use Resend's recommended config |
| Daylight savings / timezone bug | High | Medium | Store everything UTC; render in PT; test fixtures for DST transitions |
| Customer data breach | Low | Severe | RLS in Postgres; minimize PII stored; quarterly security review |

---

## 9. Comparison with paid alternatives

If at any point during the build the calculus shifts, here are the off-ramps:

| Alternative | Cost | When it's right |
|---|---|---|
| **Fresha free tier** (current) | $0 | Status quo. Best ROI by miles. |
| **Setmore free** (4-staff cap) | $0 | If you want a different vendor than Fresha. |
| **Square Appointments** | $29–69/mo | If you also want POS integration. |
| **Booksy** | ~$30/mo | If you want barbershop-specific UX over salon-generic. |
| **Cal.com Cloud** | $15/seat/mo | If you only have 1–2 barbers and want devs to integrate it. |
| **Cal.com self-hosted** (OSS) | $0 + ops time | Real OSS path; medium ops burden. |
| **Custom build (this spec)** | $0 + 240–880 dev-hours | Only if Fresha becomes unworkable. |

**Honest opinion:** the cost-per-feature of any of these alternatives is dramatically better than building from scratch. Spec exists for completeness, not as a recommendation.

---

## 10. Architecture for an "MVP-only" version (Phase 1, scoped)

If we ever need to ship just Phase 1 quickly (~80 hr), here's the lean version:

1. **Frontend (Astro):** new page `/book/`. React island for the form (calendar widget + service/barber dropdowns + Tunrstile). Tailwind styling matching site brand.
2. **Function:** `/api/booking-request` — validates input, rate-limits, writes to Supabase `booking_requests` table, triggers email + SMS to shop.
3. **Admin page:** `/admin/bookings` — Supabase auth-gated. Lists pending requests. Buttons: "Confirm" (sends customer SMS), "Decline" (sends apology), "Reschedule" (sends alt time SMS).
4. **No real-time availability.** The shop confirms manually. This is the key simplification.

Files to add:
```
src/pages/book.astro
src/pages/admin/bookings.astro
src/components/booking/BookingForm.tsx (React island)
netlify/functions/booking-request.ts
netlify/functions/booking-action.ts
docs/booking-request-data-model.md
```

This phase alone would let us delete the Fresha button and replace it with our own widget. Customers wait a few hours for confirmation instead of getting instant booking — fine for a small shop, less good than Fresha's instant flow.

---

## 11. References & inspiration

- [Cal.com — open source booking](https://github.com/calcom/cal.com) — primary architectural inspiration; AGPL
- [Fresha pricing](https://www.fresha.com/for-business) — confirm free tier features regularly
- [Supabase docs](https://supabase.com/docs) — Auth + Postgres free tier
- [Resend pricing](https://resend.com/pricing) — 3k email/mo free
- [Twilio pricing](https://www.twilio.com/sms/pricing/us) — SMS at ~$0.008/msg
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) — free CAPTCHA replacement
- [react-day-picker](https://daypicker.dev/) — accessible date picker
- [DayPilot React](https://javascript.daypilot.org/) — full calendar component
- [Booking system anti-patterns](https://web.archive.org/web/2023*/https://martinfowler.com/articles/) — search "appointment scheduling"
- [Postgres concurrency control patterns](https://www.postgresql.org/docs/current/explicit-locking.html) — for double-booking prevention

---

## 12. Watch list

Re-evaluate this spec if:
- A new OSS booking system emerges with Astro support
- Fresha changes pricing/policy
- Supabase free tier shrinks
- Twilio costs change materially
- WebRTC / WebPush enables some new pattern that simplifies notifications

---

## Summary

A custom booking system is a real product, not a weekend hack. The cost is measured in months, not days. **Fresha's free tier is almost always the right answer for a small shop.** This spec is here so we have a battle plan if that calculus ever changes — and so we know exactly what "everything we'd want" looks like before we commit.
