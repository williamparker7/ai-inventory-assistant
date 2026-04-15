import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import type { InventoryItem } from '../types';

const GET_ITEMS = gql`
  query GetItems($category: String, $search: String) {
    items(category: $category, search: $search) {
      id
      name
      category
      description
      price
      stockQuantity
      conditionStatus
      manufacturer
      modelNumber
      year
    }
    categories
    inventorySummary {
      totalItems
      totalValue
      totalStock
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;

interface Props {
  onEdit: (id: number) => void;
}

export default function InventoryList({ onEdit }: Props) {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');

  const { data, loading, error, refetch } = useQuery(GET_ITEMS, {
    variables: {
      category: category || undefined,
      search: search || undefined,
    },
  });

  const [deleteItem] = useMutation(DELETE_ITEM, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p style={{ color: 'red' }}>Error loading inventory: {error.message}</p>;

  const items: InventoryItem[] = data?.items || [];
  const categories: string[] = data?.categories || [];
  const summary = data?.inventorySummary;

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      await deleteItem({ variables: { id } });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div>
      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <SummaryCard label="Total Items" value={summary.totalItems} />
          <SummaryCard label="Total Value" value={formatPrice(summary.totalValue)} />
          <SummaryCard label="Units in Stock" value={summary.totalStock} />
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: 40 }}>
          No items found. Add your first item to get started!
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Condition</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={tdStyle}>
                  <strong>{item.name}</strong>
                  {item.manufacturer && (
                    <span style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>
                      {item.manufacturer} {item.modelNumber && `· ${item.modelNumber}`} {item.year && `· ${item.year}`}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  <span style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                    {item.category}
                  </span>
                </td>
                <td style={tdStyle}>{formatPrice(item.price)}</td>
                <td style={tdStyle}>
                  <span style={{ color: item.stockQuantity <= 1 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                    {item.stockQuantity}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: item.conditionStatus === 'new' ? '#dcfce7' : item.conditionStatus === 'refurbished' ? '#fef3c7' : '#f3f4f6',
                    color: item.conditionStatus === 'new' ? '#166534' : item.conditionStatus === 'refurbished' ? '#92400e' : '#374151',
                  }}>
                    {item.conditionStatus}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => onEdit(item.id)} style={actionBtnStyle}>Edit</button>
                  <button onClick={() => handleDelete(item.id, item.name)} style={{ ...actionBtnStyle, color: '#dc2626' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ flex: 1, padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 12px', fontWeight: 600, color: '#374151' };
const tdStyle: React.CSSProperties = { padding: '12px' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, flex: 1 };
const actionBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontSize: 13, marginRight: 8 };
