# Claudia-UGC

Portfolio site. Static HTML/CSS/JS, deployed on Vercel from the repo root.

## `crm-app/` — separate application

`crm-app/` is a standalone, password-protected CRM for tracking brand
collaborations. It is **not** part of the portfolio site: it has its own
`vercel.json` and is meant to live in its own repo and its own Vercel project.
See `crm-app/README.md` for how to deploy and how to move it out.

It sits here only until that move happens. Two things keep it off the portfolio
domain in the meantime:

- `.vercelignore` excludes `crm-app` from this project's deployment, so the
  files are never uploaded. This is the one that matters — Vercel is the host.
- `netlify.toml` shadows `/crm-app/*` with a forced 404, in case this repo is
  ever also served by Netlify.
