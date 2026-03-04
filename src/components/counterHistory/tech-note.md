# Interview Script: Counter with Undo/Redo Component

## Start Here - What Does This Do?

I'll walk you through the Counter with Undo/Redo component. It's a counter that tracks history. You can increment, decrement, and reset. Then you can undo and redo your actions. It shows the complete history of values you've been through.

Here's the flow:
1. User clicks increment → counter value changes → action goes into history
2. User clicks undo → counter reverts to previous value → that value moves to redo
3. User clicks redo → counter goes forward again
4. User clicks increment while there's undo history → all redo history is cleared

Real-world example? Think of a shopping cart. You add items. You change your mind and undo. You can redo if you want. The cart remembers everything.

---

## State Management - useReducer with History

**Current code:**
```typescript
interface CounterHistoryState {
  past: number[];      // Previous values
  present: number;     // Current value
  future: number[];    // Values from undone actions
}
```

**Q1: Why useReducer instead of useState?**

Good question. Look at what we're tracking. Not just a number. We need past, present, and future. That's complex state with relationships. When you increment, three things happen at once: past gets a new value, present changes, and future clears.

With useState, you'd need multiple state setters:
```typescript
// ❌ WRONG - scattered logic
const [past, setPast] = useState([]);
const [present, setPresent] = useState(0);
const [future, setFuture] = useState([]);

// When incrementing:
setPast([...past, present]);
setPresent(present + 1);
setFuture([]);  // Clear redo
// Three separate updates!
```

With useReducer, all three changes happen together in one place:
```typescript
// ✅ RIGHT - unified logic
const [state, dispatch] = useReducer(counterHistoryReducer, initialState);

// Dispatcher handles all three:
dispatch({ type: 'INCREMENT' });
// Reducer does: setPast, setPresent, setFuture all together
```

Why is this better? The state stays consistent. When present changes, past and future are guaranteed to update together. No race conditions. No accidental mismatches.

**Q2: What's special about the reducer?**

The reducer is a pure function. It takes state and action, returns new state. No side effects. You can understand exactly what happens for each action just by reading the switch statement.

Look at INCREMENT:
```typescript
case 'INCREMENT': {
  return {
    past: [...state.past, state.present],
    present: state.present + 1,
    future: [],
  };
}
```

Read it aloud: "Take the current value, add it to past. Increment present. Clear future." Three things, clear order. Easy to test. Easy to reason about.

---

## Hooks & Optimization - Custom Hook Pattern

**Current code:**
```typescript
export function useCounterHistory(initialValue: number = 0): UseCounterHistoryReturn {
  const [state, dispatch] = useReducer(counterHistoryReducer, {
    past: [],
    present: initialValue,
    future: [],
  });

  const increment = useCallback(() => {
    dispatch({ type: 'INCREMENT' });
  }, []);
```

**Q3: Why wrap the reducer in a custom hook?**

The component doesn't need to know about the reducer. It just needs actions: increment, undo, redo. By putting the reducer in a custom hook, we separate concerns.

The hook manages state. The component manages UI. Clean separation.

Also, the hook returns a clean interface. The component uses it like this:
```typescript
const { counter, increment, undo, redo, canUndo, canRedo } = useCounterHistory();
```

Simple. Clear. If you needed this logic in five components, you'd just use the hook in each one. Reusable.

**Q4: Why useCallback for the actions?**

I see useCallback wrapping increment, decrement, undo, etc. Each one has an empty dependency array.

Why? Because these functions are stable. They never change. If we didn't use useCallback, every render would create new functions. If a child component did React.memo, it would re-render unnecessarily.

But wait. In this app, we don't have child components using React.memo. So do we need useCallback?

For a small counter? No. But it's good practice. And if you wanted to memoize the actions for sharing, you'd already have it.

---

## Finding Bugs - Edge Cases in History

**Looking at the undo logic:**

```typescript
case 'UNDO': {
  if (state.past.length === 0) {
    return state;  // No change if nothing to undo
  }
  const newPast = state.past.slice(0, -1);
  const newPresent = state.past[state.past.length - 1];
  const newFuture = [state.present, ...state.future];
  return {
    past: newPast,
    present: newPresent,
    future: newFuture,
  };
}
```

**Q5: Can you spot any issues?**

