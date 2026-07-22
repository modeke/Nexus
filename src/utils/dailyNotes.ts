export const DAILY_NOTE_TEMPLATE = `# Daily Log

**Date:** {{date}}

## Meetings

## Tasks

## Notes

## Decisions

## Follow Up

## Tomorrow
`;

export const getDailyNotePath = (vaultPath: string): string => {
  const today = new Date().toISOString().split('T')[0];
  return `${vaultPath}/Daily Notes/${today}.md`;
};

export const getDailyNoteContent = (): string => {
  const today = new Date().toISOString().split('T')[0];
  return DAILY_NOTE_TEMPLATE.replace(/{{date}}/g, today);
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};
