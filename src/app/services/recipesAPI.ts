import { type Recipe } from 'types/propTypes';

// Function to send a new recipe to the backend
export const sendRecipeToBackend = async (recipe: Recipe) => {
  try {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

export const sendLikeToBackend = async (id: string, newRating: number) => {
  try {
    const response = await fetch(`/api/recipe/like/${id}?newRating=${newRating}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update rating');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

// Function to delete a recipe by ID
export const deleteRecipeById = async (id: string) => {
  try {
    const response = await fetch(`/api/recipe/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete recipe');
    }

    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Function to send a new recipe to the backend
export const fetchCategoriesAndTags = async () => {
  try {
    console.log(`fetchCategoriesAndTagsfetchCategoriesAndTagsfetchCategoriesAndTagsfetchCategoriesAndTags`)
    const response = await fetch('/api/utils/categoriesAndTags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`not ok`)
      const errorData = await response.json();
      throw new Error(errorData.error || 'fetchCategoriesAndTags failed');
    }

    console.log(`ok`)
    return await response;
  } catch (error) {
    console.log(`error`)
    console.error('Error in fetchCategoriesAndTags:', error);
    throw error;
  }
};