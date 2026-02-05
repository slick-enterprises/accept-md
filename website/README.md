# accept-md website

Marketing and documentation site for [accept-md](https://github.com/hemanthvalsaraj/accept-md), live at **https://accept.md**.

## Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
pnpm start
```

## Tech

- **Next.js 14** (App Router)
- **Tailwind CSS** + `@tailwindcss/typography`
- **SEO**: metadata API, Open Graph, Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`, dynamic OG image

## Deploy (Vercel, monorepo)

To deploy **only** the `website` app from this monorepo:

1. **Import the repo** in [Vercel](https://vercel.com) (GitHub/GitLab/Bitbucket).

2. **Set the Root Directory** to `website`:
   - Project **Settings** → **General** → **Root Directory**
   - Click **Edit**, enter `website`, save.

3. **Build settings** (usually auto-detected; `website/vercel.json` sets them explicitly):
   - **Framework Preset**: Next.js
   - **Install Command**: `pnpm install`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: leave default (Next.js uses `.next`)

4. **Deploy** via the dashboard or by pushing to your connected branch.

When Root Directory is `website`, Vercel runs all commands from `website/`. pnpm will still resolve the workspace root and install from the monorepo, and `pnpm run build` runs the website’s `next build`.
