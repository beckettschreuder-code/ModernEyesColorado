# Modern Eyes Colorado — Preview Site

Website draft for **Modern Eyes** (Dr. Benjamin Sturdy, O.D.).

Primary domain: **moderneyescolorado.com**

This is a **preview** for Ben to review. It is not the live site yet. The footer shows a small “Preview site — not live yet” note (remove it at go-live).

GitHub: https://github.com/beckettschreuder-code/ModernEyesColorado

---

## What this site is

A clean, modern site for a Colorado optometry practice with three offices (Centennial, Castle Rock, Aurora).

**Goal:** Keep all info and booking on **one** domain (moderneyescolorado.com). The “Book online” buttons open Ben’s existing Eyefinity scheduler (`https://scheduler.eyefinity.com/index.html?domainName=moderneyesco.com`), where patients pick Centennial, Castle Rock or Aurora.

---

## Pages

| File | What it is |
|------|------------|
| `index.html` | Home — photo slideshow hero, doctors strip, service highlights, current offer, locations, booking |
| `about.html` | About Modern Eyes + full bios for Drs. Sturdy, Keesey and Anderson |
| `services.html` | Clickable services: exams, drop-free imaging, contacts, hard-to-fit contacts, eyewear, eye health & emergencies, LASIK, kids |
| `locations.html` | Three offices with addresses, phones, hours, maps, email |
| `reviews.html` | Sample review cards (real quotes later) |
| `book.html` | Book online (Eyefinity), call buttons, new patient form (PDF), insurance & payments, current offer |

Shared files: `css/styles.css`, `js/main.js`, `favicon.ico`, `assets/forms/new-patient-form.pdf` (copied from Ben’s current site)

Also: `HOSTING.md` (how to put the site online), `_headers`, `_redirects` (for Cloudflare Pages)

---

## How to open locally

You need a simple local web server (a tiny program that serves the files in your browser).

1. Open a terminal.
2. Go into this folder:

```bash
cd /path/to/moderneyes-final
```

3. Start the server:

```bash
python3 -m http.server 8080
```

4. Open a browser and go to: http://localhost:8080/

To stop the server: press `Ctrl + C` in the terminal.

You can also open `index.html` by double-clicking it. Relative links should still work.

---

## Design notes

- Colors: warm cream + teal + coral/peach (friendly but professional)
- Fonts: **DM Sans** (body) + **Fraunces** (headings)
- Works on phone and desktop

---

## Hosting

Read **[HOSTING.md](HOSTING.md)** for plain-language steps to put this site live (we recommend Cloudflare Pages — free).

Dad / Ian can help with domain DNS (the settings that point the website name to the host) and any money steps.

---

## Before go-live (needs Ben)

- Confirm **Aurora hours** (the two old sites disagree — see the HTML comment next to Aurora hours).
- Confirm the **insurance list** (taken from the logos on moderneyescolorado.com: Medicaid, Railroad Medicare, UMR, UnitedHealthcare).
- Swap the **sample reviews** for real patient reviews.
- Remove the “Preview site — not live yet” line in the footer of each page.
