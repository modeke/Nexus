import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { useStore } from '../store/useStore';

const Editor: React.FC = () => {
  const { currentNote, updateNoteContent, editorView, favorites, addFavorite, removeFavorite, vaultConfig } = useStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [previewContent, setPreviewContent] = useState('');

  const isFavorite = currentNote ? favorites.includes(currentNote.path) : false;

  const toggleFavorite = () => {
    if (!currentNote) return;
    if (isFavorite) {
      removeFavorite(currentNote.path);
    } else {
      addFavorite(currentNote.path);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!vaultConfig || !currentNote) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    const attachmentPath = `${vaultConfig.path}/${vaultConfig.attachmentFolderPath}`;
    
    try {
      await window.electronAPI.ensureDirectory(attachmentPath);
      
      // Copy file to attachment folder
      const destPath = `${attachmentPath}/${file.name}`;
      
      // In a real Electron app, we'd need to handle the file path differently
      // For now, we'll insert a wikilink reference
      const link = `![[${file.name}]]`;
      if (viewRef.current) {
        const cursorPos = viewRef.current.state.selection.main.head;
        viewRef.current.dispatch({
          changes: {
            from: cursorPos,
            to: cursorPos,
            insert: link,
          },
        });
      }
    } catch (error) {
      console.error('Error handling file drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: currentNote?.content || '',
      extensions: [
        basicSetup,
        markdown(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updateNoteContent(update.state.doc.toString());
          }
        }),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewRef.current && currentNote) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== currentNote.content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentDoc.length,
            insert: currentNote.content,
          },
        });
      }
    }
  }, [currentNote?.content]);

  useEffect(() => {
    if (currentNote) {
      setPreviewContent(currentNote.content);
    }
  }, [currentNote?.content]);

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No note selected</p>
          <p className="text-sm">Select a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {currentNote.path.split('/').pop()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`px-2 py-1 text-xs rounded ${
              isFavorite
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              editorView === 'raw'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Raw
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              editorView === 'split'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Split
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              editorView === 'preview'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden" onDrop={handleDrop} onDragOver={handleDragOver}>
        <div ref={editorRef} className="flex-1 overflow-auto" />
        {editorView !== 'raw' && (
          <div className="flex-1 overflow-auto p-4 border-l border-gray-200 dark:border-gray-700">
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap">{previewContent}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Editor;
