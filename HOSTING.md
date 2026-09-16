# Hosting — Modern Eyes Colorado

Plain guide for Bex, Everett, Ben, and helpers.

---

## What “hosting” means

**Hosting** = a company keeps your website files on the internet so anyone can open them.

Your **domain** (moderneyescolorado.com) is the *name*. Hosting is the *house* those pages live in. The domain must **point** to the host (that pointing is called **DNS**).

---

## Our recommendation: Cloudflare Pages (free)

**Why we like it for this site:**

- Free for a simple static site (HTML, CSS, JS — no special server code)
- Fast worldwide
- Easy connect to a custom domain
- Works great with GitHub (push code → site updates)
- `_headers` and `_redirects` files in this project are already set up for Cloudflare Pages

**Good fit:** This draft is a static site. Cloudflare Pages is built for that.

---

## Alternatives (when to use them)

| Option | When it makes sense |
|--------|---------------------|
| **Netlify** | Similar to Cloudflare Pages; also free for simple sites. Fine if someone already prefers Netlify. |
| **Vercel** | Also great for static / modern sites. Fine alternative. |
| **WordPress** | Use only if Ben wants a big CMS (content system) with lots of plugins, blogs, or non-technical editing in a dashboard. More cost and upkeep. Not needed for this draft. |

For this project: **start with Cloudflare Pages.** Switch later only if you have a clear reason.

---

## Domains

- **Keep:** moderneyescolorado.com (primary — this is the main site)
- **Later:** redirect moderneyesco.com → moderneyescolorado.com so old booking links still work

Ben already pays for the domain (~**$15/year** is typical). Hosting on Cloudflare Pages can be **$0**.

Optional later: a **care plan** (~**$25/month**) if someone helps with small updates, monitoring, and “is the site up?” checks. Not required to go live.

**Money / DNS tip:** Dad or Ian can help with domain registrar logins, DNS records, and payments.

---

## Costs (simple)

| Item | About |
|------|--------|
| Hosting (Cloudflare Pages) | **$0** |
| Domain (Ben already pays) | ~**$15/year** |
| Optional care plan | ~**$25/month** (optional) |

---

## Simple go-live steps (Bex / Everett)

Do these when Ben says “go.” Ask Dad/Ian for domain steps if needed.

1. **Put the code on GitHub**  
   Repo: https://github.com/beckettschreuder-code/ModernEyesColorado  
   (Parent agent / Beckett will sync from the box and push.)

2. **Create a Cloudflare account** (free) at cloudflare.com

3. **Create a Pages project**  
   - Connect the GitHub repo  
   - Build settings: usually **no build command** (static files)  
   - Output / root: the folder with `index.html` (often the repo root)

4. **Wait for the first deploy**  
   Cloudflare gives a temporary `*.pages.dev` URL. Open it and check pages.

5. **Attach moderneyescolorado.com**  
   In Pages → Custom domains, add the domain.  
   Cloudflare will show DNS records to add (or can manage DNS if the domain is on Cloudflare).

6. **DNS** (Dad/Ian can do this)  
   Point the domain to Cloudflare Pages as instructed (often a CNAME).  
   Wait for DNS to update (can take minutes to a few hours).

7. **Test**  
   Open https://moderneyescolorado.com — check Home, About, Services, Locations, Reviews, Book, and phones.

8. **Later: redirect moderneyesco.com**  
   When ready, set moderneyesco.com to redirect to the primary site (see comment in `_redirects`). That way old booking bookmarks still land on the new site.

9. **Online booking embed**  
   When Ben’s booking tool is ready, place it in the placeholder on `book.html` (and/or the home `#book` section).

---

## Files that help Cloudflare

- `_headers` — security-ish browser headers
- `_redirects` — URL rules (and a comment about the future moderneyesco.com redirect)

---

## Who helps with what

| Person | Typical help |
|--------|----------------|
| Bex / Everett | Build pages, push to GitHub, Cloudflare Pages setup |
| Dad / Ian | Domain login, DNS, payments if needed |
| Ben | Approve content, real reviews, booking system choice, “go live” |

---

## Questions?

If something in DNS or billing is confusing, stop and ask Dad/Ian. Don’t guess on domain settings — wrong DNS can take the old site offline.
