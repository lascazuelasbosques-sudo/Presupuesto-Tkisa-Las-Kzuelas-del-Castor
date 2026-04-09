import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Recipe, Ingredient, Category } from '@/src/types';
import { calculateIngredientsForKg, getIngredientDetails } from '@/src/lib/calculations';
import { ChefHat, Scale } from 'lucide-react';

interface Props {
  recipes: Recipe[];
  ingredients: Ingredient[];
  categories: Category[];
}

export function IngredientCalculator({ recipes, ingredients, categories }: Props) {
  const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(sortedRecipes[0]?.id || '');
  const [kg, setKg] = useState<number | string>(1);

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);
  const numericKg = typeof kg === 'string' ? parseFloat(kg) || 0 : kg;
  const calculatedIngredients = selectedRecipe 
    ? calculateIngredientsForKg(selectedRecipe, numericKg)
    : [];

  const sortedCalculatedIngredients = [...calculatedIngredients].sort((a, b) => {
    const nameA = getIngredientDetails(a.ingredientId, ingredients)?.name || '';
    const nameB = getIngredientDetails(b.ingredientId, ingredients)?.name || '';
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
  });

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Calculadora de Ingredientes
          </CardTitle>
          <CardDescription>
            Selecciona un guisado y la cantidad de kilos que deseas preparar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipe">Guisado</Label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un guisado">
                    {selectedRecipe ? selectedRecipe.name : "Selecciona un guisado"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sortedRecipes.map(recipe => {
                    const totalIngredientsAmount = recipe.ingredients.reduce((sum, ing) => sum + ing.amountPerKg, 0);
                    const category = categories.find(c => c.id === recipe.categoryId);
                    return (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        <div className="flex justify-between items-center w-full gap-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{recipe.name}</span>
                            <span className="text-[10px] opacity-60 uppercase tracking-tighter">{category?.name || 'Varios'}</span>
                          </div>
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium">
                            Σ {totalIngredientsAmount.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kg">Kilos a preparar</Label>
              <div className="relative">
                <Input 
                  id="kg" 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  value={kg} 
                  onChange={(e) => setKg(e.target.value)}
                  onFocus={(e) => { if (numericKg === 0) setKg(''); }}
                  onBlur={(e) => { if (kg === '') setKg(0); }}
                  className="pl-10"
                />
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRecipe && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Lista de Compra para {numericKg}kg de {selectedRecipe.name}</span>
              <span className="text-2xl font-bold text-primary">
                ${sortedCalculatedIngredients.reduce((sum, item) => {
                  const details = getIngredientDetails(item.ingredientId, ingredients);
                  return sum + (details ? (details.costPerUnit || 0) * item.totalAmount : 0);
                }, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </CardTitle>
            <CardDescription>
              Costo aproximado por kilo de guisado: ${
                numericKg > 0 
                  ? (sortedCalculatedIngredients.reduce((sum, item) => {
                      const details = getIngredientDetails(item.ingredientId, ingredients);
                      return sum + (details ? (details.costPerUnit || 0) * item.totalAmount : 0);
                    }, 0) / numericKg).toLocaleString('es-MX', { minimumFractionDigits: 2 })
                  : '0.00'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Presupuesto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCalculatedIngredients.map(item => {
                  const details = getIngredientDetails(item.ingredientId, ingredients);
                  const unitCost = details?.costPerUnit || 0;
                  const itemCost = unitCost * item.totalAmount;
                  return (
                    <TableRow key={item.ingredientId}>
                      <TableCell className="font-medium">{details?.name || 'Desconocido'}</TableCell>
                      <TableCell className="text-right">{item.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{details?.unit || '-'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${unitCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold text-primary">
                        ${itemCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-primary/5 font-bold text-primary">
                  <TableCell colSpan={4} className="text-right uppercase">Total Presupuesto</TableCell>
                  <TableCell className="text-right text-lg">
                    ${sortedCalculatedIngredients.reduce((sum, item) => {
                      const details = getIngredientDetails(item.ingredientId, ingredients);
                      return sum + (details ? (details.costPerUnit || 0) * item.totalAmount : 0);
                    }, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/30 text-xs text-muted-foreground italic">
                  <TableCell colSpan={5}>
                    * Precios de referencia basados en Ké Va Llevar.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
