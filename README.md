# Your Obsidian Vault — Setup

This is a ready-to-use vault. Config is pre-wired; you only need to install 3 free community plugins.

## 1. Open the vault
Obsidian → **Open folder as vault** → select this folder.

## 2. Install the plugins (one-time)
Settings → **Community plugins** → turn off Restricted Mode → **Browse** → search and install each:
- **Dataview**
- **Templater**
- **Homepage**

Then enable all three with the toggles (they're already listed in `community-plugins.json`, but Obsidian still needs you to install the actual plugin code once per device — it can't be bundled in the vault folder itself).

## 3. Restart Obsidian
Close and reopen the vault. You should land directly on **Home.md** — that's the Homepage plugin doing its job.

## What you get on Home
- Live links to **Today / This Week / This Month / This Year** (auto-computed, always correct — no manual dates to update)
- **Previous periods**: last 7 days, 6 weeks, 6 months, 5 years, one click away
- **By Note Type** table — counts of daily/weekly/monthly/yearly/meeting/note across the whole vault
- **Recent Meetings** and **Recently Edited** notes

## How note creation works
Click any date link on Home that doesn't exist yet (e.g. next week's note) — Obsidian creates the file, and **Templater's folder templates** instantly fill it with the right template (Daily/Weekly/Monthly/Yearly/Meeting) based on which folder it landed in. No manual template picking needed.

To start a fresh meeting or note right now, use the **Quick Create** links at the bottom of Home — click, then rename the file (right-click → Rename, or `Ctrl/Cmd+R`).

## Folder structure
```
Home.md                  ← landing page
Calendar/
  Daily/YYYY-MM-DD.md
  Weekly/YYYY-[W]ww.md
  Monthly/YYYY-MM.md
  Yearly/YYYY.md
Meetings/                ← type: meeting
Notes/                   ← type: note (general notes)
Templates/                ← the 6 templates driving all of the above
```

## Adding your own note types
Every note's `type:` frontmatter field is what powers the "By Note Type" table on Home — add a new type (e.g. `type: project`) to any note and it'll show up automatically. No config changes needed.

## Customizing
- Edit `Home.md` directly — it's plain Markdown + Dataview code blocks, nothing hidden.
- Change how many previous periods show by editing the `LIMIT N` in each Dataview block.
- Change the landing page itself in Settings → Homepage if you ever want a different note to open first.
