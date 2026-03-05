/**
 * Trie (Prefix Tree) Data Structure
 *
 * A tree-based data structure optimized for prefix searching and autocomplete.
 *
 * Performance Comparison:
 * - Insert word: O(m) where m = word length
 * - Search for prefix: O(m) instead of O(n*m) with linear search
 * - startsWith: O(m) - check if any word starts with prefix
 *
 * Memory: O(alphabet_size * n * m)
 * Where n = number of words, m = average word length
 *
 * Why use Trie?
 * - Autocomplete systems (Google, Netflix, etc)
 * - IP routing (longest prefix matching)
 * - Spell checking
 * - Dictionary implementations
 *
 * Real-world example:
 * - Linear search: User types "re" → scan 10,000 words → ~50ms (slow)
 * - Trie search: User types "re" → traverse tree → ~1ms (fast)
 */

interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  count: number; // How many words have this prefix
}

export class Trie {
  private root: TrieNode;
  private nodeCount: number = 0;
  private wordCount: number = 0;

  constructor() {
    this.root = {
      children: new Map(),
      isEndOfWord: false,
      count: 0,
    };
  }

  /**
   * Insert a word into the trie
   * Time: O(m) where m = word length
   * Space: O(m) for new nodes
   */
  insert(word: string): void {
    if (!word || word.length === 0) return;

    const normalizedWord = word.toLowerCase();
    let node = this.root;

    for (const char of normalizedWord) {
      if (!node.children.has(char)) {
        node.children.set(char, {
          children: new Map(),
          isEndOfWord: false,
          count: 0,
        });
        this.nodeCount++;
      }

      node = node.children.get(char)!;
      node.count++;
    }

    if (!node.isEndOfWord) {
      node.isEndOfWord = true;
      this.wordCount++;
    }
  }

  /**
   * Find all words with a given prefix (case-insensitive)
   * Time: O(m + n) where m = prefix length, n = matching results
   * Space: O(n) for results
   */
  startsWith(prefix: string): string[] {
    if (!prefix || prefix.length === 0) {
      return [];
    }

    const normalizedPrefix = prefix.toLowerCase();
    let node = this.root;

    // Traverse to the end of the prefix
    for (const char of normalizedPrefix) {
      if (!node.children.has(char)) {
        return []; // Prefix not found
      }
      node = node.children.get(char)!;
    }

    // DFS from this node to find all words
    const results: string[] = [];
    this._dfsCollectWords(node, normalizedPrefix, results);
    return results;
  }

  /**
   * Check if a complete word exists in the trie
   * Time: O(m) where m = word length
   */
  search(word: string): boolean {
    if (!word || word.length === 0) return false;

    const normalizedWord = word.toLowerCase();
    let node = this.root;

    for (const char of normalizedWord) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return node.isEndOfWord;
  }

  /**
   * Helper: DFS to collect all words starting with a prefix
   * Private method used by startsWith
   */
  private _dfsCollectWords(
    node: TrieNode,
    currentWord: string,
    results: string[],
    maxResults: number = 10
  ): void {
    // Limit results for performance
    if (results.length >= maxResults) {
      return;
    }

    if (node.isEndOfWord) {
      results.push(currentWord);
    }

    // Visit children in alphabetical order
    const sortedChars = Array.from(node.children.keys()).sort();
    for (const char of sortedChars) {
      const child = node.children.get(char)!;
      this._dfsCollectWords(child, currentWord + char, results, maxResults);
    }
  }

  /**
   * Get statistics about the trie
   */
  getStats(): {
    wordCount: number;
    nodeCount: number;
    memoryEstimate: string;
  } {
    const estimatedMemory = this.nodeCount * 64; // Rough estimate: 64 bytes per node
    return {
      wordCount: this.wordCount,
      nodeCount: this.nodeCount,
      memoryEstimate:
        estimatedMemory > 1024 * 1024
          ? `${(estimatedMemory / (1024 * 1024)).toFixed(2)}MB`
          : estimatedMemory > 1024
            ? `${(estimatedMemory / 1024).toFixed(2)}KB`
            : `${estimatedMemory}B`,
    };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.root = {
      children: new Map(),
      isEndOfWord: false,
      count: 0,
    };
    this.nodeCount = 0;
    this.wordCount = 0;
  }
}

/**
 * Linear search for comparison (O(n*m))
 * Shows why Trie is better for autocomplete
 */
export function linearSearch(
  words: string[],
  prefix: string
): string[] {
  if (!prefix || prefix.length === 0) {
    return [];
  }

  const lowerPrefix = prefix.toLowerCase();
  return words
    .filter((word) => word.toLowerCase().startsWith(lowerPrefix))
    .slice(0, 10); // Limit to 10 results
}

/**
 * Sample dataset for autocomplete
 * Real apps would use databases, but this shows the concept
 */
export const SAMPLE_DATASET = [
  // Movies
  'The Shawshank Redemption',
  'The Dark Knight',
  'The Matrix',
  'The Godfather',
  'The Avengers',
  'Inception',
  'Interstellar',
  'Titanic',
  'Avatar',
  'Pulp Fiction',
  'Fight Club',
  'Forrest Gump',
  'Gladiator',
  'The Lion King',
  'Jurassic Park',
  'The Sixth Sense',
  'The Usual Suspects',
  'Memento',
  'The Prestige',
  'Sherlock Holmes',

  // Cities
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Nashville',
  'New Orleans',
  'Berlin',
  'Barcelona',
  'Bangkok',
  'Beijing',
  'Boston',
  'Barcelona',

  // Programming Languages
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'TypeScript',
  'Kotlin',
  'Scala',
  'R',
  'Swift',
  'Objective-C',
  'Perl',
  'Haskell',
  'Clojure',
  'Elixir',
  'Lua',
  'Groovy',

  // Tech Companies
  'Apple',
  'Google',
  'Microsoft',
  'Amazon',
  'Facebook',
  'Meta',
  'Netflix',
  'Tesla',
  'Twitter',
  'LinkedIn',
  'Uber',
  'Airbnb',
  'Slack',
  'Spotify',
  'Adobe',
  'Salesforce',
  'IBM',
  'Oracle',
  'Intel',
  'Nvidia',
];
