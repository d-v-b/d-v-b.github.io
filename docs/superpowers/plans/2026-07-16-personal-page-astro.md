# Personal Page Astro Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the leftover-Jekyll static site with a minimal hand-rolled Astro site: a bio landing page plus a markdown blog, deployed to GitHub Pages via Actions.

**Architecture:** Plain Astro 7 static site, no integrations, no client-side JS. One base layout wraps every page; blog posts are a markdown content collection validated by a zod schema; a single small CSS file handles a light/dark "classic minimal" look.

**Tech Stack:** Astro ^7.0.9, Node 22 (via nvm), GitHub Actions (`withastro/action@v6` + `actions/deploy-pages@v5`).

**Spec:** `docs/superpowers/specs/2026-07-16-personal-page-astro-design.md`

## Global Constraints

- `node`/`npm` are NOT on PATH. Start every shell session with:
  `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"`
- Only runtime dependency: `astro` (^7.0.9). No integrations, no CSS framework, no webfonts, no client-side JavaScript.
- Site URL is `https://d-v-b.github.io` (user Pages site — `site` set in config, no `base`).
- Deploy branch is `master`.
- Astro 7's compiler is strict: every non-void HTML element must be explicitly closed.
- Commits: conventional commits, each with trailer `Assisted-by: ClaudeCode:claude-fable-5`.
- Verification for this project is `astro build` + grepping `dist/` output (no unit-test framework — there is no logic beyond Astro's rendering).

---

### Task 1: Astro scaffold, Jekyll teardown

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder, replaced in Task 2)
- Modify: `.gitignore` (replace contents)
- Delete: `index.html`, `css/main.css`, `_configs.yml`

**Interfaces:**
- Produces: a building Astro project; `npm run build` outputs to `dist/`. Later tasks add files under `src/` and rely on `astro.config.mjs` having `site: 'https://d-v-b.github.io'`.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "d-v-b.github.io",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^7.0.9"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm install
```
Expected: `astro@7.x` in `node_modules`, `package-lock.json` created, exit 0.

- [ ] **Step 3: Create astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://d-v-b.github.io',
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Replace .gitignore contents**

```gitignore
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Create placeholder src/pages/index.astro**

This exists only so the build has a page; Task 2 replaces it entirely.

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Davis Bennett</title>
  </head>
  <body>
    <h1>Davis Bennett</h1>
  </body>
</html>
```

- [ ] **Step 7: Delete Jekyll leftovers**

Run: `git rm index.html css/main.css _configs.yml`
Expected: three files staged for deletion (`css/` directory disappears with its only file).

- [ ] **Step 8: Verify the build**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm run build && grep -q "Davis Bennett" dist/index.html && echo BUILD-OK
```
Expected: build succeeds, prints `BUILD-OK`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project, remove Jekyll leftovers

Assisted-by: ClaudeCode:claude-fable-5"
```

---

### Task 2: Base layout, global styles, bio landing page

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `public/favicon.svg`
- Modify: `src/pages/index.astro` (replace placeholder entirely)

**Interfaces:**
- Consumes: project scaffold from Task 1.
- Produces: `Base.astro` layout with props `{ title: string; description?: string }` and a default `<slot />`. Every later page wraps content in `<Base title="...">`. Footer and header nav live in `Base.astro` only. The blog nav link points at `/blog/` (page arrives in Task 3 — until then it 404s in dev, which is expected).

- [ ] **Step 1: Create src/styles/global.css**

```css
:root {
  --bg: #ffffff;
  --text: #1c1c1c;
  --muted: #6b6b6b;
  --link: #0b5aa2;
  --rule: #e2e2e2;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #131313;
    --text: #e6e6e6;
    --muted: #9c9c9c;
    --link: #85b8e8;
    --rule: #333333;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0 auto;
  padding: 3rem 1.25rem 2rem;
  max-width: 65ch;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  background: var(--bg);
  color: var(--text);
}

header nav {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

header nav a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
}

header nav a:hover {
  color: var(--text);
}

