import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchIndex } from '../hooks/useSearchIndex';
import { SearchResult } from '../types';
import { useStore } from '../store/useStore';

const Search: React.FC = () => {
  const { search } = useSearchIndex();
  const { setCurrentNote, setSidebarOpen, setRightSidebarOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setResults(search(query));
    } else {
      setResults([]);
    }
  }, [query, search]);

  const handleResultClick = async (result: SearchResult) => {
    try {
      const content = await window.electronAPI.readFile(result.path);
      setCurrentNote({
        path: result.path,
        content,
        lastModified: Date.now(),
      });
      setIsOpen(false);
      setQuery('');
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-2"
      >
        <span>🔍</span>
        <span>Search</span>
        <span className="text-xs text-gray-400">⌘K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <div
                      key={result.path}
                      onClick={() => handleResultClick(result)}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {result.preview}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.path.split('/').pop()}
                      </div>
                    </div>
                  ))
                ) : query.trim() ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Type to search notes...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
