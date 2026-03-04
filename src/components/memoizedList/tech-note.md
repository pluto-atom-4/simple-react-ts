# Interview Script: Memoized List Component

## Start Here - What Does This Do?

I'll walk you through the Memoized List component. It's a list of items that demonstrates how to avoid unnecessary re-renders. The key insight: when a parent re-renders, all children re-render too. But sometimes that's wasteful. We use React.memo and useCallback to stop that.

Here's what happens:
1. Parent has a counter that increments
2. Each time counter increments, parent re-renders
3. Without memo, all list items would re-render (wasteful)
4. With memo, only items with changed props re-render
5. Click an item to select it → just that item re-renders

You can watch the render counts update. Parent renders go up. Child renders only go up when that item changes. That's the benefit.

---

## State Management - What's Being Tracked?

**Current code:**
```typescript
const [items] = useState<ListItem[]>(SAMPLE_ITEMS);
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [counter, setCounter] = useState(0);
const renderCountRef = useRef<RenderTracker>({});
```

**Q1: Why different state management for render counts?**

Good catch. The items are static. They don't change. Selected IDs is normal state. Counter is normal state.

But render counts? We don't want render counts to trigger re-renders. We just want to track them. So we use `useRef`. A ref doesn't cause re-renders. When a ref changes, the component doesn't re-render.

```typescript
// ❌ WRONG - Would cause infinite loop
const [renderCount, setRenderCount] = useState({});
// Every time we update, component re-renders, counts change again

// ✅ RIGHT - Tracks without triggering renders
const renderCountRef = useRef({});
// Update ref, no re-render. But we call setState to show the UI
```

**Q2: Why use a Set for selectedIds?**

Sets are fast for checking membership. "Is this item selected?" → Set.has(). Very fast.

```typescript
// Could use array
const [selectedIds, setSelectedIds] = useState([]);
// Then: selectedIds.includes(id)  ← slower for large lists

// Better: use Set
const [selectedIds, setSelectedIds] = useState(new Set());
// Then: selectedIds.has(id)  ← O(1) instead of O(n)
```

For a list of 8 items, doesn't matter. For 10,000 items? Sets are way faster.

---

## Hooks & Optimization - React.memo and useCallback

**Current code:**
```typescript
const FastListItem = memo(FastListItemComponent, (prevProps, nextProps) => {
  const isEqual =
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected;
  return isEqual;
});

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
```

**Q3: What does React.memo do?**

React.memo wraps a component. It says: "Before re-rendering, check if props changed. If not, skip the re-render."

Without memo:
```typescript
// ❌ NO MEMO
function ListItem({ id, title, isSelected, onSelect }) {
  // This runs every time parent re-renders
  // Even if isSelected and onSelect didn't change
}

// ✅ WITH MEMO
const ListItem = memo(function ListItem({ id, title, isSelected, onSelect }) {
  // Only runs if props changed
});
```

How does it check? By default, shallow equality. `prevProps.x === nextProps.x` for each prop.

**Q4: What's the custom equality check doing?**

Look at the code. We're only checking id and isSelected.

```typescript
(prevProps, nextProps) => {
  const isEqual =
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected;
  return isEqual;
}
```

Why ignore renderCount? Because renderCount changes on every update. If we checked it, memo would never help.

We care about: "Did my content change?" id and isSelected matter. renderCount is just display. It doesn't affect whether the item should re-render.

**Q5: Why useCallback for handleSelectItem?**

This is critical. Look what happens without useCallback:

```typescript
// ❌ WITHOUT useCallback
function Parent() {
  const handleSelectItem = (id) => {
    setSelectedIds(...);
  };
  
  // Every parent render creates NEW function
  // FastListItem gets new onSelect reference
  // memo sees "new" prop, re-renders even though logic is same!
}

// ✅ WITH useCallback
function Parent() {
  const handleSelectItem = useCallback((id) => {
    setSelectedIds(...);
  }, []);
  
  // Same function reference across renders
  // FastListItem sees "same" onSelect
  // memo sees no change, skips re-render
}
```

Without useCallback, memo is useless for this component. The function prop always changes.

**Q6: What about the dependency array?**

The dependency array is empty: `useCallback(..., [])`.

This means: "This function never depends on changing values. Keep the same reference forever."

Could we have other deps?

```typescript
// If we depended on something:
const [filter, setFilter] = useState('');
const handleSelectItem = useCallback((id) => {
  setSelectedIds(...);
  // Use filter somehow
}, [filter]);

// Every time filter changes, new function created
// Items with changed filter prop would re-render
```

