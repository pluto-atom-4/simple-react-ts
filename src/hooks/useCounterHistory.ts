import { useReducer, useCallback } from 'react';

/**
 * Counter History State
 * Demonstrates useReducer with history pattern for undo/redo
 */
interface CounterHistoryState {
  past: number[];      // Previous counter values
  present: number;     // Current counter value
  future: number[];    // Values that were undone
}

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET'; payload: number };

/**
 * Reducer function for counter with history
 * Implements the undo/redo pattern using past/present/future
 */
function counterHistoryReducer(
  state: CounterHistoryState,
  action: CounterAction
): CounterHistoryState {
  switch (action.type) {
    case 'INCREMENT': {
      // Clear future when making a new action
      return {
        past: [...state.past, state.present],
        present: state.present + 1,
        future: [],
      };
    }

    case 'DECREMENT': {
      return {
        past: [...state.past, state.present],
        present: state.present - 1,
        future: [],
      };
    }

    case 'RESET': {
      return {
        past: [...state.past, state.present],
        present: 0,
        future: [],
      };
    }

    case 'SET': {
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    }

    case 'UNDO': {
      // No undo history? Stay the same
      if (state.past.length === 0) {
        return state;
      }
      // Pop from past, current becomes future
      const newPast = state.past.slice(0, -1);
      const newPresent = state.past[state.past.length - 1];
      const newFuture = [state.present, ...state.future];
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    }

    case 'REDO': {
      // No redo history? Stay the same
      if (state.future.length === 0) {
        return state;
      }
      // Pop from future, current becomes past
      const newFuture = state.future.slice(1);
      const newPresent = state.future[0];
      const newPast = [...state.past, state.present];
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    }

    default:
      return state;
  }
}

interface UseCounterHistoryReturn {
  counter: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCounter: (value: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: { past: number[]; present: number; future: number[] };
}

/**
 * Custom hook for counter with undo/redo functionality
 *
 * @param initialValue - Starting counter value (default: 0)
 * @returns Object with counter value, actions, and history state
 *
 * Example:
 * ```
 * const { counter, increment, undo, redo, canUndo, canRedo } = useCounterHistory(5);
 * ```
 */
export function useCounterHistory(initialValue: number = 0): UseCounterHistoryReturn {
  const [state, dispatch] = useReducer(counterHistoryReducer, {
    past: [],
    present: initialValue,
    future: [],
  });

  const increment = useCallback(() => {
    dispatch({ type: 'INCREMENT' });
  }, []);

  const decrement = useCallback(() => {
    dispatch({ type: 'DECREMENT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setCounter = useCallback((value: number) => {
    dispatch({ type: 'SET', payload: value });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  return {
    counter: state.present,
    increment,
    decrement,
    reset,
    setCounter,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    history: state,
  };
}
