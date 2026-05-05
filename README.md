# A Cut Above Barber Shop Website

The official website for **A Cut Above Barber Shop** in San Clemente, CA.
Domain: **acutabovebarbersc.com**

Built with [Astro](https://astro.build/) + Tailwind CSS. Fast, mobile-friendly, and easy to update.

---

## 1. What's on the site

| Page                       | URL          | What it does                                                                 |
| -------------------------- | ------------ | ---------------------------------------------------------------------------- |
| Home                       | `/`          | Hero, services preview, team preview, location, big "call/text" buttons      |
| About                      | `/about/`    | Kristy's story + DeAndre as co-owner                                         |
| Services                   | `/services/` | Full menu of barber + hair services + what's included with every visit       |
| Meet the Barbers           | `/barbers/`  | Full bios, taglines, and specialties for Kristy, DeAndre, Heather, Mario, Rafa |
| Visit & Book               | `/contact/`  | Click-to-call, click-to-text, embedded Google map, hours, "good to know"     |
| 404                        | any bad URL  | Friendly "that page got a fade" page with a way back home                    |

Built-in extras:

- **Google LocalBusiness schema** (JSON-LD) on every page → helps you show up in Google search and Google Maps.
- **Sitemap** auto-generated at `/sitemap-index.xml` → submit this in Google Search Console.
- **`robots.txt`** so search engines can crawl the site.
- **Open Graph tags** so links look good when shared on text/Facebook/Instagram.
- **Mobile-first responsive design** with a sticky top nav and a mobile menu.
- **Click-to-call** and **click-to-text** buttons everywhere. These are gold for a barber shop.

---

## 2. Quick edits Kristy can do herself

All the business content lives in **3 small files** under [src/data/](src/data/). You don't need to touch any HTML to update most things.

### Edit the phone, address, hours
[src/data/site.ts](src/data/site.ts): change phone, address, hours, social links, etc.

### Edit services and pricing
[src/data/services.ts](src/data/services.ts): add, remove, or rename services. Each service has a name, a description, optional feature tags, and a `priceFrom` "starting at" value.

### Edit barbers
[src/data/barbers.ts](src/data/barbers.ts): change names, taglines, bios, specialties, or add/remove barbers. To add a photo (see next section), set the `photo` field to e.g. `"/barbers/kristy.jpg"`.

After saving, run `npm run build` to regenerate the site, then re-deploy.

---

## 2a. When prices or hours change

**Pricing** is in [src/data/services.ts](src/data/services.ts). Each service has `priceFrom`, optional `priceNote` (e.g. `"varies by length"`), and optional `addOns` (e.g. `"+$5 facial mask"`). Edit the file, save, rebuild, redeploy.

**Hours** are in [src/data/site.ts](src/data/site.ts) → `hours` array. If you change days/times, also mirror the change in the `openingHoursSpecification` block of [src/components/StructuredData.astro](src/components/StructuredData.astro) so Google's local listing stays accurate.

---

## 3. Adding photos of the barbers (when you get them)

1. Save each photo as a square JPG (around 600×600 is great), named lowercase with no spaces, e.g.
   `kristy.jpg`, `deandre.jpg`, `heather.jpg`, `mario.jpg`, `rafa.jpg`.
2. Drop them into [public/barbers/](public/barbers/) (create the folder if it doesn't exist).
3. In [src/data/barbers.ts](src/data/barbers.ts), set the `photo` field for each one:
   ```ts
   {
     slug: "kristy-rogers",
     name: "Kristy Rogers",
     // ...
     photo: "/barbers/kristy.jpg",
   }
   ```
4. Save, run `npm run build`, then re-deploy. Until a photo is added, the site shows a clean monogram placeholder (e.g. "KR") in the brand colors, so the page looks finished even without photos.

You can do the same thing for shop interior photos. Drop them into `public/` and reference them in the page files.

---

## 4. Running it on your computer

You'll need [Node.js 22 or newer](https://nodejs.org/en/download) installed (free).

```sh
# install once
npm install

# start a local dev server (auto-reloads as you edit)
npm run dev    # → opens at http://localhost:4321

# build a production version into ./dist/
npm run build

# preview the production build locally
npm run preview
```

---

## 5. Putting it on the internet (deployment)

The domain `acutabovebarbersc.com` is registered with **Namecheap**.
You need a **host** to actually serve the site. Two free, easy options:

### Recommended: Cloudflare Pages (free, very fast)
1. Push this `website/` folder to a new GitHub repo (free at github.com).
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → "Create a project" → connect your GitHub.
3. Pick the repo. Framework preset = **Astro**. Build command = `npm run build`. Output dir = `dist`.
4. Click Deploy. You'll get a temporary URL like `acutabove.pages.dev`.
5. Add your domain: in the Pages project → Custom Domains → add `acutabovebarbersc.com` and `www.acutabovebarbersc.com`.
6. Cloudflare will tell you which **nameservers** to point to. In Namecheap → Domain List → Manage → "Custom DNS" → paste the two Cloudflare nameservers. SSL is automatic.

### Alternative: Netlify (also free)
1. Push to GitHub same as above.
2. Go to [netlify.com](https://www.netlify.com/) → "Add new site" → "Import from Git" → pick the repo.
3. Build command = `npm run build`, publish dir = `dist`. Click Deploy.
4. In Netlify → Domain Settings → add `acutabovebarbersc.com`. Netlify gives you DNS records; paste those into Namecheap → Advanced DNS.

Either way, the site is **free to host** at typical small-business traffic levels.

---

## 6. Other recommended next steps

These aren't part of the site itself but they massively help small local businesses:

- **Claim your Google Business Profile** at [google.com/business](https://www.google.com/business/). Add the same address, phone, hours, and photos. This is the single most important thing for local search.
- **Ask happy clients to leave Google reviews.** Reply to every one (good or bad). 30+ reviews is a noticeable jump in trust.
- **Submit your sitemap** to [Google Search Console](https://search.google.com/search-console/about) by pasting `https://acutabovebarbersc.com/sitemap-index.xml`.
- **Take real photos of the shop interior + each barber.** No stock photos. Drop them in `public/` as described above.
- **Optional later additions:** online booking widget (Booksy, Square Appointments, or Cal.com), Instagram feed embed, gallery page, gift card sales.

---

## 7. Folder structure (for a developer)

```
website/
├── public/                 # static assets served as-is
│   ├── favicon.svg         # ACA monogram favicon
│   ├── og-default.svg      # social share preview image
│   ├── robots.txt
│   └── barbers/            # (create this folder when you add photos)
├── src/
│   ├── data/               # ← business content lives here
│   │   ├── site.ts         #   contact info, hours, nav links
│   │   ├── services.ts     #   services menu
│   │   └── barbers.ts      #   team bios + specialties
│   ├── components/         # reusable UI (Nav, Footer, BarberAvatar, CtaBand, …)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/              # one file per URL
│   │   ├── index.astro     # /
│   │   ├── about.astro     # /about/
│   │   ├── services.astro  # /services/
│   │   ├── barbers.astro   # /barbers/
│   │   ├── contact.astro   # /contact/
│   │   └── 404.astro
│   └── styles/
│       └── global.css      # Tailwind + brand tokens
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## 8. Brand notes (for whoever updates the design later)

- **Colors:** cream `#f7f3ec` (background), charcoal-black `#16110b` (ink), gold `#c9a23a` (accent, matches the gold border on the existing business card).
- **Typography:** Playfair Display (serif, for headings + brand) + Inter (sans, for body). Loaded from Google Fonts.
- **Visual cues:** thin gold dividers (`.gold-rule`), uppercase tracked-out eyebrow labels, soft cream cards with subtle shadow lift on hover. The whole design is intentionally lighter than the dark-on-black business card per Kristy's note.

---

Built with care for Kristy, DeAndre, Heather, Mario, and Rafa.
