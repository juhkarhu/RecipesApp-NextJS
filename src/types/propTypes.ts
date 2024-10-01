export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Instruction {
  text: string;
  order: number;
}

export interface Recipe {
  id: string;
  name: string;
  estimatedTime: number;
  rating: number;
  categories: string[];
  tags: string[];
  instructions: Instruction[];
  ingredients: Ingredient[];
}
