# CLAUDE.md - Project Instructions

## Project Overview

This is a **React 19 + TypeScript** full-stack learning project with a custom skill for generating interview preparation guides for React components.

---

## 🎯 Primary Task: React Interview Script Skill

### Purpose
Generate `tech-note.md` interview preparation guides for React components using a hybrid approach:
- **Python script** analyzes code
- **Claude** writes conversational Q&A
- **Script** validates and saves

### Key Features
✅ Parse useState, hooks, React patterns
✅ Detect common React bugs
✅ Generate interview questions
✅ Create conversational guides
✅ Support React 19+ features

---

## 📍 Skill Location

```
.claude/skills/react-interview-script/
├── SKILL.md                                    (trigger definition)
├── README.md                                   (usage guide)
├── scripts/generate_interview_script.py        (parser engine)
├── references/                                 (learning materials)
│   ├── analysis-framework.md                  (what to analyze)
│   ├── style-guide.md                         (writing style)
│   ├── script-structure.md                    (output template)
│   └── react-19-patterns.md                   (React 19 features)
└── evals/evals.json                           (test cases)
```

---

## 📝 How to Use the Skill

### Simple Invocation
```
User: "Create interview script for src/components/Button.tsx"

Process:
1. Skill triggers (recognizes "interview script" + file path)
2. Python script analyzes component
3. Claude reads analysis + reference guides
4. Claude generates conversational tech-note.md
5. Script saves to: src/components/Button/tech-note.md
```

### Debug Mode
```bash
python3 .claude/skills/react-interview-script/scripts/generate_interview_script.py \
  src/components/Button/index.tsx \
  --save-analysis
```

Outputs JSON analysis to console + .analysis.json for inspection.

---

## 📚 Writing Style Guidelines

When Claude generates interview scripts, use these rules:

### Tone
- ✅ Conversational ("Let me think about that...")
- ✅ Accessible (simple vocabulary)
- ✅ Practice-focused (easy to speak aloud)
- ✅ Interview-relevant (practical questions)

### Structure
- ✅ Opening statement (what component does)
- ✅ Q&A format (**Q1**, **Q2**, etc)
- ✅ Code examples (wrong + right versions)
- ✅ 12-section template (see script-structure.md)
- ✅ 2,500-3,500 words per guide

### Language
- ✅ Short sentences (10-15 words each)
- ✅ Simple English (accessible to non-native speakers)
- ✅ Conversational markers ("Good question", "Here's what I see")
- ✅ Open-ended questions ("Why?" "How?")

### Content
- ✅ State management explanations
- ✅ Hook usage discussion
- ✅ Bug spotting exercises
- ✅ Edge case scenarios
- ✅ Testing strategies
- ✅ Design pattern analysis
- ✅ Refactoring suggestions
- ✅ Practice phrases

---

## 🔧 Technical Details

### What the Python Script Does
1. **Parse Component**
   - Extract component name, type
   - Find all useState calls (with types)
   - Find all hooks (useCallback, useEffect, etc)
   - Detect React patterns
   - Find React 19 features

2. **Analyze Code**
   - Detect missing dependencies
   - Spot stale closures
   - Find logic errors
   - Check uninitialized state

3. **Generate Templates**
   - Create question templates for each pattern
   - Organize by interview dimension
   - Link to reference guides

4. **Prepare Output**
   - Load reference guides
   - Create JSON analysis data
   - Format for Claude comprehension

### What Claude Does
1. Read JSON analysis
2. Review style guide & structure
3. Write conversational answers
4. Format as markdown
5. Include practice phrases

### What Script Does at End
1. Validate markdown quality
2. Check all sections present
3. Verify tone is conversational
4. Ensure code examples included
5. Write tech-note.md to disk

---

## 📌 Project Conventions

### File Naming
- Components: `src/components/[Component]/index.tsx`
- Hooks: `src/hooks/use[Hook].ts`
- Tests: `*.test.tsx` or `*.spec.tsx`
- Styles: `index.css` alongside component

### Code Style
- TypeScript: Use strict typing
- React 19: Use hooks, `use()` for async
- Components: Functional, small, focused
- Props: Use interfaces for type safety

### Documentation
- Interview guides: `src/components/[Component]/tech-note.md`
- Generated docs: `generated/by-claude/` (in .gitignore)
- Reference materials: `.claude/skills/react-interview-script/references/`

---

## 🎓 Interview Dimensions (What to Analyze)

Always cover these 7 dimensions in generated scripts:

### 1. State Management
- Why this state organization?
- Single vs multiple states?
- Initialization patterns?

### 2. Hooks & Optimization
- When is useCallback needed?
- Correct dependencies?
- Performance impact?

### 3. Bug Spotting
- Missing dependencies?
- Stale closures?
- Logic errors?

### 4. Testing Strategy
- How to test this?
- Edge cases to cover?
- Test structure?

### 5. Component Design
- Controlled or uncontrolled?
- Single responsibility?
- Composition & reusability?

### 6. Edge Cases
- Empty inputs?
- Special characters?
- Large data?

### 7. Refactoring Ideas
- Code duplication?
- Extract components?
- Simplify state?

---

## 🚀 Common Commands

### Generate Interview Script
```
"Create interview script for src/components/SearchFilter/index.tsx"
```

### Analyze Multiple Components
```
"Write interview guides for:
- src/components/Form.tsx
- src/hooks/useAuth.ts"
```

### Debug Analysis
```bash
python3 .claude/skills/react-interview-script/scripts/generate_interview_script.py \
  src/components/Button/index.tsx \
  --save-analysis
```

