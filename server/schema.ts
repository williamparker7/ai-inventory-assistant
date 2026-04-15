const typeDefs = `#graphql
  type InventoryItem {
    id: Int!
    name: String!
    category: String!
    description: String
    price: Float!
    stockQuantity: Int!
    conditionStatus: String!
    manufacturer: String
    modelNumber: String
    year: Int
    createdAt: String
    updatedAt: String
  }

  input InventoryItemInput {
    name: String!
    category: String!
    description: String
    price: Float!
    stockQuantity: Int!
    conditionStatus: String
    manufacturer: String
    modelNumber: String
    year: Int
  }

  input InventoryItemUpdateInput {
    name: String
    category: String
    description: String
    price: Float
    stockQuantity: Int
    conditionStatus: String
    manufacturer: String
    modelNumber: String
    year: Int
  }

  type Query {
    items(category: String, search: String): [InventoryItem!]!
    item(id: Int!): InventoryItem
    categories: [String!]!
    inventorySummary: InventorySummary!
  }

  type InventorySummary {
    totalItems: Int!
    totalValue: Float!
    totalStock: Int!
    categoryBreakdown: [CategoryCount!]!
  }

  type CategoryCount {
    category: String!
    count: Int!
  }

  type Mutation {
    createItem(input: InventoryItemInput!): InventoryItem!
    updateItem(id: Int!, input: InventoryItemUpdateInput!): InventoryItem!
    deleteItem(id: Int!): Boolean!
  }
`;

export default typeDefs;