But in this code, the function doesn't depend on anything. So empty array is correct.

---

## Finding Bugs - Performance Anti-Patterns

**Looking at the list rendering:**

```typescript
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
```

**Q7: Can you spot any performance issues?**

Actually, this is well-done. Let me walk through it:

1. ✅ Key is stable (id)
2. ✅ onSelect is memoized with useCallback
3. ✅ Child is memoized with React.memo

One thing I'd watch: the renderCount prop. It changes frequently. But we ignore it in the memo comparison. Good.

If we didn't have the custom comparison, renderCount changes would cause re-renders. But we handle that correctly.

**Q8: What if renderCount was in the memo check?**

Bad idea. renderCount changes on every parent render. So:

```typescript
// ❌ WRONG - if we checked renderCount
(prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.renderCount === nextProps.renderCount  // ← Always false!
  );
}

// renderCount increases on every update
// memo check always returns false
// All items re-render (memo useless)
```

We correctly exclude it. Good design.

---

## Edge Cases - What If...?

**Q9: What if there are 1,000 items?**

The memo optimization becomes important. Without memo, every counter increment would re-render 1,000 items. Each item calculates something expensive.

With memo, counter increments only re-render the counter display. List items don't re-render. Much faster.

Could we optimize further? Yes:

```typescript
// Virtual scrolling: only render visible items
// Infinite scroll: lazy load
// Web workers: expensive calculations off main thread
```

But for 100-200 items, this is fine.

**Q10: What if selectedIds changes?**

All items re-render? No. Let's trace it:

- User clicks item 3
- selectedIds changes → parent re-renders
- handleSelectItem stays same (useCallback!)
- Item 3's isSelected prop changes → item 3 re-renders
- Other items' props don't change → don't re-render

Efficient.

**Q11: What about really fast clicking?**

React batches state updates. Multiple clicks in quick succession might batch. The component handles it fine. No crashes.

---

## Testing Strategy

**Q12: How would you test this component?**

I'd test several things:

**1. Rendering:**
```typescript
it('renders all items', () => {
  render(<MemoizedList />);
  expect(screen.getAllByTestId(/^list-item-/)).toHaveLength(8);
});

it('shows parent render count', () => {
  render(<MemoizedList />);
  expect(screen.getByText(/Parent Renders/)).toBeInTheDocument();
});
```

**2. Memo efficiency:**
```typescript
it('items do not re-render when parent re-renders', () => {
  render(<MemoizedList />);
  
  // Get initial render count for item 1
  const initialCount = screen.getByText('Item 1: 1');
  
  // Click parent re-render button
  fireEvent.click(screen.getByTestId('parent-rerender-btn'));
  
  // Item 1 should still show render count 1 (didn't re-render)
  expect(screen.getByText('Item 1: 1')).toBeInTheDocument();
});
```

**3. Selection:**
```typescript
it('selecting item increases its render count', () => {
  render(<MemoizedList />);
  
  // Item 1 starts at 1 render
  expect(screen.getByText('Item 1: 1')).toBeInTheDocument();
  
  // Click item 1
  fireEvent.click(screen.getByTestId('list-item-1'));
  
  // Item 1 should re-render (count increases)
  expect(screen.getByText('Item 1: 2')).toBeInTheDocument();
});

it('selecting one item does not re-render others', () => {
  render(<MemoizedList />);
  
  // Click item 1
  fireEvent.click(screen.getByTestId('list-item-1'));
  
  // Item 2 should still be at 1 (didn't re-render)
  expect(screen.getByText('Item 2: 1')).toBeInTheDocument();
});
```

**Q13: How would you measure performance?**

Real tools:
- React DevTools Profiler: Time each component's renders
- Browser DevTools: Monitor frame rate
- Performance API: Measure specific operations

```typescript
// Manual timing
const start = performance.now();
fireEvent.click(button);
const end = performance.now();
console.log(`Render took ${end - start}ms`);
```

---

## Component Design - When to Use Memo

**Q14: Should you always use React.memo?**

No. It has costs:

1. **Memory:** Cache for comparison
2. **CPU:** Checking props takes time
3. **Code complexity:** Extra abstraction

Use it when:
- Component is expensive (large, complex)
- Props don't change often
- It's rendered many times

Don't use it when:
- Component is simple (just renders text)
- Props always change
- Only rendered once

**Q15: useCallback - always needed with memo?**

Only if you pass functions. For this component, yes. For others? Maybe not.

