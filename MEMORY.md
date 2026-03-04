# Project Memory - React Interview Script Skill

## Project Context

This is a React 19 + TypeScript full-stack project with a custom-built skill for generating interview preparation guides for React components.

### Project Location
- **Path**: `/home/pluto-atom-4/Documents/full-stack/simple-react-ts/`
- **Type**: React + TypeScript
- **Focus**: Component design, interview preparation, React fundamentals

---

## 🎯 React Interview Script Skill

### What It Is
A hybrid skill that generates `tech-note.md` interview guides for React components.

**Architecture:**
- **Script** (Python): Parses code, analyzes, generates questions
- **Claude**: Writes conversational Q&A
- **Script**: Validates and saves files

### Location
`.claude/skills/react-interview-script/`

### Key Components
1. **generate_interview_script.py** (934 lines)
   - CodeParser: Extract component structure
   - BugDetector: Find common React bugs
   - QuestionTemplateGenerator: Create Q templates
   - ContentValidator: Check output quality

2. **Reference Guides** (4 files)
   - analysis-framework.md (what to analyze)
   - style-guide.md (how to write)
   - script-structure.md (output template)
   - react-19-patterns.md (React 19+ features)

3. **Test Cases** (evals.json)
   - AniListShowcase (React 19, use() hook, Error Boundary)
   - SearchFilter (custom hooks, useDebounce)
   - TextAppend + TextField (composition, state)

### How to Use
```
User: "Create interview script for src/components/Button.tsx"
Result: src/components/Button/tech-note.md (interview guide)
```

### Output Format
Each tech-note.md contains:
- Component overview
- State management Q&A
- Hook usage explanations
- Bug spotting exercises
- Edge case discussions
- Testing strategy
- Design pattern analysis
- Refactoring suggestions
- Practice phrases
- Interview checklist

---

## 📊 Tech Stack

### React 19
- Functional components with hooks
- React 19 `use()` hook for async
- Suspense for loading states
- Error Boundaries

### TypeScript
- Strict typing throughout
- Interface definitions
- Generic patterns

### Project Structure
```
src/
├── components/
│   ├── textAppend/          (state management example)
│   ├── textField/           (reusable input component)
│   ├── searchFilter/        (custom hooks example)
│   ├── aniListShowcase/     (React 19 patterns)
│   └── ...
├── hooks/
│   ├── useAniList.ts        (async with use())
│   ├── useDebounce.ts       (custom hook)
│   └── ...
└── ...
```

---

## 🔍 Key Features of the Skill

### Parser Capabilities
✅ Extract `useState` with TypeScript types
✅ Detect all hook types (useCallback, useEffect, useMemo, use())
✅ Identify React patterns
✅ Find common bugs
✅ Support React 19 features

### Question Generation
✅ State management Q&A
✅ Hook optimization questions
✅ Bug spotting exercises
✅ Edge case discussions
✅ Testing strategies
✅ Design pattern analysis
✅ Refactoring suggestions

### Writing Style
✅ Simple, conversational English
✅ Short sentences (easy to speak)
✅ Suitable for non-native speakers
✅ Practice phrases included
✅ Interview-focused

---

## 💾 Generated Files

### Output Location
- **Interview Scripts**: `src/components/[component]/tech-note.md`
- **Analysis Files**: `src/components/[component]/.analysis.json` (debug only)
- **Documentation**: `generated/by-claude/`

### In .gitignore
`generated/by-claude/` (doesn't commit generated docs)

---

## 📝 Documentation

### For Using the Skill
1. **QUICK_START.md** - Quick reference
2. **SKILL_CREATION_SUMMARY.md** - Complete overview
3. **SKILL_REACT_INTERVIEW_SCRIPT_IMPLEMENTATION.md** - Technical details

### In Skill Directory
- **SKILL.md** - Skill definition
- **README.md** - Skill usage guide

---

## 🚀 Common Tasks

### Generate Interview Script for Component
```
"Create interview script for src/components/Form/index.tsx"
```

### Analyze Custom Hook
```
"Write interview guide for src/hooks/useCustom.ts"
```

### Debug Analysis Output
```bash
python3 .claude/skills/react-interview-script/scripts/generate_interview_script.py \
  src/components/Button/index.tsx \
  --save-analysis
```

---

## 🎓 What's Covered

### React Fundamentals
- useState patterns
- Hook usage (useCallback, useEffect, useMemo)
- Component composition
- Prop passing

### React 19
- `use()` hook for async
- Suspense for loading
- Error Boundaries
- useActionState (form actions)

### Best Practices
- Bug spotting
- Performance optimization
- Testing strategies
- Code design patterns

---

## 🔧 Configuration Files

### .gitignore
```
generated/by-claude/  # Generated documentation (excluded)
```

### CLAUDE.md
Project-specific instructions and preferences.

### MEMORY.md
This file - persistent knowledge about the project.

---

## 📌 Important Patterns

### For Interview Scripts

**Always conversational:**
- "Let me think about that..."
- "Good question."
- "Here's what I see..."
- "To improve this, I would..."

**Always practical:**
- Real code examples
- Concrete test cases
- Actual edge cases
- Interview-relevant questions

**Always accessible:**
- Simple vocabulary
- Short sentences
- Easy to speak aloud
- Suitable for non-native English speakers

---

## 🎯 Project Goals

1. ✅ **Understand React patterns** through interview preparation
2. ✅ **Master React fundamentals** via guided analysis
3. ✅ **Practice interview skills** with conversational scripts
4. ✅ **Learn React 19 patterns** with modern examples
5. ✅ **Build confidence** before technical interviews

---

## 📚 References

**Skill**: `.claude/skills/react-interview-script/`
**Docs**: `generated/by-claude/`
**Tests**: `.claude/skills/react-interview-script/evals/evals.json`

---

## ✅ Status

- **Skill**: ✅ Production Ready
- **Parser**: ✅ Fully Implemented (934 lines)
- **References**: ✅ 4 guides created
- **Tests**: ✅ 3 test cases defined
- **Documentation**: ✅ 27 KB provided

---

## 🔄 Workflow

1. User asks for interview script
2. Skill triggers
3. Python script analyzes component
4. Claude reads analysis + references
5. Claude writes conversational markdown
6. Script validates and saves tech-note.md
7. User studies the interview guide

---

## 💡 Quick Tips

- Start with `QUICK_START.md` if new to skill
- Reference guides help Claude write better content
- .analysis.json helps debug parsing
- tech-note.md files are ready to study immediately

---

## 📞 Support

See `generated/by-claude/` for detailed documentation:
1. QUICK_START.md
2. SKILL_CREATION_SUMMARY.md
3. SKILL_REACT_INTERVIEW_SCRIPT_IMPLEMENTATION.md
4. FINAL_COMPLETION_REPORT.md
