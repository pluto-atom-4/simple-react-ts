import { useMemo, useState, useCallback } from 'react';
import { Trie, linearSearch, SAMPLE_DATASET } from '../components/prefixSearchInput/SearchInput';

/**
 * usePrefixSearch Hook
 *
 * Manages a Trie data structure for efficient prefix searching
 * Provides both Trie-based and linear search for performance comparison
 *
 * Example usage:
 * ```
 * const { results, search, trieResults, linearResults, stats } =
 *   usePrefixSearch(SAMPLE_DATASET);
 *
 * search('re');  // Returns trie results for 're'
 * ```
 */

interface SearchStats {
  trieTime: number;
  linearTime: number;
  trieFaster: boolean;
  speedup: number;
}

export function usePrefixSearch(initialData: string[] = SAMPLE_DATASET) {
  // Initialize trie with all data
  const trie = useMemo(() => {
    const t = new Trie();
    initialData.forEach((item) => t.insert(item));
    return t;
  }, [initialData]);

  // State
  const [query, setQuery] = useState('');
  const [searchStats, setSearchStats] = useState<SearchStats>({
    trieTime: 0,
    linearTime: 0,
    trieFaster: true,
    speedup: 1,
  });

  // Perform both searches and measure time
  const { results: trieResults, results: linearResults } = useMemo(() => {
    if (!query || query.length === 0) {
      return { results: [], linearResults: [] };
    }

    // Trie search with timing
    const trieStart = performance.now();
    const trieRes = trie.startsWith(query);
    const trieEnd = performance.now();
    const trieTime = trieEnd - trieStart;

    // Linear search with timing
    const linearStart = performance.now();
    const linearRes = linearSearch(initialData, query);
    const linearEnd = performance.now();
    const linearTime = linearEnd - linearStart;

    // Calculate stats
    const speedup =
      linearTime > 0 ? (linearTime / trieTime).toFixed(2) : '∞';
    const trieFaster = trieTime <= linearTime;

    setSearchStats({
      trieTime: parseFloat(trieTime.toFixed(3)),
      linearTime: parseFloat(linearTime.toFixed(3)),
      trieFaster,
      speedup: parseFloat(speedup as string),
    });

    return { results: trieRes, linearResults: linearRes };
  }, [query, trie, initialData]);

  // Get trie statistics
  const stats = useMemo(() => trie.getStats(), [trie]);

  // Search handler
  const search = useCallback((q: string) => {
    setQuery(q);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    search,
    clearSearch,
    trieResults,
    linearResults,
    searchStats,
    stats,
    dataSize: initialData.length,
  };
}