h1 {
  font-size: 1.6rem;
  line-height: 1.2;
  margin: 0 0 1rem;
}

h2 {
  font-size: 1.2rem;
  margin: 2.5rem 0 0.75rem;
}

a {
  color: var(--link);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

time {
  color: var(--muted);
  font-size: 0.9rem;
}

ul.posts {
  list-style: none;
  padding: 0;
}

ul.posts li {
  margin-bottom: 1.5rem;
}

ul.posts p {
  margin: 0.25rem 0 0;
  color: var(--muted);
}

footer {
  margin-top: 4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--rule);
}

footer ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

footer a {
  color: var(--muted);
}

footer a:hover {
  color: var(--text);
}
```

- [ ] **Step 2: Create src/layouts/Base.astro**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Davis Bennett, software engineer.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Davis Bennett</a>
        <a href="/blog/">blog</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <ul>
        <li><a href="mailto:davis.v.bennett@gmail.com">email</a></li>
        <li><a href="https://github.com/d-v-b">github</a></li>
        <li><a href="https://bsky.app/profile/davisvbennett.bsky.social">bluesky</a></li>
        <li><a href="https://orcid.org/0000-0001-7579-2848">orcid</a></li>
        <li><a href="https://scholar.google.com/citations?user=jndGfkAAAAAJ&hl=en">google scholar</a></li>
      </ul>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#0b5aa2"/>
  <text x="50" y="72" font-size="60" font-family="system-ui, sans-serif" fill="#ffffff" text-anchor="middle">d</text>
</svg>
```

- [ ] **Step 4: Replace src/pages/index.astro with the bio page**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Davis Bennett">
  <h1>Davis Bennett</h1>
  <p>
    I'm a software engineer at <a href="https://developmentseed.org">Development Seed</a>,
    where I work on open source geospatial projects. I build tools for working with
    large scientific datasets — mostly storing, accessing, and analyzing big
    multidimensional arrays. I'm a core developer of <a href="https://github.com/zarr-developers/zarr-python">zarr-python</a>, and I
    prefer simple, composable tools that stand the test of time. I live in Würzburg,
    Germany.
  </p>
  <h2>Background</h2>
  <p>
    I graduated from the University of North Carolina at Chapel Hill in 2009 with a
    philosophy degree. In 2019 I completed a PhD in biology in <a href="https://ahrenslab.org">Misha Ahrens' lab</a> via the Janelia / University
    of Chicago joint PhD program. After that I worked in scientific computing and data
    engineering at Janelia (CellMap project team), then spent a few years as an
    independent contractor for clients including HHMI, Earthmover, and the Allen
    Institute for Neural Dynamics, before joining Development Seed in 2026.
  </p>
</Base>
```

- [ ] **Step 5: Verify the build output**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm run build \
  && grep -q "Development Seed" dist/index.html \
  && grep -q "davisvbennett.bsky.social" dist/index.html \
  && grep -q "orcid.org" dist/index.html \
  && grep -q 'mailto:davis.v.bennett@gmail.com' dist/index.html \
  && echo BIO-OK
```
Expected: build succeeds, prints `BIO-OK`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add base layout, global styles, and bio landing page

Assisted-by: ClaudeCode:claude-fable-5"
```

---

### Task 3: Blog content collection and pages

**Files:**
- Create: `src/content.config.ts`, `src/content/blog/hello-world.md`, `src/utils/format-date.ts`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`

**Interfaces:**
- Consumes: `Base.astro` from Task 2 (props `{ title: string; description?: string }`).
- Produces: collection `blog` with frontmatter schema `{ title: string; date: Date; description?: string; draft: boolean (default false) }`. Post URLs are `/blog/<file-stem>/`. Helper `formatDate(date: Date): string` in `src/utils/format-date.ts`.

- [ ] **Step 0: Create src/utils/format-date.ts**

```ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

- [ ] **Step 1: Create src/content.config.ts**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create the demo post src/content/blog/hello-world.md**

```markdown
---
title: Hello, world
date: 2026-07-16
description: First post on the new Astro-powered site.
---

