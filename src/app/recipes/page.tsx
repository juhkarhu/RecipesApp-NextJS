'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RecipeList from '../components/RecipeList';
import RecipeDetail from '../components/RecipeDetail';
import { Recipe } from 'types/propTypes';

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe');
      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching the recipes:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [refreshKey, fetchRecipes]);

  const refreshRecipes = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Handle closing the recipe detail view
  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
  };

  // Update a recipe after liking/disliking
  const updateRecipeInList = (updatedRecipe: Recipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    // Update the selected recipe in case the modal is still open
    setSelectedRecipe(updatedRecipe);
  };

  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4'>RecipeApp</h1>
        <Link href='/recipes/add'>
          <button className='bg-blue-600 text-white py-1 px-4 rounded float-right'>
            Add Recipe
          </button>
        </Link>
        <div className='clear-both'></div>

        {/* Display Recipe List */}
        <RecipeList recipes={recipes} refreshRecipes={refreshRecipes} />

        {/* Modal for RecipeDetail component */}
        {selectedRecipe && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-gray-900 p-4 rounded-lg max-w-xl w-full relative'>
              <RecipeDetail
                recipe={selectedRecipe}
                onUpdateRecipe={updateRecipeInList}
              />
              <button
                onClick={closeRecipeDetail}
                className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;