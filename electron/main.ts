import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import chokidar from 'chokidar';
import Store from 'electron-store';

const store = new Store();
let mainWindow: BrowserWindow | null = null;
let vaultWatcher: chokidar.FSWatcher | null = null;

// Vault path management
const getVaultPath = (): string | undefined => {
  return store.get('vaultPath') as string | undefined;
};

const setVaultPath = (vaultPath: string): void => {
  store.set('vaultPath', vaultPath);
};

// Read Obsidian config to get attachment folder path
const getAttachmentFolderPath = (vaultPath: string): string => {
  try {
    const appJsonPath = path.join(vaultPath, '.obsidian', 'app.json');
    const fs = require('fs');
    if (fs.existsSync(appJsonPath)) {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
      if (appJson.attachmentFolderPath) {
        return appJson.attachmentFolderPath;
      }
    }
  } catch (error) {
    console.error('Error reading Obsidian config:', error);
  }
  return 'Attachments';
};

// Create the main window
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff',
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (vaultWatcher) {
      vaultWatcher.close();
      vaultWatcher = null;
    }
  });
};

// Initialize vault watcher
const initializeVaultWatcher = (vaultPath: string): void => {
  if (vaultWatcher) {
    vaultWatcher.close();
  }

  vaultWatcher = chokidar.watch(vaultPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  vaultWatcher.on('change', (filePath) => {
    if (mainWindow) {
      mainWindow.webContents.send('file-changed', filePath);
    }
  });

  vaultWatcher.on('add', (filePath) => {
    if (mainWindow) {
      mainWindow.webContents.send('file-added', filePath);
    }
  });

  vaultWatcher.on('unlink', (filePath) => {
    if (mainWindow) {
      mainWindow.webContents.send('file-deleted', filePath);
    }
  });
};

// IPC handlers
ipcMain.handle('select-vault', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Obsidian Vault',
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const vaultPath = result.filePaths[0];
    setVaultPath(vaultPath);
    initializeVaultWatcher(vaultPath);
    return vaultPath;
  }
  return null;
});

ipcMain.handle('get-vault-path', async () => {
  return getVaultPath();
});

ipcMain.handle('read-file', async (_event, filePath: string) => {
  const fs = require('fs').promises;
  return fs.readFile(filePath, 'utf-8');
});

ipcMain.handle('write-file', async (_event, filePath: string, content: string) => {
  const fs = require('fs').promises;
  await fs.writeFile(filePath, content, 'utf-8');
});

ipcMain.handle('read-directory', async (_event, dirPath: string) => {
  const fs = require('fs').promises;
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  return files.map((file: any) => ({
    name: file.name,
    isDirectory: file.isDirectory(),
    path: path.join(dirPath, file.name),
  }));
});

ipcMain.handle('get-attachment-folder-path', async (_event, vaultPath: string) => {
  return getAttachmentFolderPath(vaultPath);
});

ipcMain.handle('ensure-directory', async (_event, dirPath: string) => {
  const fs = require('fs').promises;
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
});

ipcMain.handle('copy-file', async (_event, sourcePath: string, destPath: string) => {
  const fs = require('fs').promises;
  try {
    await fs.copyFile(sourcePath, destPath);
    return true;
  } catch (error) {
    console.error('Error copying file:', error);
    return false;
  }
});

// App lifecycle
app.on('ready', () => {
  createWindow();
  
  const vaultPath = getVaultPath();
  if (vaultPath) {
    initializeVaultWatcher(vaultPath);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
