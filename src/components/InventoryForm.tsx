import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ITEM = gql`
  query GetItem($id: Int!) {
    item(id: $id) {
      id name category description price stockQuantity conditionStatus manufacturer modelNumber year
    }
  }
`;

const CREATE_ITEM = gql`
  mutation CreateItem($input: InventoryItemInput!) {
    createItem(input: $input) { id }
  }
`;

const UPDATE_ITEM = gql`
  mutation UpdateItem($id: Int!, $input: InventoryItemUpdateInput!) {
    updateItem(id: $id, input: $input) { id }
  }
`;

interface Props {
  itemId?: number;
  onDone: () => void;
}

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  stockQuantity: '',
  conditionStatus: 'new',
  manufacturer: '',
  modelNumber: '',
  year: '',
};

export default function InventoryForm({ itemId, onDone }: Props) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = !!itemId;

  // Load existing item data when editing
  const { data } = useQuery(GET_ITEM, {
    variables: { id: itemId },
    skip: !itemId,
  });

  useEffect(() => {
    if (data?.item) {
      const item = data.item;
      setForm({
        name: item.name,
        category: item.category,
        description: item.description || '',
        price: String(item.price),
        stockQuantity: String(item.stockQuantity),
        conditionStatus: item.conditionStatus,
        manufacturer: item.manufacturer || '',
        modelNumber: item.modelNumber || '',
        year: item.year ? String(item.year) : '',
      });
    }
  }, [data]);

  const [createItem, { loading: creating }] = useMutation(CREATE_ITEM, { onCompleted: onDone });
  const [updateItem, { loading: updating }] = useMutation(UPDATE_ITEM, { onCompleted: onDone });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: form.name,
      category: form.category,
      description: form.description || null,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      conditionStatus: form.conditionStatus,
      manufacturer: form.manufacturer || null,
      modelNumber: form.modelNumber || null,
      year: form.year ? parseInt(form.year, 10) : null,
    };

    if (isEditing && itemId) {
      await updateItem({ variables: { id: itemId, input } });
    } else {
      await createItem({ variables: { input } });
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginTop: 0, marginBottom: 20 }}>{isEditing ? 'Edit Item' : 'Add New Item'}</h2>

      <form onSubmit={handleSubmit}>
        <Field label="Name *">
          <input required value={form.name} onChange={set('name')} style={inputStyle} placeholder="e.g. Caterpillar 320 Excavator" />
        </Field>

        <Field label="Category *">
          <input required value={form.category} onChange={set('category')} style={inputStyle} placeholder="e.g. Excavators" />
        </Field>

        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="Price *" flex>
            <input required type="number" step="0.01" min="0" value={form.price} onChange={set('price')} style={inputStyle} placeholder="0.00" />
          </Field>
          <Field label="Stock Quantity *" flex>
            <input required type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} style={inputStyle} placeholder="0" />
          </Field>
        </div>

        <Field label="Condition">
          <select value={form.conditionStatus} onChange={set('conditionStatus')} style={inputStyle}>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="Manufacturer" flex>
            <input value={form.manufacturer} onChange={set('manufacturer')} style={inputStyle} placeholder="e.g. Caterpillar" />
          </Field>
          <Field label="Model Number" flex>
            <input value={form.modelNumber} onChange={set('modelNumber')} style={inputStyle} placeholder="e.g. 320" />
          </Field>
          <Field label="Year" flex>
            <input type="number" value={form.year} onChange={set('year')} style={inputStyle} placeholder="2025" />
          </Field>
        </div>

        <Field label="Description">
          <textarea value={form.description} onChange={set('description')} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Describe the item..." />
        </Field>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button type="submit" disabled={creating || updating} style={{ ...btnStyle, background: '#2563eb', color: 'white' }}>
            {creating || updating ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
          </button>
          <button type="button" onClick={onDone} style={btnStyle}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  return (
    <div style={{ marginBottom: 16, flex: flex ? 1 : undefined }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { padding: '10px 20px', borderRadius: 6, border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500 };
