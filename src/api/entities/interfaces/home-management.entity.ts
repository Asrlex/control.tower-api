export interface StockProductI {
  stockProductID: number;
  stockProductAmount: number;
  product: ProductI;
}

export interface ShoppingListProductI {
  shoppingListProductID: number;
  shoppingListProductAmount: number;
  product: ProductI;
  store: StoreI;
}

export interface ProductI {
  productID: number;
  productName: string;
  productUnit: string;
  productDateLastConsumed: string;
  productDateLastBought: string;
  tags: TagI[];
}

export interface StoreI {
  storeID: number;
  storeName: string;
}

export interface TagI {
  tagID: number;
  tagName: string;
  tagType: string;
}

export interface TaskI {
  taskID: number;
  taskTitle: string;
  taskDescription: string;
  taskCompleted: boolean;
  taskCompletedAt: string;
  taskDateCreated: string;
  taskDateModified: string;
  tags: TagI[];
}