I notice a defensive check at the start. If past is empty, don't undo. Good protection. What if someone clicks undo with no history? Nothing happens. They can't break it.

Let me trace through an example:
- Start: past=[], present=0, future=[]
- Click increment: past=[0], present=1, future=[]
- Click increment: past=[0,1], present=2, future=[]
- Click undo: past=[0], present=1, future=[2]
- Click undo: past=[], present=0, future=[2,1]
- Click undo: past=[], present=0, future=[2,1] (no change, good)

I don't see bugs. The code handles edge cases.

**Q6: What about redo when there's history?**

When you undo twice, then increment, what happens?

Before increment: past=[], present=0, future=[2,1]
Click increment: 
```typescript
// INCREMENT clears future!
return {
  past: [0],
  present: 1,
  future: [],
};
```

So the old future is gone. Is that right? Actually, yes. You went back in time. You took a new action. The old path is abandoned. Like a timeline branching. Makes sense.

---

## Edge Cases - What If...?

**Q7: What if the user sets a really large number?**

Looking at the input handler:
```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseInt(e.target.value, 10);
  if (!isNaN(value)) {
    setCounter(value);
  }
};
```

They can type any number. No limit. So 999999 or -999999 works. The history array could grow huge if they keep changing it.

In a real app, I'd cap the history. Like keep only the last 50 states. You can add that with a helper:

```typescript
function limitHistory(state, maxSize = 50) {
  if (state.past.length > maxSize) {
    state.past = state.past.slice(-maxSize);
  }
  return state;
}
```

But for a demo, it's fine.

**Q8: What if someone mashes the undo button?**

Each click undoes one action. Click it 10 times? Go back 10 steps. The code handles it. At some point, past is empty, nothing happens.

No crashes. No errors. Good.

**Q9: What about very rapid clicking?**

React batches updates. So even if you click increment five times very fast, React processes them in a batch. The reducer runs five times, state updates once. Should work fine.

---

## Testing Strategy

**Q10: How would you test this component?**

I'd test several things.

**1. Basic actions:**
```typescript
it('increments counter', () => {
  render(<CounterHistory />);
  const btn = screen.getByTestId('increment-btn');
  fireEvent.click(btn);
  expect(screen.getByText('1')).toBeInTheDocument();
});

it('decrements counter', () => {
  render(<CounterHistory />);
  // Start at 0, click decrement
  fireEvent.click(screen.getByTestId('decrement-btn'));
  expect(screen.getByText('-1')).toBeInTheDocument();
});
```

**2. Undo/Redo:**
```typescript
it('undoes last action', () => {
  render(<CounterHistory />);
  fireEvent.click(screen.getByTestId('increment-btn'));  // 0 → 1
  expect(screen.getByText('1')).toBeInTheDocument();
  
  fireEvent.click(screen.getByTestId('undo-btn'));  // Back to 0
  expect(screen.getByText('0')).toBeInTheDocument();
});

it('redoes undone action', () => {
  render(<CounterHistory />);
  fireEvent.click(screen.getByTestId('increment-btn'));  // 1
  fireEvent.click(screen.getByTestId('undo-btn'));      // 0
  fireEvent.click(screen.getByTestId('redo-btn'));      // 1
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

**3. History tracking:**
```typescript
it('clears future when action taken after undo', () => {
  render(<CounterHistory />);
  fireEvent.click(screen.getByTestId('increment-btn'));  // 1
  fireEvent.click(screen.getByTestId('increment-btn'));  // 2
  fireEvent.click(screen.getByTestId('undo-btn'));       // 1
  fireEvent.click(screen.getByTestId('undo-btn'));       // 0
  
  // At this point, future has [1, 2]
  fireEvent.click(screen.getByTestId('increment-btn'));  // 1
  
  // Now future should be cleared
  // Redo button should be disabled
  expect(screen.getByTestId('redo-btn')).toBeDisabled();
});
```

**Q11: What about disabled states?**

The undo and redo buttons are disabled when there's no history. Good practice.

```typescript
it('disables undo when no history', () => {
  render(<CounterHistory />);
  expect(screen.getByTestId('undo-btn')).toBeDisabled();
});
```

The test data attributes help. Every testable element is marked.

---

## Component Design - Reducer Pattern

**Q12: Is this component controlled or uncontrolled?**

The input is controlled:
```typescript
<input
  id="counter-input"
  type="number"
  value={counter}
  onChange={handleInputChange}
/>
```

The value comes from state. When it changes, we update state. React controls it. Good pattern for forms.

**Q13: Could you split this component?**

Maybe. You could extract:
1. The display section into `<CounterDisplay />`
2. The action buttons into `<CounterActions />`
3. The history view into `<HistoryTimeline />`

Would that be better? For a demo, probably not. It's already readable. Each section is marked clearly.

But if this grew to 500 lines, extraction would help. Right now, the component stays focused and simple.

---

## Refactoring Ideas

**Extract button groups:**

Currently, we have multiple buttons. They could be in a separate component:

```typescript
// Before
<div className="counter-actions">
  <button onClick={decrement}>Decrease</button>
  <button onClick={reset}>Reset</button>
  <button onClick={increment}>Increase</button>
</div>
<div className="counter-history-actions">
  <button onClick={undo} disabled={!canUndo}>Undo</button>
  <button onClick={redo} disabled={!canRedo}>Redo</button>
</div>

// After
<CounterActions
  onIncrement={increment}
  onDecrement={decrement}
  onReset={reset}
/>
<HistoryActions
  onUndo={undo}
  onRedo={redo}
  canUndo={canUndo}
  canRedo={canRedo}
/>
```

Cleaner JSX. Easier to test separately.

**Simplify the history display:**

The history timeline could be its own component too. That way, the main component is just orchestration.

---

## Common Follow-Up Questions

Here's what they might ask:

- [ ] "Why not just store an array of every counter value?"
- [ ] "How would you persist history to localStorage?"
- [ ] "What if you wanted to jump to a specific point in history?"
- [ ] "How would you limit history size?"
- [ ] "Could you use this pattern for a form with multiple fields?"
- [ ] "How does this differ from Redux?"
- [ ] "What about performance with large history?"
- [ ] "Could this be a context for the whole app?"
- [ ] "How would you handle async actions?"

**Your approach:** Pick one. Explain your thinking. Show you understand trade-offs.

---

## Interview Phrases to Practice

Use these when explaining:

**Starting:**
- "Let me walk you through the reducer pattern..."
- "I'll explain the past/present/future approach..."
- "Looking at this, I notice..."

**During analysis:**
- "Good question about why useReducer..."
- "Let me think about that edge case..."
- "I notice something interesting here..."

**Spotting patterns:**
- "This is using the Command pattern..."
- "This is like a state machine..."
- "The history array is the key here..."

**Making suggestions:**
- "To improve this, I would cap the history..."
- "A better approach might be..."
- "If this got complex, I'd..."

**Handling uncertainty:**
- "I hadn't considered that scenario..."
- "Let me reconsider that..."
- "That's a good point, let me think..."

---

## Summary Checklist

Use this during interview prep:

| Topic | What You Know |
|-------|---------------|
| **What it does** | Counter with undo/redo using history pattern |
| **State pattern** | useReducer with past/present/future arrays |
| **Key insight** | past and future work like a timeline |
| **Why useReducer?** | Complex state that updates together consistently |
| **Why custom hook?** | Separates state logic from UI component |
| **The undo logic** | Move present to future, get last from past |
| **The redo logic** | Move present to past, get first from future |
| **Edge case handling** | Check past/future length before undo/redo |
| **On new action** | Always clear future (time branch, old path gone) |
| **Testing approach** | Test increment, decrement, undo, redo, combinations |
| **Disabled states** | Undo button disabled when past is empty |
| **Potential improvements** | Cap history size, extract components, persist history |

---

## Practice Plan

1. Read through this script once, slowly
2. Close it and try explaining the component from memory
3. Get stuck? Read again, then continue
4. Focus especially on the reducer logic and past/present/future
5. Practice saying it aloud 2-3 times
6. Record yourself if possible
7. Listen back—does it sound natural?
8. Repeat until you're smooth

**Key emphasis areas:**
- Why useReducer is better than useState here
- How past/present/future work together
- What happens when you undo then take new action
- Why custom hook keeps component clean

**Goal:** Sound like you really understand state management patterns, not just memorizing code.

When you interview, if they ask "How would you implement undo in another component?", you can say: "I'd use the same pattern. A reducer with history. Any complex state that needs to track changes could use this." That shows you understand the pattern, not just this one component.