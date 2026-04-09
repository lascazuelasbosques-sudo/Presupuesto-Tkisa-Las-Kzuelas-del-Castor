import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientCalculator } from './components/IngredientCalculator';
import { BudgetCalculator } from './components/BudgetCalculator';
import { RecipeManager } from './components/RecipeManager';
import { IngredientManager } from './components/IngredientManager';
import { CategoryManager } from './components/CategoryManager';
import { INITIAL_INGREDIENTS, INITIAL_RECIPES, INITIAL_CATEGORIES } from './constants';
import { Recipe, Ingredient, Category } from './types';
import { Utensils, Calculator, BookOpen, Package, ChefHat, LogIn, LogOut, User, Tags } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDocFromServer, updateDoc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | undefined | null;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | undefined | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calc');

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    
    if (error.code === 'permission-denied') {
      toast.error('Permiso denegado en Firestore. Verifica que seas administrador.');
    } else {
      toast.error('Error en la base de datos: ' + (error.message || 'Error desconocido'));
    }
    
    throw new Error(JSON.stringify(errInfo));
  };

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRecipes(INITIAL_RECIPES);
      setIngredients(INITIAL_INGREDIENTS);
      setCategories(INITIAL_CATEGORIES);
      return;
    }

    const unsubRecipes = onSnapshot(collection(db, 'recipes'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
      setRecipes(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recipes');
    });

    const unsubIngredients = onSnapshot(collection(db, 'ingredients'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
      setIngredients(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ingredients');
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });

    return () => {
      unsubRecipes();
      unsubIngredients();
      unsubCategories();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success('Sesión iniciada correctamente');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('Dominio no autorizado. Debes agregar este dominio en la consola de Firebase (Authentication > Settings > Authorized Domains).');
      } else {
        toast.error('Error al iniciar sesión: ' + (error.message || 'Error desconocido'));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleAddRecipe = async (recipe: Recipe) => {
    if (!user) {
      setRecipes([...recipes, recipe]);
      toast.success('Receta guardada localmente (Inicia sesión para persistir)');
      return;
    }
    try {
      const { id, ...data } = recipe;
      await addDoc(collection(db, 'recipes'), data);
      toast.success('Receta guardada en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'recipes');
    }
  };

  const handleUpdateRecipe = async (recipe: Recipe) => {
    if (!user) {
      setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
      toast.success('Receta actualizada localmente');
      return;
    }
    try {
      const { id, ...data } = recipe;
      await updateDoc(doc(db, 'recipes', id), data);
      toast.success('Receta actualizada en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `recipes/${recipe.id}`);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!user) {
      setRecipes(recipes.filter(r => r.id !== id));
      toast.info('Receta eliminada localmente');
      return;
    }
    try {
      await deleteDoc(doc(db, 'recipes', id));
      toast.success('Receta eliminada de la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recipes/${id}`);
    }
  };

  const handleAddIngredient = async (ingredient: Ingredient) => {
    if (!user) {
      setIngredients([...ingredients, ingredient]);
      toast.success('Ingrediente agregado localmente');
      return;
    }
    try {
      const { id, ...data } = ingredient;
      await addDoc(collection(db, 'ingredients'), data);
      toast.success('Ingrediente guardado en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'ingredients');
    }
  };

  const handleUpdateIngredient = async (ingredient: Ingredient) => {
    if (!user) {
      setIngredients(ingredients.map(i => i.id === ingredient.id ? ingredient : i));
      toast.success('Ingrediente actualizado localmente');
      return;
    }
    try {
      const { id, ...data } = ingredient;
      await updateDoc(doc(db, 'ingredients', id), data);
      toast.success('Ingrediente actualizado en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `ingredients/${ingredient.id}`);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!user) {
      setIngredients(ingredients.filter(i => i.id !== id));
      toast.info('Ingrediente eliminado localmente');
      return;
    }
    try {
      await deleteDoc(doc(db, 'ingredients', id));
      toast.success('Ingrediente eliminado de la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ingredients/${id}`);
    }
  };

  const handleAddCategory = async (category: Category) => {
    if (!user) {
      setCategories([...categories, category]);
      toast.success('Categoría agregada localmente');
      return;
    }
    try {
      const { id, ...data } = category;
      await addDoc(collection(db, 'categories'), data);
      toast.success('Categoría guardada en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    if (!user) {
      setCategories(categories.map(c => c.id === category.id ? category : c));
      toast.success('Categoría actualizada localmente');
      return;
    }
    try {
      const { id, ...data } = category;
      await updateDoc(doc(db, 'categories', id), data);
      toast.success('Categoría actualizada en la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${category.id}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const isUsed = recipes.some(r => r.categoryId === id);
    if (isUsed) {
      toast.error('No se puede eliminar: la categoría está en uso');
      return;
    }

    if (!user) {
      setCategories(categories.filter(c => c.id !== id));
      toast.info('Categoría eliminada localmente');
      return;
    }
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Categoría eliminada de la nube');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const handleSeedDatabase = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para cargar datos en la nube');
      return;
    }

    const isAdmin = user.email === "lascazuelasbosques@gmail.com";
    if (!isAdmin) {
      toast.error('No tienes permisos de administrador');
      return;
    }

    const toastId = toast.loading('Sincronizando precios con Central en Línea...');

    try {
      const batch = writeBatch(db);
      
      // Fetch all current ingredients to do a case-insensitive comparison
      const currentIngsSnapshot = await getDocs(collection(db, 'ingredients'));
      const currentIngs = currentIngsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name?.toLowerCase().trim(),
        ref: doc.ref
      }));

      // Fetch all current categories
      const currentCatsSnapshot = await getDocs(collection(db, 'categories'));
      const currentCats = currentCatsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name?.toLowerCase().trim(),
        ref: doc.ref
      }));

      // Seed Categories
      for (const cat of INITIAL_CATEGORIES) {
        const normalizedName = cat.name.toLowerCase().trim();
        const existingCat = currentCats.find(c => c.name === normalizedName);
        
        if (!existingCat) {
          const { id, ...data } = cat;
          const newDocRef = doc(collection(db, 'categories'));
          batch.set(newDocRef, data);
        }
      }

      // Seed Ingredients with Force Update
      let updatedCount = 0;
      let addedCount = 0;

      for (const ing of INITIAL_INGREDIENTS) {
        const normalizedName = ing.name.toLowerCase().trim();
        const existingIng = currentIngs.find(i => i.name === normalizedName);
        
        const ingredientData = {
          name: ing.name,
          unit: ing.unit,
          costPerUnit: ing.costPerUnit,
          lastUpdated: new Date().toISOString()
        };

        if (existingIng) {
          // Update existing ingredient
          batch.update(existingIng.ref, ingredientData);
          updatedCount++;
        } else {
          // Add new ingredient
          const newDocRef = doc(collection(db, 'ingredients'));
          batch.set(newDocRef, ingredientData);
          addedCount++;
        }
      }

      await batch.commit();
      toast.success(`Sincronización completa: ${updatedCount} actualizados, ${addedCount} nuevos.`, { id: toastId });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8 px-4 shadow-lg mb-8 relative">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs opacity-80">Bienvenido</p>
                <p className="text-sm font-bold">{user.displayName}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" /> Salir
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleLogin} className="gap-2">
              <LogIn className="w-4 h-4" /> Iniciar Sesión
            </Button>
          )}
        </div>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-2">
          <div className="bg-white/20 p-3 rounded-full mb-2">
            <ChefHat className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Taquiza Master</h1>
          <p className="text-primary-foreground/80 max-w-md italic">
            "El arte de calcular el sabor por kilo"
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8 h-auto p-1 bg-secondary/30 rounded-xl">
            <TabsTrigger value="calc" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Ingredientes</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Presupuestos</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Recetario</span>
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Insumos</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Tags className="w-4 h-4" />
              <span className="hidden sm:inline">Categorías</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="calc" className="mt-0">
                <IngredientCalculator recipes={recipes} ingredients={ingredients} categories={categories} />
              </TabsContent>
              <TabsContent value="budget" className="mt-0">
                <BudgetCalculator />
              </TabsContent>
              <TabsContent value="recipes" className="mt-0">
                <RecipeManager 
                  recipes={recipes} 
                  ingredients={ingredients} 
                  categories={categories}
                  onAddRecipe={handleAddRecipe}
                  onUpdateRecipe={handleUpdateRecipe}
                  onDeleteRecipe={handleDeleteRecipe}
                />
              </TabsContent>
              <TabsContent value="ingredients" className="mt-0">
                <IngredientManager 
                  ingredients={ingredients} 
                  recipes={recipes}
                  isAdmin={user?.email === "lascazuelasbosques@gmail.com"}
                  onAddIngredient={handleAddIngredient}
                  onUpdateIngredient={handleUpdateIngredient}
                  onDeleteIngredient={handleDeleteIngredient}
                  onSeedDatabase={handleSeedDatabase}
                />
              </TabsContent>
              <TabsContent value="categories" className="mt-0">
                <CategoryManager 
                  categories={categories}
                  isAdmin={user?.email === "lascazuelasbosques@gmail.com"}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="mt-20 py-8 border-t border-secondary text-center text-muted-foreground text-sm">
        <p>&copy; 2026 Taquiza Master - Gestión Profesional de Banquetes</p>
      </footer>
      
      <Toaster position="top-center" />
    </div>
  );
}
