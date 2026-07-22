import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectVault: () => ipcRenderer.invoke('select-vault'),
  getVaultPath: () => ipcRenderer.invoke('get-vault-path'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
  getAttachmentFolderPath: (vaultPath: string) => ipcRenderer.invoke('get-attachment-folder-path', vaultPath),
  ensureDirectory: (dirPath: string) => ipcRenderer.invoke('ensure-directory', dirPath),
  copyFile: (sourcePath: string, destPath: string) => ipcRenderer.invoke('copy-file', sourcePath, destPath),
  onFileChanged: (callback: (filePath: string) => void) => {
    ipcRenderer.on('file-changed', (_event, filePath) => callback(filePath));
  },
  onFileAdded: (callback: (filePath: string) => void) => {
    ipcRenderer.on('file-added', (_event, filePath) => callback(filePath));
  },
  onFileDeleted: (callback: (filePath: string) => void) => {
    ipcRenderer.on('file-deleted', (_event, filePath) => callback(filePath));
  },
});

declare global {
  interface Window {
    electronAPI: {
      selectVault: () => Promise<string | null>;
      getVaultPath: () => Promise<string | undefined>;
      readFile: (filePath: string) => Promise<string>;
      writeFile: (filePath: string, content: string) => Promise<void>;
      readDirectory: (dirPath: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string }>>;
      getAttachmentFolderPath: (vaultPath: string) => Promise<string>;
      ensureDirectory: (dirPath: string) => Promise<boolean>;
      copyFile: (sourcePath: string, destPath: string) => Promise<boolean>;
      onFileChanged: (callback: (filePath: string) => void) => void;
      onFileAdded: (callback: (filePath: string) => void) => void;
      onFileDeleted: (callback: (filePath: string) => void) => void;
    };
  }
}
