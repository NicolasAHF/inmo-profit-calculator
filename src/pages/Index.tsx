import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/PropertyCard";
import { ROICalculator } from "@/components/ROICalculator";
import { Simulation } from "@/components/Simulation";
import { Dashboard } from "@/components/Dashboard";
import { AddPropertyModal } from "@/components/AddPropertyModal";
import { Calculator, TrendingUp, Home, PlusCircle, SlidersHorizontal, LogIn, UserPlus, LogOut } from "lucide-react";
import heroImage from "@/assets/hero-investment.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PropertyRecommender } from "@/components/PropertyRecommender";

const Index = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user, login, logout } = useAuth();

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Apartamento Centro Madrid",
      price: 180000,
      monthlyRent: 1200,
      roi: 8.2,
      location: "Malasaña, Madrid",
    },
    {
      id: 2,
      title: "Casa Unifamiliar Barcelona",
      price: 250000,
      monthlyRent: 1400,
      roi: 6.8,
      location: "Gràcia, Barcelona",
    },
  ]);
  
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const handleLogout = () => {
    logout();
    setActiveTab("calculator"); 
  }

  const [calculatorValues, setCalculatorValues] = useState({
    purchasePrice: 500000,
    monthlyRent: 2996,
    monthlyExpenses: 800,
    oneTimeCosts: 25000,
    annualAppreciation: 3,
    annualRentIncrease: 2,
    vacancyRate: 5,
    useFinancing: false,
    interestRate: 4.5,
    loanTermYears: 30,
    downPayment: 100000,
  });
  const [calculatorResult, setCalculatorResult] = useState(null);

  const analyzeProperty = (property) => {
    const valuesToAnalyze = {
        ...calculatorValues,
        purchasePrice: property.price,
        monthlyRent: property.monthlyRent,
        monthlyExpenses: 800, 
        oneTimeCosts: property.price * 0.05,
    };
    setCalculatorValues(valuesToAnalyze);
    
    const analysis = {
      property: property.title,
      investment: property.price,
      monthlyReturn: property.monthlyRent,
      roi: property.roi,
      id: Date.now(),
    };
    setRecentAnalyses(prev => [analysis, ...prev].slice(0, 3));

    setActiveTab("calculator");
  };

  const addProperty = (newProperty) => {
    setProperties(prev => [...prev, { ...newProperty, id: Date.now() }]);
  };
  
  // --- NUEVAS FUNCIONES PARA BORRAR ---
  const deleteProperty = (idToDelete) => {
    setProperties(prev => prev.filter(p => p.id !== idToDelete));
    toast.success("Propiedad eliminada.");
  };

  const deleteRecentAnalysis = (idToDelete) => {
    setRecentAnalyses(prev => prev.filter(a => a.id !== idToDelete));
    toast.success("Análisis eliminado.");
  };
  // --- FIN DE NUEVAS FUNCIONES ---

  const saveCurrentAnalysis = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para guardar un análisis.");
      return;
    }
    if (!calculatorResult) {
      toast.warning("Primero calcula un resultado para guardarlo.");
      return;
    }
    const analysis = {
      property: `Análisis de ${formatCurrency(calculatorValues.purchasePrice)}`,
      investment: calculatorValues.purchasePrice + calculatorValues.oneTimeCosts,
      monthlyReturn: calculatorValues.monthlyRent,
      roi: calculatorResult.netRentalYield,
      id: Date.now(),
    };
    setRecentAnalyses(prev => [analysis, ...prev].slice(0, 3));
    toast.success("Análisis guardado en el Dashboard.");
  };

  const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);

  return (
    <>
      <AddPropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProperty={addProperty}
      />
      <div className="min-h-screen bg-background">
        {/* ... Hero Section (sin cambios) ... */}
        <div className="relative h-96 bg-gradient-hero overflow-hidden">
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm font-medium text-white">¡Bienvenido!</span>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => login('user@test.com', 'password')} variant="secondary" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
                <Button onClick={() => toast.info("Funcionalidad de registro no implementada.")} variant="default" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </Button>
              </>
            )}
          </div>
          <img 
            src={heroImage} 
            alt="Real Estate Investment" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-primary-foreground">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Calcula la Rentabilidad de tus Inversiones Inmobiliarias
              </h1>
              <p className="text-xl mb-6 text-primary-foreground/90 animate-fade-in">
                Herramienta profesional para analizar ROI, flujo de caja y tomar decisiones inteligentes de inversión.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 shadow-glow"
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator className="h-5 w-5" />
                Empezar Análisis
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full lg:w-fit mb-8 ${user ? 'grid-cols-4' : 'grid-cols-2'}`}>
              {user && (
                <TabsTrigger value="dashboard">
                  <Home className="h-4 w-4 mr-2" /> Dashboard
                </TabsTrigger>
              )}
              <TabsTrigger value="calculator">
                <Calculator className="h-4 w-4 mr-2" /> Calculadora ROI
              </TabsTrigger>
              <TabsTrigger value="simulation">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Simulación
              </TabsTrigger>
              {user && (
                <TabsTrigger value="properties">
                  <TrendingUp className="h-4 w-4 mr-2" /> Propiedades
                </TabsTrigger>
              )}
            </TabsList>
            
            {user && (
              <TabsContent value="dashboard" className="space-y-6">
                <Dashboard 
                  properties={properties} 
                  recentAnalyses={recentAnalyses}
                  onDeleteAnalysis={deleteRecentAnalysis} // Pasamos la función de borrar
                />
              </TabsContent>
            )}

            <TabsContent value="calculator" className="space-y-6">
              <ROICalculator 
                values={calculatorValues} 
                setValues={setCalculatorValues} 
                setResult={setCalculatorResult} 
                result={calculatorResult}
                onSaveAnalysis={saveCurrentAnalysis}
              />
            </TabsContent>
            
            <TabsContent value="simulation" className="space-y-6">
              <Simulation baseValues={calculatorValues} />
            </TabsContent>

            {user && (
              <TabsContent value="properties" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Mis Propiedades Guardadas</h2>
                    <p className="text-muted-foreground">
                      Analiza y compara tus oportunidades de inversión
                    </p>
                  </div>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Propiedad
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                      onAnalyze={() => analyzeProperty(property)}
                      onDelete={() => deleteProperty(property.id)} // Pasamos la función de borrar
                    />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;