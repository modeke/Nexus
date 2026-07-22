import React from 'react';
import { useVault } from './hooks/useVault';
import { useFileTree } from './hooks/useFileTree';
import { useAutoSave } from './hooks/useAutoSave';
import { useFileWatcher } from './hooks/useFileWatcher';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import RightSidebar from './components/RightSidebar';
import VaultSelector from './components/VaultSelector';
import ConflictDialog from './components/ConflictDialog';

const App: React.FC = () => {
  const { vaultPath, selectVault } = useVault();
  const { fileTree } = useFileTree();
  useAutoSave();
  const { externalEditConflict } = useFileWatcher();

  if (!vaultPath) {
    return <VaultSelector onSelectVault={selectVault} />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar fileTree={fileTree} />
      <Editor />
      <RightSidebar />
      {externalEditConflict && <ConflictDialog conflict={externalEditConflict} />}
    </div>
  );
};

export default App;
