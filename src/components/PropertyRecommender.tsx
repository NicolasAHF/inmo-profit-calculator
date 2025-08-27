import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, TrendingUp, MapPin, Euro, Calendar, AlertTriangle } from "lucide-react";

// Base de datos simulada de propiedades recomendadas
const RECOMMENDED_PROPERTIES = [
  {
    id: "rec1",
    title: "Apartamento Moderno Chamberí",
    location: "Chamberí, Madrid",
    price: 195000,
    monthlyRent: 1380,
    roi: 8.5,
    yearBuilt: 2019,
    size: "75m²",
    type: "Apartamento",
    highlights: ["Recién renovado", "Zona premium", "Metro a 2 min"],
    image: "/api/placeholder/300/200"
  },
  {
    id: "rec2", 
    title: "Piso Luminoso Eixample",
    location: "Eixample, Barcelona",
    price: 220000,
    monthlyRent: 1500,
    roi: 8.2,
    yearBuilt: 2020,
    size: "80m²", 
    type: "Piso",
    highlights: ["Totalmente reformado", "Balcón", "Parking incluido"],
    image: "/api/placeholder/300/200"
  },
  {
    id: "rec3",
    title: "Estudio Centro Histórico",
    location: "Centro, Sevilla", 
    price: 85000,
    monthlyRent: 650,
    roi: 9.2,
    yearBuilt: 2018,
    size: "45m²",
    type: "Estudio",
    highlights: ["Alta demanda turística", "Completamente amueblado", "Rentabilidad garantizada"],
    image: "/api/placeholder/300/200"
  },
  {
    id: "rec4",
    title: "Apartamento Universitario",
    location: "Moncloa, Madrid",
    price: 165000,
    monthlyRent: 1250,
    roi: 9.1,
    yearBuilt: 2017,
    size: "60m²",
    type: "Apartamento",
    highlights: ["Zona universitaria", "Demanda estable", "Bajo mantenimiento"],
    image: "/api/placeholder/300/200"
  }
];

