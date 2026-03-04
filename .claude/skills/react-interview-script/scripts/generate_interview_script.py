#!/usr/bin/env python3
"""
React Interview Script Generator - Hybrid Approach

This script handles technical work (parsing, analysis, bug detection).
Claude handles creative work (writing conversational Q&A, markdown).

Flow:
1. Script analyzes component code
2. Script prepares analysis data for Claude
3. Claude generates conversational content
4. Script validates and writes tech-note.md
"""

import re
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class StateVar:
    """Represents a useState call"""
    name: str
    initial_value: str
    line_number: int
    type_annotation: Optional[str] = None


@dataclass
class HookUsage:
    """Represents a hook (useCallback, useMemo, useEffect, etc)"""
    hook_type: str  # 'useCallback', 'useMemo', 'useEffect', 'use'
    line_number: int
    variables_used: List[str]
    dependencies: Optional[List[str]] = None
    is_react_19: bool = False  # use() hook


@dataclass
class Bug:
    """Represents a potential bug found"""
    line_number: int
    bug_type: str  # 'stale_closure', 'missing_dep', 'logic_error', etc
    severity: str  # 'high', 'medium', 'low'
    code_snippet: str
    description: str


@dataclass
class ComponentAnalysis:
    """Complete analysis of a React component"""
    component_name: str
    file_path: str
    component_type: str  # 'functional', 'class'
    states: List[StateVar]
    hooks: List[HookUsage]
    bugs: List[Bug]
    patterns: List[str]  # 'controlled_component', 'memoization', etc
    react_19_features: List[str]  # 'use()', 'Suspense', 'Error Boundary'
    has_typescript: bool
    has_props_interface: bool
    props_interface: Optional[str] = None
    full_code: str = ""


# ============================================================================
# CODE PARSER
# ============================================================================

