# Interview Script: Todo Component

## Start Here - What Does This Do?

I'll walk you through the Todo component. It's a todo list app with live search. When users type in the search box, it filters the list after they stop typing for 500 milliseconds. When they add a new todo or click a checkbox, the list updates right away.

Here's the flow:
1. User types in the search box → searchInput updates immediately
2. Component waits 500ms with no typing → debouncedSearchValue updates
3. Filtered list recalculates and displays → component re-renders
4. User adds a todo or toggles complete → todos array updates → UI updates

It shows really nice React patterns. Multiple states. Hooks. Custom hooks. Memoization. Let me explain how.

---

## State Management - useState

**Current code:**
```typescript
const [newTodoInput, setNewTodoInput] = useState<string>('');
const [searchInput, setSearchInput] = useState<string>('');
const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(SAMPLE_TODOS);
```

**Q1: Why separate the input states?**

Two separate states for the two inputs. The `newTodoInput` is for adding todos. The `searchInput` is for searching. I could combine them? No, that would be confusing. Each input has its own job. Each state handles its own value. Simple and clear.

Good question. Why not one object like `const [inputs, setInputs] = useState({ newTodo: '', search: '' })`? 

It could work. But then every time you type in either field, you'd need to spread the object. `setInputs({ ...inputs, newTodo: value })`. That's more typing. More chance for bugs. Two separate states are cleaner here.

**Q2: What about the todos state?**

Good catch. The todos state lives in the `useTodos` hook. Why separate it out? Because the logic is complex. There's adding, toggling, deleting. If it all lived in this component, it would be a lot of code here. By moving it to a custom hook, the component stays focused. The hook stays focused. Each file has one job.

**Alternative approach:**
```typescript
// Could do this, but more verbose:
const [todos, setTodos] = useState<Todo[]>(SAMPLE_TODOS);
// Then write addTodo, toggleTodo, deleteTodo logic here
// Component becomes much longer
```

The custom hook approach keeps things organized.

---

## Hooks & Optimization - The Key Pattern

**Current code:**
```typescript
const debouncedSearchValue = useDebounce<string>(searchInput, 500);

const filteredTodos = useMemo(() => {
  const filtered = filterTodosBySearch(todos, debouncedSearchValue);
  return sortTodos(filtered);
}, [todos, debouncedSearchValue]);
```

**Q3: What's the debounce doing?**

Let me walk through this. When you type one letter, `searchInput` updates immediately. The component re-renders. The input field shows your letter right away. Feels responsive.

But we don't filter yet. We wait 500 milliseconds. If you type another letter within that time, the timer resets. We still don't filter. After 500ms with no typing, then `debouncedSearchValue` updates. That's when we filter.

Why? Filtering is expensive. If we filter on every keystroke, we're doing lots of unnecessary work. By debouncing, we wait until the user stops typing. Then we filter once. Much better performance.

Think of it like auto-save. You type several things. Auto-save doesn't happen on every keystroke. It waits for a pause. Then saves. Same idea.

**Q4: What about the useMemo?**

I see a performance optimization here. `filteredTodos` is memoized. When dependencies haven't changed, it returns the same array.

So if the component re-renders for some other reason—like the parent updating—we don't re-filter. We return the cached result. Filtering and sorting is the expensive part. Caching that is smart.

The dependencies are correct: `todos` and `debouncedSearchValue`. If either changes, we need to recalculate. If neither changes, we don't.

**Performance impact?**

For 8 todos, the performance difference is tiny. You won't notice it. But it's good practice. If this list grew to hundreds of todos, this optimization would matter. And it's already here. Good design.

---

## Finding Bugs - What Could Go Wrong?

**Looking at the code, I notice...**

Actually, wait. I'm looking through this and I don't see obvious bugs. The code is well-structured. Let me think about edge cases instead.

```typescript
// Is searchInput trimmed?
if (!searchTerm.trim()) {
  return todos;
}
```

Good. The filtering function trims the search. So "  hello  " is treated as "hello". Smart.

```typescript
const completedCount = todos.filter((t) => t.completed).length;
```

This counts completed todos. What if todos is empty? Then completedCount is 0. That's correct.

```typescript
if (newTodoInput.trim()) {
  addTodo(newTodoInput);
  setNewTodoInput('');
}
```

**Q5: Can you spot any issues with adding todos?**

I see one thing. If the user types only spaces, like "     ", then `newTodoInput.trim()` is empty. We don't add it. Good. We prevent empty todos.

But what if the user adds a todo, then immediately types in the search box? What happens?

The new todo gets added to `todos`. That's correct. The search box updates `searchInput`. The new todo filters based on the current search. That all works.

I don't see bugs here. The code is defensive. It handles edge cases.

---

## Edge Cases - What If...?

**Q6: What if someone searches for something that doesn't exist?**

Good question. Look at line 135:

```typescript
} : filteredTodos.length === 0 ? (
  <div className="todo-no-results" data-testid="no-results">
    No todos match "{debouncedSearchValue}". Try a different search.
  </div>
```

They show a nice message. "No todos match". That's good UX.

**Q7: What if the user adds 1000 todos?**

The component would still work. But it would get slow. Filtering 1000 todos every 500ms is more work. You'd notice. 

How would you fix it? Virtual scrolling. Only render the todos you can see. Libraries like react-window help with that. But that's advanced. For now, this is good.

**Q8: What about really long todo text?**

The code doesn't limit text length. So someone could type 10,000 characters. The component would render it. It might wrap awkwardly on small screens. 

In a real app, I'd add a limit. Like `maxLength={100}` on the input. And maybe truncate display if text is super long. But for now, it works fine.

**Q9: What if the user clicks add while the input is focused and hits enter?**

Looking at line 84:

```typescript
<form className="todo-input-section" onSubmit={handleAddTodo}>
```

It's a form with `onSubmit`. So pressing Enter triggers the handler. Good design. The user can either click the button or press Enter. Both work.

---

## Testing Strategy

**Q10: How would you test this component?**

I'd write several test categories.

**1. Rendering tests:**
```typescript
it('renders the todo list', () => {
  render(<Todo />);
  expect(screen.getByTestId('todo-list')).toBeInTheDocument();
});

it('shows empty message when no todos', () => {
  // Mock empty todos
  expect(screen.getByTestId('empty-message')).toBeInTheDocument();
});
```

**2. Adding todos:**
```typescript
it('adds a todo when form submitted', () => {
  render(<Todo />);
  const input = screen.getByTestId('todo-input');
  fireEvent.change(input, { target: { value: 'New task' } });
  fireEvent.click(screen.getByTestId('add-todo-btn'));
  
  expect(screen.getByText('New task')).toBeInTheDocument();
});

it('clears input after adding', () => {
  render(<Todo />);
  const input = screen.getByTestId('todo-input');
  fireEvent.change(input, { target: { value: 'Task' } });
  fireEvent.click(screen.getByTestId('add-todo-btn'));
  
  expect(input.value).toBe('');
});
```

**3. Searching (with debounce):**
```typescript
it('filters todos after debounce delay', async () => {
  render(<Todo />);
  const searchInput = screen.getByTestId('todo-search-input');
  
  fireEvent.change(searchInput, { target: { value: 'hooks' } });
  
  // Immediately, should still show all todos
  expect(screen.getAllByTestId(/todo-item-/)).toHaveLength(8);
  
  // After 500ms, should be filtered
  await waitFor(() => {
    const items = screen.queryAllByTestId(/todo-item-/);
    expect(items.length).toBeLessThan(8);
  }, { timeout: 600 });
});
```

**4. Toggling todos:**
```typescript
it('marks todo as complete', () => {
  render(<Todo />);
  const checkbox = screen.getByTestId('todo-checkbox-1');
  
  fireEvent.click(checkbox);
  
  expect(checkbox).toBeChecked();
});
```

**Q11: What about the data-testid attributes?**

I see them throughout. `data-testid="todo-input"`, `data-testid="add-todo-btn"`, etc. This is great for testing. You're not relying on CSS selectors or DOM hierarchy. You're explicitly marking testable elements. That's professional testing practice.

**Q12: Any edge cases to test?**

Yes. Test these:
- Empty search (show all todos)
- Search with no results
- Adding todo with only spaces (should be rejected)
- Deleting the last todo
- Toggling the same todo multiple times
- Search with special characters

---

## Component Design - Patterns & Decisions

**Q13: Is this a controlled component?**

Looking at the search input:

```typescript
<input
  value={searchInput}
  onChange={handleSearchChange}
  data-testid="todo-search-input"
/>
```

Yes. The `value` comes from state. When it changes, we update state. React controls the value. This is the right pattern for forms.

**Why?** Because we need to read the value immediately. We display it. We pass it to debounce. A controlled component makes that easy.

**Alternative approach:**
```typescript
// Uncontrolled:
const searchRef = useRef();
// Then read: searchRef.current.value
```

Could work. But then reading the value is less straightforward. Controlled is better here.

**Q14: Could you split this component?**

Let me think. We could extract:
1. The add todo form into `<AddTodoForm />`
2. The search input into `<SearchInput />`
3. The todo list into `<TodoListDisplay />`

Would that be better? Maybe. It would make the component smaller. Each child would have one job.

