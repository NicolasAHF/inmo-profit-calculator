import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, PieChart, Target, Briefcase, Calculator, Trash2 } from "lucide-react";

export function Dashboard({ properties = [], recentAnalyses = [], onDeleteAnalysis }) {
  
  const totalProperties = properties.length;
  const averageROI = properties.length > 0 ? properties.reduce((acc, p) => acc + p.roi, 0) / properties.length : 0;
  const monthlyIncome = properties.reduce((acc, p) => acc + p.monthlyRent, 0);
  const portfolioValue = properties.reduce((acc, p) => acc + p.price, 0);

  const portfolioMetrics = [
    { title: "Propiedades en Cartera", value: totalProperties, icon: Briefcase },
    { title: "ROI Promedio", value: `${averageROI.toFixed(1)}%`, icon: TrendingUp },
    { title: "Ingresos Mensuales", value: `€${monthlyIncome.toLocaleString('es-ES')}`, icon: DollarSign },
    { title: "Valor Total Portfolio", value: `€${(portfolioValue / 1000000).toFixed(1)}M`, icon: PieChart },
  ];

  const formatCurrency = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  const getRoiBadgeColor = (roi) => roi >= 8 ? "bg-green-100 text-green-800" : roi >= 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";

  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className="p-3 rounded-full bg-slate-100">
                 <metric.icon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Análisis Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Análisis Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            {recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 group">
                    <div>
                        <p className="font-medium">{analysis.property}</p>
                        <p className="text-sm text-muted-foreground">
                            Inversión: {formatCurrency(analysis.investment)} • Retorno mensual: {formatCurrency(analysis.monthlyReturn)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`${getRoiBadgeColor(analysis.roi)} font-semibold`}>
                            {analysis.roi.toFixed(1)}% ROI
                        </Badge>
                        {/* BOTÓN DE BORRADO */}
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => onDeleteAnalysis(analysis.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">No hay análisis recientes. Guarda uno desde la calculadora.</p>
            )}
        </CardContent>
      </Card>

      {/* Tips de inversión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Consejos de Inversión
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-500 text-white">
              <h4 className="font-semibold">ROI Objetivo</h4>
              <p className="text-sm opacity-90">Busca propiedades con ROI superior al 6% para inversiones rentables.</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500 text-white">
              <h4 className="font-semibold">Diversificación</h4>
              <p className="text-sm opacity-90">Invierte en diferentes tipos de propiedades y ubicaciones para reducir riesgos.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}