class CodeParser:
    """Parse React component code and extract structure"""

    def __init__(self, code: str, file_path: str):
        self.code = code
        self.file_path = file_path
        self.lines = code.split('\n')

    def parse(self) -> ComponentAnalysis:
        """Parse component and return analysis"""

        component_name = self._extract_component_name()
        component_type = self._detect_component_type()
        has_typescript = self._check_typescript()

        states = self._extract_states()
        hooks = self._extract_hooks()
        patterns = self._identify_patterns(states, hooks)
        has_props_interface, props_interface = self._extract_props_interface()
        react_19_features = self._detect_react_19_features()

        analysis = ComponentAnalysis(
            component_name=component_name,
            file_path=self.file_path,
            component_type=component_type,
            states=states,
            hooks=hooks,
            bugs=[],  # Will be populated by BugDetector
            patterns=patterns,
            react_19_features=react_19_features,
            has_typescript=has_typescript,
            has_props_interface=has_props_interface,
            props_interface=props_interface,
            full_code=self.code
        )

        return analysis

    def _extract_component_name(self) -> str:
        """Extract component name from export"""
        # Look for: export default ComponentName
        match = re.search(
            r'export\s+(?:default\s+)?(?:function\s+)?(\w+)',
            self.code
        )
        if match:
            return match.group(1)
        return "Component"

    def _detect_component_type(self) -> str:
        """Detect if functional or class component"""
        if re.search(r'class\s+\w+\s+extends\s+React\.Component', self.code):
            return 'class'
        return 'functional'

    def _check_typescript(self) -> bool:
        """Check if file uses TypeScript"""
        return '.tsx' in self.file_path or '.ts' in self.file_path

    def _extract_states(self) -> List[StateVar]:
        """Extract all useState calls"""
        states = []

        # Pattern: const [state, setState] = useState<type>("initial") or useState(initial)
        pattern = r'const\s+\[\s*(\w+)\s*,\s*\w+\s*\]\s*=\s*useState(?:<([^>]+)>)?\s*\(([^)]+)\)'

        for match in re.finditer(pattern, self.code):
            name = match.group(1)
            type_annotation = match.group(2)
            initial_value = match.group(3)
            line_number = self.code[:match.start()].count('\n') + 1

            states.append(StateVar(
                name=name,
                initial_value=initial_value.strip(),
                line_number=line_number,
                type_annotation=type_annotation
            ))

        return states

    def _extract_hooks(self) -> List[HookUsage]:
        """Extract all hook usages"""
        hooks = []

        # useCallback pattern
        callback_pattern = r'useCallback\s*\(\s*\(([^)]*)\)\s*=>\s*\{?[^}]*?\}?\s*,\s*\[(.*?)\]\s*\)'
        for match in re.finditer(callback_pattern, self.code, re.DOTALL):
            line_number = self.code[:match.start()].count('\n') + 1
            deps_str = match.group(2) if match.lastindex >= 2 else ""
            dependencies = [d.strip() for d in deps_str.split(',') if d.strip()]

            snippet = match.group(0)
            variables_used = self._extract_variables_used(snippet)

            hooks.append(HookUsage(
                hook_type='useCallback',
                line_number=line_number,
                variables_used=variables_used,
                dependencies=dependencies,
                is_react_19=False
            ))

        # useMemo pattern
        memo_pattern = r'useMemo\s*\(\s*\(\)\s*=>\s*\{?[^}]*?\}?\s*,\s*\[(.*?)\]\s*\)'
        for match in re.finditer(memo_pattern, self.code, re.DOTALL):
            line_number = self.code[:match.start()].count('\n') + 1
            deps_str = match.group(1) if match.lastindex >= 1 else ""
            dependencies = [d.strip() for d in deps_str.split(',') if d.strip()]

            snippet = match.group(0)
            variables_used = self._extract_variables_used(snippet)

            hooks.append(HookUsage(
                hook_type='useMemo',
                line_number=line_number,
                variables_used=variables_used,
                dependencies=dependencies,
                is_react_19=False
            ))

        # useEffect pattern
        effect_pattern = r'useEffect\s*\(\s*\(\)\s*=>\s*\{?[^}]*?\}?\s*,\s*\[(.*?)\]\s*\)'
        for match in re.finditer(effect_pattern, self.code, re.DOTALL):
            line_number = self.code[:match.start()].count('\n') + 1
            deps_str = match.group(1) if match.lastindex >= 1 else ""
            dependencies = [d.strip() for d in deps_str.split(',') if d.strip()]

            snippet = match.group(0)
            variables_used = self._extract_variables_used(snippet)

            hooks.append(HookUsage(
                hook_type='useEffect',
                line_number=line_number,
                variables_used=variables_used,
                dependencies=dependencies,
                is_react_19=False
            ))

        # React 19: use() hook
        use_pattern = r'use\s*\(\s*([^)]+)\s*\)'
        for match in re.finditer(use_pattern, self.code):
            # Make sure it's not useCallback, useMemo, useEffect
            if not re.match(r'use(Callback|Memo|Effect|State|Reducer|Context|Ref)', match.group(0)):
                line_number = self.code[:match.start()].count('\n') + 1
                arg = match.group(1)
                variables_used = self._extract_variables_used(arg)

                hooks.append(HookUsage(
                    hook_type='use',
                    line_number=line_number,
                    variables_used=variables_used,
                    dependencies=None,
                    is_react_19=True
                ))

        return hooks

    def _extract_variables_used(self, code_snippet: str) -> List[str]:
        """Extract variable names used in code"""
        # Simple extraction of word-like identifiers
        matches = re.findall(r'\b[a-zA-Z_]\w*\b', code_snippet)
        # Remove common keywords
        keywords = {'function', 'const', 'let', 'var', 'return', 'if', 'else',
                   'for', 'while', 'true', 'false', 'null', 'undefined'}
        return [m for m in matches if m not in keywords]

    def _extract_props_interface(self) -> Tuple[bool, Optional[str]]:
        """Extract TypeScript interface for props"""
        match = re.search(
            r'interface\s+(\w*Props)\s*\{([^}]+)\}',
            self.code,
            re.DOTALL
        )
        if match:
            return True, match.group(0)
        return False, None

    def _identify_patterns(self, states: List[StateVar], hooks: List[HookUsage]) -> List[str]:
        """Identify React patterns used"""
        patterns = []

        # Multiple states pattern
        if len(states) > 1:
            patterns.append("multiple_states")

        # Memoization pattern
        if any(h.hook_type in ['useCallback', 'useMemo'] for h in hooks):
            patterns.append("memoization")

        # Side effects pattern
        if any(h.hook_type == 'useEffect' for h in hooks):
            patterns.append("side_effects")

        # Controlled component pattern (if has onChange handler)
        if 'onChange' in self.code:
            patterns.append("controlled_component")

        # Custom hook pattern (if file is in hooks folder or named useXxx)
        if 'hooks' in self.file_path or self.code.startswith('export function use'):
            patterns.append("custom_hook")

        return patterns

    def _detect_react_19_features(self) -> List[str]:
        """Detect React 19+ features"""
        features = []

        # Check for use() hook (but not useCallback, useEffect, etc)
        if re.search(r'\buse\s*\([^)]+\)', self.code) and \
           not re.search(r'use(Callback|Effect|Memo|State|Reducer|Context|Ref)\s*\(', self.code):
            features.append("use()")

        if '<Suspense' in self.code or 'Suspense' in self.code:
            features.append("Suspense")

        if 'ErrorBoundary' in self.code or '<ErrorBoundary' in self.code:
            features.append("Error Boundary")

        if 'useActionState' in self.code:
            features.append("useActionState")

        if '"use server"' in self.code or "'use server'" in self.code:
            features.append("Server Component")

        if '"use client"' in self.code or "'use client'" in self.code:
            features.append("Client Component")

        return features