This site is now built with [Astro](https://astro.build). Posts are markdown
files in `src/content/blog/` — this one is a placeholder, so delete it and
write something better.
```

- [ ] **Step 3: Create src/pages/blog/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate } from '../../utils/format-date';

const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);
---

<Base title="Blog — Davis Bennett">
  <h1>Blog</h1>
  <ul class="posts">
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.id}/`}>{post.data.title}</a>
          <time datetime={post.data.date.toISOString()}> — {formatDate(post.data.date)}</time>
          {post.data.description && <p>{post.data.description}</p>}
        </li>
      ))
    }
  </ul>
</Base>
```

- [ ] **Step 4: Create src/pages/blog/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate } from '../../utils/format-date';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Base title={`${post.data.title} — Davis Bennett`} description={post.data.description}>
  <article>
    <h1>{post.data.title}</h1>
    <time datetime={post.data.date.toISOString()}>{formatDate(post.data.date)}</time>
    <Content />
  </article>
</Base>
```

- [ ] **Step 5: Verify blog pages build**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm run build \
  && grep -q "Hello, world" dist/blog/index.html \
  && grep -q "Hello, world" dist/blog/hello-world/index.html \
  && grep -q "placeholder" dist/blog/hello-world/index.html \
  && echo BLOG-OK
```
Expected: build succeeds, prints `BLOG-OK`.

- [ ] **Step 6: Verify draft exclusion (temporary fixture)**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
cat > src/content/blog/draft-test.md <<'EOF'
---
title: Draft test
date: 2026-07-16
draft: true
---

Should not be published.
EOF
npm run build
test ! -e dist/blog/draft-test/index.html \
  && ! grep -q "Draft test" dist/blog/index.html \
  && echo DRAFT-OK
rm src/content/blog/draft-test.md
```
Expected: prints `DRAFT-OK` (no page emitted, not listed), fixture removed afterward.

- [ ] **Step 7: Verify schema validation rejects bad frontmatter (temporary fixture)**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
cat > src/content/blog/bad-test.md <<'EOF'
---
date: 2026-07-16
---

Missing a title.
EOF
npm run build; test $? -ne 0 && echo SCHEMA-OK
rm src/content/blog/bad-test.md
npm run build
```
Expected: first build FAILS with a zod error about `title` (prints `SCHEMA-OK`); final build succeeds after fixture removal.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add markdown blog with content collection

Assisted-by: ClaudeCode:claude-fable-5"
```

---

### Task 4: GitHub Pages deployment workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (replace contents)

**Interfaces:**
- Consumes: the building site from Tasks 1–3.
- Produces: CI deploy on push to `master`. Requires a one-time manual repo setting flip (documented in README and the PR description).

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install, build, and upload site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Replace README.md contents**

```markdown
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
```

Note: the nested code fences above use ```` ```sh ```` and ```` ```yaml ````
inside the README — when creating the file, keep them as regular triple
backticks.

- [ ] **Step 3: Validate workflow YAML parses**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml')); print('YAML-OK')"
```
Expected: prints `YAML-OK`. (If PyYAML is unavailable, `npx --yes yaml-lint .github/workflows/deploy.yml` is an alternative.)

- [ ] **Step 4: Final full build check**

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm run build && echo FINAL-OK
```
Expected: build succeeds, prints `FINAL-OK`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add GitHub Pages deploy workflow and rewrite README

Assisted-by: ClaudeCode:claude-fable-5"
```

---

## Post-plan verification (manual, end of implementation)

- Run `npm run dev` and load `http://localhost:4321/`: index shows bio, header nav works, `/blog/` lists the demo post, the post page renders, footer links present on all pages.
- Toggle OS dark mode (or emulate `prefers-color-scheme: dark` in devtools) and confirm colors flip.
- After merge to `master`: flip repo **Settings → Pages → Source** to **GitHub Actions**, confirm the workflow run deploys, and check `https://d-v-b.github.io`.
