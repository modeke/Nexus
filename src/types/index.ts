export interface FileNode {
  name: string;
  isDirectory: boolean;
  path: string;
  children?: FileNode[];
}

export interface Note {
  path: string;
  content: string;
  lastModified: number;
}

export interface VaultConfig {
  path: string;
  attachmentFolderPath: string;
}

export interface ExternalEditConflict {
  filePath: string;
  diskContent: string;
  editorContent: string;
}

export interface SearchIndex {
  notes: Map<string, IndexedNote>;
  tags: Map<string, Set<string>>;
  backlinks: Map<string, Set<string>>;
}

export interface IndexedNote {
  path: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  lastModified: number;
}

export interface SearchResult {
  path: string;
  title: string;
  preview: string;
  score: number;
}
