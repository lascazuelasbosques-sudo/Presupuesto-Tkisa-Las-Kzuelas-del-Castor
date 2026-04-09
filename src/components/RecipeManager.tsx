import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Recipe, Ingredient, RecipeIngredient, Category } from '@/src/types';
import { Plus, Trash2, Edit, X, Copy, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  recipes: Recipe[];
  ingredients: Ingredient[];
  categories: Category[];
  onAddRecipe: (recipe: Recipe) => void;
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipeManager({ recipes, ingredients, categories, onAddRecipe, onUpdateRecipe, onDeleteRecipe }: Props) {
  const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newName, setNewName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = sortedRecipes.filter(recipe => {
    const categoryName = categories.find(c => c.id === recipe.categoryId)?.name || '';
    const searchLower = searchQuery.toLowerCase();
    return recipe.name.toLowerCase().includes(searchLower) || categoryName.toLowerCase().includes(searchLower);
  });

  const openAddDialog = () => {
    setEditingRecipe(null);
    setNewName('');
    setCategoryId(categories[0]?.id || '');
    setSelectedIngredients([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setNewName(recipe.name);
    setCategoryId(recipe.categoryId);
    setSelectedIngredients([...recipe.ingredients]);
    setIsDialogOpen(true);
  };

  const openDuplicateDialog = (recipe: Recipe) => {
    setEditingRecipe(null); // It's a new recipe
    setNewName(`${recipe.name} (Copia)`);
    setCategoryId(recipe.categoryId);
    setSelectedIngredients([...recipe.ingredients]);
    setIsDialogOpen(true);
  };

  const handleAddIngredient = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: '', amountPerKg: 0 }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const updated = [...selectedIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedIngredients(updated);
  };

  const handleSubmit = () => {
    if (!newName || !categoryId) return;
    
    const recipeData: Recipe = {
      id: editingRecipe ? editingRecipe.id : Math.random().toString(36).substr(2, 9),
      name: newName,
      categoryId: categoryId,
      ingredients: selectedIngredients.filter(si => si.ingredientId && si.amountPerKg > 0)
    };
    
    if (editingRecipe) {
      onUpdateRecipe(recipeData);
    } else {
      onAddRecipe(recipeData);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Recetario</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar guisado o categoría..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button className="gap-2 w-full sm:w-auto" onClick={openAddDialog}>
              <Plus className="w-4 h-4" /> Nueva Receta
            </Button>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRecipe ? 'Editar Receta' : 'Agregar Nueva Receta'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Guisado</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ej. Picadillo" />
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría">
                        {categories.find(c => c.id === categoryId)?.name || "Seleccionar categoría"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sortedCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Ingredientes (por cada 1kg de guisado)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}>
                    <Plus className="w-4 h-4 mr-1" /> Agregar
                  </Button>
                </div>
                
                {selectedIngredients.map((si, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 sm:items-end border-b pb-4">
                    <div className="flex-1 space-y-2">
                      <Label>Ingrediente</Label>
                      <Select 
                        value={si.ingredientId} 
                        onValueChange={val => handleIngredientChange(index, 'ingredientId', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar...">
                            {ingredients.find(i => i.id === si.ingredientId)?.name || "Seleccionar..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {sortedIngredients.map(ing => (
                            <SelectItem key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 items-end">
                      <div className="w-full sm:w-32 space-y-2 flex-1">
                        <Label>Cant. p/kg</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={si.amountPerKg} 
                          onChange={e => handleIngredientChange(index, 'amountPerKg', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                          onFocus={(e) => { if (si.amountPerKg === 0) handleIngredientChange(index, 'amountPerKg', ''); }}
                          onBlur={(e) => { if (si.amountPerKg === '') handleIngredientChange(index, 'amountPerKg', 0); }}
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)} className="text-destructive shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editingRecipe ? 'Actualizar' : 'Guardar'} Receta</Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ingredientes</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                    {searchQuery ? 'No se encontraron recetas que coincidan con la búsqueda.' : 'No hay recetas registradas aún.'}
                  </TableCell>
                </TableRow>
              )}
              {filteredRecipes.map(recipe => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell>{categories.find(c => c.id === recipe.categoryId)?.name || 'Sin categoría'}</TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {recipe.ingredients.length} ingredientes registrados
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDuplicateDialog(recipe)} title="Duplicar para variación">
                        <Copy className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(recipe)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteRecipe(recipe.id)} className="text-destructive" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
