---
type: monthly
month: <% tp.date.now("YYYY-MM") %>
tags: [monthly]
---

# <% tp.date.now("MMMM YYYY") %>

⏪ [[Calendar/Monthly/<% tp.date.now("YYYY-MM", -30) %>|Last Month]] | [[Home]] | [[Calendar/Monthly/<% tp.date.now("YYYY-MM", 30) %>|Next Month]] ⏩

## 🎯 Monthly Goals
- [ ]
- [ ]

## 📆 Weeks This Month
```dataview
LIST
FROM "Calendar/Weekly"
WHERE startswith(week, this.month) OR contains(file.name, this.month)
SORT file.name ASC
```

## 🧾 Summary
-
