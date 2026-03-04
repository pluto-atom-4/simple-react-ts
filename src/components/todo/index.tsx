import React, { useState, useMemo } from 'react';
import './index.css';
import { useTodos } from '../../hooks/useTodos';
import useDebounce from '../../hooks/useDebounce';
import { SAMPLE_TODOS, filterTodosBySearch, sortTodos } from './TodoList';

const title = 'Todo List with Filtering';

/**
 * Todo component demonstrates:
 * - useState for managing form input state
 * - Custom hook (useTodos) for complex state logic
 * - useDebounce hook for efficient search filtering
 * - useMemo for performance optimization (memoized filtered results)
 * - Re-render behavior: input changes frequently, but search only updates after debounce delay
 *
 * RE-RENDER EXPLANATION:
 * When user types in search box:
 * 1. searchInput state updates immediately → component re-renders
 * 2. debouncedSearchValue stays same during typing
 * 3. After 500ms with no typing → debouncedSearchValue updates → filtered todos recalculate
 * This prevents expensive filtering on every keystroke
 */
function Todo() {
  // Form state for adding new todos
  const [newTodoInput, setNewTodoInput] = useState<string>('');

  // Search input state (updates immediately on typing)
  const [searchInput, setSearchInput] = useState<string>('');

  // Debounced search value (updates after 500ms of inactivity)
  // This is the KEY to efficient filtering - we don't filter on every keystroke
  const debouncedSearchValue = useDebounce<string>(searchInput, 500);

  // Custom hook managing todos: add/toggle/delete operations
  // All action handlers are memoized with useCallback to prevent
  // unnecessary re-renders of child components
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(SAMPLE_TODOS);

  /**
   * useMemo optimization:
   * Filtered and sorted todos are only recalculated when:
   * - debouncedSearchValue changes (after 500ms debounce)
   * - todos array changes (when add/toggle/delete operations happen)
   *
   * This prevents re-filtering on every render, even if parent component re-renders
   */
  const filteredTodos = useMemo(() => {
    const filtered = filterTodosBySearch(todos, debouncedSearchValue);
    return sortTodos(filtered);
  }, [todos, debouncedSearchValue]);

  /**
   * Calculate statistics for display
   * Recalculated on every render but very cheap compared to filtering
   */
  const completedCount = todos.filter((t) => t.completed).length;
  const isFiltered = debouncedSearchValue.trim().length > 0;

  // Handle adding a new todo
  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodoInput.trim()) {
      addTodo(newTodoInput);
      setNewTodoInput('');
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle new todo input change
  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoInput(e.target.value);
  };

  return (
    <section className="todo-container">
      <p className="todo-title">{title}</p>

      {/* Add new todo form */}
      <form className="todo-input-section" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new todo..."
          value={newTodoInput}
          onChange={handleNewTodoChange}
          data-testid="todo-input"
        />
        <button
          type="submit"
          className="todo-add-btn"
          data-testid="add-todo-btn"
        >
          Add
        </button>
      </form>

      {/* Search/filter section */}
      <div className="todo-search-section">
        <input
          type="text"
          className="todo-search-input"
          placeholder="Search todos (debounced)..."
          value={searchInput}
          onChange={handleSearchChange}
          data-testid="todo-search-input"
        />
      </div>

      {/* Info section with count and filter badge */}
      <div className="todo-info">
        <span data-testid="todo-count">
          {filteredTodos.length} of {todos.length} todo
          {todos.length !== 1 ? 's' : ''} • {completedCount} completed
        </span>
        {isFiltered && (
          <span
            className="todo-status-badge filtered"
            data-testid="filtered-badge"
          >
            Filtered
          </span>
        )}
      </div>

      {/* Todo list */}
      {todos.length === 0 ? (
        <div className="todo-empty" data-testid="empty-message">
          No todos yet. Add one to get started!
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="todo-no-results" data-testid="no-results">
          No todos match "{debouncedSearchValue}". Try a different search.
        </div>
      ) : (
        <div className="todo-list">
          <ul data-testid="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                data-testid={`todo-item-${todo.id}`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  data-testid={`todo-checkbox-${todo.id}`}
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  type="button"
                  className="todo-delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  data-testid={`todo-delete-${todo.id}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Todo;

