export const BUILT_IN_TEMPLATES: Record<string, string> = {
  meeting: `# Meeting

**Date:** {{date}}
**Participants:** 
**Agenda:**

## Discussion

## Action Items

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
|      |       |          |        |

## Decisions

## Notes
`,
  fieldVisit: `# Field Visit

**Date:** {{date}}
**Location:**
**Purpose:**

## Objectives

## Observations

## Findings

## Recommendations

## Follow-up Actions
`,
  weeklyReport: `# Weekly Report

**Week of:** {{date}}

## Accomplishments

## In Progress

## Blockers

## Plans for Next Week

## Metrics/Data

## Notes
`,
  monthlyReport: `# Monthly Report

**Month:** {{date}}

## Executive Summary

## Key Achievements

## Challenges

## Metrics Overview

## Project Updates

## Upcoming Priorities

## Budget/Resources

## Notes
`,
  dashboard: `# Dashboard

**Last Updated:** {{date}}

## Quick Stats

## Active Projects

## Recent Meetings

## Upcoming Deadlines

## Key Metrics

## Alerts/Issues
`,
  training: `# Training Session

**Date:** {{date}}
**Trainer:**
**Attendees:**
**Topic:**

## Learning Objectives

## Content Covered

## Exercises/Activities

## Assessment Results

## Feedback

## Follow-up Materials

## Action Items
`,
  dataReview: `# Data Review

**Date:** {{date}}
**Data Source:**
**Review Period:**

## Data Quality Assessment

## Key Findings

## Anomalies/Issues

## Trends/Patterns

## Recommendations

## Action Items

## Notes
`,
  blankNote: `# {{title}}

`,
};

export const getTemplateContent = (templateName: string): string => {
  const template = BUILT_IN_TEMPLATES[templateName];
  if (!template) return BUILT_IN_TEMPLATES.blankNote;
  
  const date = new Date().toISOString().split('T')[0];
  return template.replace(/{{date}}/g, date).replace(/{{title}}/g, 'Untitled');
};

export const getTemplateNames = (): string[] => {
  return Object.keys(BUILT_IN_TEMPLATES);
};
