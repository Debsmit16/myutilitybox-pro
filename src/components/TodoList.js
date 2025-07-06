import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load todos from Firestore with real-time updates
  useEffect(() => {
    // Clear previous user's data immediately
    setTodos([]);
    setLoading(true);

    if (!currentUser) {
      setLoading(false);
      return;
    }
    const todosRef = collection(db, 'users', currentUser.uid, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching todos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addTodo = async () => {
    if (!newTodo.trim() || !currentUser) return;

    try {
      const todosRef = collection(db, 'users', currentUser.uid, 'todos');
      await addDoc(todosRef, {
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date()
      });
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo. Please try again.');
    }
  };

  const deleteTodo = async (id) => {
    if (!currentUser) return;

    try {
      const todoRef = doc(db, 'users', currentUser.uid, 'todos', id);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo. Please try again.');
    }
  };

  const toggleTodo = async (id) => {
    if (!currentUser) return;

    try {
      const todo = todos.find(t => t.id === id);
      const todoRef = doc(db, 'users', currentUser.uid, 'todos', id);
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please try again.');
    }
  };

  const updatePriority = async (id, priority) => {
    if (!currentUser) return;

    try {
      const todoRef = doc(db, 'users', currentUser.uid, 'todos', id);
      await updateDoc(todoRef, { priority });
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority. Please try again.');
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (!editText.trim() || !currentUser) return;

    try {
      const todoRef = doc(db, 'users', currentUser.uid, 'todos', editingId);
      await updateDoc(todoRef, {
        text: editText.trim()
      });
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo text:', error);
      alert('Failed to update todo. Please try again.');
    }
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

  if (!currentUser) {
    return (
      <div className="todo-container">
        <div className="auth-required">
          <h3>Please sign in to access your todos</h3>
          <p>Your todos will be synced across all your devices!</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="todo-container">
        <div className="loading-state">
          <h3>Loading your todos...</h3>
        </div>
      </div>
    );
  }

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