# ============================================================================
# BUG DETECTOR
# ============================================================================

class BugDetector:
    """Detect common React bugs and issues"""

    def __init__(self, code: str, analysis: ComponentAnalysis):
        self.code = code
        self.analysis = analysis
        self.lines = code.split('\n')

    def detect_bugs(self) -> List[Bug]:
        """Detect all bugs and return list"""
        bugs = []

        bugs.extend(self._detect_missing_dependencies())
        bugs.extend(self._detect_stale_closures())
        bugs.extend(self._detect_logic_errors())
        bugs.extend(self._detect_uninitialized_state())

        return bugs

    def _detect_missing_dependencies(self) -> List[Bug]:
        """Detect missing dependencies in hooks"""
        bugs = []

        for hook in self.analysis.hooks:
            if hook.hook_type in ['useCallback', 'useMemo', 'useEffect']:
                if hook.dependencies is not None:
                    # Check if hook uses variables not in dependencies
                    deps_set = set(hook.dependencies)

                    # Check against state variables
                    for state in self.analysis.states:
                        if state.name in hook.variables_used and state.name not in deps_set:
                            # Special case: setters are stable, so missing them is OK
                            if not state.name.startswith('set'):
                                bugs.append(Bug(
                                    line_number=hook.line_number,
                                    bug_type='missing_dependency',
                                    severity='high',
                                    code_snippet=f"{hook.hook_type} uses {state.name} but doesn't list it in deps",
                                    description=f"The variable '{state.name}' is used but not in the dependency array"
                                ))

        return bugs

    def _detect_stale_closures(self) -> List[Bug]:
        """Detect stale closure bugs"""
        bugs = []

        # Pattern: useCallback with empty deps but uses setState/state
        for hook in self.analysis.hooks:
            if hook.hook_type == 'useCallback' and hook.dependencies == []:
                # Empty deps - check if it uses any state
                if any(state.name in hook.variables_used for state in self.analysis.states):
                    bugs.append(Bug(
                        line_number=hook.line_number,
                        bug_type='stale_closure',
                        severity='medium',
                        code_snippet=f"useCallback with empty deps [] but uses state variables",
                        description="Empty dependency array means function always uses old state values"
                    ))

        return bugs

    def _detect_logic_errors(self) -> List[Bug]:
        """Detect logic errors (off-by-one, typos, extra brackets, etc)"""
        bugs = []

        # Look for common patterns that suggest bugs
        # Pattern: return with extra characters
        for i, line in enumerate(self.lines, 1):
            # Extra brackets or semicolons in returns
            if 'return' in line and (line.rstrip().endswith(']') or line.rstrip().endswith('}]')):
                if not line.strip().startswith('//'):  # Not a comment
                    # Check if it's an actual bug (has backticks indicating string)
                    if '`' in line and '${' in line:
                        bugs.append(Bug(
                            line_number=i,
                            bug_type='logic_error',
                            severity='high',
                            code_snippet=line.strip(),
                            description="Return statement has extra bracket character at end"
                        ))

        return bugs

    def _detect_uninitialized_state(self) -> List[Bug]:
        """Detect uninitialized state"""
        bugs = []

        for state in self.analysis.states:
            # Check if initialized with undefined or empty without type
            if state.initial_value in ['undefined', '']:
                if not state.type_annotation:
                    bugs.append(Bug(
                        line_number=state.line_number,
                        bug_type='uninitialized_state',
                        severity='low',
                        code_snippet=f"const [{state.name}, set{state.name}] = useState({state.initial_value})",
                        description=f"State '{state.name}' initialized without clear type annotation"
                    ))

        return bugs


