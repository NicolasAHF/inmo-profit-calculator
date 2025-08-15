import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InvestmentComparisonChart = ({ data }) => {
  const comparisonData = [
    { name: 'Rental Property', roi: data },
    { name: 'Bank Deposit', roi: 1.5 },
    { name: 'Government Bonds', roi: 2.5 },
    { name: 'Stock Market (S&P 500)', roi: 8 },
    { name: 'REITs', roi: 6 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Comparison (10-Year Average ROI)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="roi" fill="#82ca9d" name="Average ROI (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvestmentComparisonChart;