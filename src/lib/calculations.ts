import { CALCULATIONS } from '../constants';
import { Recipe, RecipeIngredient, Ingredient } from '../types';

export function calculateIngredientsForKg(recipe: Recipe, kg: number) {
  return recipe.ingredients.map(ri => ({
    ingredientId: ri.ingredientId,
    totalAmount: ri.amountPerKg * kg
  }));
}

export function calculateKgForPeople(peopleCount: number) {
  return peopleCount * CALCULATIONS.KG_PER_PERSON;
}

export function calculatePeopleForKg(kg: number) {
  return kg / CALCULATIONS.KG_PER_PERSON;
}

export function getIngredientDetails(ingredientId: string, ingredients: Ingredient[]) {
  return ingredients.find(i => i.id === ingredientId);
}
