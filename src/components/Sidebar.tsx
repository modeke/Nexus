import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { FileNode } from '../types';
import Search from './Search';
import TemplateSelector from './TemplateSelector';
import { useDailyNotes } from '../hooks/useDailyNotes';

interface SidebarProps {
  fileTree: FileNode[];
}

const Sidebar: React.FC<SidebarProps> = ({ fileTree }) => {
  const { sidebarOpen, setSidebarOpen, setCurrentNote, vaultPath } = useStore();
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const { openTodayNote } = useDailyNotes();

  const handleFileClick = async (node: FileNode) => {
    if (node.isDirectory) return;
    
    try {
      const content = await window.electronAPI.readFile(node.path);
      setCurrentNote({
        path: node.path,
        content,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleTemplateSelect = async (content: string, filename: string) => {
    if (!vaultPath) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newNotePath = `${vaultPath}/Inbox/${filename}-${timestamp}.md`;
    
    try {
      await window.electronAPI.ensureDirectory(`${vaultPath}/Inbox`);
      await window.electronAPI.writeFile(newNotePath, content);
      setCurrentNote({
        path: newNotePath,
        content,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('Error creating note from template:', error);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0): React.ReactNode => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => handleFileClick(node)}
        >
          {node.isDirectory ? (
            <>
              <span className="text-gray-400">📁</span>
              <span className="text-gray-700 dark:text-gray-300">{node.name}</span>
            </>
          ) : (
            <>
              <span className="text-gray-400">📄</span>
              <span className="text-gray-700 dark:text-gray-300">{node.name}</span>
            </>
          )}
        </div>
        {node.isDirectory && node.children && renderFileTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0 }}
          animate={{ width: 250 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Files</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={openTodayNote}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
                title="Open Today's Note"
              >
                Today
              </button>
              <button
                onClick={() => setTemplateSelectorOpen(true)}
                className="px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded"
              >
                + New
              </button>
              <Search />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {fileTree.length > 0 ? (
              renderFileTree(fileTree)
            ) : (
              <div className="p-4 text-sm text-gray-500">No files found</div>
            )}
          </div>
        </motion.aside>
      )}
      <TemplateSelector
        isOpen={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </AnimatePresence>
  );
};

export default Sidebar;
