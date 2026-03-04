---
name: react-interview-script
description: |
  Generate interview flow scripts for React components. Use this skill when you need to create a tech-note.md interview preparation guide for any React/TypeScript component. The skill analyzes component code for state management, hooks, performance, testing, edge cases, and bugs, then produces a conversational interview script. Trigger when: user asks to "create an interview script", "write a tech note", "analyze component for interview", "prepare interview questions", "create interview guide for", or provides React component files for interview prep. Output is simple English, easy to speak aloud, suitable for practice.
compatibility: React 16.8+ (optimized for React 19+), TypeScript, hooks-based functional components
---

# React Interview Script Generator

## Quick Start

**Give me component files:**
```
Create an interview script for src/components/Form/index.tsx
Analyze src/hooks/useAuth.ts for interview
Prepare interview script for this component
```

**I will produce:**
- `tech-note.md` in the component directory
- Conversational interview Q&A
- Bug spotting exercises
- Testing strategies
- Practice phrases for speaking

---

## What This Does

Transforms React component code into an **interview preparation guide**.

The generated script walks through:
1. What the component does
2. State management choices
3. Hook usage and optimization
4. Bugs to spot (and how to fix them)
5. Edge cases and testing
6. Design patterns and refactoring
7. Common interview questions

**Format:** Simple, conversational English. Short sentences. Easy to speak aloud.

**Best for:** Interview prep, code review discussions, teaching React patterns.

---

## Analysis Framework

Examines components across React interview fundamentals:

- **State & Hooks** — useState, useCallback, useEffect, and modern patterns
- **Performance** — When to optimize? Memoization necessity?
- **Testing** — Test cases, edge cases, test structure
- **Bugs** — Logic errors, stale closures, dependency issues
- **Design** — Controlled vs uncontrolled, composition, props
- **Refactoring** — Code duplication, simplification, abstractions

See `references/analysis-framework.md` for details.

---

## Output Structure

Generated `tech-note.md` includes:

| Section | Purpose |
|---------|---------|
| Opening Statement | Brief intro to component |
| Component Purpose | Simple explanation of what it does |
| State Management | useState patterns, choices, trade-offs |
| Hooks & Optimization | useCallback, useMemo, dependencies |
| Finding Bugs | Spot bugs in code, explain fixes |
| Edge Cases | What if... scenarios |
| Testing Strategy | Test cases, data-testid, assertions |
| Component Design | Patterns, controlled components |
| Refactoring Ideas | Code improvements |
| Follow-Up Questions | Common interview questions |
| Interview Phrases | Conversational language to practice |
| Summary Checklist | Quick reference |

**Typical length:** 2,500-3,500 lines (substantial guide)

See `references/script-structure.md` for template.

---

## Language Style

Written to be **spoken aloud**, not read silently.

Key characteristics:
- Short sentences (1 idea per sentence)
- Conversational tone ("Let me think about that...")
- Simple words (accessible English)
- Code examples (show wrong and right)
- Pause points for practice
- Open-ended questions ("Why?", "How?")

See `references/style-guide.md` for details.

---

## How to Use

### Option 1: Single Component
```
Create an interview script for src/components/Button/index.tsx
```

### Option 2: Multiple Components
```
Analyze these components:
- src/components/Header.tsx
- src/hooks/useFetch.ts
```

### Option 3: With Context
```
I have a component that handles form submission.
File: src/components/LoginForm/index.tsx
Create an interview script for this.
```

---

## What Happens

1. **Read** your component code
2. **Analyze** state, hooks, logic, bugs, patterns
3. **Generate** interview Q&A based on framework
4. **Write** tech-note.md in simple, conversational style
5. **Include** code examples, testing ideas, practice phrases

The script is ready to **practice and study** for your interview.

---

## React 19+ Support

If your code uses React 19 features (like `use()` for async, Server Components, Actions), the skill will analyze these patterns too. See `references/react-19-patterns.md` for what's covered.

---

## Tips

✅ **Do:**
- Provide complete, real component code
- Include child components if referenced
- Use TypeScript (type info helps analysis)
- One component at a time (coherent script)
- Use for interview prep before live interviews

❌ **Don't:**
- Expect bug fixes (focus is interview, not debugging)
- Use for non-React code
- Expect production-grade refactoring advice
- Mix too many different components (keep focused)

---

## When This Helps

✅ Interview preparation (junior, mid-level, senior)
✅ Code review discussion guides
✅ Teaching React patterns
✅ Documenting component decisions
✅ Onboarding developers

---

## Next Steps

1. Provide component file paths
2. I'll analyze and write tech-note.md
3. You read and practice the script
4. Use during interview prep
5. Speak the phrases aloud to get comfortable

Ready? Give me a component to analyze!
