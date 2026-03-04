# Interview Script: AniList Showcase Component Suite

"I'll walk you through the AniList Showcase component system. It fetches anime data from a GraphQL API and displays it with error handling and loading states. Let me explain how all the pieces work together."

---

## Start Here - What Does This Do?

The AniList Showcase is a **React 19 system** that fetches popular anime from the AniList GraphQL API. It has three main parts working together:

**The flow:**
1. **useAniList19 hook** fetches data using React 19's `use()` API
2. **AniListShowcase component** displays the fetched anime in a grid
3. **AniListErrorBoundary** catches and handles any errors
4. **Spinner** shows a loading message

When you load the page, the system tries to fetch anime data. While loading, the boundary shows a spinner. If something breaks, the boundary catches it and shows an error message with a retry button. When data arrives, the showcase displays 12 anime cards with titles, episode counts, and ratings.

---

## Part 1: The useAniList Hook System

### Understanding the Hook Architecture

The hook file gives us two functions. Let me explain why.

**First function: useAniList()**

This is a traditional React hook. It does three things:
1. Fetches data from the AniList API
2. Manages loading and error states
3. Returns data plus a retry function

**Second function: useAniList19()**

This is React 19 specific. It uses the new `use()` API to handle async operations. It's simpler because `use()` handles the async work for you.

### State Management - Understanding the Approach

**Current code in useAniList:**
```typescript
const [data, setData] = useState<AniListMedia[] | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
```

**Q1: Why three separate states instead of one object?**

Good question. We could use one state object. But three separate states are clearer here.

Each state handles one concern. Data is for the anime list. Loading is for the loading flag. Error is for error messages. This way, when one changes, we know what changed. No object spreading needed.

**Alternative approach:**
```typescript
// ❌ Could do this - one state object
const [state, setState] = useState({
  data: null,
  loading: true,
  error: null
});

// But then updates look messy
setState({ ...state, data: newData });
```

With separate states, updates are simple:
```typescript
// ✅ Cleaner
setData(newData);
setLoading(false);
setError(null);
```

**Q2: Why initialize loading as true?**

"Good thinking. When the component mounts, we don't have data yet. So loading starts as true. This tells the boundary to show the spinner. Once the fetch completes, we set it to false."

### The Fetch Function - Step by Step

**Looking at the fetchAniList function:**

The fetch does several important things. Let me walk through them.

**Step 1: Reset states at the start**
```typescript
setLoading(true);
setError(null);
```

Why? If the user clicks retry, we want to clear old errors and show the spinner again.

**Step 2: Build the GraphQL query**

The query asks for anime data. It sorts by popularity and limits to 12 results. Each anime includes title, cover image, episodes, and score.

**Q3: Why this specific query structure?**

"The query is asking AniList for specific fields. We only ask for what we need. This makes the response smaller and faster. If we asked for everything, it could be huge."

**Step 3: Fetch and error handling**

```typescript
const response = await fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
```

This sends our GraphQL query to AniList's server. It's a POST request because GraphQL uses POST.

**Q4: What happens if the fetch fails?**

"The try/catch block handles it. If the network is down or the response is bad, we catch the error. We set the error state so the boundary knows something went wrong."

### React 19's use() API

**Looking at useAniList19:**

```typescript
function useAniList19(): AniListMedia[] {
  return use(fetchAniListResource());
}
```

This is simple. But it's powerful. Let me explain what `use()` does.

**Q5: What's different about use() compared to useAniList()?**

"Good question. The traditional hook manages loading and error states. You have to handle those yourself. But `use()` is different."

`use()` is a React 19 feature. It unwraps promises. It works with Suspense to handle async.

Here's the flow:
1. `fetchAniListResource()` returns a promise
2. `use()` unwraps that promise
3. While waiting, Suspense shows the fallback (spinner)
4. When the promise resolves, it returns the data
5. If it rejects, an error boundary catches it

**Q6: What's the benefit of use() over the traditional hook?**

"Less code to manage. No loading states. No error states to track. Suspense handles the loading UI. Error boundaries handle errors. Cleaner component code."

**But there's a catch:** You must have Suspense and error boundaries. Without them, the app crashes. But that's actually good design. You should handle loading and errors at the boundary level.

---

## Part 2: The AniListShowcase Component

### Component Overview

