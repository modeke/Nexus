import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getDailyNotePath, getDailyNoteContent } from '../utils/dailyNotes';

export const useDailyNotes = () => {
  const { vaultPath, setCurrentNote } = useStore();

  const openTodayNote = async () => {
    if (!vaultPath) return;

    const dailyNotePath = getDailyNotePath(vaultPath);

    try {
      // Check if today's note already exists
      const content = await window.electronAPI.readFile(dailyNotePath);
      setCurrentNote({
        path: dailyNotePath,
        content,
        lastModified: Date.now(),
      });
    } catch (error) {
      // Note doesn't exist, create it
      try {
        await window.electronAPI.ensureDirectory(`${vaultPath}/Daily Notes`);
        const newContent = getDailyNoteContent();
        await window.electronAPI.writeFile(dailyNotePath, newContent);
        setCurrentNote({
          path: dailyNotePath,
          content: newContent,
          lastModified: Date.now(),
        });
      } catch (createError) {
        console.error('Error creating daily note:', createError);
      }
    }
  };

  return { openTodayNote };
};
