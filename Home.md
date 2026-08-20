---
type: home
cssclass: home-page
---

# 🏠 Home

```dataviewjs
const now = dv.moment ? dv.moment() : window.moment();
const today = now.format("YYYY-MM-DD");
const week  = now.format("YYYY-[W]ww");
const month = now.format("YYYY-MM");
const year  = now.format("YYYY");

const row = (label, path, display) =>
  `**${label}**  \n[[${path}|${display}]]`;

dv.paragraph(
  [
    row("📅 Today", `Calendar/Daily/${today}`, now.format("dddd, MMM D")),
    row("🗓️ This Week", `Calendar/Weekly/${week}`, `Week ${now.format("ww")}, ${year}`),
    row("📆 This Month", `Calendar/Monthly/${month}`, now.format("MMMM YYYY")),
    row("🎯 This Year", `Calendar/Yearly/${year}`, year),
  ].join("&nbsp;&nbsp;|&nbsp;&nbsp;")
);
```

> [!tip] First time here?
> Clicking any link above that doesn't exist yet will create it automatically, pre-filled with the right template (Daily / Weekly / Monthly / Yearly), as long as Templater's folder templates are enabled — see `README.md`.

---

## ⏪ Previous Periods

### Days
```dataview
TABLE WITHOUT ID
  link(file.link, dateformat(date(file.name), "EEE, MMM d")) AS "Day"
FROM "Calendar/Daily"
WHERE file.name != date(today).toFormat("yyyy-MM-dd")
SORT file.name DESC
LIMIT 7
```

### Weeks
```dataview
TABLE WITHOUT ID
  file.link AS "Week"
FROM "Calendar/Weekly"
SORT file.name DESC
LIMIT 6
```

### Months
```dataview
TABLE WITHOUT ID
  file.link AS "Month"
FROM "Calendar/Monthly"
SORT file.name DESC
LIMIT 6
```

### Years
```dataview
TABLE WITHOUT ID
  file.link AS "Year"
FROM "Calendar/Yearly"
SORT file.name DESC
LIMIT 5
```

---

## 🗂️ By Note Type

```dataview
TABLE WITHOUT ID
  ("**" + type + "**") AS "Type",
  length(rows) AS "Count"
FROM ""
WHERE type != null AND type != "home"
GROUP BY type AS type
SORT length(rows) DESC
```

## 🧑‍🤝‍🧑 Recent Meetings
```dataview
TABLE WITHOUT ID
  file.link AS "Meeting",
  attendees AS "Attendees",
  file.mtime AS "Last edited"
FROM "Meetings"
SORT file.mtime DESC
LIMIT 5
```

## 🕒 Recently Edited (all notes)
```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  type AS "Type",
  file.mtime AS "Last edited"
FROM ""
WHERE type != "home"
SORT file.mtime DESC
LIMIT 8
```

---

## ➕ Quick Create
- [[Meetings/New Meeting|➕ New Meeting]]
- [[Notes/New Note|➕ New Note]]