**Current code:**
```typescript
function AniListShowcase() {
  const data = useAniList19();

  return (
    <section className="layout-column anilist-showcase-container">
      <p className="anilist-title">{title}</p>
      <div className="anilist-grid">
        {data && data.length > 0 ? (
          data.map((anime) => (
            <div key={anime.id} className="anime-card">
              {/* Card content */}
            </div>
          ))
        ) : (
          <p className="no-data">No anime listings found</p>
        )}
      </div>
    </section>
  );
}
```

This component is simple and focused. It does one thing: display anime data.

**Q7: What does this component do?**

"It renders a grid of anime cards. Each card shows the anime's cover image, title, episode count, and rating. That's it. It doesn't fetch. It doesn't handle errors. Just display."

### Data Display Logic

**Looking at the conditional rendering:**

```typescript
{data && data.length > 0 ? (
  data.map((anime) => (...))
) : (
  <p className="no-data">No anime listings found</p>
)}
```

**Q8: What's this conditional checking?**

"Two things. First, `data &&` checks if data exists. If data is null or undefined, we skip the map. Second, `data.length > 0` checks if the array has items. If it's empty, we show 'No anime listings found'."

This is defensive coding. It prevents crashes if data doesn't arrive.

### Image and Title Handling

**Looking at the image tag:**

```typescript
<img
  src={anime.coverImage.large}
  alt={anime.title.romaji}
  className="anime-cover"
/>
```

**Q9: Why use .large instead of just coverImage?**

"The API gives multiple image sizes. `.large` is the biggest one. We use it because the card has space for a big image. If we used a tiny image, it would look bad."

**Q10: Why is the alt text important?**

"The alt text describes the image for screen readers. If the image doesn't load, the alt text shows. Using `anime.title.romaji` makes it meaningful. Someone with a screen reader hears 'Demon Slayer' instead of just 'image'."

### Conditional Episode and Score Display

**Looking at the bottom of the card:**

```typescript
{anime.episodes && (
  <p className="anime-episodes">Episodes: {anime.episodes}</p>
)}
{anime.meanScore && (
  <p className="anime-score">⭐ Score: {anime.meanScore / 10}</p>
)}
```

**Q11: Why check anime.episodes and anime.meanScore separately?**

"Not all anime have episodes or scores in the data. Some might be movies with no episode count. Some might be too new for a score. By checking each one, we only show them if they exist. This prevents showing 'Episodes: undefined'."

**Q12: Why divide meanScore by 10?**

"The API gives scores as 0-100. But we want to show 0-10. So we divide by 10. Dividing 85 by 10 gives 8.5, which is a 5-star rating. This makes it user-friendly."

---

## Part 3: The Error Boundary

### Understanding Error Boundaries

Error boundaries are class components. This one is special because it wraps around the AniList system.

**Current code overview:**

```typescript
class AniListErrorBoundary extends React.Component<
  AniListErrorBoundaryProps,
  AniListErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error if needed
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };
}
```

**Q13: Why a class component for error handling?**

"Good question. Error boundaries must be class components. React's error boundary API is only available in class components. Functional components can't use it. So we have to use a class here."

### State Management in Error Boundary

**Current state:**

```typescript
interface AniListErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

**Q14: Why track both hasError and error?**

"`hasError` is a flag. It tells us if we're in error state. `error` stores the actual error object. We show the error message to the user. This way we know when to show error UI, and we have details to display."

### Error Catching - getDerivedStateFromError

**Looking at this method:**

```typescript
static getDerivedStateFromError(error: Error) {
  return { hasError: true, error };
}
```

**Q15: What triggers this method?**

"When a child component throws an error, React calls this method. It receives the error. We update state to trigger the error UI."

**Important detail:** This method is static. It doesn't have access to `this`. It can only return state updates.

### Error Logging - componentDidCatch

**Looking at this method:**

```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // console.error('AniListShowcase error:', error, errorInfo);
}
```

**Q16: Why is this commented out?**

"In development, we'd uncomment it to log errors. In production, we might send errors to a logging service. But for this showcase, we keep it simple. The component still catches errors. We just don't log them."

**What is errorInfo?**

It contains the component stack. This tells us which components were rendering when the error happened. Very useful for debugging.

### The Retry Mechanism

**Looking at handleRetry:**

```typescript
handleRetry = () => {
  this.setState({ hasError: false, error: null });
};
```

**Q17: How does the retry work?**

"When retry button is clicked, we clear the error state. This makes React re-render the children. The hook tries to fetch again. If it works this time, data shows. If it fails again, we catch the new error."

**Why an arrow function?**

```typescript
// ✅ This way, 'this' is bound
handleRetry = () => {
  this.setState(...);
};

