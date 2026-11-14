# Daily Tracker

Firefox extension for building a consistent daily routine. It tracks study and work blocks with auto and manual timers and logs minutes to a Google Sheet.

There is no "complete" status. It records minutes against your targets, and you judge the effort.

## Features

- **8 AM start notification** (hour is configurable).
- **Auto timers** for sites you list (LeetCode, GitHub, or any site you list). Time counts while the site is the active tab, or while a tab on that site is playing audio.
- **Manual timers** (Study, Assignments, or anything you add): paste an optional link, click Start, click Stop.
- **Progress per task** in the popup (minutes done / target).
- **Notifications** when a task starts and when its target is reached.
- **Google Sheet log:** one row per day, one column per task, synced every 5 minutes.

## Default tasks

A general starter set, all editable in Settings:

| Task | Mode | Target |
|---|---|---|
| LeetCode | auto (`leetcode.com`) | 60 min |
| GitHub | auto (`github.com`) | 30 min |
| Study | manual | 120 min |
| Assignments | manual | 60 min |

Add, remove or rename tasks freely. Auto tasks count on any URL fragment you list. Manual tasks use Start/Stop.

## Presets

Settings has a **Load preset** menu. Loading keeps your webhook and start hour.

- **General:** the table above.
- **Exam prep:** Academics, Exam prep (add your study site), Project, Research paper, LeetCode, Aptitude, Concept of the day. See `presets/exam-prep.json`.

## Install

- **Signed build:** download the `.xpi` from the [Releases](../../releases) page and open it in Firefox.
- **Temporary (development):** `about:debugging#/runtime/this-firefox` -> Load Temporary Add-on -> select `manifest.json`.

## Setup

1. Create a Google Sheet -> Extensions -> Apps Script -> paste `Code.gs`.
2. Deploy -> Web app (Execute as: Me, Access: Anyone) and copy the `/exec` URL.
3. Open the extension's Settings and edit the JSON:

```json
{
  "startHour": 8,
  "webhook": "https://script.google.com/macros/s/XXXX/exec",
  "tasks": [
    { "id": "course", "name": "Course videos", "mode": "auto", "targetMin": 90, "urls": ["your-site.com"] }
  ]
}
```

Keep the webhook URL private. It is stored in your browser, not in this repo.

## Behaviour

- **Auto tasks** stop when you switch to another tab (unless audio is playing there) or close the browser.
- **Manual tasks** keep counting until you click Stop, and resume automatically after a browser restart.
- Data is stored locally in the browser. Only the daily minutes are sent, and only to your own Sheet.

## Limits

- Firefox only (Chrome build planned).
- Settings are edited as JSON.
- Project timer is manual (git/folder activity tracking not built yet).

## Roadmap

- Local-only mode by default, Sheet sync optional
- Settings UI for tasks, targets and URLs
- CSV export and weekly summary
- Git/folder activity tracking for the Project task
- Chrome build

## License

MIT
