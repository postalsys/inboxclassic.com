# inboxclassic.com

The homepage of Inbox Classic, served by GitHub Pages from `main` at https://inboxclassic.com (`CNAME`). A single static page, `index.html`, for Windows, Mac and Linux: a small script shows each visitor their platform's download and screenshots (`img/windows`, `img/mac`, `img/linux`, from the UI end-to-end test of each, refreshed with `scripts/homepage-screenshots.sh` in the app's repo; their sizes are in the script). Without the script all three downloads show, with the Windows screenshots. `appcast.xml` is the Mac app's update feed (Sparkle), written by the app's `scripts/release.sh`.

Format with `npx prettier --write index.html`.
