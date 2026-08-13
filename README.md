# R&B's Mo'Betta Green MarketPlace — Coming Soon

Static coming-soon page for Mo'Betta Green MarketPlace (Beverly Grant, Denver).
Built by Wright Adventures.

## Files

```
index.html                  the page
assets/css/styles.css       all styles (brand tokens at the top)
assets/js/main.js           copyright year only
assets/img/miss_beverly.jpg founder photo
assets/img/favicon.svg      tab icon
assets/img/og-image.png     1200×630 social share card
.claude/launch.json         local preview config
```

No build step, no dependencies. Fonts load from Google Fonts.

## Preview locally

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321

## Deploy

Hosted on Vercel (project `mobettagreen`) — pushing to `main` autodeploys.
Production domain: **mobettagreen.org**. No build step; Vercel serves the repo
root as static files.

The `og:url` and `og:image` tags in `index.html` are absolute and point at
`https://mobettagreen.org` — update them if the domain ever changes.

## Brand

Colors are sampled from the market banner and canopy, defined as custom
properties in `assets/css/styles.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--red` | `#E23B2E` | MO'BETTA red, canopy red, accents |
| `--green` | `#45BE6B` | GREEN green |
| `--green-dark` | `#2E9A50` | green text on light backgrounds (contrast) |
| `--brown` | `#3F322B` | MARKETPLACE brown, body text, torn ribbon |
| `--paper` | `#F7F3EA` | weathered banner white, page background |

Type: **Archivo Black** for the wordmark and headings (closest free match to the
painted logo lettering), **Anton** for condensed label text, **Archivo** for body.

### Logo

The wordmark is currently **set in type**, not the real artwork — see the
`.logo` block in `index.html` and its styles in the stylesheet. When Miss
Beverly sends the packaged logo files (vector preferred: `.svg`, `.ai`, or
`.eps`), swap the `<span class="logo">` blocks for an `<img>` and delete the
`.logo` CSS.

## To confirm with the client

- Founding year — the page says "Since 2010"; press coverage supports roughly a
  decade-plus of operation but the exact year should be verified.
- The 2401 Welton St address is the Five Points location; the market also
  travels, so the copy points people to social for current dates and sites.
- Contact email `mbgmanager@gmail.com` came from public listings — confirm it's
  the one she wants published.
- Whether to name Seeds of Power Unity Farm as a separate entity or fold it in.
