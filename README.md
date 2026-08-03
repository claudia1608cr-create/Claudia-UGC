# Claudia-UGC

Portfolio site. Static HTML/CSS/JS, deployed on Netlify from the repo root.

## `crm-app/` — separate application

`crm-app/` is a standalone, password-protected CRM for tracking brand
collaborations. It is **not** part of the portfolio site: it has its own
`netlify.toml` and is meant to live in its own repo and its own Netlify site.

It sits here only until it is moved — `crm-app/README.md` has the commands.
Until then, `netlify.toml` shadows `/crm-app/*` with a forced 404 so the
portfolio domain never serves it.
