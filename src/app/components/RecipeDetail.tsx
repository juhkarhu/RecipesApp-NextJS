'use client'

import { useEffect, useState } from 'react';
import { type Recipe } from '../../types/propTypes';
import { sendLikeToBackend } from 'app/services/recipesAPI';

interface RecipeDetailProps {
  recipeId?: string;
  recipe?: Recipe;
  onUpdateRecipe?: (updatedRecipe: Recipe) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipeId, recipe: initialRecipe, onUpdateRecipe }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe || null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (recipeId && !initialRecipe) {
        try {
          const response = await fetch(`/api/recipe?id=${recipeId}`);
          if (!response.ok) throw new Error('Recipe not found');
          
          const data = await response.json();
          if (data.length > 0) {
            setRecipe(data[0]);
          }
        } catch (error) {
          console.error('Error fetching the recipe:', error);
        }
      }
    };

    fetchRecipe();
  }, [recipeId, initialRecipe]);

  if (!recipe) return <p className='text-white'>Loading...</p>;

  const handleLikedRecipe = async (liked: boolean) => {
    const newRating: number = liked ? Math.min(recipe.rating + 0.1, 5.0) : Math.max(recipe.rating - 0.1, 0.0);
    try {
      await sendLikeToBackend(recipe.id, Number(newRating.toFixed(1)));

      const updatedRecipe = { ...recipe, rating: Number(newRating.toFixed(1)) };
      setRecipe(updatedRecipe);

      // Call the parent component's update function if provided
      if (onUpdateRecipe) {
        onUpdateRecipe(updatedRecipe);
      }
    } catch (error) {
      console.error('Error updating recipe rating:', error);
    }
  };

  const { name, rating, tags = [], categories = [], ingredients = [], instructions = [] } = recipe;

  return (
    <div className='p-6 bg-gray-900 text-white rounded-lg shadow-md'>
      <h2 className='text-3xl font-bold mb-4'>{name}</h2>
      <h2 className='text-l font-bold mb-4'>Rating: {rating}</h2>
      <button
            onClick={async () => {
              await handleLikedRecipe(true);
            }}
            className='bg-red-600 text-white px-2 py-1 rounded mt-2'
          >
            👍
          </button>
      
      <button
            onClick={async () => {
              await handleLikedRecipe(false);
            }}
            className='bg-red-600 text-white px-2 py-1 rounded mt-2'
          >
            👎
          </button>
      
      <div className='mb-4'>
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span
              key={index}
              className='inline-block bg-gray-700 rounded px-2 py-1 mr-2 text-sm'
            >
              {tag}
            </span>
          ))
        ) : (
          <span>No tags available</span>
        )}
      </div>

      <div className='bg-gray-800 p-4 mb-4 rounded-lg'>
        <h4 className='font-bold text-xl mb-2'>CATEGORIES</h4>
        <div className='mb-4'>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <span
                key={index}
                className='inline-block bg-gray-700 rounded px-2 py-1 mr-2 text-sm'
              >
                {category}
              </span>
            ))
          ) : (
            <span>No categories available</span>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 p-4 bg-gray-800 rounded-lg'>
          <h4 className='font-bold text-xl mb-2'>YOU NEED THESE</h4>
          <ul className='list-decimal pl-5'>
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <li key={index} className='list-disc mb-2'>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))
            ) : (
              <li>No ingredients available</li>
            )}
          </ul>
        </div>

        <div className='flex-1 p-4 bg-gray-800 rounded-lg'>
          <h4 className='font-bold text-xl mb-2'>THIS IS HOW YOU COOK</h4>
          <ol className='list-decimal pl-5'>
            {instructions.length > 0 ? (
              instructions.map((instruction, index) => (
                <li key={index} className='mb-2'>
                  {instruction.text}
                </li>
              ))
            ) : (
              <li>No instructions available</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;