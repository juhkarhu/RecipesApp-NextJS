'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendRecipeToBackend } from '../../services/recipesAPI';
import Autocomplete from 'react-autocomplete-input';
import { Recipe, Ingredient } from 'types/propTypes';

const RecipeAdd: React.FC = () => {
  const predefinedUnits = ['g', 'kg', 'ml', 'l', 'tl', 'rl', 'dl', 'kpl'];
  const possibleIngredients = [
    'Jauheliha',
    'Jauhepossu',
    'Suola',
    'Pippuri',
    'Kana',
    'Sokeri',
    'Soijarouhe',
    'Tofu',
  ];

  const [ingredientInput, setIngredientInput] = useState<string>('');
  const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe>({
    id: '',
    name: '',
    estimatedTime: 0,
    rating: 0,
    categories: [],
    tags: [],
    instructions: [],
    ingredients: [],
  });

  useEffect(() => {
    setCategories(['Kana', 'Jauheliha', 'Soijarouhe', 'Tofu']);
    setTags(['Mallan suosikki', 'Uuni', 'Paistinpannu']);
  }, []);

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...chosenIngredients];
    updatedIngredients.splice(index, 1);
    setChosenIngredients(updatedIngredients);
  };

  const updateChosenIngredient = (
    index: number,
    property: keyof Ingredient,
    value: string | number,
  ) => {
    setChosenIngredients((prevIngredients) =>
      prevIngredients.map((item, i) =>
        i !== index ? item : { ...item, [property]: value },
      ),
    );
  };

  const handleAddInstruction = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      instructions: [
        ...prevRecipe.instructions,
        { text: '', order: prevRecipe.instructions.length + 1 },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedInstructions = recipe.instructions.map(
      (instruction, index) => ({
        text: instruction.text,
        order: index + 1,
      }),
    );

    const recipeData: Recipe = {
      id: uuidv4(),
      name: recipe.name,
      estimatedTime: recipe.estimatedTime,
      rating: recipe.rating,
      categories: selectedCategories,
      tags: selectedTags,
      ingredients: chosenIngredients,
      instructions: updatedInstructions,
    };

    try {
      await sendRecipeToBackend(recipeData);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const renderBasicFields = () => (
    <>
      <div className='mb-4'>
        <label className='block text-sm font-bold mb-2'>Title:</label>
        <input
          className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
          type='text'
          value={recipe.name}
          onChange={(e) => {
            setRecipe({ ...recipe, name: e.target.value });
          }}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-bold mb-2'>
          Estimated Time (minutes):
        </label>
        <input
          className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
          type='number'
          value={recipe.estimatedTime}
          onChange={(e) => {
            setRecipe({ ...recipe, estimatedTime: Number(e.target.value) });
          }}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-bold mb-2'>Rating:</label>
        <input
          className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
          type='number'
          value={recipe.rating}
          onChange={(e) => {
            setRecipe({ ...recipe, rating: Number(e.target.value) });
          }}
        />
      </div>
    </>
  );

  const renderCategories = () => (
    <div className='flex flex-col mb-4'>
      <label className='mb-4'>Categories:</label>
      <select
        className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
        multiple
        value={selectedCategories}
        onChange={(e) => {
          setSelectedCategories(
            Array.from(e.target.selectedOptions, (option) => option.value),
          );
        }}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );

  const renderTags = () => (
    <div className='flex flex-col mb-4'>
      <label>Tags:</label>
      <select
        className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
        multiple
        value={selectedTags}
        onChange={(e) => {
          setSelectedTags(
            Array.from(e.target.selectedOptions, (option) => option.value),
          );
        }}
      >
        {tags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );

  const renderChosenIngredients = () => (
    <div className='flex flex-col mb-4'>
      <label>Chosen Ingredients:</label>
      <ul className='bg-gray-800 shadow rounded space-y-1 mt-2'>
        {chosenIngredients.map((ingredient, index) => (
          <li
            key={index}
            className='cursor-pointer hover:bg-gray-700 text-gray-300 px-3 py-2'
          >
            <span>{ingredient.name}</span>
            <input
              className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
              type='number'
              placeholder='Quantity'
              value={ingredient.quantity}
              onChange={(e) => {
                updateChosenIngredient(
                  index,
                  'quantity',
                  Number(e.target.value),
                );
              }}
            />
            <select
              className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
              value={ingredient.unit}
              onChange={(e) => {
                updateChosenIngredient(index, 'unit', e.target.value);
              }}
            >
              {predefinedUnits.map((unit, unitIndex) => (
                <option key={unitIndex} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              className='bg-green-700 hover:bg-green-800 text-gray-200 px-3 py-1 rounded mt-2'
              onClick={() => {
                handleRemoveIngredient(index);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderFilteredIngredients = () => (
    <div className='flex flex-col mb-4'>
      <label>Ingredients:</label>
      <Autocomplete
        Component={'input'}
        trigger={''}
        options={possibleIngredients}
        onChange={(value) => {
          if (typeof value === 'string') {
            setIngredientInput(value);
          }
        }}
        onSelect={(value) => {
          if (typeof value === 'string') {
            setChosenIngredients([
              ...chosenIngredients,
              { name: value, quantity: 0, unit: '' },
            ]);
            setIngredientInput('');
          }
        }}
        className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2'
        value={ingredientInput}
        placeholder='Enter ingredient'
        matchAny={true}
      />
    </div>
  );

  const renderInstructions = () => (
    <div className='flex flex-col mb-4'>
      <label>Instructions:</label>
      <div className='mb-4'>
        <ol className='list-decimal pl-5'>
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className='mb-3'>
              <input
                className='bg-gray-800 text-gray-300 border-gray-600 border rounded p-2 w-full'
                type='text'
                value={instruction.text}
                onChange={(e) => {
                  const newInstructions = [...recipe.instructions];
                  newInstructions[index].text = e.target.value;
                  setRecipe({ ...recipe, instructions: newInstructions });
                }}
              />
            </li>
          ))}
        </ol>
        <button
          type='button'
          onClick={handleAddInstruction}
          className='bg-green-700 hover:bg-green-800 text-gray-200 px-3 py-1 rounded mt-2'
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex justify-center bg-gray-900 items-center'>
      <div className='p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-xl w-full'>
        <h2 className='text-3xl font-bold mb-4'>Add a New Recipe</h2>
        <form onSubmit={handleSubmit} className='recipe-form'>
          <div className='mb-4 text-center w-full'>{renderBasicFields()}</div>
          {renderCategories()}
          {renderTags()}
          {renderChosenIngredients()}
          {renderFilteredIngredients()}
          {renderInstructions()}
          <button
            className='bg-blue-600 text-white py-1 px-4 rounded w-full'
            type='submit'
          >
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeAdd;
