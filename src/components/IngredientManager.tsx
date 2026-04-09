import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ingredient, Unit, Recipe } from '@/src/types';
import { Plus, Trash2, Edit, AlertTriangle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  ingredients: Ingredient[];
  recipes: Recipe[];
  isAdmin?: boolean;
  onAddIngredient: (ingredient: Ingredient) => void;
  onUpdateIngredient: (ingredient: Ingredient) => void;
  onDeleteIngredient: (id: string) => void;
  onSeedDatabase?: () => void;
}

export function IngredientManager({ ingredients, recipes, isAdmin, onAddIngredient, onUpdateIngredient, onDeleteIngredient, onSeedDatabase }: Props) {
  const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState<Unit>('kg');
  const [newCost, setNewCost] = useState<number | string>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = sortedIngredients.filter(ing => 
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingIngredient(null);
    setNewName('');
    setNewUnit('kg');
    setNewCost(0);
    setIsAddOpen(true);
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setNewName(ingredient.name);
    setNewUnit(ingredient.unit);
    setNewCost(ingredient.costPerUnit || 0);
    setIsAddOpen(true);
  };

  const handleSubmit = () => {
    if (!newName) return;
    
    const ingredientData: Ingredient = {
      id: editingIngredient ? editingIngredient.id : Math.random().toString(36).substr(2, 9),
      name: newName,
      unit: newUnit,
      costPerUnit: typeof newCost === 'string' ? parseFloat(newCost) || 0 : newCost,
      lastUpdated: new Date().toISOString()
    };
    
    if (editingIngredient) {
      onUpdateIngredient(ingredientData);
    } else {
      onAddIngredient(ingredientData);
    }
    
    setIsAddOpen(false);
    setNewName('');
    setNewUnit('kg');
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      onDeleteIngredient(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getIngredientUsage = (id: string) => {
    return recipes.filter(r => r.ingredients.some(ri => ri.ingredientId === id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Catálogo de Ingredientes</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar ingrediente..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdmin && onSeedDatabase && (
            <Button variant="outline" onClick={onSeedDatabase} className="w-full sm:w-auto">
              Actualizar Precios (Ké Va Llevar)
            </Button>
          )}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <Button className="gap-2 w-full sm:w-auto" onClick={openAddDialog}>
              <Plus className="w-4 h-4" /> Nuevo Ingrediente
            </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIngredient ? 'Editar Ingrediente' : 'Agregar Nuevo Ingrediente'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del Ingrediente</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ej. Cebolla Morada" />
              </div>
              <div className="space-y-2">
                <Label>Unidad de Medida</Label>
                <Select value={newUnit} onValueChange={(val: Unit) => setNewUnit(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad">
                      {newUnit === 'kg' ? 'Kilogramo (kg)' :
                       newUnit === 'g' ? 'Gramo (g)' :
                       newUnit === 'lt' ? 'Litro (lt)' :
                       newUnit === 'ml' ? 'Mililitro (ml)' :
                       newUnit === 'pza' ? 'Pieza (pza)' :
                       newUnit === 'manojo' ? 'Manojo' :
                       newUnit === 'pqte' ? 'Paquete (pqte)' :
                       newUnit === 'lata' ? 'Lata' :
                       newUnit === 'frasco' ? 'Frasco' : newUnit}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                    <SelectItem value="g">Gramo (g)</SelectItem>
                    <SelectItem value="lt">Litro (lt)</SelectItem>
                    <SelectItem value="ml">Mililitro (ml)</SelectItem>
                    <SelectItem value="pza">Pieza (pza)</SelectItem>
                    <SelectItem value="manojo">Manojo</SelectItem>
                    <SelectItem value="pqte">Paquete (pqte)</SelectItem>
                    <SelectItem value="lata">Lata</SelectItem>
                    <SelectItem value="frasco">Frasco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Costo por Unidad ($)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={newCost} 
                  onChange={e => setNewCost(e.target.value)} 
                  placeholder="Ej. 125.50" 
                />
                <p className="text-[10px] text-muted-foreground italic">
                  * Costo estimado por {newUnit} (Central de Abastos Ecatepec)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editingIngredient ? 'Actualizar' : 'Guardar'} Ingrediente</Button>
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
                <TableHead>Unidad</TableHead>
                <TableHead>Costo Unit.</TableHead>
                <TableHead>Última Act.</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                    {searchQuery ? 'No se encontraron ingredientes que coincidan con la búsqueda.' : 'No hay ingredientes registrados aún.'}
                  </TableCell>
                </TableRow>
              )}
              {filteredIngredients.map(ingredient => {
                const usage = getIngredientUsage(ingredient.id);
                return (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">
                      {ingredient.name}
                      {usage.length > 0 && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-normal">
                          En uso ({usage.length})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    <TableCell className="font-mono text-sm">
                      ${(ingredient.costPerUnit || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">
                      {ingredient.lastUpdated ? new Date(ingredient.lastUpdated).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(ingredient)} 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeleteConfirmId(ingredient.id)} 
                          className="text-destructive"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              ¿Confirmar eliminación?
            </DialogTitle>
            <DialogDescription className="pt-2">
              {deleteConfirmId && (
                <>
                  Estás a punto de eliminar <strong>{sortedIngredients.find(i => i.id === deleteConfirmId)?.name}</strong>.
                  {getIngredientUsage(deleteConfirmId).length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                      <p className="font-bold mb-1">Advertencia:</p>
                      Este ingrediente se utiliza en las siguientes recetas:
                      <ul className="list-disc list-inside mt-1 opacity-90">
                        {getIngredientUsage(deleteConfirmId).map(r => (
                          <li key={r.id}>{r.name}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs">Al eliminarlo, estas recetas mostrarán el ingrediente como "Desconocido".</p>
                    </div>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar permanentemente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
