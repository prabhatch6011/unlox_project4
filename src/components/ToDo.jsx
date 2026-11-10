import React, { useState, useEffect } from 'react';

function ToDo() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editId !== null) {
      setTasks(tasks.map(t => t.id === editId ? { ...t, text: input } : t));
      setEditId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    }
    setInput('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Pending') return !t.completed;
    return true;
  });

  return (
    <div className="card">
      <h2>Task Manager (To-Do)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', fontSize: '15px' }}
        />
        <button type="submit" style={{ padding: '12px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          {editId !== null ? 'Update' : 'Add Task'}
        </button>
      </form>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['All', 'Completed', 'Pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 15px',
              border: 'none',
              borderRadius: '20px',
              background: filter === f ? '#764ba2' : '#eee',
              color: filter === f ? 'white' : '#555',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none' }}>
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#88, 88, 88', padding: '20px' }}>No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '12px 15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
              <span
                onClick={() => toggleComplete(task.id)}
                style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#aaa' : '#333', cursor: 'pointer', flex: 1, fontSize: '15px' }}
              >
                {task.text}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => startEdit(task)} style={{ padding: '5px 12px', background: '#ffc107', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                <button onClick={() => deleteTask(task.id)} style={{ padding: '5px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ToDo;