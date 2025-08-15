import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";

// The Simulation component now receives the base values from the calculator
export function Simulation({ baseValues }) {
  const [adjustments, setAdjustments] = useState({
    rent: 0,
    expenses: 0,
    vacancy: baseValues.vacancyRate,
  });
  const [simulatedResult, setSimulatedResult] = useState(null);
  
  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  const formatNumber = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  const formatPercent = (value) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);

  useEffect(() => {
    const calculateSimulatedROI = () => {
        const { purchasePrice, oneTimeCosts, downPayment, useFinancing } = baseValues;

        // Apply adjustments
        const adjustedRent = baseValues.monthlyRent * (1 + adjustments.rent / 100);
        const adjustedExpenses = baseValues.monthlyExpenses * (1 + adjustments.expenses / 100);
        
        // Recalculate metrics with adjusted values
        const annualRent = adjustedRent * 12;
        const annualExpenses = adjustedExpenses * 12;
        const vacancyLoss = annualRent * (adjustments.vacancy / 100);
        const effectiveGrossIncome = annualRent - vacancyLoss;
        const netOperatingIncome = effectiveGrossIncome - annualExpenses;

        const totalInvestment = useFinancing ? downPayment + oneTimeCosts : purchasePrice + oneTimeCosts;
        const monthlyCashFlow = netOperatingIncome / 12; // Simplified for simulation without mortgage
        
        const netRentalYield = (netOperatingIncome / purchasePrice) * 100;
        const breakEvenTime = netOperatingIncome > 0 ? totalInvestment / netOperatingIncome : Infinity;

        // Simplified 10-year ROI for simulation
        const totalCashFlow10Years = monthlyCashFlow * 12 * 10;
        const appreciation10Years = purchasePrice * (Math.pow(1 + baseValues.annualAppreciation / 100, 10) - 1);
        const totalReturn10Years = totalCashFlow10Years + appreciation10Years;
        const roi10Year = totalInvestment > 0 ? (totalReturn10Years / totalInvestment) * 100 : 0;

        setSimulatedResult({
            monthlyCashFlow,
            netRentalYield,
            breakEvenTime,
            roi10Year
        });
    };

    calculateSimulatedROI();
  }, [adjustments, baseValues]);

  const handleAdjustmentChange = (field, value) => {
    setAdjustments(prev => ({ ...prev, [field]: value }));
  };
  
  const adjustedRentValue = baseValues.monthlyRent * (1 + adjustments.rent / 100);
  const adjustedExpensesValue = baseValues.monthlyExpenses * (1 + adjustments.expenses / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal />
            Scenario Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
                <Label>Rent Adjustment: {adjustments.rent > 0 ? '+' : ''}{adjustments.rent}%</Label>
                <Slider value={[adjustments.rent]} onValueChange={([val]) => handleAdjustmentChange('rent', val)} max={50} min={-50} step={1} />
                <p className="text-sm text-muted-foreground">Current: {formatCurrency(adjustedRentValue)}/month</p>
            </div>
            <div className="space-y-2">
                <Label>Expense Adjustment: {adjustments.expenses > 0 ? '+' : ''}{adjustments.expenses === 0 ? 'No change' : `${adjustments.expenses}%`}</Label>
                <Slider value={[adjustments.expenses]} onValueChange={([val]) => handleAdjustmentChange('expenses', val)} max={100} min={-50} step={1} />
                <p className="text-sm text-muted-foreground">Current: {formatCurrency(adjustedExpensesValue)}/month</p>
            </div>
            <div className="space-y-2">
                <Label>Vacancy Rate: {adjustments.vacancy.toFixed(1)}%</Label>
                <Slider value={[adjustments.vacancy]} onValueChange={([val]) => handleAdjustmentChange('vacancy', val)} max={20} step={0.5} />
            </div>
        </div>

        {simulatedResult && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(simulatedResult.monthlyCashFlow)}</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Net Rental Yield</p>
                    <p className="text-2xl font-bold text-red-600">{formatPercent(simulatedResult.netRentalYield)}</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">10-Year ROI</p>
                    <p className="text-2xl font-bold">{formatPercent(simulatedResult.roi10Year)}</p>
                </div>
                 <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Break-even Time</p>
                    <p className="text-2xl font-bold text-red-600">{isFinite(simulatedResult.breakEvenTime) ? `${formatNumber(simulatedResult.breakEvenTime)} years` : 'N/A'}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}