```typescript
// Possible split:
<section>
  <AddTodoForm onAdd={addTodo} />
  <SearchInput value={searchInput} onChange={setSearchInput} />
  <TodoListDisplay todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
</section>
```

But look at the current code. The main component is not huge. It's readable. Each section is clearly marked with comments. Sometimes, one component is fine. Don't over-engineer.

I'd keep it as is unless the component grows.

---

## Refactoring Ideas

**Reduce duplication:**

Looking at the todo item rendering:

```typescript
<input
  type="checkbox"
  className="todo-checkbox"
  checked={todo.completed}
  onChange={() => toggleTodo(todo.id)}
  data-testid={`todo-checkbox-${todo.id}`}
/>
<span className="todo-text">{todo.text}</span>
<button
  type="button"
  className="todo-delete-btn"
  onClick={() => deleteTodo(todo.id)}
  data-testid={`todo-delete-${todo.id}`}
>
  Delete
</button>
```

This happens once in the map. Not duplicated. Good.

But if you had multiple places rendering todos, I'd extract this to a `<TodoItem />` component:

```typescript
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

Then:
```typescript
{filteredTodos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
))}
```

Cleaner. Easier to reuse if needed.

**Simplify the empty state logic:**

Currently:
```typescript
{todos.length === 0 ? (
  <div>No todos yet...</div>
) : filteredTodos.length === 0 ? (
  <div>No todos match...</div>
) : (
  <div>...render list</div>
)}
```

This works. But it's nested ternaries. Hard to read.

Better approach:
```typescript
function renderContent() {
  if (todos.length === 0) {
    return <div>No todos yet</div>;
  }
  if (filteredTodos.length === 0) {
    return <div>No matches</div>;
  }
  return <TodoList items={filteredTodos} />;
}

return <section>{renderContent()}</section>;
```

This is easier to understand. Each condition is clear. The logic is separated from JSX.

---

## Common Follow-Up Questions

Here's what they might ask in an interview:

- [ ] "What's the difference between useCallback and useMemo?"
- [ ] "Why is the useTodos hook separate?"
- [ ] "How would you test the debounce?"
- [ ] "What if filtering became really slow?"
- [ ] "How would you handle errors?"
- [ ] "Could you persist todos to localStorage?"
- [ ] "What about accessibility?"
- [ ] "How would you add sorting options?"
- [ ] "What's the best way to structure tests?"
- [ ] "Would you use Redux for this?"

**Your approach:** Pick one. Show you can think through it. Ask them for guidance if needed.

Example:
"Good question about persistence. I'd probably use `localStorage`. When the component mounts, load todos. When todos change, save to storage. I could use useEffect for that. Want me to code it?"

---

## Interview Phrases to Practice

Use these when explaining:

**Starting:**
- "Let me walk you through this component..."
- "I'll explain how the debounce works..."
- "Looking at the code, I notice..."

**During analysis:**
- "Good question."
- "Let me think about that..."
- "I notice something here..."
- "This is interesting because..."

**Spotting issues:**
- "Wait, I see a potential issue..."
- "What if...?"
- "This could break if..."

**Making suggestions:**
- "To improve this, I would..."
- "A better approach would be..."
- "If we needed to scale, I'd..."

**Handling uncertainty:**
- "I hadn't thought about that..."
- "Let me reconsider..."
- "Good point. Let me think..."

**Asking for clarity:**
- "Does that make sense?"
- "Any questions about that part?"
- "Should I explain more?"

---

## Summary Checklist

Use this during your interview prep:

| Topic | What You Know |
|-------|---------------|
| **What it does** | A todo list with live, debounced search filtering |
| **State pattern** | Three separate states: newTodoInput, searchInput, todos |
| **Key hooks** | useDebounce (performance), useMemo (optimization), custom useTodos hook |
| **Smart pattern** | Separate input state and debounced value for responsive UI + efficient filtering |
| **The optimization** | useMemo caches filtered list. Only recalculates when todos or search changes |
| **Test approach** | Test rendering, add/delete, search with debounce delay, toggle complete |
| **Edge cases** | Empty todos, no search results, whitespace input validation, long text |
| **Potential bugs** | None found. Code is well-guarded. Trims input. Handles empty states |
| **Refactoring** | Could extract TodoItem component, simplify conditional rendering |

---

## Practice Plan

1. Read through this script once
2. Close it, try explaining the component from memory
3. Get stuck? Read again, continue
4. Practice saying it aloud 2-3 times
5. Record yourself if possible
6. Watch/listen back—does it sound natural?
7. Repeat until smooth

**Goal:** Sound confident and conversational, not robotic.

When you interview, they'll ask follow-ups. That's good. It means they're interested. Take a breath. Think. Then answer. You've got this.

