import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ensureVaultStructure } from '../utils/vaultStructure';

export const useVault = () => {
  const { vaultPath, setVaultPath, setVaultConfig, vaultConfig } = useStore();

  useEffect(() => {
    const loadVaultPath = async () => {
      if (!window.electronAPI) return;
      const path = await window.electronAPI.getVaultPath();
      if (path) {
        setVaultPath(path);
        const attachmentPath = await window.electronAPI.getAttachmentFolderPath(path);
        const config = { path, attachmentFolderPath: attachmentPath };
        setVaultConfig(config);
        await ensureVaultStructure(config);
      }
    };

    loadVaultPath();
  }, [setVaultPath, setVaultConfig]);

  const selectVault = async () => {
    if (!window.electronAPI) return;
    const path = await window.electronAPI.selectVault();
    if (path) {
      setVaultPath(path);
      const attachmentPath = await window.electronAPI.getAttachmentFolderPath(path);
      const config = { path, attachmentFolderPath: attachmentPath };
      setVaultConfig(config);
      await ensureVaultStructure(config);
    }
  };

  return { vaultPath, selectVault };
};
