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

export default function Home() {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
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
    console.log(selectedPrefectures);
    const prefCode: string = selectedPrefectures.join(",");
    console.log("${prefCode}", prefCode);
    axios
      .get(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
        }
      )
      .then((res) => {
        console.log(res.data.result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedPrefectures]);

  const handleChange = (prefCode: number) => {
    setSelectedPrefectures([...selectedPrefectures, prefCode]);
  };

  return (
    <main>
      <Container maxWidth="sm">
        <Grid container>
          <FormGroup>
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
        <Chart></Chart>
      </Container>
    </main>
  );
}
