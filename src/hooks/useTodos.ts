import { useCallback, useState } from 'react';
import { Todo } from '../components/todo/types';

/**
 * Custom hook for managing todo list state and operations
 *
 * Demonstrates:
 * - useState for managing list state
 * - useCallback for memoized handlers (prevents unnecessary re-renders of child components)
 * - Separation of concerns: state logic extracted from component
 *
 * @param initialTodos - Initial array of todos
 * @returns Object containing todos array and memoized action handlers
 */
export function useTodos(initialTodos: Todo[]) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  /**
   * Add a new todo to the list
   * Memoized with useCallback to ensure stable reference across renders
   */
  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now(), // Simple ID generation
      text: text.trim(),
      completed: false,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  /**
   * Toggle the completed status of a todo
   * This prevents re-renders of memoized child components when not necessary
   */
  const toggleTodo = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  /**
   * Delete a todo by ID
   * Memoized to provide stable reference for child components
   */
  const deleteTodo = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return { todos, addTodo, toggleTodo, deleteTodo };
}

