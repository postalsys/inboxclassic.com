# inboxclassic.com

The homepage of Inbox Classic, served by GitHub Pages from `main` at https://inboxclassic.com (`CNAME`). A single static page, `index.html`, for Windows, Mac and Linux: `js/site.js` shows each visitor their platform's download and screenshots (`img/windows`, `img/mac`, `img/linux`, from the UI end-to-end test of each, refreshed with `scripts/homepage-screenshots.sh` in the app's repo; their sizes are in `js/site.js`). Without the script all three downloads show, with the Windows screenshots. `appcast.xml` is the Mac app's update feed (Sparkle), written by the app's `scripts/release.sh`.

The design is the shared Postal Systems one (Tailwind v4 + FlyonUI, the indigo and coral brand colours, PT Sans), as on postalsys.com, ethereal.email and EmailEngine. `css/src/app.tailwind.css` is the source; run `npm install` once, then `npm run build:css` after changing classes in any page, and commit the built `css/app.css` (GitHub Pages serves the files as they are, nothing is built on deploy). `js/site.js` has the light/dark toggle and the platform choice. The font is self-hosted in `fonts/`.

Format with `npm run format` (Prettier).

For search engines and link previews: each page has a canonical URL, Open Graph and Twitter tags with the share image `img/og.jpg` (1200x630), and the homepage has schema.org data (`SoftwareApplication`). `robots.txt`, `sitemap.xml` (update `lastmod` when a page changes) and `llms.txt` (a summary for language models; keep it in step with the page) are at the root, with the icons (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest`) and `404.html`.
