import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  year: number;
  value: number;
};

interface Chart {
  data: ChartData;
}
export default function Chart(data: any) {
  console.log(data.data);
  return (
    <div>
      <LineChart
        width={500}
        height={300}
        data={data.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </div>
  );
}
