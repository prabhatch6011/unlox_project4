import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('todo');

  // To-Do State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [editTaskId, setEditTaskId] = useState(null);

  // Notes State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('app_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

  // Task Handlers
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    if (editTaskId !== null) {
      setTasks(tasks.map(t => t.id === editTaskId ? { ...t, text: taskInput } : t));
      setEditTaskId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
    }
    setTaskInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditTask = (task) => {
    setTaskInput(task.text);
    setEditTaskId(task.id);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Pending') return !t.completed;
    return true;
  });

  // Note Handlers
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    if (editNoteId !== null) {
      setNotes(notes.map(n => n.id === editNoteId ? { ...n, title: noteTitle, content: noteContent, date: new Date().toLocaleString() } : n));
      setEditNoteId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title: noteTitle, content: noteContent, date: new Date().toLocaleString() }]);
    }
    setNoteTitle('');
    setNoteContent('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const startEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditNoteId(note.id);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f3f4f6', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '50px' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          Unlox Academy - Week 04 Project
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Professional To-Do & Notes Dashboard</p>
        
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('todo')}
            style={{
              padding: '10px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', border: 'none',
              background: activeTab === 'todo' ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'rgba(255,255,255,0.05)',
              color: '#fff', boxShadow: activeTab === 'todo' ? '0 10px 20px -5px rgba(99,102,241,0.4)' : 'none'
            }}
          >
            📋 To-Do Manager
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '10px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', border: 'none',
              background: activeTab === 'notes' ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'rgba(255,255,255,0.05)',
              color: '#fff', boxShadow: activeTab === 'notes' ? '0 10px 20px -5px rgba(99,102,241,0.4)' : 'none'
            }}
          >
            📝 Notes Keeper
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '650px', margin: '30px auto', padding: '0 20px' }}>
        {activeTab === 'todo' ? (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>Task Manager</h2>
            
            <form onSubmit={handleTaskSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="What needs to be done?"
                style={{ flex: 1, padding: '12px 15px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" style={{ padding: '12px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {editTaskId !== null ? 'Update' : 'Add'}
              </button>
            </form>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['All', 'Completed', 'Pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    background: filter === f ? '#8b5cf6' : '#1f2937', color: filter === f ? '#fff' : '#9ca3af'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <ul style={{ listStyle: 'none' }}>
              {filteredTasks.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '30px 0' }}>No tasks found.</p>
              ) : (
                filteredTasks.map(t => (
                  <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1f2937', padding: '12px 15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #374151' }}>
                    <span
                      onClick={() => toggleTask(t.id)}
                      style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#6b7280' : '#f3f4f6', cursor: 'pointer', flex: 1, fontSize: '14px' }}
                    >
                      {t.text}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => startEditTask(t)} style={{ padding: '5px 10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                      <button onClick={() => deleteTask(t.id)} style={{ padding: '5px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '25px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>Notes Keeper</h2>
            
            <form onSubmit={handleNoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title..."
                style={{ padding: '12px 15px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '14px' }}
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your notes here..."
                rows="3"
                style={{ padding: '12px 15px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '14px', resize: 'vertical' }}
              />
              <button type="submit" style={{ padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {editNoteId !== null ? 'Update Note' : 'Save Note'}
              </button>
            </form>

            <div style={{ display: 'grid', gap: '12px' }}>
              {notes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '30px 0' }}>No notes available.</p>
              ) : (
                notes.map(n => (
                  <div key={n.id} style={{ background: '#1f2937', border: '1px solid #374151', padding: '15px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '16px', color: '#f3f4f6', margin: 0 }}>{n.title}</h3>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>{n.date}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{n.content}</p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => startEditNote(n)} style={{ padding: '4px 10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                      <button onClick={() => deleteNote(n.id)} style={{ padding: '4px 10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;