# ============================================================================
# QUESTION TEMPLATE GENERATOR
# ============================================================================

class QuestionTemplateGenerator:
    """Generate question templates for Claude to elaborate on"""

    def __init__(self, analysis: ComponentAnalysis):
        self.analysis = analysis

    def generate_questions(self) -> Dict[str, List[Dict[str, Any]]]:
        """Generate all question templates organized by section"""
        questions = {
            'state_management': self._generate_state_questions(),
            'hooks_optimization': self._generate_hook_questions(),
            'bugs': self._generate_bug_questions(),
            'edge_cases': self._generate_edge_case_questions(),
            'testing': self._generate_testing_questions(),
            'design': self._generate_design_questions(),
            'refactoring': self._generate_refactoring_questions(),
        }
        return questions

    def _generate_state_questions(self) -> List[Dict[str, Any]]:
        """Generate state management questions"""
        questions = []

        if len(self.analysis.states) > 1:
            questions.append({
                'type': 'state_design',
                'question': f"Why use {len(self.analysis.states)} separate states instead of one object?",
                'context': {
                    'states': [asdict(s) for s in self.analysis.states],
                    'pattern': 'multiple_states' in self.analysis.patterns
                }
            })

        for state in self.analysis.states:
            questions.append({
                'type': 'state_initialization',
                'question': f"Why initialize {state.name} with {state.initial_value}?",
                'context': {
                    'state': asdict(state),
                    'has_type': state.type_annotation is not None
                }
            })

        return questions

    def _generate_hook_questions(self) -> List[Dict[str, Any]]:
        """Generate hook usage questions"""
        questions = []

        for hook in self.analysis.hooks:
            if hook.hook_type == 'useCallback':
                questions.append({
                    'type': 'hook_necessity',
                    'question': f"Why use useCallback at line {hook.line_number}? When is it actually needed?",
                    'context': {
                        'hook': asdict(hook),
                        'pattern': 'memoization' in self.analysis.patterns
                    }
                })

            if hook.hook_type == 'useEffect':
                questions.append({
                    'type': 'hook_dependencies',
                    'question': f"What should be in the dependency array of useEffect at line {hook.line_number}?",
                    'context': {
                        'hook': asdict(hook),
                        'states': [asdict(s) for s in self.analysis.states]
                    }
                })

            if hook.hook_type == 'use' and hook.is_react_19:
                questions.append({
                    'type': 'react_19_feature',
                    'question': f"What does the use() hook do at line {hook.line_number}? How is it different from useEffect?",
                    'context': {
                        'hook': asdict(hook),
                        'feature': 'use()'
                    }
                })

        return questions

    def _generate_bug_questions(self) -> List[Dict[str, Any]]:
        """Generate bug spotting questions"""
        questions = []

        for bug in self.analysis.bugs:
            questions.append({
                'type': 'bug_spotting',
                'question': f"Spot the bug on line {bug.line_number}. What's wrong and how would you fix it?",
                'context': {
                    'bug': asdict(bug),
                    'code_line': self._get_code_line(bug.line_number)
                }
            })

        return questions

    def _generate_edge_case_questions(self) -> List[Dict[str, Any]]:
        """Generate edge case questions"""
        questions = []

        questions.extend([
            {
                'type': 'edge_case',
                'question': "What happens when inputs are empty? How should you handle it?",
                'context': {'states': [asdict(s) for s in self.analysis.states]}
            },
            {
                'type': 'edge_case',
                'question': "What about whitespace or special characters in inputs?",
                'context': {'states': [asdict(s) for s in self.analysis.states]}
            },
            {
                'type': 'edge_case',
                'question': "What if input data is very large? Any performance concerns?",
                'context': {'states': [asdict(s) for s in self.analysis.states]}
            },
        ])

        return questions

    def _generate_testing_questions(self) -> List[Dict[str, Any]]:
        """Generate testing questions"""
        questions = [
            {
                'type': 'testing_strategy',
                'question': "How would you test this component? What test cases are essential?",
                'context': {
                    'states': [asdict(s) for s in self.analysis.states],
                    'has_props_interface': self.analysis.has_props_interface
                }
            },
            {
                'type': 'testing_edge_cases',
                'question': "How would you test edge cases? Empty inputs? Special characters?",
                'context': {'states': [asdict(s) for s in self.analysis.states]}
            },
        ]
        return questions

    def _generate_design_questions(self) -> List[Dict[str, Any]]:
        """Generate component design questions"""
        questions = []

        if 'controlled_component' in self.analysis.patterns:
            questions.append({
                'type': 'design_pattern',
                'question': "Is this a controlled or uncontrolled component? Should you change it?",
                'context': {'pattern': 'controlled_component'}
            })

        if self.analysis.has_props_interface:
            questions.append({
                'type': 'props_design',
                'question': "Looking at the props interface, is it clear and well-designed? Any improvements?",
                'context': {'props_interface': self.analysis.props_interface}
            })

        return questions

    def _generate_refactoring_questions(self) -> List[Dict[str, Any]]:
        """Generate refactoring suggestions"""
        questions = [
            {
                'type': 'refactoring',
                'question': "Would you refactor this component? What improvements would you suggest?",
                'context': {
                    'patterns': self.analysis.patterns,
                    'states': [asdict(s) for s in self.analysis.states],
                }
            },
        ]
        return questions

    def _get_code_line(self, line_number: int) -> str:
        """Get code line by number"""
        lines = self.analysis.full_code.split('\n')
        if 0 < line_number <= len(lines):
            return lines[line_number - 1].strip()
        return ""


