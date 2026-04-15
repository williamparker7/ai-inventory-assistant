import React, { useState } from 'react';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';
// import AIChatPanel from './components/AIChatPanel';

type View = 'list' | 'add' | 'edit';

export default function App() {
  const [view, setView] = useState<View>('list');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleEdit = (id: number) => {
    setEditItemId(id);
    setView('edit');
  };

  const handleDone = () => {
    setView('list');
    setEditItemId(null);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>AI Inventory Assistant</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>Manage equipment &middot; Ask AI anything about your stock</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {view !== 'list' && (
            <button onClick={handleDone} style={buttonStyle}>
              &larr; Back to List
            </button>
          )}
          {view === 'list' && (
            <button onClick={() => setView('add')} style={{ ...buttonStyle, background: '#2563eb', color: 'white' }}>
              + Add Item
            </button>
          )}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            style={{ ...buttonStyle, background: chatOpen ? '#7c3aed' : '#059669', color: 'white' }}
          >
            {chatOpen ? 'Close AI Chat' : '🤖 Ask AI'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {view === 'list' && <InventoryList onEdit={handleEdit} />}
          {view === 'add' && <InventoryForm onDone={handleDone} />}
          {view === 'edit' && editItemId && <InventoryForm itemId={editItemId} onDone={handleDone} />}
        </div>

        {chatOpen && (
          <div style={{ width: 400, flexShrink: 0 }}>
            <AIChatPanel />
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: 'white',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
};
