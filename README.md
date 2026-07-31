# Claudia-UGC

Portfolio site plus a private collab CRM.

## Collab CRM (`/crm`)

A single-page tracker for brand collaborations — deliverables, usage rights,
pricing, briefs, payment and deadlines, all in one card per collab.

Open it at `yoursite.com/crm`. It is not linked from the portfolio and is
marked `noindex`, but it is not password-protected — anyone with the URL can
open the page. They will see an empty CRM, not your data (see below).

### How it works

- **Dashboard** — every collab that isn't finished, soonest deadline first.
  Overdue ones jump to the top with a red badge.
- **Mark done** — archives the collab. It leaves the dashboard but stays in
  the app and keeps counting toward your monthly and yearly totals.
- **Archive** — finished collabs grouped by month, with a count and a total
  for each month.
- **Stats** — collabs per month as a bar chart, plus totals for the year:
  how many, how many different brands, invoiced, unpaid, gifted value.
  Use `‹` and `›` to compare years.
- **Brands** — every brand you've worked with, how many times, and lifetime
  total. Tap one for its full history.

### Where the data lives

Everything is stored in your browser's local storage on the device you're
using. No account, no server, no monthly cost, and it works offline.

Two consequences worth knowing:

1. **It does not sync.** Your phone and your laptop each keep their own copy.
2. **Clearing your browser data deletes it.** So does using a private window.

Use **⬇ Export** regularly to download a JSON backup, and **⬆ Import** to
restore it or copy your collabs to another device. Import merges by ID, so
importing the same backup twice will not create duplicates.
