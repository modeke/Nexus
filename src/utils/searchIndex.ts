import { SearchIndex, IndexedNote, SearchResult } from '../types';

class SearchIndexManager {
  private index: SearchIndex;

  constructor() {
    this.index = {
      notes: new Map(),
      tags: new Map(),
      backlinks: new Map(),
    };
  }

  // Parse tags from content (both frontmatter and inline)
  private parseTags(content: string): string[] {
    const tags: Set<string> = new Set();
    
    // Parse frontmatter tags
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      if (tagsMatch) {
        const tagList = tagsMatch[1].split(',').map((t) => t.trim().replace(/['"]/g, ''));
        tagList.forEach((tag) => tags.add(tag));
      }
    }
    
    // Parse inline tags (#tag)
    const inlineTagRegex = /#([a-zA-Z0-9_-]+)/g;
    let match;
    while ((match = inlineTagRegex.exec(content)) !== null) {
      tags.add(match[1]);
    }
    
    return Array.from(tags);
  }

  // Parse wikilinks from content
  private parseLinks(content: string): string[] {
    const links: Set<string> = new Set();
    const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?(?:#[^\]]+)?\]\]/g;
    let match;
    while ((match = wikilinkRegex.exec(content)) !== null) {
      links.add(match[1]);
    }
    return Array.from(links);
  }

  // Extract title from content (first heading or filename)
  private extractTitle(content: string, path: string): string {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
    return path.split('/').pop()?.replace('.md', '') || 'Untitled';
  }

  // Index a single note
  indexNote(path: string, content: string): void {
    const tags = this.parseTags(content);
    const links = this.parseLinks(content);
    const title = this.extractTitle(content, path);
    
    const indexedNote: IndexedNote = {
      path,
      title,
      content,
      tags,
      links,
      lastModified: Date.now(),
    };

    // Remove old backlinks for this note
    const oldNote = this.index.notes.get(path);
    if (oldNote) {
      oldNote.links.forEach((linkedPath) => {
        const backlinks = this.index.backlinks.get(linkedPath);
        if (backlinks) {
          backlinks.delete(path);
          if (backlinks.size === 0) {
            this.index.backlinks.delete(linkedPath);
          }
        }
      });
    }

    // Add note to index
    this.index.notes.set(path, indexedNote);

    // Update tag index
    tags.forEach((tag) => {
      if (!this.index.tags.has(tag)) {
        this.index.tags.set(tag, new Set());
      }
      this.index.tags.get(tag)!.add(path);
    });

    // Update backlink index
    links.forEach((linkedPath) => {
      if (!this.index.backlinks.has(linkedPath)) {
        this.index.backlinks.set(linkedPath, new Set());
      }
      this.index.backlinks.get(linkedPath)!.add(path);
    });
  }

  // Remove a note from index
  removeNote(path: string): void {
    const note = this.index.notes.get(path);
    if (!note) return;

    // Remove from tag index
    note.tags.forEach((tag) => {
      const tagSet = this.index.tags.get(tag);
      if (tagSet) {
        tagSet.delete(path);
        if (tagSet.size === 0) {
          this.index.tags.delete(tag);
        }
      }
    });

    // Remove from backlink index
    note.links.forEach((linkedPath) => {
      const backlinks = this.index.backlinks.get(linkedPath);
      if (backlinks) {
        backlinks.delete(path);
        if (backlinks.size === 0) {
          this.index.backlinks.delete(linkedPath);
        }
      }
    });

    // Remove from notes index
    this.index.notes.delete(path);
  }

  // Search notes by query
  search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    this.index.notes.forEach((note) => {
      const titleLower = note.title.toLowerCase();
      const contentLower = note.content.toLowerCase();
      
      let score = 0;
      
      // Title match (highest weight)
      if (titleLower.includes(lowerQuery)) {
        score += 10;
        if (titleLower === lowerQuery) {
          score += 5;
        }
      }
      
      // Content match
      if (contentLower.includes(lowerQuery)) {
        score += 2;
      }
      
      // Tag match
      if (note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        score += 5;
      }

      if (score > 0) {
        // Generate preview
        const preview = this.generatePreview(note.content, lowerQuery);
        results.push({
          path: note.path,
          title: note.title,
          preview,
          score,
        });
      }
    });

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  // Generate preview with highlighted query
  private generatePreview(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(query);
    
    if (index === -1) {
      return content.substring(0, 100) + '...';
    }

    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 70);
    
    let preview = content.substring(start, end);
    if (start > 0) preview = '...' + preview;
    if (end < content.length) preview = preview + '...';
    
    return preview;
  }

  // Get all tags
  getAllTags(): string[] {
    return Array.from(this.index.tags.keys()).sort();
  }

  // Get notes by tag
  getNotesByTag(tag: string): IndexedNote[] {
    const paths = this.index.tags.get(tag);
    if (!paths) return [];
    return Array.from(paths)
      .map((path) => this.index.notes.get(path))
      .filter((note): note is IndexedNote => note !== undefined);
  }

  // Get backlinks for a note
  getBacklinks(path: string): IndexedNote[] {
    const backlinkPaths = this.index.backlinks.get(path);
    if (!backlinkPaths) return [];
    return Array.from(backlinkPaths)
      .map((p) => this.index.notes.get(p))
      .filter((note): note is IndexedNote => note !== undefined);
  }

  // Get all indexed notes
  getAllNotes(): IndexedNote[] {
    return Array.from(this.index.notes.values());
  }

  // Clear index
  clear(): void {
    this.index = {
      notes: new Map(),
      tags: new Map(),
      backlinks: new Map(),
    };
  }
}

// Singleton instance
let searchIndexManager: SearchIndexManager | null = null;

export const getSearchIndexManager = (): SearchIndexManager => {
  if (!searchIndexManager) {
    searchIndexManager = new SearchIndexManager();
  }
  return searchIndexManager;
};