# ============================================================================
# REFERENCE LOADER
# ============================================================================

class ReferenceLoader:
    """Load reference files for Claude"""

    def __init__(self, skill_dir: Path):
        self.skill_dir = skill_dir
        self.references_dir = skill_dir / 'references'

    def load_all_references(self) -> Dict[str, str]:
        """Load all reference documents"""
        references = {}

        ref_files = [
            'analysis-framework.md',
            'style-guide.md',
            'script-structure.md',
            'react-19-patterns.md'
        ]

        for ref_file in ref_files:
            path = self.references_dir / ref_file
            if path.exists():
                try:
                    with open(path, 'r') as f:
                        references[ref_file] = f.read()
                except Exception as e:
                    print(f"Warning: Could not load {ref_file}: {e}")

        return references

    def load_style_guide(self) -> Optional[str]:
        """Load just the style guide"""
        path = self.references_dir / 'style-guide.md'
        if path.exists():
            try:
                with open(path, 'r') as f:
                    return f.read()
            except Exception:
                return None
        return None

    def load_structure_template(self) -> Optional[str]:
        """Load just the structure template"""
        path = self.references_dir / 'script-structure.md'
        if path.exists():
            try:
                with open(path, 'r') as f:
                    return f.read()
            except Exception:
                return None
        return None


