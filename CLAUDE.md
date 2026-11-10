# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site for Inbox Classic. The app itself lives in the sibling checkout `../PostalExpress` (GitHub `postalsys/inbox-classic`); "the app repo" below means that directory, and it is where to look up features, wording, release notes and the scripts that feed this site. This site is served by GitHub Pages straight from `main` at https://inboxclassic.com (`CNAME`, `.nojekyll`). Static HTML pages with no templating and no tests. Pushing to `main` deploys, and nothing is built on deploy, so the compiled CSS is committed.

## Commands

- `npm install` once (devDependencies only: Tailwind, FlyonUI, iconify, Prettier).
- `npm run build:css`: compile `css/src/app.tailwind.css` into `css/app.css`. Run it after any class change in a page or in `js/site.js`, and commit `css/app.css`; a class missing from the build is simply unstyled on the live site.
- `npm run format`: Prettier on the pages, CSS source, JS and docs (`.prettierrc.json`: 4 spaces, print width 160, single quotes).
- `npm run serve`: preview at http://localhost:8080. Pages link `/css/app.css`, `/fonts/...` and `/js/site.js` by absolute path, so serve from the repo root.

## Design system

The site uses the shared Postal Systems design, the same as postalsys.com (`../postalsys-web`), ethereal.email (`../ethereal-www`) and EmailEngine (`../emailengine`): Tailwind v4 + FlyonUI 2, brand indigo `#4C5CC5` (primary) and coral `#F8485E` (secondary), PT Sans self-hosted in `fonts/`, Tabler icons as `icon-[tabler--name]` classes. When in doubt about how something should look, copy the pattern from those repos (their `app.tailwind.css` and `views/`) rather than inventing a new one.

