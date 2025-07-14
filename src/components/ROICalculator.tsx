import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, AlertCircle, PiggyBank } from "lucide-react";

interface CalculationResult {
  monthlyProfit: number;
  annualProfit: number;
  roi: number;
  breakEvenMonths: number;
  totalInvestment: number;
}

export function ROICalculator() {
  const [values, setValues] = useState({
    propertyPrice: 150000,
    monthlyRent: 800,
    downPayment: 30000,
    renovationCosts: 5000,
    monthlyExpenses: 150,
    annualTaxes: 1200,
    insurance: 600,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateROI = () => {
    const totalInvestment = values.downPayment + values.renovationCosts;
    const monthlyIncome = values.monthlyRent;
    const monthlyExpenses = values.monthlyExpenses + (values.annualTaxes / 12) + (values.insurance / 12);
    const monthlyProfit = monthlyIncome - monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const roi = (annualProfit / totalInvestment) * 100;
    const breakEvenMonths = totalInvestment / monthlyProfit;

    setResult({
      monthlyProfit,
      annualProfit,
      roi,
      breakEvenMonths,
      totalInvestment,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof typeof values, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const getRoiBadgeColor = (roi: number) => {
    if (roi >= 8) return "bg-success text-success-foreground";
    if (roi >= 5) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Datos de la Inversión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyPrice">Precio de la Propiedad</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={values.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
                placeholder="150,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Renta Mensual</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={values.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                placeholder="800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="downPayment">Enganche/Pago Inicial</Label>
              <Input
                id="downPayment"
                type="number"
                value={values.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
                placeholder="30,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renovationCosts">Costos de Renovación</Label>
              <Input
                id="renovationCosts"
                type="number"
                value={values.renovationCosts}
                onChange={(e) => handleInputChange('renovationCosts', e.target.value)}
                placeholder="5,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses">Gastos Mensuales</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={values.monthlyExpenses}
                onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                placeholder="150"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualTaxes">Impuestos Anuales</Label>
              <Input
                id="annualTaxes"
                type="number"
                value={values.annualTaxes}
                onChange={(e) => handleInputChange('annualTaxes', e.target.value)}
                placeholder="1,200"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="insurance">Seguro Anual</Label>
              <Input
                id="insurance"
                type="number"
                value={values.insurance}
                onChange={(e) => handleInputChange('insurance', e.target.value)}
                placeholder="600"
              />
            </div>
          </div>
          
          <Button 
            onClick={calculateROI} 
            variant="gradient" 
            className="w-full"
            size="lg"
          >
            <Calculator className="h-5 w-5" />
            Calcular ROI
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Resultados del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-gradient-primary rounded-lg">
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                {result.roi.toFixed(1)}%
              </div>
              <p className="text-primary-foreground/80">ROI Anual</p>
              <Badge className={`mt-2 ${getRoiBadgeColor(result.roi)}`}>
                {result.roi >= 8 ? 'Excelente' : result.roi >= 5 ? 'Bueno' : 'Bajo'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PiggyBank className="h-4 w-4" />
                  Ganancia Mensual
                </div>
                <p className="text-lg font-semibold text-success">
                  {formatCurrency(result.monthlyProfit)}
                </p>
              </div>
              
              <div className="space-y-2 p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Ganancia Anual
                </div>
                <p className="text-lg font-semibold text-success">
                  {formatCurrency(result.annualProfit)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border">
                <span className="text-sm text-muted-foreground">Inversión Total</span>
                <span className="font-semibold">{formatCurrency(result.totalInvestment)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg bg-card border">
                <span className="text-sm text-muted-foreground">Break-even</span>
                <span className="font-semibold">
                  {Math.ceil(result.breakEvenMonths)} meses
                </span>
              </div>
            </div>
            
            {result.roi < 5 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">ROI Bajo</p>
                  <p className="text-muted-foreground">
                    Considera negociar un mejor precio o buscar propiedades con mayor potencial de renta.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}