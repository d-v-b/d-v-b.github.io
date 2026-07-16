# d-v-b.github.io

Personal site, built with [Astro](https://astro.build).

## Develop

Requires Node 22.

```sh
npm install
npm run dev    # local dev server
npm run build  # static build to dist/
```

## Write a post

Add a markdown file to `src/content/blog/` with frontmatter:

```yaml
---
title: Post title
date: 2026-07-16
description: Optional one-liner shown in the post list.
draft: true # optional; excludes the post from the built site
---
```

## Deploy

Pushes to `master` build and deploy via GitHub Actions
(`.github/workflows/deploy.yml`). One-time setup: in the repo settings under
**Pages**, set the source to **GitHub Actions**.
