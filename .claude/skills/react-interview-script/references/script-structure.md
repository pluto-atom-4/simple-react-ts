# Tech-Note.md Structure Template

This is the structure the skill follows when generating interview scripts.

## Outline

```
1. Title and Opening Statement
2. Start Here - Component Overview
3. State Management
4. Hooks & Optimization
5. Finding Bugs
6. Edge Cases
7. Testing Strategy
8. Component Design
9. Refactoring Ideas
10. Common Follow-Up Questions
11. Interview Phrases & Language
12. Key Takeaways & Checklist
```

---

## Section Breakdown

### 1. Title and Opening Statement

**Purpose:** Warm greeting, set context

```markdown
# Interview Script: [Component Name] Component

"I'll walk you through [ComponentName]. It [one sentence describing what it does]. Let me explain how it works."
```

**Length:** 1-2 sentences

---

### 2. Component Overview / Start Here

**Purpose:** Explain what the component does simply

```markdown
## Start Here - What Does This Do?

"[ComponentName] is a [type] component. It [action]. When user [interaction], it [outcome]."

"Here's the flow:
1. ...
2. ...
3. ..."
```

**Length:** 30-50 words

---

### 3. State Management

**Purpose:** Analyze useState usage

```markdown
## State Management - useState

**Current code:**
```javascript
const [state1, setState1] = useState("");
const [state2, setState2] = useState("");
```

**Q1: Why two separate states?**

"Good question. I could use one object. But two states are simpler. [explanation]"

**Q2: Why initialize with empty string?**

"[answer with example]"

**Alternative approach:**
"We could do this instead: [code]. But that would mean [trade-off]."
```

**Length:** 200-400 words

---

### 4. Hooks & Optimization

**Purpose:** Analyze useCallback, useMemo, useEffect

```markdown
## Hooks & Optimization

**Current code:**
```javascript
const handleChange = useCallback((value) => {
  setState(value);
}, []);
```

**Q3: What does useCallback do?**

"[explanation]. It keeps the same function. But do we need it here? [analysis]"

**Q4: What about dependencies?**

"This empty array means [what]. Should it include [variable]? [reasoning]"

**Performance impact:** [minimal/important] because [why]
```

**Length:** 250-500 words

---

### 5. Finding Bugs

**Purpose:** Spot bugs and discuss fixes

```markdown
## Finding Bugs

**Looking at line X:**
```javascript
// This line has a problem
const result = something.doThis()  // ← BUG HERE!
```

**Q5: Can you spot it?**

"I notice [bug]. Here's the problem: [explanation].

Looking at this case... it would fail when [scenario].

**Fix:**
```javascript
const result = something?.doThis() // Use optional chaining
```

This way [why it's better]."
```

**Length:** 200-400 words per bug

---

### 6. Edge Cases

**Purpose:** Discuss "what if" scenarios

```markdown
## Edge Cases - What If...?

**Q6: What about empty inputs?**

"If state is empty, [what happens]. Should we handle it? [yes/no]. How? [suggestion]"

**Q7: What if input is very long?**

"[analysis]. Current code would [behavior]. Better would be [suggestion]"

**Q8: What about whitespace or special chars?**

"[discussion and handling strategy]"
```

**Length:** 150-300 words per case

---

### 7. Testing Strategy

**Purpose:** Discuss how to test

```markdown
## Testing Strategy

**Q9: How would you test this?**

"I'd write test cases:

```javascript
it('renders component', () => {
  render(<Component />);
  expect(screen.getByTestId('element')).toBeInTheDocument();
});

it('handles user input', () => {
  render(<Component />);
  const input = screen.getByTestId('input');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(screen.getByTestId('output')).toHaveTextContent('expected');
});

// More test cases...
```

These test [what]."

**Q10: What about edge cases in tests?**

"I'd also test: [edge case scenarios]"

**Use data-testid for:** [explanation]
```

**Length:** 300-500 words

---

### 8. Component Design

**Purpose:** Discuss patterns and design

```markdown
## Component Design - Patterns & Decisions

**Q11: Controlled or uncontrolled?**

"This is [type]. Why? [reason].

Better would be [suggestion]:
```javascript
// Current
<Child onChange={handleChange} />

