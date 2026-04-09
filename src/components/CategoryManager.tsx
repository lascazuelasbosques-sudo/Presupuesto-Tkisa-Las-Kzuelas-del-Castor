import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Category } from '@/src/types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  categories: Category[];
  isAdmin: boolean;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onSeedDatabase: () => void;
}

export function CategoryManager({ categories, isAdmin, onAddCategory, onUpdateCategory, onDeleteCategory, onSeedDatabase }: Props) {
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openAddDialog = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name) return;
    
    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : Math.random().toString(36).substr(2, 9),
      name,
      description
    };
    
    if (editingCategory) {
      onUpdateCategory(categoryData);
    } else {
      onAddCategory(categoryData);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" onClick={onSeedDatabase}>
              Cargar Datos Iniciales
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button className="gap-2" onClick={openAddDialog}>
              <Plus className="w-4 h-4" /> Nueva Categoría
            </Button>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre de la Categoría</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. POLLO, RES, POSTRES" />
              </div>
              <div className="space-y-2">
                <Label>Descripción (Opcional)</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descripción" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editingCategory ? 'Actualizar' : 'Guardar'} Categoría</Button>
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
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">
                    No hay categorías registradas aún.
                  </TableCell>
                </TableRow>
              )}
              {sortedCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteCategory(category.id)} className="text-destructive">
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
