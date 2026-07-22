import { VaultConfig } from '../types';

const STANDARD_FOLDERS = [
  'Daily Notes',
  'Meetings',
  'Projects',
  'Templates',
  'Inbox',
  'Archive',
];

export const ensureVaultStructure = async (vaultConfig: VaultConfig): Promise<void> => {
  const { path: vaultPath, attachmentFolderPath } = vaultConfig;

  // Ensure standard folders exist
  for (const folder of STANDARD_FOLDERS) {
    const folderPath = `${vaultPath}/${folder}`;
    await window.electronAPI.ensureDirectory(folderPath);
  }

  // Ensure attachment folder exists
  const attachmentPath = `${vaultPath}/${attachmentFolderPath}`;
  await window.electronAPI.ensureDirectory(attachmentPath);
};
