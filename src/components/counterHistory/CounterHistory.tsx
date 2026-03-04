import React from 'react';
import './index.css';
import { useCounterHistory } from '../../hooks/useCounterHistory';

/**
 * Counter with Undo/Redo Showcase
 *
 * Demonstrates:
 * - useReducer for complex state management
 * - History pattern (past/present/future) for undo/redo
 * - useCallback for memoized action handlers
 * - State composition and behavioral patterns
 *
 * Real-world analogy: Like a shopping cart where you can undo
 * adding items or redo if you change your mind.
 */
function CounterHistory() {
  const {
    counter,
    increment,
    decrement,
    reset,
    setCounter,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
  } = useCounterHistory(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCounter(value);
    }
  };

  return (
    <section className="counter-container">
      <h2 className="counter-title">Counter with Undo/Redo</h2>

      <div className="counter-display-section">
        <div className="counter-value-box">
          <p className="counter-label">Current Count</p>
          <p className="counter-display">{counter}</p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="counter-actions">
        <button
          className="btn btn-decrement"
          onClick={decrement}
          data-testid="decrement-btn"
        >
          − Decrease
        </button>

        <button
          className="btn btn-reset"
          onClick={reset}
          data-testid="reset-btn"
        >
          Reset
        </button>

        <button
          className="btn btn-increment"
          onClick={increment}
          data-testid="increment-btn"
        >
          + Increase
        </button>
      </div>

      {/* Undo/Redo Buttons */}
      <div className="counter-history-actions">
        <button
          className={`btn btn-undo ${!canUndo ? 'disabled' : ''}`}
          onClick={undo}
          disabled={!canUndo}
          data-testid="undo-btn"
          title={canUndo ? 'Undo last action' : 'No actions to undo'}
        >
          ↶ Undo
        </button>

        <button
          className={`btn btn-redo ${!canRedo ? 'disabled' : ''}`}
          onClick={redo}
          disabled={!canRedo}
          data-testid="redo-btn"
          title={canRedo ? 'Redo last undone action' : 'No actions to redo'}
        >
          ↷ Redo
        </button>
      </div>

      {/* Custom Input */}
      <div className="counter-input-section">
        <label htmlFor="counter-input" className="input-label">
          Set custom value:
        </label>
        <input
          id="counter-input"
          type="number"
          className="counter-input"
          value={counter}
          onChange={handleInputChange}
          data-testid="counter-input"
        />
      </div>

      {/* History Information */}
      <div className="counter-history-info">
        <h3 className="history-title">Action History</h3>

        <div className="history-timeline">
          {/* Past Actions */}
          <div className="history-column">
            <p className="history-column-label">Previous Actions ({history.past.length})</p>
            <div className="history-list">
              {history.past.length === 0 ? (
                <span className="history-empty">No history yet</span>
              ) : (
                history.past.map((value, index) => (
                  <div key={index} className="history-item">
                    <span className="history-step">Step {index + 1}:</span>
                    <span className="history-value">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Value */}
          <div className="history-column history-current">
            <p className="history-column-label">Current</p>
            <div className="history-current-value">{history.present}</div>
          </div>

          {/* Future Actions (Redo) */}
          <div className="history-column">
            <p className="history-column-label">Undone Actions ({history.future.length})</p>
            <div className="history-list">
              {history.future.length === 0 ? (
                <span className="history-empty">No redo available</span>
              ) : (
                history.future.map((value, index) => (
                  <div key={index} className="history-item redo">
                    <span className="history-step">Step {index + 1}:</span>
                    <span className="history-value">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Info */}
      <div className="learning-section">
        <details>
          <summary>Learn: How does this work?</summary>
          <div className="learning-content">
            <h4>The Reducer Pattern</h4>
            <p>
              This component uses <code>useReducer</code> instead of <code>useState</code>.
              Why? Because we need to track history.
            </p>

            <h4>The History Pattern</h4>
            <p>
              Instead of just storing the counter value, we store:
            </p>
            <ul>
              <li>
                <strong>past:</strong> Array of previous counter values
              </li>
              <li>
                <strong>present:</strong> The current counter value
              </li>
              <li>
                <strong>future:</strong> Values that were undone (for redo)
              </li>
            </ul>

            <h4>How Undo Works</h4>
            <p>
              When you undo, we pop the last value from <code>past</code>, make it the new present,
              and move the old present into <code>future</code>.
            </p>

            <h4>How Redo Works</h4>
            <p>
              When you redo, we pop from <code>future</code>, make it present, and move the old present
              into <code>past</code>.
            </p>

            <h4>Why Clear Future on New Action?</h4>
            <p>
              When you undo twice, then increment, the old "future" is thrown away. Think of a timeline:
              you went forward, then backward, then took a new path. The old future is gone.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

export default CounterHistory;