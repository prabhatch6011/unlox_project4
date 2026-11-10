import React, { useState, useEffect } from 'react';

function Notes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('app_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editId !== null) {
      setNotes(notes.map(n => n.id === editId ? { ...n, title, content, date: new Date().toLocaleString() } : n));
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content, date: new Date().toLocaleString() }]);
    }
    setTitle('');
    setContent('');
  };

  const startEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="card">
      <h2>Notes Keeper</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px', background: '#fafafa', padding: '15px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title..."
          style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows="3"
          style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          {editId !== null ? 'Update Note' : 'Save Note'}
        </button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No notes yet. Create your first note!</p>
        ) : (
          notes.map(note => (
            <div key={note.id} style={{ background: '#fff', border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{note.title}</h3>
                <span style={{ fontSize: '11px', color: '#888' }}>{note.date}</span>
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#555', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>{note.content}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => startEdit(note)} style={{ padding: '4px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                <button onClick={() => deleteNote(note.id)} style={{ padding: '4px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;