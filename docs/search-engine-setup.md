# Getting acutabovebarbersc.com to show up in Google & Bing

**Goal:** Make the site discoverable in search engines so customers can find it by name and by local searches like "barber shop San Clemente."
**Time required:** ~20 minutes total (excluding waiting for verification mail/postcard).
**Cost:** $0.

---

## Why this is needed

A new website doesn't automatically appear in search results. Search engines have to:

1. **Discover** your site (find a link to it from somewhere)
2. **Crawl** it (read its pages)
3. **Index** it (add it to their searchable database)
4. **Rank** it (decide where it appears for queries)

The fastest way through this is to **submit the site directly** via each search engine's webmaster tools. After that, indexing happens within a few days instead of weeks.

---

## Setup checklist (do these in order)

- [ ] **Step 1:** Google Search Console (~10 min)
- [ ] **Step 2:** Bing Webmaster Tools (~5 min, can import from Google)
- [ ] **Step 3:** (Optional) Update Yelp/BestProsInTown listings to add the website URL

---

## Step 1 — Google Search Console

This tells Google "here's my site, please crawl it and let me see how it's doing in search."

### What you'll need
- A Google account (Kristy's Gmail recommended — she'll be primary admin long-term)
- Access to deploy a small file to the website (hand the verification file to your developer; they'll add it in 2 minutes)

### Steps

1. Open https://search.google.com/search-console in a browser.
2. Sign in with the Google account you want to use.
3. Click **"Add property"**.
4. Choose **"URL prefix"** (the right-hand option, not "Domain").
5. Enter: `https://acutabovebarbersc.com`
6. Click **Continue**.
7. Google offers several verification methods. **Pick "HTML file"** (the easiest):
   - Click "Download HTML verification file" — you'll get a file like `googleabc123def456.html`
   - **Send this file to your developer.** They'll commit it to `public/` in the repo and redeploy. After redeploy (≈ 60 sec), the file will be reachable at `https://acutabovebarbersc.com/googleabc123def456.html`.
   - Back in Search Console, click **Verify**. Should turn green.
8. Once verified, in the Search Console sidebar, click **Sitemaps**.
9. Enter `sitemap-index.xml` and click **Submit**.
10. Search Console shows "Success" → done.

### What happens next
- Google starts crawling within hours.
- Site appears in Google for the brand name "A Cut Above Barber Shop San Clemente" within 3–7 days.
- General terms ("barber shop San Clemente") take 2–8 weeks and depend heavily on Google Business Profile + reviews.

### Useful Search Console pages to check weekly
- **Performance** — see what queries people use to find you, click-through rates
- **Coverage** — confirms all pages are indexed (no errors)
- **Sitemaps** — confirms the sitemap is being read

---

## Step 2 — Bing Webmaster Tools

Same idea, but for Bing (and DuckDuckGo, which uses Bing's index).

### What you'll need
- Microsoft, Google, or Facebook account to log in

### Steps

1. Open https://www.bing.com/webmasters/
2. Sign in with whichever account you prefer (Google account works too).
3. Click **"Add a site"**.
4. **Easy mode:** click **"Import from Google Search Console"** if you've already done Step 1. Bing pulls everything in one click and you're done.
5. **Manual mode** (if you skipped Search Console): enter `https://acutabovebarbersc.com`, then verify via HTML file (same flow as Google).
6. After verification, go to **Sitemaps** → **Submit sitemap** → enter `https://acutabovebarbersc.com/sitemap-index.xml`

### What happens next
- Bing tends to crawl new sites faster than Google (often within 24 hours).
- Apple's Spotlight Search and Siri also use Bing's index, so this also helps Mac/iPhone users discover the site.

---

## Step 3 — Update third-party listings (optional but high-value)

You already noticed that Yelp and BestProsInTown have listings for the shop. They're showing up in search results, but they don't yet link to the official website. Adding the URL takes 2 minutes per platform and helps a lot:

### Yelp
1. Go to https://biz.yelp.com/
2. Claim/log into the A Cut Above Barbershop listing
3. Edit the business profile → add `https://acutabovebarbersc.com` to the "Website" field
4. Save

### BestProsInTown
1. Go to https://www.bestprosintown.com/
2. Search for "A Cut Above Barber Shop"
3. There's usually a "Claim this business" or "Update info" link
4. Add the website URL

### Other directories worth claiming (~5 min each, all free)
- **Apple Business Connect** (Apple Maps): https://businessconnect.apple.com/ — free, can import from Google
- **Foursquare/Factual**: https://business.foursquare.com/ — many other apps source data from here
- **Nextdoor for Business**: https://business.nextdoor.com/ — local-community-focused, great for word-of-mouth
- **Better Business Bureau**: https://www.bbb.org/get-listed (optional — free basic listing)

---

## Realistic timeline after completing Steps 1 & 2

| Time | What you'll see |
|---|---|
| Hour 1 | Search engines start crawling |
| Day 1–2 | Bing indexes the site; site shows up for brand-name searches on Bing |
| Day 3–7 | Google indexes the site; brand-name searches on Google now show acutabovebarbersc.com |
| Week 2–4 | Site starts appearing for less-specific searches like "San Clemente barber" |
| Month 1–3 | Local pack rankings improve as Google Business Profile reviews grow |

---

## Common questions

### "I did everything but the site still doesn't show up. What's wrong?"

Probably nothing — search engines just take time. Wait at least 7 days after sitemap submission before worrying. To check progress:
- In Google Search Console → Coverage → see how many pages are indexed (target: all 12 pages)
- Type `site:acutabovebarbersc.com` into Google — if any results show, you're indexed.

### "Should I pay for Google Ads / SEO services?"

For a small barbershop, **probably not**. Local SEO via Google Business Profile (which you already have) does more than 95% of paid SEO services for ⅒ the cost. Save your money. If you ever do want paid traffic, Google Local Service Ads (the green "Google Guaranteed" badge ones) are far better ROI than regular Google Ads for service businesses.

### "I see a different barber shop ranking #1 for 'barber shop San Clemente'. How do I beat them?"

Three things move the needle:
1. **Google reviews** — get to 30+ Google reviews on your Business Profile, average ≥ 4.5 stars
2. **Posts on Google Business Profile** — add weekly photo posts (just photos of fresh cuts, costs nothing)
3. **Backlinks** — when local San Clemente blogs, the chamber of commerce, a Marines spouse group, etc. link to your website

That's the whole local SEO playbook. Everything else is window dressing.

---

## Reminder: critical missing piece — Netlify ↔ GitHub auto-deploy

This isn't strictly a search engine concern, but **without it, even fixing this stuff is moot:** if your Netlify site isn't connected to the GitHub repo for automatic rebuilds, then any content updates Kristy makes won't reach the live site (and won't be re-crawled by Google). Setup is a 2-minute click flow in Netlify; see the main README.
