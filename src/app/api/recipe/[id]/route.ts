import { type NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import { Recipe } from '../../../../models/Recipe';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (deletedRecipe) {
      return NextResponse.json(
        { message: 'Recipe deleted successfully', deletedRecipe },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 },
    );
  }
}
