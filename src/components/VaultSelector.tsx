import React from 'react';

interface VaultSelectorProps {
  onSelectVault: () => void;
}

const VaultSelector: React.FC<VaultSelectorProps> = ({ onSelectVault }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Work Notebook
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A local-first companion to Obsidian
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Select your Obsidian Vault to get started. Your notes will be stored as standard Markdown
            files that remain fully compatible with Obsidian.
          </p>
          <button
            onClick={onSelectVault}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Select Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultSelector;
