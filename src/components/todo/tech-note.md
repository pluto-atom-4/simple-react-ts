# Todo List with Filtering - Tech Notes

## Overview

This Todo List component is a comprehensive showcase of React hooks and performance optimization techniques. It demonstrates how to build a searchable, filterable list with dynamic state management, debouncing, and memoization.

## Key Learning Points

### 1. **useState for Dynamic Lists**

```typescript
const [todos, setTodos] = useState<Todo[]>(initialTodos);
```

- Manages the complete list of todos
- State updates trigger re-renders
- Used in the custom `useTodos` hook for encapsulation

### 2. **Custom Hook Pattern with useCallback**

The `useTodos` hook demonstrates:
- **Separation of Concerns**: State logic extracted from component
- **Memoization**: `useCallback` ensures action handlers maintain stable references
- **Why it matters**: Prevents unnecessary re-renders of child components if they use `React.memo()`

```typescript
const addTodo = useCallback((text: string) => {
  // Implementation
}, []); // Empty dependency array = stable reference across all renders
```

### 3. **Debounced Search - The Performance Sweet Spot**

**Problem**: Filtering 8+ todos on every keystroke = expensive re-renders

**Solution**: `useDebounce` hook with 500ms delay

```typescript
const [searchInput, setSearchInput] = useState<string>('');
const debouncedSearchValue = useDebounce<string>(searchInput, 500);
```

**Re-render Timeline:**
```
User types: 'r' → searchInput updates → component re-renders (fast)
           'e' → searchInput updates → component re-renders (fast)
           'a' → searchInput updates → component re-renders (fast)
           'c' → searchInput updates → component re-renders (fast)
  [500ms pause, no typing]
           → debouncedSearchValue updates → filtered list recalculates → re-render
```

**Benefits:**
- **Reduced filtering calls**: Only filters after user stops typing
- **Smoother UX**: Input field responds instantly, filtering is optimized
- **Real-world analogy**: Like auto-save that waits for you to finish typing

### 4. **useMemo for Computed Values**

```typescript
const filteredTodos = useMemo(() => {
  const filtered = filterTodosBySearch(todos, debouncedSearchValue);
  return sortTodos(filtered);
}, [todos, debouncedSearchValue]);
```

**What it does:**
- Recalculates filtered list ONLY when dependencies change
- Dependencies: `todos` (when list changes) or `debouncedSearchValue` (when search finishes)

**When it helps:**
- Component re-renders for unrelated reasons (parent updates)
- Without useMemo: Would refilter entire list unnecessarily
- With useMemo: Returns cached result if dependencies haven't changed

### 5. **Pure Functions for Filtering Logic**

```typescript
export function filterTodosBySearch(todos: Todo[], searchTerm: string): Todo[] {
  if (!searchTerm.trim()) return todos;
  const lowercaseSearch = searchTerm.toLowerCase();
  return todos.filter((todo) =>
    todo.text.toLowerCase().includes(lowercaseSearch)
  );
}
```

**Why separate from component:**
- **Testability**: Easy to unit test
- **Reusability**: Can use in other components
- **Clarity**: Component focuses on UI logic, utilities handle data logic
- **Performance**: Can be memoized independently

### 6. **Comparison: Immediate vs Debounced Search**

#### Without Debounce (SearchFilter component):
- Every keystroke filters instantly
- Good for small datasets (15 products)
- Network calls would be wasteful

#### With Debounce (Todo component):
- Waits 500ms after user stops typing
- Better for larger datasets or expensive operations
- Same user experience, fewer computations

## Component Architecture

```
Todo Component
├── useState: newTodoInput (form state)
├── useState: searchInput (immediate search state)
├── useDebounce: debouncedSearchValue (optimized search)
├── useTodos: todos + action handlers (list state)
├── useMemo: filteredTodos (computed value)
└── JSX
    ├── Add form (input + button)
    ├── Search input (updates searchInput immediately)
    ├── Info section (count badge, filter indicator)
    └── Todo list (renders filteredTodos)
```

## Re-render Triggers

| Trigger | Effect |
|---------|--------|
| User types in add input | `newTodoInput` updates → re-render |
| User types in search input | `searchInput` updates → re-render |
| 500ms after typing stops | `debouncedSearchValue` updates → filtered list recalculates |
| User clicks add button | `addTodo()` updates `todos` → re-render |
| User toggles checkbox | `toggleTodo()` updates `todos` → re-render |
| User clicks delete | `deleteTodo()` updates `todos` → re-render |

## Performance Optimizations

### 1. **useCallback in useTodos Hook**
- All handlers (`addTodo`, `toggleTodo`, `deleteTodo`) are memoized
- Ensures stable references for child components using `React.memo()`

### 2. **useMemo for Filtered Results**
- Prevents re-filtering when parent re-renders
- Only recalculates when `todos` or `debouncedSearchValue` change

### 3. **Debouncing Search**
- Reduces expensive filter operations
- Improves perceived performance

### 4. **Pure Functions**
- No side effects
- Easy to reason about
- Can be cached

## Interview Question Answers

**Q: "Why separate search and debounced search state?"**
A: The `searchInput` updates immediately for responsive UI (showing what user typed), while `debouncedSearchValue` waits 500ms to avoid expensive filtering on every keystroke. This gives best of both worlds.

**Q: "What causes unnecessary re-renders?"**
A: Without memoization, filtering would happen even when `todos` array hasn't changed. Without debouncing, filtering would happen on every keystroke. Without `useCallback`, child components would re-render even when their props haven't changed.

**Q: "How does debouncing compare to other patterns?"**
A: 
- **No debounce**: Fast but inefficient (SearchFilter approach)
- **Debounce**: Efficient and smooth (Todo approach) ← Best for filtering
- **Throttle**: Updates at fixed intervals (good for scroll events)

**Q: "What's the difference between useMemo and useCallback?"**
A: 
- `useMemo`: Memoizes a **computed value** (result of filtering)
- `useCallback`: Memoizes a **function** (action handlers)

## Sample Data

Pre-populated with 8 sample todos demonstrating:
- Mixed completed/uncompleted states
- Realistic task descriptions
- Queryable keywords

## Testing the Component

1. **Add todos**: Type text and click "Add"
2. **Check off todos**: Click checkbox to mark complete
3. **Search in real-time**: Type in search (notice smooth input)
4. **See debounce effect**: Wait 500ms to see filter results update
5. **Delete todos**: Click "Delete" button
6. **Observe badge**: "Filtered" badge appears when search is active

## Further Optimization Ideas

1. **Virtual scrolling**: If you had 1000+ todos, render only visible items
2. **useTransition**: Mark filtering as non-urgent to keep UI responsive
3. **IndexedDB**: Persist todos to local database
4. **URL search params**: Store search query in URL for shareable filtered views
5. **Keyboard shortcuts**: Ctrl+K to focus search, Enter to add

