import { Ingredient, Recipe, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'POLLO' },
  { id: 'c2', name: 'RES' },
  { id: 'c3', name: 'PUERCO' },
  { id: 'c4', name: 'INFANTIL' },
  { id: 'c5', name: 'SABORES DE AGUA' },
  { id: 'c6', name: 'OTROS' },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Proteínas
  { id: 'i1', name: 'Pechuga de pollo deshebrada', unit: 'kg', costPerUnit: 125 },
  { id: 'i2', name: 'Pechuga de pollo en cubos', unit: 'kg', costPerUnit: 130 },
  { id: 'i3', name: 'Pollo en piezas', unit: 'kg', costPerUnit: 85 },
  { id: 'i4', name: 'Falda de res para deshebrar', unit: 'kg', costPerUnit: 195 },
  { id: 'i5', name: 'Bistec de res picado', unit: 'kg', costPerUnit: 185 },
  { id: 'i6', name: 'Fajitas de res', unit: 'kg', costPerUnit: 190 },
  { id: 'i7', name: 'Carne molida de res', unit: 'kg', costPerUnit: 175 },
  { id: 'i8', name: 'Chicharrón seco', unit: 'kg', costPerUnit: 280 },
  { id: 'i9', name: 'Chorizo de cerdo', unit: 'kg', costPerUnit: 110 },
  { id: 'i10', name: 'Carne molida de puerco', unit: 'kg', costPerUnit: 105 },
  { id: 'i11', name: 'Costilla de cerdo', unit: 'kg', costPerUnit: 125 },
  { id: 'i12', name: 'Carne de cerdo en trozos', unit: 'kg', costPerUnit: 115 },
  { id: 'i13', name: 'Salchicha de pavo', unit: 'pqte', costPerUnit: 65 },
  { id: 'i14', name: 'Jamón de pavo', unit: 'kg', costPerUnit: 140 },
  { id: 'i15', name: 'Huevo de gallina', unit: 'pza', costPerUnit: 3.5 },
  { id: 'i16', name: 'Longaniza', unit: 'kg', costPerUnit: 115 },
  { id: 'i17', name: 'Nuggets de pollo', unit: 'pqte', costPerUnit: 85 },
  
  // Vegetales y Frutas
  { id: 'i18', name: 'Jitomate', unit: 'kg', costPerUnit: 32 },
  { id: 'i19', name: 'Cebolla blanca', unit: 'kg', costPerUnit: 22 },
  { id: 'i20', name: 'Chile pimiento morrón', unit: 'pza', costPerUnit: 12 },
  { id: 'i21', name: 'Tomate verde', unit: 'kg', costPerUnit: 28 },
  { id: 'i22', name: 'Chile serrano', unit: 'pza', costPerUnit: 1.5 },
  { id: 'i23', name: 'Cilantro fresco', unit: 'manojo', costPerUnit: 15 },
  { id: 'i24', name: 'Ajo', unit: 'pza', costPerUnit: 8 },
  { id: 'i25', name: 'Papa blanca', unit: 'kg', costPerUnit: 26 },
  { id: 'i26', name: 'Zanahoria', unit: 'kg', costPerUnit: 18 },
  { id: 'i27', name: 'Chícharos', unit: 'kg', costPerUnit: 45 },
  { id: 'i28', name: 'Nopales picados', unit: 'kg', costPerUnit: 35 },
  { id: 'i29', name: 'Chile poblano tatemado', unit: 'kg', costPerUnit: 65 },
  { id: 'i30', name: 'Granos de elote', unit: 'kg', costPerUnit: 55 },
  { id: 'i31', name: 'Piña en almíbar', unit: 'pza', costPerUnit: 48 },
  { id: 'i32', name: 'Limón', unit: 'kg', costPerUnit: 38 },
  
  // Abarrotes y Condimentos
  { id: 'i33', name: 'Chile chipotle en adobo', unit: 'lata', costPerUnit: 25 },
  { id: 'i34', name: 'Aceite vegetal', unit: 'lt', costPerUnit: 42 },
  { id: 'i35', name: 'Tocino', unit: 'kg', costPerUnit: 180 },
  { id: 'i36', name: 'Queso tipo manchego', unit: 'kg', costPerUnit: 165 },
  { id: 'i37', name: 'Pasta de mole poblano', unit: 'g', costPerUnit: 0.18 },
  { id: 'i38', name: 'Caldo de pollo', unit: 'lt', costPerUnit: 15 },
  { id: 'i39', name: 'Chocolate de mesa', unit: 'pza', costPerUnit: 12 },
  { id: 'i40', name: 'Ajonjolí', unit: 'g', costPerUnit: 0.12 },
  { id: 'i41', name: 'Chile morita', unit: 'g', costPerUnit: 0.45 },
  { id: 'i42', name: 'Chile guajillo', unit: 'g', costPerUnit: 0.35 },
  { id: 'i43', name: 'Caldillo de jitomate', unit: 'ml', costPerUnit: 0.05 },
  { id: 'i44', name: 'Salsa cátsup', unit: 'frasco', costPerUnit: 35 },
  { id: 'i45', name: 'Crema ácida', unit: 'lt', costPerUnit: 65 },
  { id: 'i46', name: 'Mostaza', unit: 'frasco', costPerUnit: 28 },
  { id: 'i47', name: 'Mayonesa', unit: 'frasco', costPerUnit: 45 },
  { id: 'i48', name: 'Pan para hot dog', unit: 'pqte', costPerUnit: 42 },
  { id: 'i49', name: 'Pasta corta', unit: 'pqte', costPerUnit: 18 },
  { id: 'i50', name: 'Mantequilla', unit: 'g', costPerUnit: 0.25 },
  { id: 'i51', name: 'Flor de jamaica', unit: 'g', costPerUnit: 0.28 },
  { id: 'i52', name: 'Agua', unit: 'lt', costPerUnit: 2 },
  { id: 'i53', name: 'Azúcar', unit: 'kg', costPerUnit: 32 },
  { id: 'i54', name: 'Semillas de chía', unit: 'g', costPerUnit: 0.15 },
  { id: 'i55', name: 'Pulpa de tamarindo natural', unit: 'g', costPerUnit: 0.12 },
  
  // Nuevos ingredientes
  { id: 'i56', name: 'Carne molida de res y cerdo', unit: 'kg', costPerUnit: 145 },
  { id: 'i57', name: 'Sal de grano', unit: 'kg', costPerUnit: 12 },
  { id: 'i58', name: 'Pimienta negra molida', unit: 'g', costPerUnit: 0.85 },
  { id: 'i59', name: 'Bolillo o teleras', unit: 'pza', costPerUnit: 4.5 },
];

