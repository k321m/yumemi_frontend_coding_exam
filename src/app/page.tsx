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
import Chart from "@/components/chart";

type PrefecturesData = {
  prefCode: number;
  prefName: string;
};

type ChartData = {
  year: number;
  value: number;
};

export default function Home() {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [data, setData] = useState<ChartData[]>([]);
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

  const convertData = (data: string[]) => {
    // {year: 2000, 北海道:1000},{year:2050, 北海道}
    data.map((item) => {});
  };

  const handleChange = (prefCode: number) => {
    axios
      .get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
        }
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data.result.data[0].data);
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
                onChange={() => handleChange(prefecture.prefCode)}
                label={prefecture.prefName}
              />
              // </Grid>
            ))}
          </FormGroup>
        </Grid>
        <Chart data={data} />
      </Container>
    </main>
  );
}
