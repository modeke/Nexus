---
type: weekly
week: <% tp.date.now("YYYY-[W]ww") %>
tags: [weekly]
---

# Week <% tp.date.now("ww, YYYY") %>

⏪ [[Calendar/Weekly/<% tp.date.now("YYYY-[W]ww", -7) %>|Last Week]] | [[Home]] | [[Calendar/Weekly/<% tp.date.now("YYYY-[W]ww", 7) %>|Next Week]] ⏩

## 🎯 Goals for the Week
- [ ]
- [ ]

## 📅 Daily Notes This Week
```dataview
LIST
FROM "Calendar/Daily"
WHERE date(file.name) >= date(this.week + "-1", "yyyy-[W]WW-c")
  AND date(file.name) <= date(this.week + "-7", "yyyy-[W]WW-c")
SORT file.name ASC
```

## 🔁 Review
- What went well:
- What to improve:
