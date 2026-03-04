# React 19+ Patterns Guide

This reference covers modern React 19+ patterns the skill should analyze.

## New in React 19

### 1. The `use()` Hook

**Purpose:** Handle Promises directly in components.

**Pattern:**
```javascript
// Old way (React 18)
const [data, setData] = useState(null);
useEffect(() => {
  fetchData().then(setData);
}, []);

// New way (React 19)
const data = use(fetchData());
```

**Interview questions:**
- "What does `use()` do differently than useEffect?"
- "Can you use it for any Promise?"
- "What happens if the Promise rejects?"
- "How does error handling work?"

---

### 2. `use()` with Context

**Pattern:**
```javascript
// Old way
const value = useContext(MyContext);

// New way (optional)
const value = use(MyContext);
```

**Less typing, same behavior.**

---

### 3. Suspense for Data Fetching

**Pattern:**
```javascript
function MyComponent() {
  const data = use(fetchData());
  return <div>{data}</div>;
}

// Usage
<Suspense fallback={<Loading />}>
  <MyComponent />
</Suspense>
```

**Interview questions:**
- "How does Suspense work with `use()`?"
- "When do you show the fallback?"
- "How do you combine with Error Boundaries?"

---

### 4. useActionState (Form Actions)

**Pattern:**
```javascript
function Form() {
  const [state, submit, isPending] = useActionState(handleSubmit, initialState);

  return (
    <form action={submit}>
      <input name="username" />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**Interview questions:**
- "How is useActionState different from useState + onClick?"
- "What is progressive enhancement?"
- "When do you use form actions?"
- "How do you handle errors?"

---

### 5. Error Boundaries

**Pattern:**
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error, show fallback UI
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**With `use()` and Suspense:**
```javascript
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <MyComponent />
  </Suspense>
</ErrorBoundary>
```

---

### 6. Server Components (Conceptual)

**Pattern:**
```javascript
// Server Component (runs on server)
async function PostList() {
  const posts = await db.getPosts();
  return (
    <ul>
      {posts.map(post => <PostItem key={post.id} post={post} />)}
    </ul>
  );
}

// Client Component (runs on browser)
'use client';
function PostItem({ post }) {
  const [liked, setLiked] = useState(false);
  return (
    <li>
      {post.title}
      <button onClick={() => setLiked(!liked)}>
        {liked ? '❤️' : '🤍'}
      </button>
    </li>
  );
}
```

**Interview questions:**
- "When do you use Server vs Client Components?"
- "Can Server Components use useState?"
- "How do you pass data from server to client?"

---

## Interview Questions for React 19 Features

### If Component Uses `use()`

Q: "What is the `use()` hook doing here?"
- Answer: "It unwraps the Promise. Suspense handles loading. If Promise fails, Error Boundary catches it."

Q: "What happens if the Promise never resolves?"
- Answer: "Component stays suspended. Shows fallback forever. Should have timeout logic."

Q: "How is this better than useEffect?"
- Answer: "Simpler code. Automatic Suspense support. Automatic error handling."

### If Component Uses useActionState

Q: "Why use useActionState instead of onClick + useState?"
- Answer: "Form actions work without JavaScript. Progressive enhancement. Better UX."

Q: "What is isPending for?"
- Answer: "Disable button while form submits. Show loading state."

### If Component Uses Suspense

Q: "When does fallback show?"
- Answer: "When child component is suspended. Usually waiting for data."

Q: "How do you handle errors with Suspense?"
- Answer: "Use Error Boundary above Suspense. Catches errors from suspended components."

---

## Patterns to Spot

### Anti-pattern: `use()` with useEffect
```javascript
// ❌ Don't mix
const [data, setData] = useState(null);
useEffect(() => {
  use(fetchData()).then(setData);
}, []);

// ✅ Do this
const data = use(fetchData());
```

### Anti-pattern: No error boundary with Suspense
```javascript
// ❌ Risky
<Suspense fallback={<Loading />}>
  <MyComponent /> {/* uses use() which could fail */}
</Suspense>

// ✅ Safe
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <MyComponent />
  </Suspense>
</ErrorBoundary>
```

### Anti-pattern: Blocking Suspense
```javascript
// ❌ Suspends entire app
<Suspense fallback={<Loading />}>
  <Header />
  <MyComponent /> {/* uses use() */}
  <Footer />
</Suspense>

// ✅ Only suspend the component needing data
<Header />
<Suspense fallback={<Loading />}>
  <MyComponent />
</Suspense>
<Footer />
```

---

## Comparison: Old vs New

| Feature | React 18 | React 19 |
|---------|----------|---------|
| Async data | useEffect + useState | `use()` + Suspense |
| Form submission | onClick + setState | Form actions |
| Loading state | Explicit state | Automatic (Suspense) |
| Error handling | try-catch | Error Boundary |
| Code length | More boilerplate | Less code |

---

## When to Analyze React 19 Features

The skill should notice:

✅ **Do analyze:**
- If component imports or uses `use()` hook
- If component uses `useActionState`
- If component is wrapped in Suspense
- If component has Error Boundary
- If file has `'use client'` or `'use server'`

❌ **Don't over-focus:**
- Old React 18 patterns are still fine
- Some apps don't use React 19 yet
- Choose tools based on needs, not trends

---

## Interview Approach for React 19

**If candidate's code uses React 19:**

1. "Tell me why you chose `use()` over useEffect"
2. "How do you handle if the Promise fails?"
3. "Where does the Suspense boundary go?"
4. "Show me the Error Boundary for this"
5. "What would you change if you needed two Promises?"

**If candidate is unfamiliar:**

1. "React 19 added a `use()` hook"
2. "It lets you unwrap Promises directly"
3. "Works with Suspense for loading states"
4. "Error Boundary handles failures"
5. "Much simpler than useEffect + useState for async"

---

## Edge Cases in React 19

### Race Conditions with `use()`

```javascript
// Risky: What if component unmounts while Promise pending?
function Component() {
  const data = use(fetchUserData(userId));
  return <div>{data.name}</div>;
}

// Safer: Cancel Promise on unmount
function Component() {
  const controller = new AbortController();
  const data = use(fetchUserData(userId, controller.signal));
  // Clean up in Effect
  return <div>{data.name}</div>;
}
```

### Suspense Batching

Multiple `use()` calls:
```javascript
// Both Promises must resolve before rendering
function Component() {
  const user = use(fetchUser());    // Suspends
  const posts = use(fetchPosts());  // Also suspends
  return <div>{user.name} - {posts.length} posts</div>;
}
```

Interview question: "What happens if one Promise is slow?"
Answer: "Component stays suspended until both resolve."

---

## Testing React 19 Components

### With `use()`:
```javascript
// Mock the Promise
const mockPromise = Promise.resolve({ id: 1, name: 'Test' });
render(<Component data={mockPromise} />);
```

### With Suspense:
```javascript
// Use React's testing utilities
await waitFor(() => screen.getByText('loaded'));
```

### With Form Actions:
```javascript
// Test the action function separately
const result = await handleSubmit(formData);
expect(result).toEqual(expectedState);
```

Interview question: "How do you test async components?"
