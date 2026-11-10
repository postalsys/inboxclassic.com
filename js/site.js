/* globals document, window, navigator, location, localStorage */

'use strict';

// Light/dark theme, as on the other Postal Systems sites. The chosen theme is
// stored in localStorage ("inboxclassicTheme"); when unset, the CSS follows
// prefers-color-scheme (the dark theme is registered with prefersdark). A small
// inline script in each page's <head> applies the stored value before first
// paint, so there is no flash.
(function () {
    function storedTheme() {
        try {
            return localStorage.getItem('inboxclassicTheme');
        } catch (_err) {
            return null;
        }
    }

    function effectiveTheme() {
        let stored = storedTheme();
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateToggleIcons() {
        let theme = effectiveTheme();
        for (let elm of document.querySelectorAll('.theme-toggle-light')) {
            elm.classList.toggle('hidden', theme !== 'dark');
        }
        for (let elm of document.querySelectorAll('.theme-toggle-dark')) {
            elm.classList.toggle('hidden', theme === 'dark');
        }
    }

    for (let btn of document.querySelectorAll('.theme-toggle-btn')) {
        btn.addEventListener('click', () => {
            let next = effectiveTheme() === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try {
                localStorage.setItem('inboxclassicTheme', next);
            } catch (_err) {
                // private mode, the theme just does not persist
            }
            updateToggleIcons();
        });
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateToggleIcons);
    }
    updateToggleIcons();
})();

// The visitor's platform: its download is the button, the others are links
// under it, and the screenshots are its own. Without this all three downloads
// show, Windows first, with the Windows screenshots.
(function () {
    let platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    let agent = navigator.userAgent;
    let os = '';
    if (/mac/i.test(platform) && navigator.maxTouchPoints < 2) {
        os = 'mac';
    } else if (/win/i.test(platform)) {
        os = 'windows';
    } else if (/linux/i.test(platform) && !/android/i.test(agent)) {
        os = 'linux';
    }

    // the pixel size of each screenshot, per platform, so the page does not
    // jump when one is swapped in; update these when the screenshots change
    let sizes = {
        windows: {
            'read-1-html': [1086, 753],
            'account-1-form': [442, 311],
            'find-2-every-folder': [1086, 399],
            'write-5-new': [746, 400],
            'agents-4-send': [602, 471],
            'bounce-1-failed': [1086, 646]
        },
        mac: {
            'read-1-html': [1100, 811],
            'account-1-form': [480, 403],
            'find-2-every-folder': [1100, 430],
            'write-5-new': [760, 400],
            'agents-4-send': [560, 445],
            'bounce-1-failed': [1100, 618]
        },
        linux: {
            'read-1-html': [1090, 750],
            'account-1-form': [551, 459],
            'find-2-every-folder': [1090, 398],
            'write-5-new': [750, 400],
            'agents-4-send': [528, 481],
            'bounce-1-failed': [1090, 618]
        }
    };

    function choose(chosen) {
        document.documentElement.setAttribute('data-os', chosen);
        for (let img of document.querySelectorAll('img[data-shot]')) {
            let name = img.getAttribute('data-shot');
            let size = sizes[chosen] && sizes[chosen][name];
            img.src = 'img/' + chosen + '/' + name + '.png';
            if (size) {
                img.width = size[0];
                img.height = size[1];
            }
        }
    }

    for (let link of document.querySelectorAll('.os-also a')) {
        link.addEventListener('click', event => {
            event.preventDefault();
            choose(link.getAttribute('data-os'));
        });
    }

    // a link to one platform's download (#download-mac) chooses it
    let linked = /^#download-(windows|mac|linux)$/.exec(location.hash);
    if (linked || os) {
        choose(linked ? linked[1] : os);
    }
})();

// Copy buttons for the commands on the page (the Linux apt card). They stay
// hidden where the clipboard is not available (no script, or not https).
(function () {
    if (!navigator.clipboard) {
        return;
    }
    for (let btn of document.querySelectorAll('.copy-btn')) {
        let code = document.getElementById(btn.getAttribute('data-copy'));
        let label = btn.lastChild;
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(code.textContent).then(
                () => {
                    label.textContent = 'Copied';
                    setTimeout(() => {
                        label.textContent = 'Copy';
                    }, 2000);
                },
                () => {}
            );
        });
    }
})();
