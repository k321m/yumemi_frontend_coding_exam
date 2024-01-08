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
import dynamic from "next/dynamic";

// LineChartを動的にロード
const LineChart = dynamic(() => import("@/components/LineChart"), {
  ssr: false,
});

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
  const [selectedPrefsPopulation, setSelectedPrefsPopulation] = useState<
    ChartDataType[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://opendata.resas-portal.go.jp/api/v1/prefectures",
          {
            headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
          }
        );
        setPrefectures(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const convertData = (prefName: string, addchartData: ChartData[]) => {
    if (selectedPrefsPopulation.some((item) => item.name === prefName)) {
      setSelectedPrefsPopulation(
        selectedPrefsPopulation.filter((item) => item.name !== prefName)
      );
      return;
    }
    setSelectedPrefsPopulation([
      ...selectedPrefsPopulation,
      {
        name: prefName,
        data: addchartData.map((obj) => obj["value"]),
      },
    ]);
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
        convertData(prefecture.prefName, res.data.result.data[0].data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <main>
      <Container maxWidth="md">
        <Grid container>
          <FormGroup row={true}>
            {prefectures.map((prefecture) => (
              <FormControlLabel
                key={prefecture.prefCode}
                control={<Checkbox />}
                onChange={() => handleChange(prefecture)}
                label={prefecture.prefName}
              />
            ))}
          </FormGroup>
        </Grid>
        {typeof window !== "undefined" && (
          <LineChart population={selectedPrefsPopulation}></LineChart>
        )}
      </Container>
    </main>
  );
}
