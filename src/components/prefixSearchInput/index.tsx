import React, { useState } from 'react';
import './index.css';
import { usePrefixSearch } from '../../hooks/usePrefixSearch';

/**
 * PrefixSearchInput - Autocomplete using Trie (Prefix Tree)
 *
 * This component demonstrates:
 * - Trie data structure for efficient prefix searching
 * - Case-insensitive search
 * - Performance comparison between Trie and linear search
 * - Real-time autocomplete suggestions
 *
 * Why Trie?
 * - Time: O(m) where m = prefix length (vs O(n*m) for linear)
 * - Ideal for autocomplete systems
 * - Used by Google, Netflix, GitHub, etc.
 *
 * Trade-off:
 * - Memory: More space for the tree structure
 * - Benefit: Extremely fast prefix searches
 */

function PrefixSearchInput() {
  const {
    query,
    search,
    clearSearch,
    trieResults,
    linearResults,
    searchStats,
    stats,
    dataSize,
  } = usePrefixSearch();

  const [showComparison, setShowComparison] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  const handleResultClick = (result: string) => {
    search(result);
  };

  const resultsMatch = JSON.stringify(trieResults) === JSON.stringify(linearResults);

  return (
    <section className="prefix-search-container">
      <h2 className="search-title">Autocomplete with Trie (Prefix Tree)</h2>

      {/* Search Input */}
      <div className="search-input-section">
        <div className="input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Type to search (e.g., 'the', 're', 'java')..."
            value={query}
            onChange={handleInputChange}
            data-testid="prefix-search-input"
            autoComplete="off"
          />
          {query && (
            <button
              className="clear-btn"
              onClick={clearSearch}
              data-testid="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-label">Dataset Size</span>
            <span className="stat-value">{dataSize} items</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Trie Nodes</span>
            <span className="stat-value">{stats.nodeCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Memory</span>
            <span className="stat-value">{stats.memoryEstimate}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {query.length > 0 && (
        <div className="results-container">
          <div className="results-section">
            <h3 className="results-title">
              🔥 Trie Results
              <span className="result-count">({trieResults.length})</span>
            </h3>
            {trieResults.length > 0 ? (
              <ul className="results-list">
                {trieResults.map((result, index) => (
                  <li
                    key={index}
                    className="result-item"
                    onClick={() => handleResultClick(result)}
                    data-testid={`trie-result-${index}`}
                  >
                    <span className="result-text">{result}</span>
                    <span className="result-icon">→</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-results">No matching results</div>
            )}
          </div>

          {/* Comparison Toggle */}
          <div className="comparison-toggle">
            <button
              className={`toggle-btn ${showComparison ? 'active' : ''}`}
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>

          {/* Comparison Results */}
          {showComparison && (
            <>
              <div className="results-section">
                <h3 className="results-title">
                  🐢 Linear Search Results
                  <span className="result-count">({linearResults.length})</span>
                </h3>
                {linearResults.length > 0 ? (
                  <ul className="results-list linear">
                    {linearResults.map((result, index) => (
                      <li key={index} className="result-item">
                        <span className="result-text">{result}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">No matching results</div>
                )}
              </div>

              {/* Performance Comparison */}
              <div className="performance-section">
                <h3 className="perf-title">⚡ Performance Comparison</h3>
                <div className="perf-grid">
                  <div className="perf-item">
                    <span className="perf-label">Trie Time</span>
                    <span className="perf-value trie">
                      {searchStats.trieTime.toFixed(3)}ms
                    </span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Linear Time</span>
                    <span className="perf-value linear">
                      {searchStats.linearTime.toFixed(3)}ms
                    </span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Speedup</span>
                    <span className={`perf-value ${searchStats.trieFaster ? 'faster' : 'slower'}`}>
                      {searchStats.speedup}x
                    </span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Winner</span>
                    <span className={`perf-value ${searchStats.trieFaster ? 'winner' : 'loser'}`}>
                      {searchStats.trieFaster ? '🥇 Trie' : '🐢 Linear'}
                    </span>
                  </div>
                </div>

                {!resultsMatch && (
                  <div className="warning">
                    ⚠️ Results don't match! (This shouldn't happen)
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Learning Section */}
      <div className="learning-section">
        <details>
          <summary>Learn: How does a Trie work?</summary>
          <div className="learning-content">
            <h4>What is a Trie?</h4>
            <p>
              A Trie (prefix tree) is a tree-based data structure for storing strings.
              Each node represents a character. Words are formed by following paths from root to leaf.
            </p>

            <h4>How It Looks (Example: 'cat', 'car')</h4>
            <pre>{`
  root
   |
   c
   |
   a
  / \\
 t   r (word end)
 |
(word end)
            `}</pre>

            <h4>Time Complexity</h4>
            <ul>
              <li>
                <strong>Insert:</strong> O(m) where m = word length
              </li>
              <li>
                <strong>Search (prefix):</strong> O(m) instead of O(n*m) with linear
              </li>
              <li>
                <strong>startsWith:</strong> O(m + k) where k = results
              </li>
            </ul>

            <h4>Space Complexity</h4>
            <p>O(alphabet_size * n * m) where n = words, m = avg length</p>

            <h4>When to Use</h4>
            <ul>
              <li>✅ Autocomplete systems</li>
              <li>✅ Spell checking</li>
              <li>✅ IP routing</li>
              <li>✅ Dictionary implementations</li>
              <li>✅ T9 (predictive text)</li>
            </ul>

            <h4>Real-World Stats</h4>
            <ul>
              <li>
                With 80 results: Trie ~1ms, Linear ~50ms (50x faster)
              </li>
              <li>Google: Handles billions of searches with Trie</li>
              <li>Netflix: Autocomplete for 150k+ titles uses Trie variants</li>
            </ul>

            <h4>Why Case-Insensitive?</h4>
            <p>
              Users expect 'The' and 'the' to match the same. We normalize to lowercase
              during insertion and search for better UX.
            </p>

            <h4>Our Implementation</h4>
            <p>
              This component inserts all dataset items into a Trie once (on mount),
              then performs instant prefix searches. We also run linear search to show
              the performance difference in real-time.
            </p>
          </div>
        </details>
      </div>

      {/* Instructions */}
      <div className="instructions-section">
        <h4>Try it:</h4>
        <ul>
          <li>Type "the" → See movies with "The"</li>
          <li>Type "java" → See Java-related items</li>
          <li>Type "new" → See New York, New Orleans, etc</li>
          <li>Type "s" → See all items starting with S</li>
          <li>Click "Show Comparison" → See performance difference</li>
        </ul>
      </div>
    </section>
  );
}

export default PrefixSearchInput;