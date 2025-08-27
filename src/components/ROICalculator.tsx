import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calculator, CreditCard, Save, BarChart2 } from "lucide-react";
import ROIProjectionChart from "@/components/ROIProjectionChart";
import InvestmentComparisonChart from "@/components/InvestmentComparisonChart";
import CashFlowChart from "@/components/CashFlowChart";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyRecommender } from "@/components/PropertyRecommender";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// La prop onSaveAnalysis ya no es necesaria aquí, usaremos el contexto directamente
export function ROICalculator({ values, setValues, result, setResult, onSaveAnalysis }) {
    // Usamos el hook de autenticación para saber si hay un usuario
    const { user } = useAuth();

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const formatNumber = (value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
    const formatPercent = (value) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);

    const calculateMortgagePayment = (principal, annualRate, years) => {
        if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
        const monthlyRate = annualRate / 100 / 12;
        const numPayments = years * 12;
        if (monthlyRate === 0) return principal / numPayments;
        const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
        return monthlyPayment;
    };
    
    useEffect(() => {
        const calculateROI = () => {
            const {
                purchasePrice, monthlyRent, monthlyExpenses, oneTimeCosts,
                annualAppreciation, annualRentIncrease, vacancyRate,
                useFinancing, interestRate, loanTermYears, downPayment,
            } = values;
    
            const annualRent = monthlyRent * 12;
            const annualExpenses = monthlyExpenses * 12;
            const vacancyLoss = annualRent * (vacancyRate / 100);
            const effectiveGrossIncome = annualRent - vacancyLoss;
            const netOperatingIncome = effectiveGrossIncome - annualExpenses;
    
            const mortgagePayment = useFinancing ? calculateMortgagePayment(purchasePrice - downPayment, interestRate, loanTermYears) : 0;
            const annualMortgagePayment = mortgagePayment * 12;
            
            const monthlyCashFlow = (netOperatingIncome / 12) - mortgagePayment;
            const totalInvestment = useFinancing ? downPayment + oneTimeCosts : purchasePrice + oneTimeCosts;
            
            const netRentalYield = (netOperatingIncome / purchasePrice) * 100;
            const breakEvenTime = netOperatingIncome > 0 ? totalInvestment / netOperatingIncome : Infinity;
    
            const roiProjection = [];
            let cumulativeCashFlow = 0;
    
            for (let i = 0; i < 15; i++) {
                const year = i + 1;
                const currentYearRent = monthlyRent * 12 * Math.pow(1 + annualRentIncrease / 100, i);
                const currentYearVacancyLoss = currentYearRent * (vacancyRate / 100);
                const currentYearEffectiveGross = currentYearRent - currentYearVacancyLoss;
                const currentYearNOI = currentYearEffectiveGross - annualExpenses;
                
                const currentYearCashFlow = currentYearNOI - annualMortgagePayment;
                cumulativeCashFlow += currentYearCashFlow;
        
                const propertyValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, year);
                const equityAppreciation = propertyValue - purchasePrice;
        
                const totalReturn = cumulativeCashFlow + equityAppreciation;
                const roi = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;
        
                roiProjection.push({
                    year, roi, propertyValue, cashFlow: cumulativeCashFlow,
                });
            }
    
            setResult({
                monthlyCashFlow, netRentalYield, breakEvenTime, totalInvestment,
                roi5Year: roiProjection[4]?.roi || 0,
                roi10Year: roiProjection[9]?.roi || 0,
                roi15Year: roiProjection[14]?.roi || 0,
                roiProjection,
            });
        };
    
        calculateROI();
    }, [values, setResult]);

    const handleInputChange = (field, value) => {
        const numericValue = parseFloat(value);
        setValues((prev) => ({
        ...prev,
        [field]: isNaN(numericValue) ? 0 : numericValue,
        }));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="animate-fade-in lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            Property Investment Details
                        </span>
                        {user && (
                            <Button onClick={onSaveAnalysis} size="sm" variant="outline">
                                <Save className="h-4 w-4 mr-2" />
                                Guardar Análisis
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                        <Input id="purchasePrice" type="number" value={values.purchasePrice} onChange={(e) => handleInputChange('purchasePrice', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
                        <Input id="monthlyRent" type="number" value={values.monthlyRent} onChange={(e) => handleInputChange('monthlyRent', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="monthlyExpenses">Monthly Expenses ($)</Label>
                        <Input id="monthlyExpenses" type="number" value={values.monthlyExpenses} onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Property tax, insurance, HOA, maintenance</p>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="oneTimeCosts">One-time Costs ($)</Label>
                        <Input id="oneTimeCosts" type="number" value={values.oneTimeCosts} onChange={(e) => handleInputChange('oneTimeCosts', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Closing costs, agent fees, renovations</p>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="annualAppreciation">Annual Appreciation (%)</Label>
                        <Input id="annualAppreciation" type="number" value={values.annualAppreciation} onChange={(e) => handleInputChange('annualAppreciation', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="annualRentIncrease">Annual Rent Increase (%)</Label>
                        <Input id="annualRentIncrease" type="number" value={values.annualRentIncrease} onChange={(e) => handleInputChange('annualRentIncrease', e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                        <Input id="vacancyRate" type="number" value={values.vacancyRate} onChange={(e) => handleInputChange('vacancyRate', e.target.value)} />
                        <p className="text-xs text-muted-foreground">Percentage of time property is vacant</p>
                        </div>
                    </div>
                    <div className="space-y-4 p-4 rounded-lg border bg-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <Label htmlFor="useFinancing" className="text-base font-medium">
                                    Use Financing
                                </Label>
                            </div>
                            <Switch
                                id="useFinancing"
                                checked={values.useFinancing}
                                onCheckedChange={(checked) => setValues(prev => ({ ...prev, useFinancing: checked }))}
                            />
                        </div>
                        {values.useFinancing && (
                            <div className="grid md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="downPayment">Down Payment ($)</Label>
                                    <Input id="downPayment" type="number" value={values.downPayment} onChange={(e) => handleInputChange('downPayment', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                                    <Input id="interestRate" type="number" step="0.1" value={values.interestRate} onChange={(e) => handleInputChange('interestRate', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="loanTermYears">Loan Term (years)</Label>
                                    <Input id="loanTermYears" type="number" value={values.loanTermYears} onChange={(e) => handleInputChange('loanTermYears', e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Monthly Cash Flow</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-100">{formatCurrency(result.monthlyCashFlow)}</p>
                                <p className="text-xs text-muted-foreground">After all expenses</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Net Rental Yield</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatPercent(result.netRentalYield)}</p>
                                <p className="text-xs text-muted-foreground">Annual return on investment</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Break-even Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{isFinite(result.breakEvenTime) ? `${formatNumber(result.breakEvenTime)} years` : 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">Time to recover investment</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatCurrency(result.totalInvestment)}</p>
                                <p className="text-xs text-muted-foreground">Purchase + closing costs</p>
                            </CardContent>
                        </Card>
                    </div>

                    <PropertyRecommender result={result} values={values} />
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <BarChart2 className="h-4 w-4" />
                            Ver gráficos detallados
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <Card>
                                  <CardHeader className="pb-2">
                                      <CardTitle className="text-sm font-medium">5-Year ROI</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <p className="text-2xl font-bold">{formatPercent(result.roi5Year)}</p>
                                  </CardContent>
                              </Card>
                              <Card>
                                  <CardHeader className="pb-2">
                                      <CardTitle className="text-sm font-medium">10-Year ROI</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <p className="text-2xl font-bold">{formatPercent(result.roi10Year)}</p>
                                  </CardContent>
                              </Card>
                              <Card>
                                  <CardHeader className="pb-2">
                                      <CardTitle className="text-sm font-medium">15-Year ROI</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <p className="text-2xl font-bold">{formatPercent(result.roi15Year)}</p>
                                  </CardContent>
                              </Card>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <ROIProjectionChart data={result.roiProjection} />
                              <InvestmentComparisonChart data={result.netRentalYield} />
                          </div>
                          <CashFlowChart data={result.roiProjection} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    );
}