### View Generated Guide
```bash
cat src/components/Button/tech-note.md
```

---

## ✅ Quality Standards

### For Generated Scripts

**Minimum Quality:**
- [ ] 500+ characters (2,500-3,500 words ideal)
- [ ] 12 required sections present
- [ ] Q&A format with **Q1**, **Q2**, etc
- [ ] Code examples (wrong + right)
- [ ] Conversational tone detected

**Interview Value:**
- [ ] Questions are relevant to actual code
- [ ] Bug spotting matches real patterns
- [ ] Testing strategies are practical
- [ ] Edge cases are realistic
- [ ] Practice phrases are useful

**Language Quality:**
- [ ] Simple, accessible English
- [ ] Short sentences (10-15 words)
- [ ] Conversational tone
- [ ] No jargon without explanation
- [ ] Suitable for non-native speakers

---

## 📂 Generated Files Management

### Output Locations
- **Interview scripts**: `src/components/[Component]/tech-note.md`
- **Analysis (debug)**: `src/components/[Component]/.analysis.json`
- **Documentation**: `generated/by-claude/`

### Git Management
- `generated/by-claude/` is in .gitignore (don't commit)
- `tech-note.md` files should be committed (part of component)
- `.analysis.json` files can be ignored (debug only)

---

## 🔄 Workflow

### When User Requests Interview Script

**Step 1: Recognize Request**
- User mentions "interview script", "tech note", "analyze component"
- User provides component file path

**Step 2: Skill Triggers**
- .claude/skills/react-interview-script/ activates
- Script analyzes component

**Step 3: Receive Analysis**
- Script provides JSON with:
  - Component structure (states, hooks)
  - Detected bugs
  - Question templates
  - Reference guides

**Step 4: Generate Content**
- Read the analysis carefully
- Consult reference guides (style, structure)
- Write conversational Q&A
- Format as markdown
- Include practice phrases

**Step 5: Return to Script**
- Script receives markdown
- Validates quality
- Saves tech-note.md
- Done! ✅

---

## 💡 Tips for Quality Output

### Use the References!
- **analysis-framework.md** → What questions to ask
- **style-guide.md** → How to write conversationally
- **script-structure.md** → Output organization
- **react-19-patterns.md** → Modern React features

### Keep It Conversational
- Imagine explaining to a friend
- Use contractions ("don't", "won't")
- Ask rhetorical questions
- Share reasoning process

### Make It Practical
- Show real code examples
- Discuss actual edge cases
- Suggest real test cases
- Connect to interview scenarios

### Ensure Accessibility
- Explain technical terms
- Use simple vocabulary
- Break complex ideas into steps
- Relate to familiar patterns

---

## 🎯 Success Metrics

A good interview script:
- ✅ User can read it aloud smoothly
- ✅ Questions are from actual code
- ✅ Answers explain the "why"
- ✅ Bug spotting works
- ✅ Testing strategy is actionable
- ✅ Practice phrases are natural
- ✅ User feels prepared for interview

---

## 📞 Documentation References

Located in: `generated/by-claude/`

1. **QUICK_START.md** - Quick reference
2. **SKILL_CREATION_SUMMARY.md** - Full overview
3. **SKILL_REACT_INTERVIEW_SCRIPT_IMPLEMENTATION.md** - Technical
4. **FINAL_COMPLETION_REPORT.md** - Completion details

Also see:
- `.claude/skills/react-interview-script/SKILL.md`
- `.claude/skills/react-interview-script/README.md`
- `.claude/skills/react-interview-script/references/`

---

## ⚙️ Configuration Notes

### Python Script
- Location: `.claude/skills/react-interview-script/scripts/generate_interview_script.py`
- Language: Python 3
- Dependencies: Standard library only
- Status: Production ready

### Reference Guides
- Location: `.claude/skills/react-interview-script/references/`
- Format: Markdown
- Purpose: Inform Claude's writing
- Update: As needed for clarity

### Git Configuration
- `.gitignore` includes `generated/by-claude/`
- `tech-note.md` files are tracked
- `.analysis.json` files are ignored

---

## ✨ Key Strengths of the Skill

1. **Hybrid Approach**
   - Script: Reliable, deterministic analysis
   - Claude: Creative, natural language
   - Each plays to its strengths

2. **Comprehensive**
   - Covers 7 interview dimensions
   - Detects multiple bug patterns
   - Generates 12+ question types

3. **Interview-Focused**
   - Questions are practice-relevant
   - Bug spotting included
   - Testing strategies covered
   - Practice phrases provided

4. **Modern React**
   - React 19 patterns recognized
   - use() hook support
   - Suspense awareness
   - Error Boundary understanding

5. **Accessible**
   - Simple English
   - Easy to speak aloud
   - Non-native speaker friendly
   - Practice-oriented

---

## 📝 Important Notes

- Script is fully implemented (934 lines)
- All references created and complete
- Test cases defined from real project components
- Ready for immediate use
- Skill is production-ready

---

## 🚀 Getting Started

1. **First Use**: Say "Create interview script for src/components/Button.tsx"
2. **Review Output**: Check generated tech-note.md
3. **Understand Pattern**: Review QUICK_START.md
4. **Adapt as Needed**: Reference style-guide.md for adjustments

---

## 📌 Remember

- Always use conversational tone
- Refer to reference guides
- Include practice phrases
- Make it interview-ready
- Keep it accessible

---

**Last Updated**: March 4, 2026
**Status**: Production Ready ✅
