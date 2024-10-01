import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import { Recipe } from '../../../../models/Recipe';

export async function GET() {
  try {
    await connectToDatabase();

    const recipes = await Recipe.find({});

    let existingTags = [];
    let existingCategories = [];

    for (const recipe of recipes) {
      const { tags, categories } = recipe;
      existingTags.push(...tags);
      existingCategories.push(...categories);
    }

    existingTags = Array.from(new Set(existingTags));
    existingCategories = Array.from(new Set(existingCategories));

    console.log(`existingTags: ${JSON.stringify(existingTags)}`)
    console.log(`existingCategories: ${JSON.stringify(existingCategories)}`)
    return NextResponse.json({ tags: existingTags, categories: existingCategories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 },
    );
  }
}
