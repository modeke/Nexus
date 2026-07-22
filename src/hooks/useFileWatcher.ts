import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useFileWatcher = () => {
  const { currentNote, externalEditConflict, setExternalEditConflict, hasUnsavedChanges } = useStore();

  useEffect(() => {
    if (!window.electronAPI) return;

    const handleFileChanged = async (filePath: string) => {
      if (!currentNote || filePath !== currentNote.path) return;
      
      // If we have unsaved changes, this might be a conflict
      if (hasUnsavedChanges) {
        const diskContent = await window.electronAPI.readFile(filePath);
        setExternalEditConflict({
          filePath,
          diskContent,
          editorContent: currentNote.content,
        });
      } else {
        // No unsaved changes, just reload from disk
        const diskContent = await window.electronAPI.readFile(filePath);
        // Update current note content
        // This would be handled by the editor component
      }
    };

    window.electronAPI.onFileChanged(handleFileChanged);
    window.electronAPI.onFileAdded(() => {
      // Refresh file tree when files are added
    });
    window.electronAPI.onFileDeleted(() => {
      // Refresh file tree when files are deleted
    });

    return () => {
      // Cleanup listeners if needed
    };
  }, [currentNote, hasUnsavedChanges, setExternalEditConflict]);

  return { externalEditConflict };
};
