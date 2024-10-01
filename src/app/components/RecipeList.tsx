'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { type Recipe } from '../../types/propTypes';
import RecipeDetail from './RecipeDetail';
import { deleteRecipeById } from 'app/services/recipesAPI';

interface RecipeListProps {
  recipes: Recipe[];
  refreshRecipes: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, refreshRecipes }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this recipe?');

    if (isConfirmed) {
      try {
        await deleteRecipeById(id);
        refreshRecipes();
        router.push('/recipes');
      } catch (error) {
        console.error('Error deleting the recipe:', error);
      }
    }
  };

  const openModal = (id: string) => {
    setSelectedRecipeId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  const updateRecipeInList = () => {
    refreshRecipes();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen]);

  const openRecipeDetailPage = () => {
    if (selectedRecipeId) {
      router.push(`/recipes/${selectedRecipeId}`);
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className='p-4 bg-gray-800 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-sky-900'
          onClick={() => {
            openModal(recipe.id);
          }}
        >
          <h2 className='text-xl font-bold mb-2'>{recipe.name}</h2>
          <p className='text-gray-400 mb-2'>Estimated Time: {recipe.estimatedTime} mins</p>
          <p className='text-yellow-500 mb-4'>Rating: {recipe.rating}</p>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await handleDelete(recipe.id);
            }}
            className='bg-red-600 text-white px-2 py-1 rounded mt-2'
          >
            Delete
          </button>
        </div>
      ))}

      {isModalOpen && selectedRecipeId && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div
            ref={modalRef}
            className='bg-gray-900 p-6 rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl'
          >
            <RecipeDetail
              recipeId={selectedRecipeId}
              recipe={recipes.find((r) => r.id === selectedRecipeId) || undefined}
              onUpdateRecipe={updateRecipeInList}
            />
            <button
              onClick={closeModal}
              className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'
            >
              Close
            </button>
            <button
              onClick={openRecipeDetailPage}
              className='bg-green-600 text-white px-4 py-2 rounded'
            >
              Open
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeList;