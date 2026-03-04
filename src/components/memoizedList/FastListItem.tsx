import React, { memo } from 'react';

/**
 * FastListItem - A memoized list item component
 *
 * This component uses React.memo to prevent unnecessary re-renders.
 *
 * Without React.memo:
 * - Parent renders → ALL children re-render (even if props didn't change)
 * - Expensive calculation runs for each child
 * - List of 100 items = 100 expensive calculations on every parent change
 *
 * With React.memo:
 * - Parent renders → Children only re-render if props changed
 * - Expensive calculation runs only when props change
 * - Significant performance improvement for large lists
 *
 * The onSelect callback is wrapped with useCallback in parent to maintain
 * the same function reference. Without it, memo wouldn't help because
 * a new function reference would make React think props changed.
 */

interface FastListItemProps {
  id: string;
  title: string;
  renderCount: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * This is the actual component logic.
 * We separate it from the memo wrapper for clarity.
 */
function FastListItemComponent({
  id,
  title,
  renderCount,
  isSelected,
  onSelect,
}: FastListItemProps) {
  // Simulate expensive calculation
  // In real life, this might be image processing, complex layout, etc.
  const expensiveValue = calculateExpensive(title);

  return (
    <li
      className={`list-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(id)}
      data-testid={`list-item-${id}`}
    >
      <div className="item-content">
        <span className="item-title">{title}</span>
        <span className="item-badge" title="Component render count">
          Renders: {renderCount}
        </span>
        <span className="item-expensive">{expensiveValue}</span>
      </div>
      <span className="item-checkbox" role="checkbox" aria-checked={isSelected}>
        {isSelected ? '✓' : '○'}
      </span>
    </li>
  );
}

/**
 * Wrap with React.memo to prevent re-renders when props haven't changed
 *
 * Custom comparison:
 * We use a custom equality check. Two items are equal if:
 * - Same id
 * - Same selection state
 * (We ignore renderCount and title changes for demo purposes)
 *
 * In production, you'd typically use the default shallow comparison.
 */
const FastListItem = memo(FastListItemComponent, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render)
  // Return false if props are different (do re-render)
  const isEqual =
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected;

  return isEqual;
});

FastListItem.displayName = 'FastListItem';

export default FastListItem;

/**
 * Simulate an expensive calculation
 * In real apps, this might be:
 * - Image resizing
 * - JSON parsing
 * - Complex algorithm
 * - Data transformation
 *
 * This is intentionally inefficient to demonstrate the performance benefit
 */
function calculateExpensive(input: string): string {
  // Simulate work by doing string operations
  let result = input;
  for (let i = 0; i < 1000; i++) {
    result = result.split('').reverse().join('');
  }
  return `⚡ ${result.substring(0, 10)}...`;
}