import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type ChartData = {
  year: number;
  value: number;
};

type ChartDataType = {
  name: string;
  data: number[];
};
interface ApexChart {
  chartData: ChartDataType[];
}
export default function ApexChart(props: ChartDataType[]) {
  console.log(props);
  const [data, setData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        title: { text: "年度" },
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
  });

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={data.options}
            series={props.props}
            type="line"
            width="500"
          />
        </div>
      </div>
    </div>
  );
}