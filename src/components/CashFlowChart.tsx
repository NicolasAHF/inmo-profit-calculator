import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CashFlowChart = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow vs Property Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cashFlow" fill="#8884d8" name="Cash Flow" />
            <Bar dataKey="propertyValue" fill="#82ca9d" name="Property Value" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;