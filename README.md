# Modern Eyes Colorado — Final Draft

Website draft for **Modern Eyes** (Dr. Benjamin Sturdy, O.D.).

Primary domain: **moderneyescolorado.com**

This is a **final draft** for Ben and Everett to review. It is not the live site yet. Pages show a small badge: “FINAL DRAFT — for Ben & Everett.”

GitHub: https://github.com/beckettschreuder-code/ModernEyesColorado

---

## What this site is

A clean, modern site for a Colorado optometry practice with three offices (Centennial, Castle Rock, Aurora).

**Goal:** Keep all info and booking on **one** domain (moderneyescolorado.com). Booking used to live on moderneyesco.com — that will move here later.

---

## Pages

| File | What it is |
|------|------------|
| `index.html` | Home / splash — hero, about strip, locations, book section |
| `about.html` | About Modern Eyes + Dr. Sturdy highlights |
| `services.html` | Eye exams, glasses/contacts, screening, LASIK care |
| `locations.html` | Three offices with addresses, phones, hours |
| `reviews.html` | Sample review cards (real quotes later) |
| `book.html` | Booking hub — call buttons + space for future online booking |

Shared files: `css/styles.css`, `js/main.js`

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

- Colors: soft white + teal (medical / optical feel)
- Fonts: **DM Sans** (body) + **Fraunces** (headings)
- Works on phone and desktop

---

## Hosting

Read **[HOSTING.md](HOSTING.md)** for plain-language steps to put this site live (we recommend Cloudflare Pages — free).

Dad / Ian can help with domain DNS (the settings that point the website name to the host) and any money steps.
