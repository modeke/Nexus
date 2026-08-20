---
type: yearly
year: <% tp.date.now("YYYY") %>
tags: [yearly]
---

# <% tp.date.now("YYYY") %>

⏪ [[Calendar/Yearly/<% tp.date.now("YYYY", -365) %>|Last Year]] | [[Home]] | [[Calendar/Yearly/<% tp.date.now("YYYY", 365) %>|Next Year]] ⏩

## 🎯 Year Goals
- [ ]
- [ ]
- [ ]

## 📆 Months
```dataview
LIST
FROM "Calendar/Monthly"
WHERE startswith(file.name, this.year)
SORT file.name ASC
```

## 🏆 Highlights
-
