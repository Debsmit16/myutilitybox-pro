import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const updatePriority = (id, priority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const moveTodo = (id, direction) => {
    const index = todos.findIndex(todo => todo.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < todos.length - 1)
    ) {
      const newTodos = [...todos];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newTodos[index], newTodos[newIndex]] = [newTodos[newIndex], newTodos[index]];
      setTodos(newTodos);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'pending':
        return !todo.completed;
      case 'high':
        return todo.priority === 'high' && !todo.completed;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>📝 To-Do List</h2>
        <div className="todo-stats">
          <span>Total: {todos.length}</span>
          <span>Completed: {todos.filter(t => t.completed).length}</span>
          <span>Pending: {todos.filter(t => !t.completed).length}</span>
        </div>
      </div>

      <div className="todo-input-section">
        <div className="input-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-btn">
            ➕ Add
          </button>
        </div>
      </div>

      <div className="todo-filters">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
          { key: 'high', label: 'High Priority' }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            className={`filter-btn ${filter === filterOption.key ? 'active' : ''}`}
            onClick={() => setFilter(filterOption.key)}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. {filter !== 'all' ? 'Try changing the filter.' : 'Add your first task!'}</p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}

                <select
                  value={todo.priority}
                  onChange={(e) => updatePriority(todo.id, e.target.value)}
                  className="priority-select"
                  style={{ borderColor: getPriorityColor(todo.priority) }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="todo-actions">
                <div className="move-buttons">
                  <button
                    onClick={() => moveTodo(todo.id, 'up')}
                    disabled={index === 0}
                    className="move-btn"
                    title="Move up"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveTodo(todo.id, 'down')}
                    disabled={index === filteredTodos.length - 1}
                    className="move-btn"
                    title="Move down"
                  >
                    ⬇️
                  </button>
                </div>

                {editingId === todo.id ? (
                  <div className="edit-actions">
                    <button onClick={saveEdit} className="save-btn">✅</button>
                    <button onClick={cancelEdit} className="cancel-btn">❌</button>
                  </div>
                ) : (
                  <div className="item-actions">
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="edit-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
