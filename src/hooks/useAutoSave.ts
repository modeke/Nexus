import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const useAutoSave = () => {
  const { currentNote, hasUnsavedChanges, setHasUnsavedChanges } = useStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentNote || !hasUnsavedChanges) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await window.electronAPI.writeFile(currentNote.path, currentNote.content);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error auto-saving:', error);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentNote, hasUnsavedChanges, setHasUnsavedChanges]);
};
