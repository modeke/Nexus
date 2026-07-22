import { create } from 'zustand';
import { FileNode, Note, VaultConfig, ExternalEditConflict } from '../types';

interface AppState {
  // Vault
  vaultPath: string | null;
  vaultConfig: VaultConfig | null;
  setVaultPath: (path: string) => void;
  setVaultConfig: (config: VaultConfig) => void;
  
  // File tree
  fileTree: FileNode[];
  setFileTree: (tree: FileNode[]) => void;
  
  // Current note
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  updateNoteContent: (content: string) => void;
  
  // External edit conflicts
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (has: boolean) => void;
  externalEditConflict: ExternalEditConflict | null;
  setExternalEditConflict: (conflict: ExternalEditConflict | null) => void;
  
  // Favorites
  favorites: string[];
  addFavorite: (path: string) => void;
  removeFavorite: (path: string) => void;
  setFavorites: (paths: string[]) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
  editorView: 'raw' | 'preview' | 'split';
  setEditorView: (view: 'raw' | 'preview' | 'split') => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>((set) => ({
  vaultPath: null,
  vaultConfig: null,
  setVaultPath: (path) => set({ vaultPath: path }),
  setVaultConfig: (config) => set({ vaultConfig: config }),
  
  fileTree: [],
  setFileTree: (tree) => set({ fileTree: tree }),
  
  currentNote: null,
  setCurrentNote: (note) => set({ currentNote: note }),
  updateNoteContent: (content) =>
    set((state) => ({
      currentNote: state.currentNote ? { ...state.currentNote, content } : null,
      hasUnsavedChanges: true,
    })),
  
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (has) => set({ hasUnsavedChanges: has }),
  externalEditConflict: null,
  setExternalEditConflict: (conflict) => set({ externalEditConflict: conflict }),
  
  favorites: [],
  addFavorite: (path) => set((state) => ({ favorites: [...state.favorites, path] })),
  removeFavorite: (path) => set((state) => ({ favorites: state.favorites.filter((p) => p !== path) })),
  setFavorites: (paths) => set({ favorites: paths }),
  
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  rightSidebarOpen: true,
  setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
  editorView: 'split',
  setEditorView: (view) => set({ editorView: view }),
  
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