// ❌ Without arrow, 'this' would be undefined
handleRetry() {
  this.setState(...);
}
```

The arrow function syntax automatically binds `this`. Without it, the button click would fail.

### Render Logic

**Looking at the render:**

```typescript
render() {
  if (this.state.hasError) {
    return (
      <section className="layout-column anilist-showcase-container">
        <p className="anilist-title">Anime Listings (AniList GraphQL)</p>
        <div className="anilist-error">
          <p className="error-message">
            {this.state.error?.message || 'Something went wrong.'}
          </p>
          <button className="retry-button" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      </section>
    );
  }
  return this.props.children;
}
```

**Q18: Why show the same title in error state?**

"It keeps the UI consistent. Whether there's an error or success, the title stays the same. This helps users know they're still on the anime page."

**Q19: What's the `?.message` syntax?**

"This is optional chaining. If the error exists, we show its message. If there's no error (shouldn't happen), we show 'Something went wrong.' as a fallback. Safe and user-friendly."

---

## Part 4: The Spinner Component

### The Simple Loading Indicator

**Current code:**

```typescript
function Spinner() {
  return (
    <div className="anilist-loading">
      <div className="spinner"></div>
      <p>Loading anime listings...</p>
    </div>
  );
}
```

**Q20: Why is the spinner a separate component?**

"It's small and focused. It does one thing: show a loading message. This makes it reusable. Other pages could use it too."

**Q21: Why a div with class "spinner" instead of a component?**

"The CSS handles the animation. The div is just a container. The spinning effect comes from CSS keyframes. Simpler than adding animation logic."

---

## Integration: How It All Works Together

Now let me explain how these four pieces work as a system.

### The Component Tree

```
<AniListErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <AniListShowcase>
      (calls useAniList19())
    </AniListShowcase>
  </Suspense>
</AniListErrorBoundary>
```

**Q22: What's the order of these?**

"ErrorBoundary is outermost. It catches any errors from children. Next is Suspense. It shows the spinner while waiting. Innermost is AniListShowcase. It uses useAniList19 to get data."

### The Data Flow

1. Page loads
2. AniListShowcase calls useAniList19()
3. useAniList19 calls fetchAniListResource()
4. fetchAniListResource makes a network request
5. While waiting, Suspense shows Spinner
6. When data arrives, Suspense unmounts Spinner
7. AniListShowcase renders the grid
8. If fetch fails, error boundary catches it and shows retry UI

**Q23: What if the fetch times out?**

"The browser will throw an error. The error boundary catches it. User sees 'Something went wrong' with a retry button. Click retry, and the fetch tries again. This is good error handling."

### Why Suspense and Error Boundary?

**Q24: Why not just use useAniList()?**

"Good question. We could. But the showcase would be more complex. We'd need to check loading states. We'd need to handle errors ourselves. With Suspense and error boundaries, those concerns move to the boundary level. The showcase stays simple."

This is a React 19 pattern. It separates data loading from UI rendering. Cleaner architecture.

---

## Finding Bugs - Edge Cases and Issues

### Potential Bug 1: Network Error Handling

**Looking at the fetch error handling:**

```typescript
try {
  const response = await fetch('https://graphql.anilist.co', {...});
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  // ...
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
  setError(`Failed to load anime listings. Please try again. (${errorMessage})`);
}
```

**I notice something good here:** The code checks `response.ok`. This catches HTTP errors like 500 or 403.

But wait. Look at this case:

```typescript
// What if response is not JSON?
const result: AniListResponse = await response.json();
```

If the response isn't valid JSON, `response.json()` throws. This gets caught. Good.

But there's no timeout handling. If the server is slow, the user waits forever.

**Fix idea:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const response = await fetch('https://graphql.anilist.co', {
  // ...
  signal: controller.signal,
});

clearTimeout(timeoutId);
```

This adds a 5-second timeout. If it takes longer, the request cancels.

