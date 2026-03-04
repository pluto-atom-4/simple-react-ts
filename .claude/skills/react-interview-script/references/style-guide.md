# Style Guide for Interview Scripts

## Core Principles

The interview script is written to be **spoken aloud**, not silently read.

### 1. Conversational Tone

**Instead of:** "It is evident that the component employs multiple state variables."
**Write:** "The component uses two separate state variables. Let me explain why."

**Instead of:** "The dependency array necessitates inclusion of..."
**Write:** "This variable is used here, so we must add it to dependencies."

### 2. Short Sentences

**Instead of:** "While it is possible to combine these into a single state object which would reduce the number of setter calls, this would require object spreading which could be more complex."
**Write:** "We could use one state object. But that means more spreading. Two states are simpler."

**Guideline:** One idea per sentence. Average 10-15 words.

### 3. Simple Vocabulary

Choose words a non-native English speaker understands:

| ❌ Avoid | ✅ Use |
|----------|--------|
| "necessitate" | "need" |
| "utilize" | "use" |
| "facilitate" | "help" |
| "juxtapose" | "compare" |
| "aforementioned" | "this one" |
| "subsequently" | "then" |
| "inherently" | "by nature" |

### 4. Code Examples

Always show **both wrong and right**:

```javascript
// ❌ WRONG:
const [texts, setTexts] = useState({});

// ✅ RIGHT:
const [texts, setTexts] = useState({ first: '', second: '' });
```

Explain why one is wrong:
"Without initialization, `texts.first` is undefined. Then we can't do string operations on it."

### 5. Conversation Markers

Use these to sound natural:

- "Let me think about that..."
- "Good question."
- "Looking at the code..."
- "I notice something here..."
- "Wait, that looks wrong..."
- "Let me walk through this..."
- "Here's what I see..."
- "To improve this, I would..."
- "Does that make sense?"

### 6. Pause Points

Mark where you'd pause in a real interview:

```
"Two states are simpler. [pause]

Why? Because each input has its own value.
No spreading needed."
```

### 7. Open-Ended Questions

Not yes/no, but "why" and "how":

❌ "Is this using useCallback?"
✅ "Why is this using useCallback? When would you actually need it?"

---

## Phrasing Patterns

### Starting an Explanation

"Let me walk you through..."
"Here's what's happening..."
"Looking at this code..."
"I'll explain how this works..."

### During Analysis

"I notice..."
"I see a problem here..."
"This is interesting because..."
"Let me think about that..."

### Spotting Bugs

"Wait, that looks wrong..."
"I see a bug here..."
"This could break if..."
"What happens when..."

### Making Suggestions

"To improve this, I would..."
"Better approach would be..."
"If we needed to scale, I'd change..."
"I might refactor this like this..."

### Handling Uncertainty

"I hadn't thought about that..."
"Let me reconsider..."
"Actually, maybe..."
"Good point. Let me think..."

### Asking for Feedback

"Does that make sense?"
"Any questions?"
"Should I explain more?"
"Want me to code that?"

---

## Structure of Answers

Each answer should follow this pattern:

1. **Direct answer** (1-2 sentences)
2. **Explanation** (why, what, how)
3. **Example** (code or scenario)
4. **So what?** (why does it matter)

### Example:

**Q: Why use two separate states?**

**Direct:** "Two separate states are simpler here."

**Explanation:** "Each input manages itself. No object spreading needed."

**Example:**
```javascript
// Simple
const [first, setFirst] = useState("");
const [second, setSecond] = useState("");

// More complex
const [texts, setTexts] = useState({ first: "", second: "" });
// Would need: setTexts({ ...texts, first: newValue })
```

**So what?** "For just two inputs, separate states are easier. If we had 10 inputs, one object might be better."

---

## Avoiding Common Mistakes

### Don't over-explain
**Bad:** "The dependency array, which is a feature of hooks that tells React when to re-run the effect, needs to include all variables from the outer scope that are used in the effect..."

**Good:** "Dependencies must include all variables we use in the function. If we change them, React must re-run."

### Don't assume knowledge
**Bad:** "The closure captures the stale value from the previous render cycle."

**Good:** "The function remembers the old value. When it runs, it uses the old one, not the new one."

### Don't be too casual
**Bad:** "lol this code is totally broken"

**Good:** "This code has a bug that would cause problems."

### Don't contradict yourself
If you say "React memoization helps", don't later say "we don't need it here." Explain the difference: "Memoization helps when props change often. Here, props don't change, so it's not needed."

---

## Difficulty Adaptation

### For Simpler Components

Focus on:
- Basic state patterns
- Why components exist
- Simple test cases
- Obvious improvements

### For Complex Components

Cover:
- Advanced patterns
- Performance trade-offs
- Architectural decisions
- Scaling challenges
- Security or accessibility

---

## Checklist

When writing the script:

- [ ] Can read aloud naturally?
- [ ] Sentences under 20 words?
- [ ] Simple English words?
- [ ] Code examples show wrong AND right?
- [ ] Questions are open-ended?
- [ ] Explanations have examples?
- [ ] Conversational tone throughout?
- [ ] No unnecessary jargon?
- [ ] Pause points clear?
- [ ] Practice phrases included?
