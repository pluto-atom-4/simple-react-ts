import React, { useState, useCallback, useRef } from 'react';
import './index.css';
import FastListItem from './FastListItem';

/**
 * MemoizedList - Showcase of React.memo and useCallback
 *
 * This component demonstrates:
 * - React.memo to prevent unnecessary child re-renders
 * - useCallback to maintain stable function references
 * - Why both are needed together
 * - Performance benefits with large lists
 *
 * Real-world use case:
 * Large product lists, search results, feed items - anything where:
 * 1. List updates frequently
 * 2. Each item does expensive work
 * 3. Most items don't need to re-render
 */

interface ListItem {
  id: string;
  title: string;
}

const SAMPLE_ITEMS: ListItem[] = [
  { id: '1', title: 'React fundamentals' },
  { id: '2', title: 'Hooks in depth' },
  { id: '3', title: 'Performance optimization' },
  { id: '4', title: 'State management' },
  { id: '5', title: 'Testing strategies' },
  { id: '6', title: 'TypeScript patterns' },
  { id: '7', title: 'Advanced components' },
  { id: '8', title: 'Error boundaries' },
];

interface RenderTracker {
  [key: string]: number;
}

function MemoizedList() {
  // List state
  const [items] = useState<ListItem[]>(SAMPLE_ITEMS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Counter state - changes trigger parent re-render
  const [counter, setCounter] = useState(0);

  // Track how many times each item has rendered
  const [renderCount, setRenderCount] = useState<RenderTracker>({});
  const renderCountRef = useRef<RenderTracker>({});

  // Track parent renders
  const [parentRenderCount, setParentRenderCount] = useState(0);
  const parentRenderRef = useRef(0);

  // Update parent render count
  React.useEffect(() => {
    parentRenderRef.current++;
    setParentRenderCount(parentRenderRef.current);
  });

  // Track child renders (this is called when children re-render)
  const trackChildRender = useCallback((id: string) => {
    renderCountRef.current[id] = (renderCountRef.current[id] || 0) + 1;
    setRenderCount({ ...renderCountRef.current });
  }, []);

  /**
   * useCallback is CRITICAL here
   *
   * Without useCallback:
   * - New function created on every parent render
   * - FastListItem sees "new" onSelect prop
   * - React.memo thinks props changed
   * - All items re-render anyway!
   *
   * With useCallback:
   * - Same function reference across renders
   * - React.memo sees same onSelect
   * - Items only re-render when selected state changes
   */
  const handleSelectItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const incrementCounter = () => setCounter((prev) => prev + 1);

  // Track child renders on render
  items.forEach((item) => {
    if (!renderCountRef.current[item.id]) {
      renderCountRef.current[item.id] = 1;
    }
  });

  const selectedCount = selectedIds.size;
  const totalItems = items.length;

  return (
    <section className="memoized-list-container">
      <h2 className="list-title">Memoized List - Performance Optimization</h2>

      {/* Performance Stats */}
      <div className="stats-section">
        <div className="stat-box">
          <p className="stat-label">Parent Renders</p>
          <p className="stat-value">{parentRenderCount}</p>
        </div>

        <div className="stat-box">
          <p className="stat-label">Counter</p>
          <p className="stat-value">{counter}</p>
        </div>

        <div className="stat-box">
          <p className="stat-label">Selected Items</p>
          <p className="stat-value">
            {selectedCount} / {totalItems}
          </p>
        </div>
      </div>

      {/* Counter Button - Triggers Parent Re-render */}
      <div className="counter-section">
        <p className="section-label">
          Click to re-render parent (children stay memoized):
        </p>
        <button
          className="btn btn-counter"
          onClick={incrementCounter}
          data-testid="parent-rerender-btn"
        >
          Click Me ({counter})
        </button>
        <p className="instruction">
          👆 Click this button to re-render the parent. Notice:
        </p>
        <ul className="instruction-list">
          <li>Parent Renders counter increases</li>
          <li>Child render counts stay the same (memo working!)</li>
          <li>List items don't blink/flicker</li>
        </ul>
      </div>

      {/* Selection Instructions */}
      <div className="selection-section">
        <p className="section-label">Click items to select (updates child props):</p>
        <ul className="instruction-list">
          <li>Child render counts increase when you select/deselect</li>
          <li>Only clicked item re-renders (efficient!)</li>
          <li>Other items don't re-render</li>
        </ul>
      </div>

      {/* The Memoized List */}
      <ul className="items-list" data-testid="items-list">
        {items.map((item) => (
          <FastListItem
            key={item.id}
            id={item.id}
            title={item.title}
            renderCount={renderCountRef.current[item.id] || 0}
            isSelected={selectedIds.has(item.id)}
            onSelect={handleSelectItem}
          />
        ))}
      </ul>

      {/* Render Count Details */}
      <div className="render-details">
        <h3 className="details-title">Individual Item Render Counts</h3>
        <div className="render-grid">
          {items.map((item) => (
            <div key={item.id} className="render-item">
              <span className="render-label">Item {item.id}:</span>
              <span className="render-badge">
                {renderCountRef.current[item.id] || 0}
              </span>
            </div>
          ))}
        </div>
        <p className="render-note">
          <strong>Key insight:</strong> With React.memo + useCallback, only items
          whose props change will re-render. Parent rendering doesn't cause all
          children to re-render.
        </p>
      </div>

      {/* Learning Info */}
      <div className="learning-section">
        <details>
          <summary>Learn: React.memo & useCallback Pattern</summary>
          <div className="learning-content">
            <h4>The Problem</h4>
            <p>
              When a parent component re-renders, all child components re-render
              automatically. With 100 items doing expensive calculations, that's
              100 wasted calculations.
            </p>

            <h4>React.memo Solution</h4>
            <p>
              React.memo wraps a component and says: "Only re-render if props changed."
              Without it, parent change = all children re-render.
            </p>

            <h4>The Catch: Function Props</h4>
            <p>
              If you pass a function to a memoized child, the function reference
              changes every render. React.memo sees "new" prop, re-renders anyway.
            </p>

            <h4>useCallback Solution</h4>
            <p>
              useCallback memoizes the function. Same reference across renders.
              React.memo sees "same" prop, skips re-render. Win!
            </p>

            <h4>When to Use</h4>
            <ul>
              <li>
                <strong>Use React.memo:</strong> When component is expensive
                (large list, complex calculation)
              </li>
              <li>
                <strong>Use useCallback:</strong> When passing functions to memoized children
              </li>
              <li>
                <strong>Both together:</strong> For maximum performance
              </li>
            </ul>

            <h4>When NOT to Use</h4>
            <ul>
              <li>
                <strong>Simple components:</strong> Overhead might exceed benefit
              </li>
              <li>
                <strong>Props always change:</strong> Memoization is pointless
              </li>
              <li>
                <strong>No function props:</strong> Memo alone is enough
              </li>
            </ul>

            <h4>The Trade-off</h4>
            <p>
              React.memo and useCallback have a cost: memory for the cache.
              Only use them when the benefit (fewer re-renders) exceeds the cost.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

export default MemoizedList;