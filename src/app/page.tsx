"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
// import Chart from "@/components/chart";
import ApexChart from "@/components/ApexChart";
import { channel } from "diagnostics_channel";

type PrefecturesData = {
  prefCode: number;
  prefName: string;
};

type ChartData = {
  year: number;
  value: number;
};

type ChartDataType = {
  name: string;
  data: number[];
};

export default function Home() {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  // const [chartData, setchartData] = useState<ChartData[]>([]);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  // const [data, setData] = useState({
  //   総人口: {},
  //   年少人口: {},
  //   生産年齢人口: {},
  //   老年人口: {},
  // });
  useEffect(() => {
    axios
      .get("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
      })
      .then((res) => {
        setPrefectures(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(chartData);
  }, [chartData]);

  const convertData = (prefName: string, addchartData: ChartData[]) => {
    console.log(addchartData);
    var convertedData: ChartDataType = {
      name: prefName,
      data: addchartData.map((obj) => obj["value"]),
    };
    console.log(convertedData);
    setChartData([...chartData, convertedData]);
  };

  const handleChange = (prefecture: PrefecturesData) => {
    axios
      .get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefecture.prefCode}`,
        {
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
        }
      )
      .then((res) => {
        // console.log(res.data);
        convertData(prefecture.prefName, res.data.result.data[0].data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      <Container maxWidth="sm">
        <Grid container>
          <FormGroup row={true}>
            {prefectures.map((prefecture) => (
              // <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox />}
                onChange={() => handleChange(prefecture)}
                label={prefecture.prefName}
              />
              // </Grid>
            ))}
          </FormGroup>
        </Grid>
        {/* <Chart data={data} /> */}
        <ApexChart props={chartData}></ApexChart>
      </Container>
    </main>
  );
}