export const INITIAL_RECIPES: Recipe[] = [
  // POLLO
  {
    id: 'p1',
    name: 'Tinga',
    categoryId: 'c1',
    ingredients: [
      { ingredientId: 'i1', amountPerKg: 1 },
      { ingredientId: 'i18', amountPerKg: 0.8 },
      { ingredientId: 'i19', amountPerKg: 0.5 },
      { ingredientId: 'i33', amountPerKg: 0.1 },
      { ingredientId: 'i34', amountPerKg: 50 },
    ]
  },
  {
    id: 'p2',
    name: 'Alambre',
    categoryId: 'c1',
    ingredients: [
      { ingredientId: 'i2', amountPerKg: 1 },
      { ingredientId: 'i20', amountPerKg: 3 },
      { ingredientId: 'i19', amountPerKg: 0.2 },
      { ingredientId: 'i35', amountPerKg: 0.2 },
      { ingredientId: 'i36', amountPerKg: 0.25 },
    ]
  },
  {
    id: 'p3',
    name: 'Mole con pollo',
    categoryId: 'c1',
    ingredients: [
      { ingredientId: 'i3', amountPerKg: 1 },
      { ingredientId: 'i37', amountPerKg: 0.25 },
      { ingredientId: 'i38', amountPerKg: 1 },
      { ingredientId: 'i39', amountPerKg: 1 },
      { ingredientId: 'i40', amountPerKg: 0.05 },
    ]
  },

  // RES
  {
    id: 'r1',
    name: 'Tinga',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i4', amountPerKg: 1 },
      { ingredientId: 'i19', amountPerKg: 0.6 },
      { ingredientId: 'i18', amountPerKg: 0.6 },
      { ingredientId: 'i33', amountPerKg: 0.05 },
    ]
  },
  {
    id: 'r2',
    name: 'Alambre',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i5', amountPerKg: 1 },
      { ingredientId: 'i20', amountPerKg: 3 },
      { ingredientId: 'i19', amountPerKg: 0.2 },
      { ingredientId: 'i35', amountPerKg: 0.2 },
      { ingredientId: 'i36', amountPerKg: 0.25 },
    ]
  },
  {
    id: 'r3',
    name: 'Bistec a la mexicana',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i5', amountPerKg: 1 },
      { ingredientId: 'i18', amountPerKg: 0.5 },
      { ingredientId: 'i19', amountPerKg: 0.25 },
      { ingredientId: 'i22', amountPerKg: 3 },
      { ingredientId: 'i23', amountPerKg: 1 },
    ]
  },
  {
    id: 'r4',
    name: 'Bistec encebollado',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i5', amountPerKg: 1 },
      { ingredientId: 'i19', amountPerKg: 0.4 },
      { ingredientId: 'i24', amountPerKg: 2 },
      { ingredientId: 'i34', amountPerKg: 50 },
    ]
  },
  {
    id: 'r5',
    name: 'Fajitas de res en salsa verde',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i6', amountPerKg: 1 },
      { ingredientId: 'i21', amountPerKg: 0.8 },
      { ingredientId: 'i22', amountPerKg: 4 },
      { ingredientId: 'i23', amountPerKg: 1 },
      { ingredientId: 'i24', amountPerKg: 2 },
    ]
  },
  {
    id: 'r6',
    name: 'Bistec en salsa verde con papas',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i5', amountPerKg: 1 },
      { ingredientId: 'i25', amountPerKg: 0.5 },
      { ingredientId: 'i21', amountPerKg: 0.7 },
      { ingredientId: 'i22', amountPerKg: 3 },
      { ingredientId: 'i19', amountPerKg: 0.1 },
    ]
  },
  {
    id: 'r7',
    name: 'Picadillo',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i7', amountPerKg: 1 },
      { ingredientId: 'i25', amountPerKg: 0.3 },
      { ingredientId: 'i26', amountPerKg: 0.3 },
      { ingredientId: 'i18', amountPerKg: 0.4 },
      { ingredientId: 'i27', amountPerKg: 0.1 },
    ]
  },
  {
    id: 'r8',
    name: 'Bistec en chile morita y nopales',
    categoryId: 'c2',
    ingredients: [
      { ingredientId: 'i5', amountPerKg: 1 },
      { ingredientId: 'i41', amountPerKg: 6 },
      { ingredientId: 'i28', amountPerKg: 0.5 },
      { ingredientId: 'i21', amountPerKg: 0.4 },
      { ingredientId: 'i24', amountPerKg: 2 },
    ]
  },

  // PUERCO
  {
    id: 'pu1',
    name: 'Chicharrón en salsa verde',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i8', amountPerKg: 0.25 },
      { ingredientId: 'i21', amountPerKg: 1 },
      { ingredientId: 'i19', amountPerKg: 0.1 },
      { ingredientId: 'i23', amountPerKg: 1 },
    ]
  },
  {
    id: 'pu1b',
    name: 'Chicharrón en salsa roja',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i8', amountPerKg: 0.25 },
      { ingredientId: 'i18', amountPerKg: 1 },
      { ingredientId: 'i42', amountPerKg: 0.05 },
      { ingredientId: 'i19', amountPerKg: 0.1 },
    ]
  },
  {
    id: 'pu2',
    name: 'Chorizo con papas',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i9', amountPerKg: 0.5 },
      { ingredientId: 'i25', amountPerKg: 1 },
      { ingredientId: 'i19', amountPerKg: 0.1 },
      { ingredientId: 'i34', amountPerKg: 30 },
    ]
  },
  {
    id: 'pu3',
    name: 'Chorizo con nopales',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i9', amountPerKg: 0.5 },
      { ingredientId: 'i28', amountPerKg: 1 },
      { ingredientId: 'i19', amountPerKg: 0.1 },
    ]
  },
  {
    id: 'pu4',
    name: 'Picadillo',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i10', amountPerKg: 1 },
      { ingredientId: 'i25', amountPerKg: 0.3 },
      { ingredientId: 'i26', amountPerKg: 0.3 },
      { ingredientId: 'i43', amountPerKg: 500 },
    ]
  },
  {
    id: 'pu5',
    name: 'Costillitas en salsa morita y nopales',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i11', amountPerKg: 1 },
      { ingredientId: 'i41', amountPerKg: 8 },
      { ingredientId: 'i28', amountPerKg: 0.5 },
      { ingredientId: 'i21', amountPerKg: 0.5 },
      { ingredientId: 'i24', amountPerKg: 2 },
    ]
  },
  {
    id: 'pu6',
    name: 'Entomatado',
    categoryId: 'c3',
    ingredients: [
      { ingredientId: 'i12', amountPerKg: 1 },
      { ingredientId: 'i21', amountPerKg: 1.5 },
      { ingredientId: 'i19', amountPerKg: 0.5 },
      { ingredientId: 'i33', amountPerKg: 0.02 },
    ]
  },

  // OTROS
  {
    id: 'o1',
    name: 'Salchichas a la mexicana',
    categoryId: 'c6',
    ingredients: [
      { ingredientId: 'i13', amountPerKg: 1 },
      { ingredientId: 'i18', amountPerKg: 0.4 },
      { ingredientId: 'i19', amountPerKg: 0.2 },
      { ingredientId: 'i22', amountPerKg: 2 },
    ]
  },
  {
    id: 'o2',
    name: 'Salchichas a la hawaiana',
    categoryId: 'c6',
    ingredients: [
      { ingredientId: 'i13', amountPerKg: 1 },
      { ingredientId: 'i31', amountPerKg: 1 },
      { ingredientId: 'i14', amountPerKg: 0.2 },
      { ingredientId: 'i44', amountPerKg: 200 },
    ]
  },
  {
    id: 'o3',
    name: 'Huevo en salsa verde',
    categoryId: 'c6',
    ingredients: [
      { ingredientId: 'i15', amountPerKg: 12 },
      { ingredientId: 'i21', amountPerKg: 1 },
      { ingredientId: 'i22', amountPerKg: 4 },
      { ingredientId: 'i23', amountPerKg: 1 },
    ]
  },
  {
    id: 'o4',
    name: 'Huevo ahogado en salsa verde con longaniza',
    categoryId: 'c6',
    ingredients: [
      { ingredientId: 'i15', amountPerKg: 12 },
      { ingredientId: 'i16', amountPerKg: 0.3 },
      { ingredientId: 'i21', amountPerKg: 1 },
      { ingredientId: 'i22', amountPerKg: 3 },
    ]
  },
  {
    id: 'o5',
    name: 'Rajas con crema',
    categoryId: 'c6',
    ingredients: [
      { ingredientId: 'i29', amountPerKg: 1 },
      { ingredientId: 'i45', amountPerKg: 500 },
      { ingredientId: 'i30', amountPerKg: 0.25 },
      { ingredientId: 'i19', amountPerKg: 0.2 },
    ]
  },

  // INFANTIL
  {
    id: 'i1',
    name: 'Nuggets',
    categoryId: 'c4',
    ingredients: [
      { ingredientId: 'i17', amountPerKg: 1 },
      { ingredientId: 'i34', amountPerKg: 0.25 },
    ]
  },
  {
    id: 'i2',
    name: 'Hot dogs',
    categoryId: 'c4',
    ingredients: [
      { ingredientId: 'i13', amountPerKg: 1 },
      { ingredientId: 'i48', amountPerKg: 1 },
      { ingredientId: 'i44', amountPerKg: 0.2 },
      { ingredientId: 'i46', amountPerKg: 0.1 },
      { ingredientId: 'i47', amountPerKg: 0.2 },
    ]
  },
  {
    id: 'i3',
    name: 'Pasta con crema y trozos de jamón',
    categoryId: 'c4',
    ingredients: [
      { ingredientId: 'i49', amountPerKg: 1 },
      { ingredientId: 'i45', amountPerKg: 0.25 },
      { ingredientId: 'i14', amountPerKg: 0.15 },
      { ingredientId: 'i50', amountPerKg: 30 },
    ]
  },

  // SABORES DE AGUA (Cantidades por 1 Litro)
  {
    id: 'a1',
    name: 'Agua de Jamaica (1L)',
    categoryId: 'c5',
    ingredients: [
      { ingredientId: 'i51', amountPerKg: 0.025 },
      { ingredientId: 'i52', amountPerKg: 1 },
      { ingredientId: 'i53', amountPerKg: 0.0625 },
    ]
  },
  {
    id: 'a2',
    name: 'Agua de Limón con Chía (1L)',
    categoryId: 'c5',
    ingredients: [
      { ingredientId: 'i32', amountPerKg: 0.125 },
      { ingredientId: 'i54', amountPerKg: 0.0125 },
      { ingredientId: 'i52', amountPerKg: 1 },
      { ingredientId: 'i53', amountPerKg: 0.0625 },
    ]
  },
  {
    id: 'a3',
    name: 'Agua de Tamarindo (1L)',
    categoryId: 'c5',
    ingredients: [
      { ingredientId: 'i55', amountPerKg: 0.075 },
      { ingredientId: 'i52', amountPerKg: 1 },
      { ingredientId: 'i53', amountPerKg: 0.075 },
    ]
  },
];

export const CALCULATIONS = {
  TACOS_PER_PERSON: 5,
  GRAMS_PER_TACO: 75,
  KG_PER_PERSON: 0.375,
};
