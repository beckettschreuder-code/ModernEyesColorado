# Campaigns: the second-pair offer

The one offer on the site right now is **20% off your second pair (sunglasses included)**, expires **06/30/2027**.
The wording is copied from Ben's current site (https://www.moderneyescolorado.com/offers---promotions). Don't change terms unless Ben says so.

## One page, one place to edit

- Offer page: `offer-second-pair.html` (short address `/offers/second-pair`, set up in `_redirects`).
- The offer cards on the home page and the Patients page (`book.html`) show the same text and link to that page.
- To change the offer, edit the text in all three files and update `data-offer-expires` (a date like `2027-06-30`) on each card.
- After the expiry date (end of that day), JavaScript hides the cards on the home and Patients pages and the offer page switches to "This offer has ended". The printed link and QR code keep working.
- To preview the ended message today, open the offer page with `?offerEnded=1` on the end of the address.

## Example campaign links

Give each place people find the offer its own link. The tags (`utm_...`) are just words added to the address so the practice can tell where people came from. Swap in the real domain at launch.

| Where | Link |
|---|---|
| Instagram post / bio | `https://www.moderneyescolorado.com/offers/second-pair?utm_source=instagram&utm_medium=social&utm_campaign=second_pair` |
| Google Business Profile offer | `https://www.moderneyescolorado.com/offers/second-pair?utm_source=google_business_profile&utm_medium=organic&utm_campaign=second_pair` |
| Front-desk QR code | `https://www.moderneyescolorado.com/offers/second-pair?utm_source=front_desk&utm_medium=qr&utm_campaign=second_pair` |

Tips:
- Make the QR code from the full link, and print the short address `moderneyescolorado.com/offers/second-pair` next to it so people can type it.
- Lowercase, no spaces. One `utm_campaign` name per offer (`second_pair`).
- Counting actual sales: give staff a simple code such as `PAIR20` and tally it by office. The site can't see sales.
- Calls and scheduler visits: use the office phone reports and the Eyefinity scheduler reports for completed bookings.

## Privacy rule: no tracking in the booking flow

This site has **no analytics, ad pixels, or session-replay tools**, and none should be added to the booking flow
(`book.html`, including the "Which exam do I need?" guide, which asks about symptoms, children and prior visits).
Patient details must stay out of marketing tools. If analytics (for example GA4) is added later, keep it off `book.html`,
and have the practice's privacy lead review the vendor first. See HHS guidance:
https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html

The UTM tags above only help if some analytics tool is installed on the offer page. Without one they are harmless and just label the link.