# ============================================================================
# CONTENT VALIDATOR
# ============================================================================

class ContentValidator:
    """Validate generated markdown content"""

    @staticmethod
    def validate(markdown_content: str) -> Tuple[bool, List[str]]:
        """Validate markdown structure and quality"""
        errors = []

        # Check minimum length
        if len(markdown_content) < 500:
            errors.append("Content too short (minimum 500 characters)")

        # Check for required sections
        required_sections = [
            '# Interview Script',
            '## Start Here',
            '## State Management',
            '## Hooks',
            '## Testing',
        ]

        for section in required_sections:
            if section not in markdown_content:
                errors.append(f"Missing section: {section}")

        # Check for Q&A format
        if '**Q' not in markdown_content:
            errors.append("Missing Q&A format (should have **Q1, **Q2, etc)")

        # Check for code examples
        if '```javascript' not in markdown_content and '```' not in markdown_content:
            errors.append("Missing code examples")

        # Check for conversational language
        conversational_markers = [
            'let me', 'i think', 'good question', 'here', 'why',
            'because', 'example', 'suppose', 'imagine'
        ]

        if not any(marker in markdown_content.lower() for marker in conversational_markers):
            errors.append("Content may not be conversational enough")

        is_valid = len(errors) == 0
        return is_valid, errors


# ============================================================================
# FILE WRITER
# ============================================================================

class FileWriter:
    """Handle file I/O operations"""

    @staticmethod
    def write_tech_note(
        component_dir: Path,
        markdown_content: str,
        component_name: str
    ) -> Path:
        """Write tech-note.md to component directory"""

        # Ensure directory exists
        component_dir.mkdir(parents=True, exist_ok=True)

        # Write file
        output_path = component_dir / 'tech-note.md'

        try:
            with open(output_path, 'w') as f:
                f.write(markdown_content)
            return output_path
        except Exception as e:
            raise IOError(f"Failed to write {output_path}: {e}")

    @staticmethod
    def write_analysis_json(
        component_dir: Path,
        analysis: ComponentAnalysis
    ) -> Path:
        """Write analysis.json (for debugging/inspection)"""

        output_path = component_dir / '.analysis.json'

        # Convert to dict, handling non-serializable objects
        analysis_dict = {
            'component_name': analysis.component_name,
            'file_path': analysis.file_path,
            'component_type': analysis.component_type,
            'states': [asdict(s) for s in analysis.states],
            'hooks': [asdict(h) for h in analysis.hooks],
            'bugs': [asdict(b) for b in analysis.bugs],
            'patterns': analysis.patterns,
            'react_19_features': analysis.react_19_features,
            'has_typescript': analysis.has_typescript,
            'has_props_interface': analysis.has_props_interface,
        }

        try:
            with open(output_path, 'w') as f:
                json.dump(analysis_dict, f, indent=2)
            return output_path
        except Exception as e:
            print(f"Warning: Could not write analysis.json: {e}")
            return None


# ============================================================================
# MAIN GENERATOR CLASS
# ============================================================================

