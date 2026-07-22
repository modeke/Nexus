import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { FileNode } from '../types';

const buildFileTree = async (dirPath: string, vaultPath: string): Promise<FileNode[]> => {
  try {
    const files = await window.electronAPI.readDirectory(dirPath);
    const nodes: FileNode[] = [];

    for (const file of files) {
      // Skip .obsidian folder
      if (file.name === '.obsidian') continue;
      
      if (file.isDirectory) {
        const children = await buildFileTree(file.path, vaultPath);
        if (children.length > 0) {
          nodes.push({
            name: file.name,
            isDirectory: true,
            path: file.path,
            children,
          });
        }
      } else if (file.name.endsWith('.md')) {
        nodes.push({
          name: file.name,
          isDirectory: false,
          path: file.path,
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error building file tree:', error);
    return [];
  }
};

export const useFileTree = () => {
  const { vaultPath, fileTree, setFileTree } = useStore();
  const [loading, setLoading] = useState(false);

  const refreshFileTree = async () => {
    if (!vaultPath) return;
    
    setLoading(true);
    try {
      const tree = await buildFileTree(vaultPath, vaultPath);
      setFileTree(tree);
    } catch (error) {
      console.error('Error refreshing file tree:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFileTree();
  }, [vaultPath]);

  return { fileTree, loading, refreshFileTree };
};
