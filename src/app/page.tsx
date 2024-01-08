"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
} from "@mui/material";
import dynamic from "next/dynamic";

// FIX:LineChartを動的にロード
const LineChart = dynamic(() => import("@/components/LineChart"), {
  ssr: false,
});

type PrefecturesDataType = {
  prefCode: number;
  prefName: string;
};

type SelectedPrefsPopulationsType = {
  name: string;
  code: number;
  total: number[];
  young: number[];
  working: number[];
  eldery: number[];
};

type SelectdDataType = "total" | "young" | "working" | "eldery";

export default function Home() {
  const [prefectures, setPrefectures] = useState<PrefecturesDataType[]>([]); // 都道府県名
  const [selectedPrefsPopulations, setSelectedPrefsPopulations] = useState<
    // 選択されている都道府県の人口データ
    SelectedPrefsPopulationsType[]
  >([]);
  const [selectedDataType, setSelectedDataType] =
    useState<SelectdDataType>("total");

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

  const handleChange = (prefecture: PrefecturesDataType) => {
    // 都道府県が既に選択されていた場合
    if (
      selectedPrefsPopulations.some((item) => item.code === prefecture.prefCode)
    ) {
      setSelectedPrefsPopulations(
        selectedPrefsPopulations.filter(
          (item) => item.name !== prefecture.prefName
        )
      );
      return;
    }
    // 都道府県名が選択されていなかった場合
    axios
      .get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefecture.prefCode}`,
        {
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
        }
      )
      .then((res) => {
        addSelectedPrefsPopulation(prefecture, res.data.result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSelectedPrefsPopulation = (
    prefecture: PrefecturesDataType,
    populations: Array<{
      data: Array<{ year: number; value: number }>;
      label: string;
    }>
  ) => {
    setSelectedPrefsPopulations([
      ...selectedPrefsPopulations,
      {
        name: prefecture.prefName,
        code: prefecture.prefCode,
        total: populations[0].data.map((obj) => obj["value"]),
        young: populations[1].data.map((obj) => obj["value"]),
        working: populations[2].data.map((obj) => obj["value"]),
        eldery: populations[3].data.map((obj) => obj["value"]),
      },
    ]);
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
        <Stack spacing={1} direction="row">
          <Button
            variant="outlined"
            onClick={() => setSelectedDataType("total")}
          >
            総人口数
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedDataType("young")}
          >
            年少人口
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedDataType("working")}
          >
            生産年齢人口
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedDataType("eldery")}
          >
            老年人口
          </Button>
        </Stack>

        {typeof window !== "undefined" && (
          <LineChart
            LineChartData={selectedPrefsPopulations.map(
              ({ name, ...rest }) => ({
                name: name,
                data: rest[selectedDataType],
              })
            )}
          ></LineChart>
        )}
      </Container>
    </main>
  );
}
