# Collab CRM

A private, password-protected tracker for brand collaborations — deliverables,
usage rights, pricing, briefs, payments and deadlines, one card per collab.

Self-contained static site: no backend, no accounts, no monthly cost.

---

## Moving this into its own repo

These files are a complete repo root — `index.html` is the whole app. To split
it out from the portfolio repo:

```bash
# 1. Create an empty repo on github.com (no README, no .gitignore) — e.g. claudia-collab-crm
# 2. From the folder containing crm-app/:
cp -r crm-app claudia-collab-crm
cd claudia-collab-crm
git init -b main
git add .
git commit -m "Collab CRM"
git remote add origin git@github.com:YOUR-USERNAME/claudia-collab-crm.git
git push -u origin main
```

Then in Netlify: **Add new site → Import an existing project**, pick the repo,
leave the build command empty and the publish directory as `.`. The included
`netlify.toml` handles routing, security headers and `noindex`.

## How it works

- **Dashboard** — every collab that isn't finished, soonest deadline first.
  Overdue ones jump to the top with a red badge.
- **Mark done** — archives the collab. It leaves the dashboard but stays in the
  app and keeps counting toward monthly and yearly totals.
- **Archive** — finished collabs grouped by month, with a count and total each.
- **Stats** — collabs per month as a bar chart, plus totals for the year: how
  many, how many different brands, invoiced, unpaid, gifted value.
- **Brands** — every brand, how many times, lifetime total, full history.

Money is summed per currency and never converted, so a mixed year reads
`€2 400 + 8 000 kr` rather than a total resting on an invented exchange rate.

## The password

On first open you set a password. It is run through PBKDF2-SHA256 (600,000
iterations) to derive an AES-GCM key, and everything is stored encrypted in the
browser's local storage. The key is held in memory only.

It locks after **15 minutes idle**, when you tap **🔒**, and whenever the tab
closes — reopening always needs the password again.

**There is no password reset.** No reset link, no master key, no recovery
question. That is what stops anyone else reading your collabs, and it applies to
you too. Keep a backup.

A wrong password is indistinguishable from corrupt data to the app: AES-GCM
authentication simply fails, and you get "that password doesn't match".

### What this does and doesn't protect

It protects the **data**: someone with your unlocked phone, or reading the
browser's storage directly, sees ciphertext.

It does not hide the **page**. The app itself is a public URL — anyone who
guesses it gets the lock screen, not your collabs. If you also want the URL
itself gated, that needs Netlify's site-level password (a paid plan).

Encryption needs a secure context, so the app must be served over `https://`
(or `localhost`). Opening `index.html` straight off disk will show a warning
instead of the lock screen.

## Backups

**⋯ → Download encrypted backup** gives you the vault file, still locked with
your password — safe to keep in iCloud, Drive or email. **Import a backup**
restores it, or copies your collabs onto another device; it merges by ID, so
importing the same file twice never creates duplicates.

There is also **Download readable copy** — plain, unencrypted JSON for an
accountant or a spreadsheet. It asks for confirmation first, because anyone who
opens that file can read everything.

Note that the data does **not** sync. Each device keeps its own encrypted copy,
and clearing browser data deletes it. Changing your password re-encrypts the
device copy but not old backup files — those keep the password they were made
with, so label them if you keep several.

## Installing on your phone

It ships a web app manifest and a service worker, so **Share → Add to Home
Screen** gives it an icon and opens it without browser chrome. The service
worker is network-first: it fetches the latest version when online and falls
back to the cached copy when there's no connection.
