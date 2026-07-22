import React from 'react';
import { motion } from 'framer-motion';
import { ExternalEditConflict } from '../types';
import { useStore } from '../store/useStore';

interface ConflictDialogProps {
  conflict: ExternalEditConflict;
}

const ConflictDialog: React.FC<ConflictDialogProps> = ({ conflict }) => {
  const { setExternalEditConflict, currentNote, setCurrentNote } = useStore();

  const handleReloadFromDisk = async () => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        content: conflict.diskContent,
      });
    }
    setExternalEditConflict(null);
  };

  const handleKeepCurrentEdits = () => {
    setExternalEditConflict(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            File Changed Outside Work Notebook
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            This note has been modified by another application (e.g., Obsidian).
          </p>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How would you like to resolve this?
            </p>
            <div className="space-y-3">
              <button
                onClick={handleReloadFromDisk}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-left transition-colors"
              >
                <div className="font-medium">Reload from Disk</div>
                <div className="text-sm opacity-90">
                  Discard your current edits and load the version from disk
                </div>
              </button>
              <button
                onClick={handleKeepCurrentEdits}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg text-left transition-colors"
              >
                <div className="font-medium">Keep Current Edits</div>
                <div className="text-sm opacity-90">
                  Keep your current edits and overwrite the disk version on save
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setExternalEditConflict(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConflictDialog;