- Light and dark themes: the dark theme follows `prefers-color-scheme`; the navbar toggle stores the choice in `localStorage` (`inboxclassicTheme`), applied before first paint by the small inline script in every page's `<head>`. Check both themes when changing anything visual.
- Layout conventions: `bg-base-200` page, `bg-base-100` sticky navbar and footer, content in `max-w-page mx-auto px-6` (`--container-page` in the CSS source), cards as `card bg-base-100 shadow-md`, the coloured hero band is `.ui-brand-hero` (same gradient as postalsys.com). App screenshots use `.app-shot`, which keeps a light frame in both themes because the captures are light.
- Legal pages wrap their text in `.ui-prose` (restores headings, lists and link styling that Tailwind's preflight removes).
- FlyonUI's JS runtime is not loaded; nothing on the site needs dropdowns or overlays. If one is added, vendor `node_modules/flyonui/flyonui.js` the way the other sites do.
- FlyonUI emits its components in `@layer utilities`, so overrides that must win (the per-platform show/hide rules, `.btn-on-brand`) are un-layered in the CSS source on purpose.
- The navbar and footer are copied into each of `index.html`, `privacy.html`, `terms.html` and `404.html`; change all four together.
- EmailEngine is linked the way the other Postal Systems sites link it (the shared `oss-docs` scheme): every link is `https://emailengine.app/?utm_source=inboxclassic.com&utm_medium=<homepage|footer|inline>&utm_campaign=oss-docs&utm_content=<placement slug>` (the footer link has no `utm_content`). The logo `img/emailengine.png` (from postalsys-web) sits on a white pad because its dark lettering disappears on the dark theme. The footer's "From the makers of" logo line is on every page; the homepage also has an EmailEngine card and a link in the "Is it really free?" answer.
- Nothing is loaded from third parties (fonts, icons and images are all self-hosted). The one outside request is Plausible, our own; the postalsys.com `frame.js` beacon the other sites load is deliberately left out. The privacy policy describes exactly this, so update it if that ever changes.

## How the homepage works

`index.html` holds the schema.org JSON-LD in the head; the behaviour is in `js/site.js`.

- **Per-platform downloads and screenshots.** `js/site.js` detects the visitor's OS and sets `data-os` on `<html>`. Rules in the CSS source keyed on `html[data-os=...]` show that platform's `.os-download` button and `.os-note`, and the `.os-also` line links to the others. A `#download-windows|mac|linux` hash forces a platform. Without the script (or an unknown OS) all three downloads show. The downloads appear twice (hero and the closing "Try Inbox Classic" card).
- **Screenshots** are `<img data-shot="name">` with `src="img/windows/<name>.png"` as the default. The script swaps in `img/<os>/<name>.png` and sets width/height from the `sizes` table in `js/site.js`. When screenshots are replaced, update `sizes` (and the `width`/`height` attributes on the default Windows `<img>` tags) to match. Every shot must exist in all three of `img/windows`, `img/mac`, `img/linux`.
- Screenshots come from the app repo's UI end-to-end tests, refreshed with `../PostalExpress/scripts/homepage-screenshots.sh`.

## Files that must stay in step with the page

When page content or features change, check all of these:

- `llms.txt`: a plain-language summary of the app for language models. Keep its feature list, download links and system requirements matching `index.html`.
- `sitemap.xml`: bump `<lastmod>` for any changed page; its `<image:image>` entries list screenshot URLs.
- JSON-LD in `index.html` head: `operatingSystem`, `inLanguage` (app UI languages), `screenshot` URLs.
- Open Graph / Twitter tags and canonical URL on each page; share image is `img/og.jpg` (1200x630).
- System requirements (Windows 10/11, macOS 26+ on Apple silicon, Ubuntu 26.04+) appear in the download notes in two places on the homepage (hero and the closing download card), in the JSON-LD and in `llms.txt`.

## Analytics: Plausible through a.inboxclassic.com (the vhost is load-bearing)

Every page's `<head>` loads `https://a.inboxclassic.com/pv.js` and calls `plausible.init({ endpoint: 'https://a.inboxclassic.com/e' })`. Neither path is a file anywhere: `a.inboxclassic.com` is a DNS-only A record (Cloudflare) to srv-04 (`ssh andris@srv-04.emailengine.dev`), and the `a.inboxclassic.com` vhost in `/etc/caddy/Caddyfile` there rewrites `/pv.js` to the site's own script `/js/pa-3rttl1epShN1LnJaVLLFD.js` and `/e` to `/api/event`, proxying both to the self-hosted Plausible CE on `localhost:11800` (the instance behind plausible.emailengine.dev). It is the same pattern as `a.emailengine.app` for emailengine.app; GitHub Pages cannot proxy, hence the subdomain.

- It is proxied because EasyPrivacy (on by default in uBlock Origin and AdGuard) blocks `plausible.*` hostnames. Do not rename the host or paths to anything resembling `plausible`, `stats`, `analytics`, `script.js` or `/api/event`.
- The `endpoint` in `plausible.init()` is required: the `pa-` script has `https://plausible.emailengine.dev/api/event` built in, which blockers catch.
- The vhost SETS `X-Plausible-IP` and `X-Forwarded-For` from the socket, so visitors cannot choose their own country.
- The script's options (outbound links, file downloads, form submissions) are set per site in the Plausible dashboard, not here.
- Custom events: every download link on the homepage carries `plausible-event-name=Download` with `plausible-event-os` (`windows`, `mac`, `linux`, `linux-arm64`) and `plausible-event-location` (`hero`, `bottom`) classes; a new download link needs the same classes. `404.html` sends `404` with the missing `path`. Both need a matching goal in Plausible (site id 10; goals are rows in the `goals` table of the `plausible_db` database in the `plausible-plausible_db-1` container, or Site Settings > Goals in the dashboard). Renaming an event without its goal silently stops counting it.
- Changing the tag or the vhost alone silently stops analytics. To check without recording a visit, load the page in Playwright with `navigator.webdriver` hidden (Plausible ignores automated browsers otherwise) and intercept the POST to `/e`.

## Linux apt repository: apt.inboxclassic.com

The FAQ card `#linux-apt` (linked from both Linux download notes) tells Linux users to download `https://apt.inboxclassic.com/inboxclassic.sources` into `/etc/apt/sources.list.d/` and `apt install inbox-classic`. That file is a deb822 source with the release key inline, kept in the app repo as `linux/data/inboxclassic.sources`; the `.deb` (newer than 0.9.0) installs the same file from its postinst, so both routes end up identical. The host is not this repo: it is a DNS-only A record (Cloudflare) to srv-04 and a static `file_server` vhost in `/etc/caddy/Caddyfile` there, serving `/var/www/apt.inboxclassic.com` (`/` redirects to `/#linux-apt`, so keep that id). The indexes are signed with the release GPG key and uploaded by `../PostalExpress/scripts/apt-repo.sh`, which `release.sh` runs after each release. The vhost has no access log, as the privacy policy promises. If the commands in the card change, change `llms.txt` and the check at the end of `apt-repo.sh` with them. The commands are one `<code>` per line in `.ui-terminal` (the `$ ` prompt is CSS, the Copy button joins the lines); `<wbr />` after slashes gives phones break points.

## Files written by other tooling

- `appcast.xml` is the Mac app's Sparkle update feed, generated by `../PostalExpress/scripts/release.sh` (commits titled "Inbox Classic X.Y.Z for the Mac updater"). Do not hand-edit it; the `sparkle:edSignature` and `length` must match the released DMG.
- `.well-known/microsoft-identity-association.json` verifies the publisher domain for the app's Microsoft (OAuth) registration. Leave it as is.

## Copy style

Site copy is plain, concrete and short: say what the app does in everyday words, one message per section, nothing said twice. Download links always point to `https://github.com/postalsys/inbox-classic/releases/latest/download/<asset>` so they never need a version bump.