### Potential Bug 2: Missing Null Checks

**Looking at the anime card rendering:**

```typescript
<img
  src={anime.coverImage.large}
  alt={anime.title.romaji}
/>
```

**Q25: What if coverImage is null?**

"If the API returns anime without a coverImage, this line crashes. We access `.large` on null. Boom."

**Fix:**
```typescript
{anime.coverImage && (
  <img
    src={anime.coverImage.large}
    alt={anime.title.romaji}
  />
)}
```

Or better, the API should never return null. But defensive coding is good.

### Potential Bug 3: Key prop with index

**Looking at the map:**

```typescript
data.map((anime) => (
  <div key={anime.id} className="anime-card">
```

Good news! We're using `anime.id` as the key. This is correct. The ID is unique and stable. If we used the index, reordering would break the component.

### Potential Bug 4: Query Error Detection

**Looking at error detection:**

```typescript
if ('errors' in result) {
  throw new Error('Failed to fetch anime listings from AniList API');
}
```

**Q26: Why check for 'errors' in result?**

"GraphQL is special. Even with a 200 status, the response might have errors. For example, the API might reject your query. We check the `errors` field to catch this."

This is correct! Good defensive coding.

---

## Edge Cases - What If?

### Edge Case 1: Empty Data

**What if the API returns an empty array?**

```typescript
{data && data.length > 0 ? (
  data.map(...)
) : (
  <p className="no-data">No anime listings found</p>
)}
```

Good! We handle it. The conditional checks `data.length > 0`. If empty, we show "No anime listings found."

### Edge Case 2: Very Slow Network

**What if the network is very slow?**

Suspense shows the spinner. After 30 seconds still waiting? Suspense keeps showing the spinner. There's no timeout message. The user might think something's broken.

**Better approach:**
```typescript
<Suspense fallback={<Spinner />} unstable_expectedLoadTime={5000}>
  {/* If it takes more than 5 seconds, show a different message */}
</Suspense>
```

Or add a custom timeout handler.

### Edge Case 3: User Navigates Away

**What if the user leaves the page while fetching?**

The fetch completes. It tries to update state. But the component is unmounted. React warns about memory leaks.

**Fix:**
```typescript
useEffect(() => {
  let isMounted = true;

  fetchAniList();

  return () => {
    isMounted = false;
  };
}, []);

// When updating:
if (isMounted) {
  setData(result);
}
```

But with React 19's use(), this is handled by Suspense. Less to worry about.

### Edge Case 4: Large Image Files

**What if the cover images are huge?**

The page loads slowly. The grid waits for all images.

**Better approach:**
```typescript
<img
  src={anime.coverImage.large}
  alt={anime.title.romaji}
  loading="lazy"
/>
```

The `loading="lazy"` attribute delays image loading. Only images about to appear load first.

---

## Testing Strategy

### Test Case 1: Rendering the Showcase

```typescript
it('renders anime grid when data loads', () => {
  render(
    <AniListErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <AniListShowcase />
      </Suspense>
    </AniListErrorBoundary>
  );

  // Initially shows spinner
  expect(screen.getByText('Loading anime listings...')).toBeInTheDocument();

  // After data loads, shows anime cards
  // (You'd mock the API here)
});
```

**Q27: How would you mock the API?**

"I'd use jest.mock or Mock Service Worker. Mock the fetch call to return test data. This way tests don't hit the real API. Tests run fast and reliably."

### Test Case 2: Error Handling

```typescript
it('shows error message when fetch fails', () => {
  // Mock fetch to throw an error
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  render(
    <AniListErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <AniListShowcase />
      </Suspense>
    </AniListErrorBoundary>
  );

  // Wait for error boundary to show error
  waitFor(() => {
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  // User should see retry button
  expect(screen.getByText('Retry')).toBeInTheDocument();
});
```

### Test Case 3: Retry Functionality

```typescript
it('retries fetch when retry button clicked', async () => {
  const mockFetch = jest.fn()
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValueOnce(mockResponseData);

  global.fetch = mockFetch;

  const { rerender } = render(
    <AniListErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <AniListShowcase />
      </Suspense>
    </AniListErrorBoundary>
  );

  // Wait for error
  await waitFor(() => {
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  // Click retry
  fireEvent.click(screen.getByText('Retry'));

  // Wait for successful load
  await waitFor(() => {
    expect(screen.getByText(/anime title/)).toBeInTheDocument();
  });
});
```

