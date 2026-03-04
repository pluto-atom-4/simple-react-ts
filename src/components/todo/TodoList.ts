import { Todo } from './types';

/**
 * Sample todo items for initial display
 * Demonstrates pre-populated data for showcase purposes
 */
export const SAMPLE_TODOS: Todo[] = [
  { id: 1, text: 'Learn React hooks (useState, useEffect, useCallback)', completed: true },
  { id: 2, text: 'Implement todo app with filtering', completed: true },
  { id: 3, text: 'Add debounced search functionality', completed: false },
  { id: 4, text: 'Understand re-render behavior in React', completed: false },
  { id: 5, text: 'Implement memoization with useCallback', completed: false },
  { id: 6, text: 'Build responsive UI with CSS', completed: false },
  { id: 7, text: 'Test component with different search queries', completed: false },
  { id: 8, text: 'Optimize performance using memo and useCallback', completed: false },
];

/**
 * Filter todos by search term (case-insensitive)
 * Pure function that doesn't modify original array
 *
 * @param todos - Array of todos to filter
 * @param searchTerm - Search query string
 * @returns Filtered array of todos matching the search term
 *
 * Why this is separate from component:
 * - Testability: Pure function is easy to unit test
 * - Reusability: Can be used in multiple places
 * - Clarity: Component logic is focused on rendering, filtering logic is isolated
 */
export function filterTodosBySearch(todos: Todo[], searchTerm: string): Todo[] {
  if (!searchTerm.trim()) {
    return todos;
  }

  const lowercaseSearch = searchTerm.toLowerCase();
  return todos.filter((todo) =>
    todo.text.toLowerCase().includes(lowercaseSearch)
  );
}

/**
 * Sort todos by completion status and then by ID
 * Completed todos appear at the bottom, newest todos appear first among uncompleted
 *
 * @param todos - Array of todos to sort
 * @returns Sorted array (creates new array, doesn't mutate original)
 */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    // Uncompleted todos first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Within same status, newest first (higher ID = newer)
    return b.id - a.id;
  });
}

