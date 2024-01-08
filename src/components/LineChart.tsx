import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type ChartDataType = {
  name: string;
  data: number[];
};
interface LineChartProps {
  population: ChartDataType[];
}
export default function LineChart({ population }: LineChartProps) {
  const [data, setData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        title: { text: "年度" },
        categories: [
          1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010,
          2015, 2020, 2025, 2030, 2035, 2040, 2045,
        ],
      },
      yaxis: {
        title: { text: "人口数" },
      },
    },
  });

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={data.options}
            series={population}
            type="line"
            width="700"
          />
        </div>
      </div>
    </div>
  );
}
