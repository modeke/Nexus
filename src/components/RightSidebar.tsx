import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

const RightSidebar: React.FC = () => {
  const { rightSidebarOpen, setRightSidebarOpen } = useStore();

  return (
    <AnimatePresence>
      {rightSidebarOpen && (
        <motion.aside
          initial={{ width: 0 }}
          animate={{ width: 280 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Outline</h2>
            <button
              onClick={() => setRightSidebarOpen(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <p className="text-sm text-gray-500">Outline will appear here</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default RightSidebar;