class InterviewScriptGenerator:
    """Main class that orchestrates the generation process"""

    def __init__(self, component_path: str, skill_dir: Optional[str] = None):
        self.component_path = Path(component_path)

        if skill_dir:
            self.skill_dir = Path(skill_dir)
        else:
            # Find skill directory relative to this script
            self.skill_dir = Path(__file__).parent.parent

        self.reference_loader = ReferenceLoader(self.skill_dir)
        self.validator = ContentValidator()

    def prepare_for_claude(self) -> Dict[str, Any]:
        """
        Analyze component and prepare data for Claude to generate content.

        Returns: Dictionary with all analysis, questions, and references
        """

        # Step 1: Read component file
        if not self.component_path.exists():
            raise FileNotFoundError(f"Component file not found: {self.component_path}")

        with open(self.component_path, 'r') as f:
            code = f.read()

        # Step 2: Parse component
        parser = CodeParser(code, str(self.component_path))
        analysis = parser.parse()

        # Step 3: Detect bugs
        bug_detector = BugDetector(code, analysis)
        analysis.bugs = bug_detector.detect_bugs()

        # Step 4: Generate question templates
        question_gen = QuestionTemplateGenerator(analysis)
        questions = question_gen.generate_questions()

        # Step 5: Load references
        references = self.reference_loader.load_all_references()

        # Prepare data for Claude
        claude_input = {
            'analysis': {
                'component_name': analysis.component_name,
                'file_path': str(analysis.file_path),
                'component_type': analysis.component_type,
                'states': [asdict(s) for s in analysis.states],
                'hooks': [asdict(h) for h in analysis.hooks],
                'bugs': [asdict(b) for b in analysis.bugs],
                'patterns': analysis.patterns,
                'react_19_features': analysis.react_19_features,
                'has_typescript': analysis.has_typescript,
                'full_code': code,
            },
            'questions': questions,
            'references': {
                'style_guide': references.get('style-guide.md', ''),
                'structure_template': references.get('script-structure.md', ''),
                'analysis_framework': references.get('analysis-framework.md', ''),
                'react_19_patterns': references.get('react-19-patterns.md', ''),
            }
        }

        return claude_input

    def save_analysis(self, component_dir: Optional[Path] = None) -> Path:
        """
        Save analysis results to .analysis.json for inspection.
        Useful for debugging the parsing stage.
        """

        if not component_dir:
            component_dir = self.component_path.parent

        # Get analysis
        parser = CodeParser(self.component_path.read_text(), str(self.component_path))
        analysis = parser.parse()

        bug_detector = BugDetector(self.component_path.read_text(), analysis)
        analysis.bugs = bug_detector.detect_bugs()

        # Save to file
        return FileWriter.write_analysis_json(component_dir, analysis)

    def write_tech_note(self, markdown_content: str) -> Tuple[bool, Path, List[str]]:
        """
        Write the generated markdown content to tech-note.md.
        Validates content first.

        Returns: (is_valid, file_path, errors)
        """

        # Validate content
        is_valid, errors = self.validator.validate(markdown_content)

        component_dir = self.component_path.parent

        if not is_valid:
            print("Validation warnings found:")
            for error in errors:
                print(f"  - {error}")

        # Write file anyway (Claude might have good reasons for format)
        output_path = FileWriter.write_tech_note(
            component_dir,
            markdown_content,
            self.component_path.stem
        )

        return is_valid, output_path, errors


# ============================================================================
# CLI INTERFACE
# ============================================================================

def main():
    """Command line interface"""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python generate_interview_script.py <component_path> [--save-analysis]")
        print("\nExample:")
        print("  python generate_interview_script.py src/components/Button/index.tsx")
        print("  python generate_interview_script.py src/components/Form.tsx --save-analysis")
        sys.exit(1)

    component_path = sys.argv[1]
    save_analysis = '--save-analysis' in sys.argv

    try:
        generator = InterviewScriptGenerator(component_path)

        # Prepare data for Claude
        claude_data = generator.prepare_for_claude()

        # Output JSON that Claude will receive
        print("=" * 70)
        print(f"ANALYSIS PREPARED FOR CLAUDE")
        print("=" * 70)
        print(json.dumps(claude_data, indent=2))

        # Optionally save analysis for inspection
        if save_analysis:
            analysis_file = generator.save_analysis()
            print(f"\n✓ Analysis saved to: {analysis_file}")

        print("\n" + "=" * 70)
        print("NEXT STEP: Claude will generate the conversational content")
        print("=" * 70)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
