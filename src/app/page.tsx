'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import RecipeList from './components/RecipeList';
// import RecipeDetail from './components/RecipeDetail';
// import { Recipe } from 'types/propTypes';

const HomePage = () => {
  // const [recipes, setRecipes] = useState<Recipe[]>([]);
  // const [refreshKey, setRefreshKey] = useState(0);
  // const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/recipe');
  //       if (!response.ok) throw new Error('Failed to fetch recipes');

  //       const data = await response.json();
  //       setRecipes(data);
  //     } catch (error) {
  //       console.error('Error fetching the recipes:', error);
  //     }
  //   };

  //   fetchData();
  // }, [refreshKey]);

  // const refreshRecipes = () => {
  //   setRefreshKey((prevKey) => prevKey + 1);
  // };

  // // Handle closing the recipe detail view
  // const closeRecipeDetail = () => {
  //   setSelectedRecipeId(null);
  // };

  return (
    <div>HomePage</div>
    // <div className='bg-gray-900 text-white min-h-screen'>
    //   <div className='container mx-auto p-4'>
    //     <Link href="/recipes/add">
    //       <button className='bg-blue-600 text-white py-1 px-4 rounded float-right'>
    //         Add Recipe
    //       </button>
    //     </Link>
    //     <div className='clear-both'></div>

    //     {/* Display Recipe List */}
    //     <RecipeList recipes={recipes} refreshRecipes={refreshRecipes} />

    //     {/* Modal for RecipeDetail component */}
    //     {selectedRecipeId && (
    //       <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
    //         <div className='bg-gray-900 p-4 rounded-lg max-w-xl w-full relative'>
    //           <RecipeDetail recipeId={selectedRecipeId} />
    //           <button
    //             onClick={closeRecipeDetail}
    //             className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded'
    //           >
    //             Close
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default HomePage;