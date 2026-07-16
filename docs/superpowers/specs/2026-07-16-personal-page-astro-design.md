# Personal page refresh: minimal Astro site with blog

**Date:** 2026-07-16
**Repo:** d-v-b/d-v-b.github.io (GitHub Pages user site)

## Goal

Replace the hand-written HTML/leftover-Jekyll site with a minimal Astro site:
a landing page with an updated bio, plus a markdown-powered blog. Classic
minimal look, hand-rolled (no starter template, no theme).

## Site structure

```
astro.config.mjs
package.json
tsconfig.json
.github/workflows/deploy.yml
public/favicon.svg
src/
  layouts/Base.astro          # <head>, global CSS import, header nav, footer
  pages/index.astro           # bio
  pages/blog/index.astro      # reverse-chronological post list
  pages/blog/[slug].astro     # renders one post
  content/blog/hello-world.md # demo post (user deletes/replaces later)
  content.config.ts           # blog collection schema
  styles/global.css           # the only stylesheet
```

Deleted: `index.html`, `css/`, `_configs.yml`, Jekyll entries in `.gitignore`.

## Content

### Bio (index page)

Sourced from d-v-b/cv (`cv.json`). Draft text:

> **Davis Bennett**
>
> I'm a software engineer at [Development Seed](https://developmentseed.org),
> where I work on open source geospatial projects. I build tools for working
> with large scientific datasets — mostly storing, accessing, and analyzing
> big multidimensional arrays. I'm a core developer of
> [zarr-python](https://github.com/zarr-developers/zarr-python), and I prefer
> simple, composable tools that stand the test of time. I live in Würzburg,
> Germany.
>
> **Background**
>
> I graduated from the University of North Carolina at Chapel Hill in 2009
> with a philosophy degree. In 2019 I completed a PhD in biology in
> [Misha Ahrens' lab](https://ahrenslab.org) via the Janelia / University of
> Chicago joint PhD program. After that I worked in scientific computing and
> data engineering at Janelia (CellMap project team), then spent a few years
> as an independent contractor for clients including HHMI, Earthmover, and
> the Allen Institute for Neural Dynamics, before joining Development Seed
> in 2026.

### Footer links (all pages)

- email → mailto:davis.v.bennett@gmail.com (replaces stale Janelia address)
- github → https://github.com/d-v-b
- bluesky → https://bsky.app/profile/davisvbennett.bsky.social
- orcid → https://orcid.org/0000-0001-7579-2848
- google scholar → https://scholar.google.com/citations?user=jndGfkAAAAAJ&hl=en

The old twitter link is dropped (user confirmed; replaced by bluesky).

### Blog

- Posts are markdown files in `src/content/blog/`, defined as an Astro
  content collection.
- Frontmatter schema (zod): `title` (string, required), `date` (date,
  required), `description` (string, optional), `draft` (boolean, default
  false).
- Blog index lists non-draft posts newest-first: title, date, description.
- Post page: title, date, rendered markdown body.
- One demo post ships with the site.
- No RSS in this iteration.

### Navigation

Header on every page: site name ("Davis Bennett") linking home, plus a
"blog" link. Small, unobtrusive, same type as body text.

## Look

- Single centered column, `max-width: 65ch`, generous margins.
- System font stack; no webfonts.
- Automatic light/dark via `prefers-color-scheme` with CSS custom properties
  for background/text/link colors.
- Understated links (accent color or underline-on-hover), no heavy chrome.
- One small `global.css`; no CSS framework, no client-side JS.

## Deployment

- GitHub Actions workflow using `withastro/action` + `actions/deploy-pages`,
  triggered on push to `main`.
- Site URL: `https://d-v-b.github.io` (set as `site` in astro.config.mjs; no
  `base` needed for a user site).
- One-time manual step (documented in PR): switch repo Pages setting from
  "deploy from branch" to "GitHub Actions".

## Testing / verification

- `astro build` must pass locally and in CI — it validates frontmatter
  against the collection schema.
- Manual check with `astro dev`: index renders bio, blog index lists the demo
  post, post page renders, dark mode responds to system preference.
- No unit tests: there is no logic beyond Astro's own rendering.

## Out of scope

- RSS feed (easy later add via @astrojs/rss).
- Projects/CV sections, analytics, comments, custom domain.
