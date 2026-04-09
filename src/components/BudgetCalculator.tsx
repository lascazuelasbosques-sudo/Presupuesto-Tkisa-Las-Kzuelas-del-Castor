import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CALCULATIONS } from '@/src/constants';
import { calculateKgForPeople, calculatePeopleForKg } from '@/src/lib/calculations';
import { Users, UtensilsCrossed } from 'lucide-react';

export function BudgetCalculator() {
  const [people, setPeople] = useState<number | string>(50);
  const [totalKg, setTotalKg] = useState<number | string>(calculateKgForPeople(50));

  const numericPeople = typeof people === 'string' ? parseInt(people) || 0 : people;
  const numericKg = typeof totalKg === 'string' ? parseFloat(totalKg) || 0 : totalKg;

  const handlePeopleChange = (val: string) => {
    setPeople(val);
    const num = parseInt(val) || 0;
    setTotalKg(calculateKgForPeople(num).toFixed(2));
  };

  const handleKgChange = (val: string) => {
    setTotalKg(val);
    const num = parseFloat(val) || 0;
    setPeople(Math.round(calculatePeopleForKg(num)));
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Cálculo de Comensales
          </CardTitle>
          <CardDescription>
            Calcula cuántos kilos necesitas según el número de personas, o viceversa.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="people">Número de Personas</Label>
                <div className="relative">
                  <Input 
                    id="people" 
                    type="number" 
                    min="1" 
                    value={people} 
                    onChange={(e) => handlePeopleChange(e.target.value)}
                    onFocus={(e) => { if (numericPeople === 0) setPeople(''); }}
                    onBlur={(e) => { if (people === '') setPeople(0); }}
                    className="pl-10 text-lg h-12"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                * Basado en un promedio de {CALCULATIONS.TACOS_PER_PERSON} tacos por persona ({CALCULATIONS.KG_PER_PERSON * 1000}g de guisado total, considerando guarniciones).
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalKg">Kilos Totales de Guisado</Label>
              <div className="relative">
                <Input 
                  id="totalKg" 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  value={totalKg} 
                  onChange={(e) => handleKgChange(e.target.value)}
                  onFocus={(e) => { if (numericKg === 0) setTotalKg(''); }}
                  onBlur={(e) => { if (totalKg === '') setTotalKg(0); }}
                  className="pl-10 text-lg h-12"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">kg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">Tacos Totales</p>
            <p className="text-3xl font-bold mt-1">{numericPeople * CALCULATIONS.TACOS_PER_PERSON}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Gramos por Persona</p>
            <p className="text-3xl font-bold mt-1">{CALCULATIONS.KG_PER_PERSON * 1000}g</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-secondary">
          <CardContent className="pt-6 text-center">
            <p className="text-sm font-medium text-foreground uppercase tracking-wider">Kilos por Persona</p>
            <p className="text-3xl font-bold mt-1">{CALCULATIONS.KG_PER_PERSON}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
