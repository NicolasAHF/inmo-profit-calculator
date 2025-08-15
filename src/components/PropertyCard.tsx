import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Trash2, Home } from "lucide-react"; // Importamos Trash2

interface PropertyCardProps {
  title: string;
  price: number;
  monthlyRent: number;
  roi: number;
  location: string;
  onAnalyze: () => void;
  onDelete: () => void; // Añadimos la prop para borrar
}

export function PropertyCard({ title, price, monthlyRent, roi, location, onAnalyze, onDelete }: PropertyCardProps) {
  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  const getRoiBadgeColor = (roi) => roi >= 8 ? "bg-green-100 text-green-800" : roi >= 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-primary" />
            <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <Badge className={`${getRoiBadgeColor(roi)} font-semibold`}>
            {roi.toFixed(1)}% ROI
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Precio</p>
            <p className="font-semibold text-lg">{formatCurrency(price)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Renta mensual</p>
            <p className="font-semibold text-lg text-green-600">{formatCurrency(monthlyRent)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          onClick={onAnalyze} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Analizar
        </Button>
        <Button onClick={onDelete} variant="outline" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
}