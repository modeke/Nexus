---
type: daily
date: <% tp.date.now("YYYY-MM-DD") %>
tags: [daily]
---

# <% tp.date.now("dddd, MMMM D, YYYY") %>

⏪ [[Calendar/Daily/<% tp.date.now("YYYY-MM-DD", -1) %>|Yesterday]] | [[Home]] | [[Calendar/Daily/<% tp.date.now("YYYY-MM-DD", 1) %>|Tomorrow]] ⏩

## 🎯 Top Priorities
- [ ]
- [ ]
- [ ]

## 📝 Notes


## 🧑‍🤝‍🧑 Meetings Today
```dataview
LIST
FROM "Meetings"
WHERE date = date(this.date)
```

## ✅ Tasks Due
```dataview
TASK
FROM ""
WHERE !completed AND due = date(this.date)
```

## 🌙 Reflection
-
