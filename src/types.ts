export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  conditionStatus: 'new' | 'used' | 'refurbished';
  manufacturer: string | null;
  modelNumber: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  totalStock: number;
  categoryBreakdown: { category: string; count: number }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
