export type Unit = 'kg' | 'g' | 'lt' | 'ml' | 'pza' | 'manojo' | 'pqte' | 'lata' | 'frasco';

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  costPerUnit: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  amountPerKg: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  ingredients: RecipeIngredient[];
}

export interface QuoteItem {
  recipeId: string;
  kg: number;
}

export interface Quote {
  id: string;
  clientName: string;
  date: string;
  peopleCount: number;
  items: QuoteItem[];
  totalCost: number;
  notes?: string;
}
