# Daily Tracker

Firefox extension that tracks my daily study blocks (Academics, GATE, project, paper, LeetCode, GitHub, cyber concept, aptitude) and logs minutes to a Google Sheet.

## Goals
- 8 AM "time starts now" notification
- Auto timers on LeetCode / GitHub / GATE site
- Manual Start/Stop timers for the rest
- Daily record in a Google Sheet
- No "complete" status, only minutes vs. target

## Install
1. Build/sign as unlisted add-on on addons.mozilla.org, install the signed `.xpi`.
   (Temporary: `about:debugging#/runtime/this-firefox` -> Load Temporary Add-on -> `manifest.json`.)

## Setup
1. Create a Google Sheet -> Extensions -> Apps Script -> paste `Code.gs` -> Deploy as Web app (Me / Anyone).
2. Extension Settings: paste the `/exec` URL into `"webhook"` and add your GATE site to the gate task `"urls"`.
   Keep the webhook URL private. It is stored in the browser, not in this repo.

## Behaviour
- Auto tasks count while the site is the active tab, or while a tab on that site plays audio.
- Manual tasks count from Start until Stop (resume automatically after browser restart).
