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

type PrefecturesData = {
  prefCode: number;
  prefName: string;
};

export default function Home() {
  const [prefectures, setPrefectures] = useState<PrefecturesData[]>([]);
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
  return (
    <main>
      <Container maxWidth="sm">
        <Grid container>
          <FormGroup>
            {prefectures.map((prefecture) => (
              // <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox />}
                label={prefecture.prefName}
              />
              // </Grid>
            ))}
          </FormGroup>
        </Grid>
      </Container>
    </main>
  );
}