export function PropertyRecommender({ result, values }) {
  if (!result) return null;

  const currentROI = result.netRentalYield;
  const monthlyCashFlow = result.monthlyCashFlow;
  const breakEvenTime = result.breakEvenTime;
  
  // Lógica de recomendación
  const shouldBuy = currentROI >= 7 && monthlyCashFlow > 0 && breakEvenTime < 15;
  const recommendation = getRecommendation(currentROI, monthlyCashFlow, breakEvenTime);
  
  // Filtrar propiedades recomendadas basadas en la ubicación y tipo similar
  const similarProperties = RECOMMENDED_PROPERTIES.filter(prop => 
    prop.roi > currentROI && prop.price <= values.purchasePrice * 1.2
  ).slice(0, 2);

  const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR', 
    minimumFractionDigits: 0 
  }).format(value);

  const formatPercent = (value) => `${value.toFixed(1)}%`;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {shouldBuy ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Recomendación de Inversión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recomendación principal */}
        <div className={`p-4 rounded-lg border-l-4 ${
          shouldBuy 
            ? 'bg-green-50 border-green-500 dark:bg-green-950' 
            : 'bg-red-50 border-red-500 dark:bg-red-950'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-semibold ${shouldBuy ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {shouldBuy ? '✅ SE RECOMIENDA COMPRAR' : '❌ NO SE RECOMIENDA COMPRAR'}
              </h3>
              <p className={`text-sm mt-1 ${shouldBuy ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {recommendation.reason}
              </p>
            </div>
            <Badge variant={shouldBuy ? "default" : "destructive"} className="ml-4">
              ROI: {formatPercent(currentROI)}
            </Badge>
          </div>
        </div>

        {/* Análisis detallado */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <TrendingUp className={`h-4 w-4 ${currentROI >= 7 ? 'text-green-600' : 'text-orange-500'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Rentabilidad</p>
              <p className="font-semibold">{formatPercent(currentROI)}</p>
              <p className="text-xs text-muted-foreground">
                {currentROI >= 8 ? 'Excelente' : currentROI >= 6 ? 'Buena' : 'Baja'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Euro className={`h-4 w-4 ${monthlyCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Flujo Mensual</p>
              <p className="font-semibold">{formatCurrency(monthlyCashFlow)}</p>
              <p className="text-xs text-muted-foreground">
                {monthlyCashFlow > 200 ? 'Positivo' : monthlyCashFlow > 0 ? 'Ajustado' : 'Negativo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className={`h-4 w-4 ${breakEvenTime < 12 ? 'text-green-600' : 'text-orange-500'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Punto de Equilibrio</p>
              <p className="font-semibold">{isFinite(breakEvenTime) ? `${breakEvenTime.toFixed(1)} años` : 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {breakEvenTime < 10 ? 'Rápido' : breakEvenTime < 15 ? 'Moderado' : 'Lento'}
              </p>
            </div>
          </div>
        </div>

        {/* Propiedades alternativas si no se recomienda */}
        {!shouldBuy && similarProperties.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <h4 className="font-semibold">Propiedades Alternativas con Mejor Rentabilidad</h4>
            </div>
            
            <div className="grid gap-4">
              {similarProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium">{property.title}</h5>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 font-semibold">
                      {formatPercent(property.roi)} ROI
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Precio</p>
                      <p className="font-medium text-sm">{formatCurrency(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Renta Mensual</p>
                      <p className="font-medium text-sm text-green-600">{formatCurrency(property.monthlyRent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tamaño</p>
                      <p className="font-medium text-sm">{property.size}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      +{(property.roi - currentROI).toFixed(1)}% más rentable que tu opción actual
                    </p>
                    <Button size="sm" variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consejos adicionales */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Consejos del Experto</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {getExpertTips(currentROI, monthlyCashFlow, breakEvenTime).map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function getRecommendation(roi, cashFlow, breakEvenTime) {
  if (roi >= 8 && cashFlow > 200) {
    return {
      decision: true,
      reason: "Excelente rentabilidad y flujo de caja positivo. Esta propiedad cumple con todos los criterios de inversión."
    };
  } else if (roi >= 7 && cashFlow > 0) {
    return {
      decision: true,
      reason: "Buena rentabilidad con flujo de caja positivo. Una inversión sólida con potencial de crecimiento."
    };
  } else if (roi < 5) {
    return {
      decision: false,
      reason: "La rentabilidad está por debajo del mínimo recomendado (5-7%). Considera buscar mejores oportunidades."
    };
  } else if (cashFlow <= 0) {
    return {
      decision: false,
      reason: "El flujo de caja es negativo o neutro. Esto significa gastos mensuales adicionales para mantener la propiedad."
    };
  } else if (breakEvenTime > 20) {
    return {
      decision: false,
      reason: "El tiempo de recuperación es muy alto. Considera propiedades con mejor cash flow inicial."
    };
  } else {
    return {
      decision: false,
      reason: "La inversión presenta riesgos moderados. Evalúa alternativas con mejor perfil riesgo-retorno."
    };
  }
}

function getExpertTips(roi, cashFlow, breakEvenTime) {
  const tips = [];
  
  if (roi < 6) {
    tips.push("Busca propiedades en zonas con alta demanda de alquiler para mejorar la rentabilidad.");
    tips.push("Considera propiedades que necesiten reformas menores para aumentar el valor de alquiler.");
  }
  
  if (cashFlow <= 0) {
    tips.push("Revisa los gastos mensuales: pueden estar sobrestimados los costos de mantenimiento.");
    tips.push("Considera aumentar el precio de alquiler si está por debajo del mercado.");
  }
  
  if (breakEvenTime > 15) {
    tips.push("Evalúa reducir el precio de compra o negociar mejores condiciones de financiación.");
  }
  
  // Tips generales
  tips.push("Siempre verifica la demanda de alquiler en la zona antes de comprar.");
  tips.push("Considera la ubicación: proximidad a transporte público, colegios y servicios.");
  tips.push("Diversifica tu cartera con propiedades en diferentes zonas y tipos.");
  
  return tips.slice(0, 4); // Máximo 4 tips
}