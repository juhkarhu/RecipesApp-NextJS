import { type NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import { Recipe } from '../../../../../models/Recipe';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const newRating = request.nextUrl.searchParams.get('newRating');

    if (!id) {
      throw new Error('Please pass id')
    }

    const update = { rating: Number(newRating) };

    await Recipe.findByIdAndUpdate(new ObjectId(id), { $set: update }, { new: true });    console.log(`newRating: ${newRating}`)
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json(
      { error: 'Failed to add recipe' },
      { status: 500 },
    );
  }
}