### Test Case 4: Conditional Fields

```typescript
it('only shows episodes if they exist', () => {
  const animeWithEpisodes = {
    id: 1,
    title: { romaji: 'Attack on Titan' },
    coverImage: { large: 'url' },
    episodes: 25,
  };

  const animeWithoutEpisodes = {
    id: 2,
    title: { romaji: 'Movie' },
    coverImage: { large: 'url' },
    episodes: undefined,
  };

  const { container } = render(
    <div>
      {/* Render both anime */}
    </div>
  );

  // First should show episodes
  expect(screen.getByText('Episodes: 25')).toBeInTheDocument();

  // Second should NOT show episodes
  expect(screen.queryByText(/Episodes:/)).not.toBeInTheDocument();
});
```

### Test Case 5: Spinner Component

```typescript
it('renders spinner with loading message', () => {
  render(<Spinner />);

  const spinner = screen.getByTestId('spinner');
  expect(spinner).toBeInTheDocument();

  expect(screen.getByText('Loading anime listings...')).toBeInTheDocument();
});
```

---

## Component Design - Patterns and Decisions

### Pattern 1: Separation of Concerns

**Q28: Why split this into four pieces?**

"Each piece has one job. The hook fetches. The showcase displays. The boundary handles errors. The spinner shows loading. One responsibility each."

This is the single responsibility principle. Easy to test. Easy to change. Easy to reuse.

### Pattern 2: Using React 19's use()

**Q29: Is useAniList19 future-proof?**

"Yes. It uses React 19's new use() API. This is the modern way. The traditional useAniList hook is good for older React versions. But new code should use use() with Suspense."

**Benefits of use():**
- Simpler code
- Suspense integration
- Error boundaries
- Better composition

### Pattern 3: Error Boundary as Container

**Q30: Why wrap the whole thing in an error boundary?**

"The boundary catches errors from anywhere inside. From the hook, from Suspense, from the showcase. One place to handle all errors. This is the recommended pattern."

### Pattern 4: Controlled vs Uncontrolled

**Looking at AniListShowcase:**

The component receives no props. It calls the hook directly. Is this good?

```typescript
// Current - uncontrolled
function AniListShowcase() {
  const data = useAniList19();
  return ...
}

// Alternative - controlled
function AniListShowcase({ data }: { data: AniListMedia[] }) {
  return ...
}
```

**Q31: Which is better?**

"It depends on your needs. The current approach is simpler. The component is self-contained. But it's less reusable. If you wanted to show different data, you'd have to modify the component."

**For this showcase, uncontrolled is fine.** It's a single-purpose display.

**If you needed flexibility, controlled would be better.** The parent controls what data to show.

---

## Refactoring Ideas

### Idea 1: Extract Anime Card into a Component

**Current code has a card inline:**

```typescript
<div key={anime.id} className="anime-card">
  <div className="anime-cover-wrapper">
    <img ... />
  </div>
  <div className="anime-info">
    ...
  </div>
</div>
```

**Better approach:**

```typescript
// Create AnimeCard.tsx
function AnimeCard({ anime }: { anime: AniListMedia }) {
  return (
    <div key={anime.id} className="anime-card">
      {/* card content */}
    </div>
  );
}

// Use it
data.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
```

**Benefits:**
- Easier to test one card
- Easier to style one card
- Reusable in other grids
- Easier to read

### Idea 2: Add Custom Hooks for Error Boundary

**Current error boundary is very similar to standard ones.** We could extract:

```typescript
function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  
  const reset = () => setError(null);
  
  return { error, setError, reset };
}
```

But error boundaries must be class components. So this doesn't work directly.

### Idea 3: Add a Fallback UI in Suspense

**Current setup:**

```typescript
<Suspense fallback={<Spinner />}>
  <AniListShowcase />
</Suspense>
```

**Could add multiple suspense boundaries:**

```typescript
<Suspense fallback={<Spinner />}>
  <AniListShowcase />
</Suspense>
```

Or nested:

```typescript
<Suspense fallback={<div>Loading...</div>}>
  <div className="anilist-grid">
    <Suspense fallback={<AnimeCardSkeleton />}>
      {anime.map(a => <AnimeCard key={a.id} anime={a} />)}
    </Suspense>
  </div>
</Suspense>
```