```typescript
// ✅ MEMO helps here (expensive calculation)
const Item = memo(function Item({ data, onSelect }) {
  expensiveCalculation();  // ← Expensive!
  return ...;
});

// ✅ useCallback needed (passing function)
const Parent = () => {
  const handleSelect = useCallback((id) => {
    setSelected(id);
  }, []);
  
  return <Item onSelect={handleSelect} />;
};

// Without useCallback, memo wouldn't help
```

**Q16: What about useMemo?**

useMemo is different. It memoizes a VALUE, not a function.

```typescript
// useCallback memoizes a function
const handleClick = useCallback(() => {...}, []);

// useMemo memoizes a computed value
const filtered = useMemo(() => {
  return items.filter(...);
}, [items]);
```

This component doesn't need useMemo because the items don't change. If they did, we might want:

```typescript
const sorted = useMemo(() => {
  return [...items].sort(...);
}, [items]);
```

---

## Refactoring Ideas

**Improve with virtual scrolling:**

For very large lists (1,000+ items), only render visible items.

```typescript
import { FixedSizeList as List } from 'react-window';

// Only render items in viewport
<List
  height={600}
  itemCount={items.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <FastListItem {...items[index]} />
    </div>
  )}
</List>
```

This is more complex but handles thousands of items efficiently.

**Extract button group:**

The counter section could be its own component:

```typescript
<CounterControl
  count={counter}
  onIncrement={incrementCounter}
/>
```

Keeps parent component simpler.

---

## Common Follow-Up Questions

Here's what they might ask:

- [ ] "What's the difference between React.memo and useMemo?"
- [ ] "When would you use shouldComponentUpdate?"
- [ ] "How does PureComponent differ from memo?"
- [ ] "What about performance profiling in production?"
- [ ] "Could you use Suspense for code splitting here?"
- [ ] "How would you test memo behavior?"
- [ ] "What about memoizing context consumers?"
- [ ] "Is there ever a reason to NOT use useCallback?"

**Your approach:** Pick one. Show understanding of trade-offs. Don't just recite rules.

---

## Interview Phrases to Practice

Use these when explaining:

**Starting:**
- "Let me walk you through the memo pattern..."
- "I'll explain why this needs useCallback..."
- "Looking at the code, I notice..."

**During analysis:**
- "Good question about memo overhead..."
- "Let me think about that trade-off..."
- "Here's the key insight..."

**Spotting patterns:**
- "This is using a classic optimization pattern..."
- "The expensive calculation is here..."
- "Without memo, this would re-render..."

**Making suggestions:**
- "To improve further, I would..."
- "If the list was larger, I'd..."
- "For performance testing, I'd use..."

**Handling uncertainty:**
- "I'd need to measure to know for sure..."
- "Let me think through that scenario..."
- "That's a good point I hadn't considered..."

---

## Summary Checklist

Use this during interview prep:

| Topic | What You Know |
|-------|---------------|
| **What it does** | List that avoids re-renders using memo and useCallback |
| **The problem** | Parent re-render = all children re-render (wasteful) |
| **React.memo solution** | Wraps component, skips re-render if props unchanged |
| **useCallback purpose** | Keeps function reference stable across renders |
| **Why both needed** | memo checks if props changed; without useCallback, function always "changes" |
| **Custom equality** | Check only id and isSelected, ignore renderCount |
| **renderCount pattern** | Use ref for tracking without triggering re-renders |
| **selectedIds as Set** | Fast lookup for large lists (O(1) instead of O(n)) |
| **When to use memo** | Expensive components, stable props, rendered many times |
| **When NOT to use** | Simple components, props always change, rendered once |
| **Testing approach** | Check render counts, verify memo efficiency |
| **Trade-offs** | Memory and CPU cost vs. fewer re-renders |

---

## Practice Plan

1. Read through this script once, take your time
2. Close it and try explaining the component from memory
3. Focus on WHY memo and useCallback are needed together
4. Get stuck? Read the "Hooks & Optimization" section again
5. Practice saying it aloud 2-3 times
6. Record yourself if possible
7. Listen back—does it sound natural and confident?
8. Repeat until smooth

**Key areas to emphasize:**
- Without useCallback, memo is useless
- Function props need useCallback to work with memo
- The custom equality check ignores renderCount (good design)
- Trade-off between performance gain and code complexity

**Goal:** Show you understand WHEN to optimize, not just HOW.

When you interview, they might ask "When would you use memo?" The answer isn't "always" or "never"—it's "when the performance gain exceeds the complexity cost." That's expert thinking.