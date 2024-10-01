import { type NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import { Recipe } from '../../../models/Recipe';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const recipeData = await req.json();

    const newRecipe = new Recipe(recipeData);
    const savedRecipe = await newRecipe.save();

    return NextResponse.json(savedRecipe, { status: 201 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json(
      { error: 'Failed to add recipe' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let query = {};
    if (id) {
      query = { _id: new ObjectId(id) };
    }

    const recipes = await Recipe.find(query);
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 },
    );
  }
}
