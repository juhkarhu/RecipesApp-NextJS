import mongoose, { Schema, type Document, type Model } from 'mongoose';

// Define the interfaces for Ingredients and Instructions
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Instruction {
  text: string;
  order: number;
}

// Interface for the Recipe document
export interface IRecipe extends Document {
  name: string;
  estimatedTime: number;
  rating: number;
  categories: string[];
  tags: string[];
  instructions: Instruction[];
  ingredients: Ingredient[];
  image?: {
    data: Buffer;
    contentType: string;
  };
}

// Define the Ingredient schema
const ingredientSchema = new Schema<Ingredient>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
});

// Define the Instruction schema
const instructionSchema = new Schema<Instruction>({
  text: { type: String, required: true },
  order: { type: Number, required: true },
});

// Define the Recipe schema
const recipeSchema = new Schema<IRecipe>({
  name: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  rating: { type: Number, required: true },
  categories: [{ type: String, required: true }],
  tags: [{ type: String, required: true }],
  instructions: [instructionSchema],
  ingredients: [ingredientSchema],
  image: {
    data: Buffer,
    contentType: String,
  },
});

// Transform the toJSON output to modify the object as needed
recipeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Transform the toJSON output for the instruction schema
instructionSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export the Recipe model, checking if it's already defined to prevent redefinition
export const Recipe: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', recipeSchema);
