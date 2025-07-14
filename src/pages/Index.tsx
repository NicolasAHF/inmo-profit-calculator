import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/PropertyCard";
import { ROICalculator } from "@/components/ROICalculator";
import { Dashboard } from "@/components/Dashboard";
import { Calculator, TrendingUp, Home, PlusCircle } from "lucide-react";
import heroImage from "@/assets/hero-investment.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sampleProperties = [
    {
      title: "Apartamento Centro Madrid",
      price: 180000,
      monthlyRent: 1200,
      roi: 8.2,
      location: "Malasaña, Madrid",
    },
    {
      title: "Casa Unifamiliar Barcelona",
      price: 250000,
      monthlyRent: 1400,
      roi: 6.8,
      location: "Gràcia, Barcelona",
    },
    {
      title: "Estudio Moderno Valencia",
      price: 120000,
      monthlyRent: 750,
      roi: 9.1,
      location: "Ruzafa, Valencia",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-hero overflow-hidden">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full lg:w-fit grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculadora ROI
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Propiedades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <ROICalculator />
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Propiedades Disponibles</h2>
                <p className="text-muted-foreground">
                  Analiza diferentes oportunidades de inversión
                </p>
              </div>
              <Button variant="gradient">
                <PlusCircle className="h-4 w-4" />
                Agregar Propiedad
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((property, index) => (
                <PropertyCard
                  key={index}
                  {...property}
                  onAnalyze={() => setActiveTab("calculator")}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
