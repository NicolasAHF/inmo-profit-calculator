import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign, Home } from "lucide-react";

interface PropertyCardProps {
  title: string;
  price: number;
  monthlyRent: number;
  roi: number;
  location: string;
  onAnalyze: () => void;
}

export function PropertyCard({ title, price, monthlyRent, roi, location, onAnalyze }: PropertyCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoiBadgeColor = (roi: number) => {
    if (roi >= 8) return "bg-success text-success-foreground";
    if (roi >= 5) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card className="hover:shadow-elegant transition-smooth animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={getRoiBadgeColor(roi)}>
            {roi.toFixed(1)}% ROI
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Precio
            </div>
            <p className="font-semibold">{formatCurrency(price)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Renta mensual
            </div>
            <p className="font-semibold text-success">{formatCurrency(monthlyRent)}</p>
          </div>
        </div>
        
        <Button 
          onClick={onAnalyze} 
          variant="hero" 
          className="w-full"
        >
          <Calculator className="h-4 w-4" />
          Analizar Inversión
        </Button>
      </CardContent>
    </Card>
  );
}