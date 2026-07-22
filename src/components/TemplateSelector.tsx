import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateContent, getTemplateNames } from '../utils/templates';
import { useStore } from '../store/useStore';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: string, filename: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [userTemplates, setUserTemplates] = useState<string[]>([]);
  const { vaultPath } = useStore();

  useEffect(() => {
    const loadUserTemplates = async () => {
      if (!vaultPath) return;
      try {
        const templatesPath = `${vaultPath}/Templates`;
        const files = await window.electronAPI.readDirectory(templatesPath);
        const templateFiles = files
          .filter((f) => !f.isDirectory && f.name.endsWith('.md'))
          .map((f) => f.name);
        setUserTemplates(templateFiles);
      } catch (error) {
        // Templates folder might not exist yet
        setUserTemplates([]);
      }
    };

    loadUserTemplates();
  }, [vaultPath]);

  const handleTemplateSelect = async (templateName: string, isUserTemplate = false) => {
    let content: string;
    let filename: string;

    if (isUserTemplate) {
      try {
        const templatePath = `${vaultPath}/Templates/${templateName}`;
        content = await window.electronAPI.readFile(templatePath);
        filename = templateName.replace('.md', '');
      } catch (error) {
        console.error('Error loading user template:', error);
        return;
      }
    } else {
      content = getTemplateContent(templateName);
      filename = templateName.charAt(0).toUpperCase() + templateName.slice(1);
    }

    onSelect(content, filename);
    onClose();
  };

  const builtInTemplates = getTemplateNames();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Template
              </h2>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Built-in Templates
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {builtInTemplates.map((template) => (
                    <button
                      key={template}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {template === 'blankNote' ? 'Blank Note' : template.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {userTemplates.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Your Templates
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {userTemplates.map((template) => (
                      <button
                        key={template}
                        onClick={() => handleTemplateSelect(template, true)}
                        className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {template.replace('.md', '')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateSelector;