// Better
<Child value={state} onChange={handleChange} />
```

This way [benefit]."

**Q12: Could you split this component?**

"[Analysis]. We could extract [part] into its own component. This would [benefit]."
```

**Length:** 200-350 words per pattern

---

### 9. Refactoring Ideas

**Purpose:** Suggest improvements

```markdown
## Refactoring Ideas

**Reduce duplication:**

"Look at lines X and Y. They're almost identical. We could:
1. [Extract component]
2. [Use a loop]
3. [Custom hook]

For example:
```javascript
// Before - duplicate code
<Input onChange={handleA} />
<Input onChange={handleB} />

// After - using a loop
{inputs.map(input => (
  <Input key={input.id} onChange={input.handler} />
))}
```

Benefits: [what gets better]"

**Simplify state:**

"Current approach has [issue]. Alternative: [suggestion]"
```

**Length:** 250-400 words per idea

---

### 10. Common Follow-Up Questions

**Purpose:** Checklist of expected questions

```markdown
## Common Follow-Up Questions

Here's what they might ask:

- [ ] "What's the difference between useCallback and useMemo?"
- [ ] "How would you handle errors?"
- [ ] "What about accessibility?"
- [ ] "How would you make this async?"
- [ ] "What if you needed undo/redo?"
- [ ] "How would you measure performance?"
- [ ] "What about type safety?"

**Your approach:** Pick one, show you can think through it, ask them to guide you.
```

**Length:** 1-2 checklist items per question

---

### 11. Interview Phrases & Language

**Purpose:** Provide speaking practice

```markdown
## Interview Phrases to Practice

Use these when explaining:

**Starting:**
- "Let me walk you through..."
- "I'll explain how this works..."
- "Looking at the code..."

**During analysis:**
- "Good question."
- "Let me think about that..."
- "I notice something here..."
- "This is interesting because..."

**Spotting bugs:**
- "Wait, I see a bug..."
- "What if...?"
- "This could break if..."

**Making suggestions:**
- "To improve this, I would..."
- "Better approach would be..."
- "If we needed to scale, I'd..."

**Handling uncertainty:**
- "I hadn't thought about that..."
- "Let me reconsider..."
- "Good point. Let me think..."

**Practicing:**
- Read these aloud before interview
- Try different phrasings
- Record yourself and listen
```

**Length:** 100-150 words

---

### 12. Summary Checklist

**Purpose:** Quick reference during interview

```markdown
## Interview Checklist

Use this during your prep:

| Topic | What You Know |
|-------|---------------|
| **What it does** | [one sentence] |
| **State pattern** | [explanation] |
| **Key hook** | [which one, why] |
| **The bug** | [what and how to fix] |
| **Test cases** | [3-4 key tests] |
| **Edge cases** | [2-3 important ones] |
| **Design pattern** | [controlled/component composition/etc] |
| **Refactoring** | [one improvement] |

---

## Practice Plan

1. Read through this script once
2. Close it, try explaining from memory
3. Get stuck? Read again, continue
4. Practice saying aloud 2-3 times
5. Record yourself
6. Watch/listen back
7. Repeat until smooth

**Goal:** Sound confident and conversational, not robotic.

---

## Key Points to Remember

✅ Explain simply
✅ Ask "why?" about design choices
✅ Spot bugs
✅ Suggest improvements
✅ Show testing strategy
✅ Handle edge cases
✅ Speak naturally
```

**Length:** 150-300 words

---

## Total Length

- **Minimum:** 1,500 words
- **Typical:** 2,500-3,500 words
- **Maximum:** 5,000 words

Depends on component complexity.

---

## Style Throughout

- ✅ Short sentences
- ✅ Simple English
- ✅ Code examples (wrong + right)
- ✅ Conversational tone
- ✅ "We" or "I" voice
- ✅ Questions followed by answers
- ✅ Practical examples

- ❌ Overly technical language
- ❌ Dense paragraphs
- ❌ Just listing facts
- ❌ Passive voice
- ❌ Assume advanced knowledge
