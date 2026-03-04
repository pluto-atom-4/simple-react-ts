# Analysis Framework

The skill analyzes React components across these dimensions:

## 1. State Management

**What to analyze:**
- How does the component use `useState`?
- Single state vs multiple states? Pros/cons?
- State initialization - why this pattern?
- State updates - any issues with closures?

**Interview questions:**
- "Why separate states instead of one object?"
- "What would happen if you grouped them differently?"
- "Is state initialized correctly?"

---

## 2. Hooks & Optimization

**What to analyze:**
- Which hooks are used? (`useCallback`, `useMemo`, `useEffect`)
- Dependency arrays - are they correct?
- Is optimization actually necessary?
- Performance implications of choices

**Interview questions:**
- "What does this dependency array do?"
- "Do we really need useCallback here?"
- "What would break if we removed these dependencies?"
- "How would you measure if this optimization helps?"

---

## 3. Bug Spotting

**What to look for:**
- Logic errors in conditionals
- Stale closures (variables used but not in deps)
- Missing or wrong dependencies
- Off-by-one errors
- Unhandled null/undefined cases
- Mutating state directly

**Interview questions:**
- "Can you spot any bugs?"
- "What happens in this edge case?"
- "Is this closure stale?"
- "What if this value changes?"

---

## 4. Testing Strategy

**What to discuss:**
- How to test this component?
- Edge cases to cover
- Use of `data-testid` attributes
- Mocking requirements
- Async testing patterns

**Interview questions:**
- "How would you test this?"
- "What test cases should we write?"
- "What edge cases matter?"
- "How do you avoid brittle tests?"

---

## 5. Component Design

**What to analyze:**
- Controlled vs uncontrolled components
- Single responsibility principle
- Props interface - is it clear?
- Composition and reusability
- Component coupling

**Interview questions:**
- "Is this controlled or uncontrolled?"
- "Could you split this into smaller components?"
- "What does this prop do?"
- "How would you make this more reusable?"

---

## 6. Edge Cases

**What to consider:**
- Empty/null inputs
- Whitespace handling
- Very large inputs
- Rapid user interactions (clicking many times)
- Async operations and race conditions
- Error states
- Boundary values

**Interview questions:**
- "What if the input is empty?"
- "What about very large data?"
- "What if user clicks twice quickly?"
- "How do you handle errors?"

---

## 7. Refactoring Opportunities

**What to identify:**
- Code duplication (copy-paste)
- Extract components
- Simplify state logic
- Reduce prop drilling
- Extract custom hooks
- Performance improvements

**Interview questions:**
- "Would you refactor this?"
- "How would you reduce duplication?"
- "Could this be a custom hook?"
- "What's the trade-off here?"

---

## Interview Approach

When analyzing a component:

1. **Walk through the code** - Explain what you see
2. **Ask questions** - Why was this choice made?
3. **Spot patterns** - What React patterns are used?
4. **Find bugs** - What could break?
5. **Test your thinking** - Test cases that would fail
6. **Suggest improvements** - How would you improve it?
7. **Discuss trade-offs** - What are the costs?

---

## Difficulty Levels

### Junior Developer Level
- Explain what the component does
- Identify useState usage
- Find simple bugs
- Suggest basic test cases

### Mid-Level Developer
- Analyze state management choices
- Understand useCallback/useMemo necessity
- Spot stale closure bugs
- Design test cases for edge cases
- Suggest refactoring ideas

### Senior Developer
- Challenge design decisions
- Discuss performance trade-offs
- Propose architectural alternatives
- Consider accessibility and error handling
- Think about scalability

The skill adapts analysis depth based on component complexity.
