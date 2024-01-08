import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type LineChartDataType = {
  name: string;
  data: number[];
};

interface LineChartProps {
  LineChartData: LineChartDataType[];
}
export default function LineChart({ LineChartData }: LineChartProps) {
  const [lineChartData, setLineChartData] = useState({
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
            options={lineChartData.options}
            series={LineChartData}
            type="line"
            width="700"
          />
        </div>
      </div>
    </div>
  );
}
