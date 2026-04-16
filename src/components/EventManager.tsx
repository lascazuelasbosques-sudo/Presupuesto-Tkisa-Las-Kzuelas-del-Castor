import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Recipe, Ingredient, Quote, QuoteItem, Category } from '@/src/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateIngredientsForKg, getIngredientDetails } from '@/src/lib/calculations';
import { Calendar, User, Trash2, Printer, Plus, AlertTriangle, FileText, Search } from 'lucide-react';

interface Props {
  quotes: Quote[];
  recipes: Recipe[];
  ingredients: Ingredient[];
  categories: Category[];
  onAddQuote: (quote: Omit<Quote, 'id' | 'userId'>) => void;
  onUpdateQuote?: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  userEmail?: string;
}

export function EventManager({ quotes, recipes, ingredients, categories, onAddQuote, onUpdateQuote, onDeleteQuote, userEmail }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [eventName, setEventName] = useState('');
  const [clientName, setClientName] = useState('');
  const [salesperson, setSalesperson] = useState(userEmail || '');
  const [date, setDate] = useState('');
  const [peopleCount, setPeopleCount] = useState<number | string>(50);
  const [items, setItems] = useState<{recipeId: string, kg: string | number}[]>([]);

  const handleEditClick = (quote: Quote) => {
    setEditingQuoteId(quote.id);
    setEventName(quote.eventName);
    setClientName(quote.clientName);
    setSalesperson(quote.salesperson);
    setDate(quote.date);
    setPeopleCount(quote.peopleCount);
    setItems(quote.items.map(i => ({ ...i })));
    setIsAddOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { recipeId: '', kg: 0 }]);
  };

  const handleItemChange = (index: number, field: 'recipeId' | 'kg', value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateItemCost = (recipeId: string, kg: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !kg) return 0;
    const calculatedIngredients = calculateIngredientsForKg(recipe, kg);
    return calculatedIngredients.reduce((sum, item) => {
      const details = getIngredientDetails(item.ingredientId, ingredients);
      return sum + (details ? (details.costPerUnit || 0) * item.totalAmount : 0);
    }, 0);
  };

  const handleSave = () => {
    if (!eventName || !clientName) return;

    const validItems = items.filter(i => i.recipeId && typeof i.kg === 'number' && i.kg > 0) as QuoteItem[];
    
    let totalCost = 0;
    validItems.forEach(item => {
      totalCost += calculateItemCost(item.recipeId, item.kg);
    });

    if (editingQuoteId && onUpdateQuote) {
      const existingQuote = quotes.find(q => q.id === editingQuoteId);
      if (existingQuote) {
        onUpdateQuote({
          ...existingQuote,
          eventName,
          clientName,
          salesperson,
          date,
          peopleCount: typeof peopleCount === 'string' ? parseInt(peopleCount) || 0 : peopleCount,
          items: validItems,
          totalCost
        });
      }
    } else {
      onAddQuote({
        eventName,
        clientName,
        salesperson,
        date,
        createdAt: new Date().toISOString(),
        peopleCount: typeof peopleCount === 'string' ? parseInt(peopleCount) || 0 : peopleCount,
        items: validItems,
        totalCost
      });
    }

    setIsAddOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingQuoteId(null);
    setEventName('');
    setClientName('');
    setSalesperson(userEmail || '');
    setDate('');
    setPeopleCount(50);
    setItems([]);
  };

  // Helper object to consolidate ingredients for the event across all selected recipes
  const consolidatedIngredients = React.useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(item => {
      const recipe = recipes.find(r => r.id === item.recipeId);
      if (recipe && typeof item.kg === 'number' && item.kg > 0) {
        const reqs = calculateIngredientsForKg(recipe, item.kg);
        reqs.forEach(req => {
          map.set(req.ingredientId, (map.get(req.ingredientId) || 0) + req.totalAmount);
        });
      }
    });
    
    return Array.from(map.entries())
      .map(([id, amount]) => ({ ingredientId: id, totalAmount: amount }))
      .sort((a,b) => {
        const nameA = getIngredientDetails(a.ingredientId, ingredients)?.name || '';
        const nameB = getIngredientDetails(b.ingredientId, ingredients)?.name || '';
        return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
      });
  }, [items, recipes, ingredients]);

  const handlePrint = (quote: Quote) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let itemsHtml = '';
    quote.items.forEach(item => {
      const recipe = recipes.find(r => r.id === item.recipeId);
      const cost = calculateItemCost(item.recipeId, item.kg);
      itemsHtml += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${recipe?.name || 'Guisado'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.kg} kg</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    });

    const html = `
      <html>
        <head>
          <title>Cotización - ${quote.eventName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #333; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #f97316; margin-bottom: 5px; }
            .header { border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; }
            table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f9fafb; padding: 10px 8px; text-align: left; border-bottom: 2px solid #eee; }
            .total { font-size: 1.5em; font-weight: bold; text-align: right; margin-top: 20px; color: #f97316; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Taquiza Master</h1>
            <p>Cotización de Evento / Banquete</p>
          </div>
          
          <div class="details">
            <div>
              <strong>Evento:</strong> ${quote.eventName}<br/>
              <strong>Cliente:</strong> ${quote.clientName}<br/>
              <strong>Personas:</strong> ${quote.peopleCount}
            </div>
            <div>
              <strong>Fecha del Evento:</strong> ${quote.date || 'Por definir'}<br/>
              <strong>Atendido por:</strong> ${quote.salesperson}<br/>
              <strong>Fecha de Cotización:</strong> ${new Date(quote.createdAt).toLocaleDateString()}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Guisado</th>
                <th style="text-align: right;">Cantidad</th>
                <th style="text-align: right;">Costo (Insumos)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total">
            Costo Total de Insumos: $${quote.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
          
          <p style="margin-top: 50px; font-size: 0.9em; color: #666; text-align: center;">
            * Esta cotización incluye únicamente el costo estimado de los insumos.
          </p>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = quotes.filter(q => 
    q.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Eventos y Cotizaciones
        </h2>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Evento
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <Label htmlFor="search-events" className="sr-only">Buscar eventos</Label>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              id="search-events"
              placeholder="Buscar por nombre de evento o cliente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Personas</TableHead>
                <TableHead className="text-right">Costo Insumos</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map(quote => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.eventName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="w-3 h-3" /> {quote.clientName}
                    </div>
                  </TableCell>
                  <TableCell>{quote.date || <span className="text-muted-foreground italic">Por definir</span>}</TableCell>
                  <TableCell className="text-right">{quote.peopleCount}</TableCell>
                  <TableCell className="text-right text-primary font-bold">
                    ${quote.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handlePrint(quote)} title="Imprimir">
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditClick(quote)} title="Editar">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteConfirmId(quote.id)} title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredQuotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                    {quotes.length === 0 
                      ? 'No hay eventos o cotizaciones guardadas. Crea uno nuevo para empezar.' 
                      : 'No se encontraron resultados para tu búsqueda.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={(open) => {
        setIsAddOpen(open);
        if(!open) resetForm();
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Cotización de Evento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Evento (Ej. Boda de Carlos y Ana)</Label>
                <Input value={eventName} onChange={e => setEventName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nombre del Cliente</Label>
                <Input value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fecha del Evento</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Atendido por (Responsable)</Label>
                <Input value={salesperson} onChange={e => setSalesperson(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Número de Comensales</Label>
                <Input type="number" min="1" value={peopleCount} onChange={e => setPeopleCount(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Guisados</Label>
                <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-1">
                  <Plus className="w-4 h-4" /> Agregar Guisado
                </Button>
              </div>

              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4 border border-dashed rounded-md">
                  No hay guisados seleccionados. Haz clic en "Agregar Guisado".
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const recipe = recipes.find(r => r.id === item.recipeId);
                    
                    return (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-muted/20 border p-3 rounded-lg shadow-sm">
                        <div className="flex-1 w-full">
                          <Select 
                            value={item.recipeId} 
                            onValueChange={(val) => handleItemChange(index, 'recipeId', val)}
                          >
                            <SelectTrigger className="w-full bg-background font-semibold">
                              <SelectValue placeholder="Selecciona guisado">
                                {recipe?.name || "Selecciona guisado"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {[...recipes]
                                .sort((a,b) => a.name.localeCompare(b.name))
                                .map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="w-full sm:w-auto flex items-center gap-2">
                          <div className="relative w-full sm:w-32">
                            <Input 
                              type="number" 
                              step="0.1" 
                              min="0.1" 
                              className="bg-background"
                              value={item.kg || ''} 
                              placeholder="Kilos"
                              onChange={e => handleItemChange(index, 'kg', parseFloat(e.target.value) || 0)}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive sm:hidden" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hidden sm:flex" onClick={() => handleRemoveItem(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                  
                  {/* End Items Mapping */}
                  <div className="border-t border-primary/20 pt-6 mt-6"></div>

                  {consolidatedIngredients.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-dashed">
                      <Label className="text-lg font-semibold block mb-4">Ingredientes Necesarios (Para todos los guisados seleccionados)</Label>
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ingrediente</TableHead>
                              <TableHead className="text-right">Cantidad</TableHead>
                              <TableHead>Unidad</TableHead>
                              <TableHead className="text-right border-l">Costo Est.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {consolidatedIngredients.map(item => {
                              const details = getIngredientDetails(item.ingredientId, ingredients);
                              const itemCost = (details?.costPerUnit || 0) * item.totalAmount;
                              return (
                                <TableRow key={item.ingredientId}>
                                  <TableCell className="font-medium whitespace-nowrap">{details?.name || 'Desconocido'}</TableCell>
                                  <TableCell className="text-right">{item.totalAmount.toLocaleString()}</TableCell>
                                  <TableCell>{details?.unit || '-'}</TableCell>
                                  <TableCell className="text-right text-primary font-mono border-l">
                                    ${itemCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow className="bg-muted/50 font-bold">
                              <TableCell colSpan={3} className="text-right uppercase tracking-wider text-muted-foreground text-xs">
                                Subtotal de Insumos:
                              </TableCell>
                              <TableCell className="text-right text-primary text-base font-mono border-l">
                                ${items.reduce((sum, item) => sum + calculateItemCost(item.recipeId, typeof item.kg === 'number' ? item.kg : 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!eventName || !clientName}>Guardar Cotización</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              ¿Confirmar eliminación?
            </DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar este evento. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => {
              if (deleteConfirmId) onDeleteQuote(deleteConfirmId);
              setDeleteConfirmId(null);
            }}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
