import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getSearchIndexManager } from '../utils/searchIndex';
import { SearchResult } from '../types';

export const useSearchIndex = () => {
  const { vaultPath, fileTree } = useStore();
  const [initialized, setInitialized] = useState(false);
  const searchIndexManager = getSearchIndexManager();

  // Initialize search index on vault load
  useEffect(() => {
    if (!vaultPath || !fileTree.length) return;

    const initializeIndex = async () => {
      searchIndexManager.clear();
      
      const scanDirectory = async (nodes: any[]) => {
        for (const node of nodes) {
          if (node.isDirectory && node.children) {
            await scanDirectory(node.children);
          } else if (node.name.endsWith('.md')) {
            try {
              const content = await window.electronAPI.readFile(node.path);
              searchIndexManager.indexNote(node.path, content);
            } catch (error) {
              console.error('Error indexing file:', node.path, error);
            }
          }
        }
      };

      await scanDirectory(fileTree);
      setInitialized(true);
    };

    initializeIndex();
  }, [vaultPath, fileTree]);

  const search = (query: string): SearchResult[] => {
    return searchIndexManager.search(query);
  };

  const getAllTags = () => {
    return searchIndexManager.getAllTags();
  };

  const getNotesByTag = (tag: string) => {
    return searchIndexManager.getNotesByTag(tag);
  };

  const getBacklinks = (path: string) => {
    return searchIndexManager.getBacklinks(path);
  };

  return {
    initialized,
    search,
    getAllTags,
    getNotesByTag,
    getBacklinks,
  };
};