This shows skeletons for each card as they load. More sophisticated.

### Idea 4: Extract Query String

**Current code embeds the GraphQL query:**

```typescript
const query = `
  query {
    Page(page: 1, perPage: 12) {
      ...
    }
  }
`;
```

**Better:**

```typescript
// queries.ts
export const ANILIST_QUERY = `
  query GetPopularAnime {
    Page(page: 1, perPage: 12) {
      ...
    }
  }
`;

// useAniList.ts
const response = await fetch('https://graphql.anilist.co', {
  body: JSON.stringify({ query: ANILIST_QUERY }),
});
```

**Benefits:**
- Reusable
- Easier to modify
- Cleaner code

---

## Common Follow-Up Questions

Here's what interviewers might ask:

- [ ] "How would you paginate? Show more anime when user scrolls?"
- [ ] "How would you add filtering by genre or season?"
- [ ] "What if you needed to cache the data?"
- [ ] "How would you make images responsive on mobile?"
- [ ] "Could you add favorite/bookmark functionality?"
- [ ] "How would you test this without hitting the real API?"
- [ ] "What about accessibility? Screen readers?"
- [ ] "How would you handle authentication with AniList?"
- [ ] "What if the API rate-limited your requests?"
- [ ] "How would you optimize performance with many anime?"

---

## Interview Phrases to Practice

Use these when explaining:

**Starting:**
- "Let me walk you through how this works..."
- "I'll explain the architecture..."
- "Looking at the code, here's what I see..."
- "Let me break this down into pieces..."

**During analysis:**
- "Good question."
- "Let me think about that..."
- "I notice something interesting here..."
- "This is a React 19 pattern..."

**Spotting bugs:**
- "Wait, I see a potential issue..."
- "What would happen if...?"
- "This could break if the API returns..."
- "There's no timeout handling here..."

**Making suggestions:**
- "To improve this, I would..."
- "Better approach would be..."
- "If we needed to scale, I'd..."
- "A cleaner way would be..."

**Handling uncertainty:**
- "I hadn't thought about that..."
- "Let me reconsider..."
- "Good point. I'd probably..."
- "That's a great question."

**Explaining trade-offs:**
- "There's a trade-off here..."
- "One approach is simpler, but..."
- "This is more performant, but less reusable..."
- "We choose simplicity over performance here."

---

## Interview Checklist

Use this quick reference during prep:

| Topic | What You Know |
|-------|---------------|
| **What it does** | Fetches anime from AniList API, displays in grid with error/loading handling |
| **Main hook** | useAniList19 uses React 19's use() with fetchAniListResource |
| **State pattern** | useAniList has three separate states: data, loading, error |
| **The bug** | Missing null checks on coverImage; no timeout on fetch; network errors handled well |
| **Key test cases** | Render grid, show spinner, error handling, retry button, conditional fields |
| **Edge cases** | Empty data, slow network, missing fields, large images, navigation away |
| **Design pattern** | Suspense + Error Boundary + uncontrolled showcase component |
| **Refactoring** | Extract AnimeCard, extract GraphQL query, add pagination, lazy load images |
| **React 19 feature** | use() API unwraps promises, requires Suspense and error boundaries |

---

## Practice Plan

1. Read through this script once, understanding the flow
2. Close it, try explaining from memory
3. Get stuck? Read again, continue
4. Practice saying aloud 2-3 times
5. Record yourself
6. Watch/listen back
7. Repeat until smooth

**Goal:** Sound confident and conversational, not robotic.

---

## Key Takeaways

✅ **Architecture:** Four focused pieces working together
✅ **React 19:** use() API simplifies async component code
✅ **Error Handling:** Error boundaries + Suspense at container level
✅ **Simple Display:** Showcase does one job well
✅ **Defensive:** Checks for null/undefined fields
✅ **Good Patterns:** Single responsibility, separation of concerns
✅ **Testable:** Each piece can be tested independently
✅ **Trade-offs:** use() is modern but requires boundaries; uncontrolled component is simple but less flexible

---

**Ready for interview prep!** This system demonstrates modern React patterns, error handling, and clean architecture. Study the code, practice the phrases, and you'll be confident explaining it in your interview.
