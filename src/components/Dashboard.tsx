import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, PieChart, Calculator, Home, Target } from "lucide-react";

export function Dashboard() {
  const portfolioMetrics = [
    {
      title: "Propiedades en Cartera",
      value: "12",
      icon: Home,
      color: "text-primary",
    },
    {
      title: "ROI Promedio",
      value: "7.8%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Ingresos Mensuales",
      value: "€8,450",
      icon: DollarSign,
      color: "text-accent",
    },
    {
      title: "Valor Total Portfolio",
      value: "€1.2M",
      icon: PieChart,
      color: "text-primary",
    },
  ];

  const recentAnalysis = [
    {
      property: "Apartamento Centro Madrid",
      roi: 8.2,
      investment: 45000,
      monthlyReturn: 320,
    },
    {
      property: "Casa Unifamiliar Barcelona", 
      roi: 6.8,
      investment: 75000,
      monthlyReturn: 425,
    },
    {
      property: "Estudio Malasaña",
      roi: 9.1,
      investment: 35000,
      monthlyReturn: 280,
    },
  ];

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
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric, index) => (
          <Card key={index} className="animate-fade-in hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de rendimiento */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Análisis Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalysis.map((analysis, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-smooth"
              >
                <div className="space-y-1">
                  <p className="font-medium">{analysis.property}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Inversión: {formatCurrency(analysis.investment)}</span>
                    <span>•</span>
                    <span>Retorno mensual: {formatCurrency(analysis.monthlyReturn)}</span>
                  </div>
                </div>
                <Badge className={getRoiBadgeColor(analysis.roi)}>
                  {analysis.roi.toFixed(1)}% ROI
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips de inversión */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Consejos de Inversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-primary">
              <h4 className="font-semibold text-primary-foreground">ROI Objetivo</h4>
              <p className="text-sm text-primary-foreground/80">
                Busca propiedades con ROI superior al 6% para inversiones rentables.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-success">
              <h4 className="font-semibold text-success-foreground">Diversificación</h4>
              <p className="text-sm text-success-foreground/80">
                Invierte en diferentes tipos de propiedades y ubicaciones para reducir riesgos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}