# React Interview Script Skill

A project-specific skill for generating interview preparation guides (tech-note.md files) for React components.

## What This Skill Does

Transforms React component code into conversational interview preparation scripts.

**Input:** React component file paths
**Output:** `tech-note.md` file with interview Q&A, bug spotting, testing strategies, and practice phrases

## Skill Structure

```
react-interview-script/
├── SKILL.md                          # Main skill definition
├── README.md                         # This file
├── references/                       # Supporting documentation
│   ├── analysis-framework.md        # Interview analysis dimensions
│   ├── style-guide.md               # Writing style for scripts
│   ├── script-structure.md          # Template for generated scripts
│   └── react-19-patterns.md         # React 19+ specific patterns
├── scripts/                         # Implementation (to be added)
│   └── generate_interview_script.py  # Main generation script
└── evals/                          # Test cases
    └── evals.json                 # Test scenarios
```

## How to Use

### Option 1: Simple Single Component
```
Create an interview script for src/components/Button/index.tsx
```

### Option 2: Multiple Related Components
```
Analyze these components:
- src/components/SearchFilter/index.tsx
- src/hooks/useDebounce.ts
Write interview script
```

### Option 3: Component Set with Context
```
I have an anime list display component using React 19 use() hook.
Analyze src/components/aniListShowcase/ and create interview script.
```

## What Gets Generated

A `tech-note.md` file with:
- ✅ Component overview and purpose
- ✅ State management analysis
- ✅ Hook usage and optimization discussion
- ✅ Bug spotting exercises
- ✅ Edge case testing scenarios
- ✅ Testing strategy and examples
- ✅ Component design patterns
- ✅ Refactoring suggestions
- ✅ Common interview follow-up questions
- ✅ Conversational practice phrases
- ✅ Interview preparation checklist

## File Locations

### References (Read These First)

| File | When to Read |
|------|--------------|
| `SKILL.md` | Understand what the skill does |
| `references/analysis-framework.md` | Learn what gets analyzed |
| `references/style-guide.md` | Understand the conversational tone |
| `references/script-structure.md` | See the output template |
| `references/react-19-patterns.md` | For React 19+ components |

### Test Cases

- `evals/evals.json` - Test cases for validating the skill
  - AniListShowcase (React 19, use() hook, Error Boundary)
  - SearchFilter (custom hooks, useDebounce)
  - TextAppend + TextField (state, composition, bugs)

## Analysis Framework

The skill analyzes components across 7 dimensions:

1. **State Management** — useState patterns and choices
2. **Hooks & Optimization** — useCallback, useMemo, dependencies
3. **Bug Spotting** — Logic errors, stale closures
4. **Testing Strategy** — Test cases and coverage
5. **Component Design** — Patterns and architecture
6. **Edge Cases** — Boundary conditions and errors
7. **Refactoring Ideas** — Code improvements

## Writing Style

All generated scripts are:
- ✅ Conversational (not academic)
- ✅ Simple English (accessible to non-native speakers)
- ✅ Spoken aloud (short sentences, pause points)
- ✅ Question-driven (Q&A format)
- ✅ Code-heavy (examples and counter-examples)
- ✅ Practice-focused (phrases to rehearse)

## React 19 Support

The skill recognizes and analyzes:
- ✅ `use()` hook for async operations
- ✅ `use()` with Promises and Error Boundaries
- ✅ Suspense integration
- ✅ useActionState (form actions)
- ✅ Server Components concepts
- ✅ React 19 patterns and benefits

See `references/react-19-patterns.md` for details.

## Implementation Status

- [x] SKILL.md - Main definition
- [x] references/analysis-framework.md - Analysis dimensions
- [x] references/style-guide.md - Writing guidelines
- [x] references/script-structure.md - Output template
- [x] references/react-19-patterns.md - React 19 patterns
- [x] evals/evals.json - Test cases
- [ ] scripts/generate_interview_script.py - To be implemented
- [ ] Test execution and validation

## Next Steps

1. **Implement the generator script** (`scripts/generate_interview_script.py`)
2. **Run test cases** against the three example component sets
3. **Validate output quality** - Check if generated scripts are conversational and complete
4. **Iterate** - Refine based on test results
5. **Document** - Add any additional patterns discovered

## Example Output

A generated `tech-note.md` typically includes:

```markdown
# Interview Script: SearchFilter Component

## Start Here - What Does This Do?

"SearchFilter is a React component. It lets users search and filter a list.
When user types, we debounce the input to avoid too many updates..."

## State Management - useState

**Current code:**
```javascript
const [query, setQuery] = useState("");
const [debouncedQuery] = useState(query);
```

**Q1: Why two states?**

"Good question. One tracks what user types. Other is debounced version.
We separate them because...[explanation]"

...

## Interview Phrases to Practice

Use these when explaining:
- "Let me walk you through..."
- "Good question. Let me think..."
- "I notice something here..."

...
```

## Project Context

This skill is part of a React/TypeScript learning project focusing on:
- Interview preparation for junior/mid-level React developers
- Understanding React 19+ patterns
- Component design and testing
- Conversational, accessible English for non-native speakers

## Tips for Success

✅ **Do:**
- Use with real, complete component code
- Include child components and hooks used
- Mention if using React 19 features
- Read the generated script aloud
- Practice before interviews

❌ **Don't:**
- Use incomplete or pseudo-code
- Mix too many unrelated components
- Expect it to fix bugs (for analysis only)
- Use for non-React code

## Questions?

Refer to the relevant reference file:
- **"How should the script be written?"** → `style-guide.md`
- **"What will be analyzed?"** → `analysis-framework.md`
- **"What does the output look like?"** → `script-structure.md`
- **"How does React 19 fit?"** → `react-19-patterns.md`
