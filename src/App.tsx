import "./App.css";

import NavItem from "../src/components/NavItem";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {
  createAMatrix,
  createInvertedD_Matrix,
  createDeltaUMatrix,
  departureDiff,
  dgrToRadians,
  DRBearing,
  findN_matrix,
  latDiff,
  multiplyTransposedA_MatrixAndInvertedD_Matrix,
  multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix,
  createDeltaX_Matrix,
  calculateCompassError,
} from "./functions";
import { SetStateAction, useState } from "react";

interface inputData {
  DRLatDGR: number;
  DRLatDir: "n" | "N" | "s" | "S";
  DRLatMins: number;
  DRLongDGR: number;
  DRLongDir: "w" | "W" | "e" | "E";
  DRLongMins: number;
  orientNumber1Bearing: number;
  orientNumber1LatDGR: number;
  orientNumber1LatDir: "n" | "N" | "s" | "S";
  orientNumber1LatMins: number;
  orientNumber1LongDGR: number;
  orientNumber1LongDir: "w" | "W" | "e" | "E";
  orientNumber1LongMins: number;
  orientNumber2Bearing: number;
  orientNumber2LatDGR: number;
  orientNumber2LatDir: "n" | "N" | "s" | "S";
  orientNumber2LatMins: number;
  orientNumber2LongDGR: number;
  orientNumber2LongDir: "w" | "W" | "e" | "E";
  orientNumber2LongMins: number;
  orientNumber3Bearing: number;
  orientNumber3LatDGR: number;
  orientNumber3LatDir: "n" | "N" | "s" | "S";
  orientNumber3LatMins: number;
  orientNumber3LongDGR: number;
  orientNumber3LongDir: "w" | "W" | "e" | "E";
  orientNumber3LongMins: number;
  orientNumber4Bearing: number;
  orientNumber4LatDGR: number;
  orientNumber4LatDir: "n" | "N" | "s" | "S";
  orientNumber4LatMins: number;
  orientNumber4LongDGR: number;
  orientNumber4LongDir: "w" | "W" | "e" | "E";
  orientNumber4LongMins: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ButtonCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  let initialValuesTemplate = {
    DRPosition: {
      lat: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      long: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
    },
    first: {
      lat: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      long: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      bearing: 1,
    },
    second: {
      lat: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      long: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      bearing: 1,
    },
    third: {
      lat: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      long: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      bearing: 1,
    },
    fourth: {
      lat: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      long: {
        dgr: 1,
        mins: 1,
        dir: " ",
      },
      bearing: 1,
    },
  };

  let initialValues = [0, 1, 2, 3];

  const { register, handleSubmit } = useForm();

  const [inputData, setInputData] = useState();

  // let dU_Matrix = createDeltaUMatrix(
  //   [dgrToRadians(29.9), DRBearing(4, 8)],
  //   [dgrToRadians(56.9), DRBearing(6, 4.3)],
  //   [dgrToRadians(115.2), DRBearing(7.7, -3.1)],
  //   [dgrToRadians(349.4), DRBearing(-1.4, 5.9)]
  // );
  // let a = createInvertedD_Matrix();
  // let A_Matrix = createAMatrix([4, 8], [6, 4.3], [7.7, -3.1], [-1.4, 5.9]);
  // let AD_matrix = multiplyTransposedA_MatrixAndInvertedD_Matrix(A_Matrix, a);
  // let N_Matrix = findN_matrix(AD_matrix, A_Matrix);
  // let ADU_Matrix =
  //   multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix(
  //     AD_matrix,
  //     dU_Matrix
  //   );
  // let deltaX_Matrix = createDeltaX_Matrix(N_Matrix, ADU_Matrix);
  // let compassError = calculateCompassError(deltaX_Matrix);

  const onSubmit = (data: any) => {
    // setInputData(data);

    let departureDiffOrient_1 = departureDiff(
      {
        dgr: +data.orientNumber1LongDGR,
        mins: +data.orientNumber1LongMins,
        dir: data.orientNumber1LongDir,
      },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir },
      60
    );
    let latDiffOrient_1 = latDiff(
      {
        dgr: +data.orientNumber1LatDGR,
        mins: +data.orientNumber1LatMins,
        dir: data.orientNumber1LatDir,
      },
      {
        dgr: +data.DRLatDGR,
        mins: +data.DRLatMins,
        dir: data.DRLatDir,
      }
    );

    let departureDiffOrient_2 = departureDiff(
      {
        dgr: +data.orientNumber2LongDGR,
        mins: +data.orientNumber2LongMins,
        dir: data.orientNumber2LongDir,
      },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir },
      60
    );
    let latDiffOrient_2 = latDiff(
      {
        dgr: +data.orientNumber2LatDGR,
        mins: +data.orientNumber2LatMins,
        dir: data.orientNumber2LatDir,
      },
      {
        dgr: +data.DRLatDGR,
        mins: +data.DRLatMins,
        dir: data.DRLatDir,
      }
    );

    let departureDiffOrient_3 = departureDiff(
      {
        dgr: +data.orientNumber3LongDGR,
        mins: +data.orientNumber3LongMins,
        dir: data.orientNumber3LongDir,
      },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir },
      60
    );
    let latDiffOrient_3 = latDiff(
      {
        dgr: +data.orientNumber3LatDGR,
        mins: +data.orientNumber3LatMins,
        dir: data.orientNumber3LatDir,
      },
      {
        dgr: +data.DRLatDGR,
        mins: +data.DRLatMins,
        dir: data.DRLatDir,
      }
    );

    let departureDiffOrient_4 = departureDiff(
      {
        dgr: +data.orientNumber4LongDGR,
        mins: +data.orientNumber4LongMins,
        dir: data.orientNumber4LongDir,
      },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir },
      60
    );
    let latDiffOrient_4 = latDiff(
      {
        dgr: +data.orientNumber4LatDGR,
        mins: +data.orientNumber4LatMins,
        dir: data.orientNumber4LatDir,
      },
      {
        dgr: +data.DRLatDGR,
        mins: +data.DRLatMins,
        dir: data.DRLatDir,
      }
    );

    let dU_Matrix = createDeltaUMatrix(
      [
        dgrToRadians(+data.orientNumber1Bearing),
        DRBearing(departureDiffOrient_1, latDiffOrient_1),
      ],
      [
        dgrToRadians(+data.orientNumber2Bearing),
        DRBearing(departureDiffOrient_2, latDiffOrient_2),
      ],
      [
        dgrToRadians(+data.orientNumber3Bearing),
        DRBearing(departureDiffOrient_3, latDiffOrient_3),
      ],
      [
        dgrToRadians(+data.orientNumber4Bearing),
        DRBearing(departureDiffOrient_4, latDiffOrient_4),
      ]
    );
    let invertedD_matrix = createInvertedD_Matrix();
    let A_Matrix = createAMatrix(
      [departureDiffOrient_1, latDiffOrient_1],
      [departureDiffOrient_2, latDiffOrient_2],
      [departureDiffOrient_3, latDiffOrient_3],
      [departureDiffOrient_4, latDiffOrient_4]
    );
    let AD_matrix = multiplyTransposedA_MatrixAndInvertedD_Matrix(
      A_Matrix,
      invertedD_matrix
    );
    let N_Matrix = findN_matrix(AD_matrix, A_Matrix);
    let ADU_Matrix =
      multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix(
        AD_matrix,
        dU_Matrix
      );
    let deltaX_Matrix = createDeltaX_Matrix(N_Matrix, ADU_Matrix);
    let compassError = calculateCompassError(deltaX_Matrix);

    console.log(compassError);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 0.7, backgroundColor: "rgb(157 143 143 / 60%)" }}>
        <Typography variant="h3" gutterBottom>
          Курсовая работа по МОС
        </Typography>
        <Typography>Исходные данные</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {initialValues.map((item) => (
          <NavItem key={item} number={item} register={register} />
        ))}
        <div className="divider"></div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item>Счислимые координаты</Item>
            </Grid>
            <Grid item xs={3}>
              <Item sx={{ height: "80%" }}>Широта</Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLatDGR", { required: true })}
                  name="DRLatDGR"
                  label="Градусы"
                  variant="outlined"
                />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLatMins", { required: true })}
                  name="DRLatMins"
                  label="Минуты"
                  variant="outlined"
                />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLatDir", { required: true })}
                  name="DRLatDir"
                  label="Наименование"
                  variant="outlined"
                />
              </Item>
            </Grid>

            <Grid item xs={3}>
              <Item sx={{ height: "80%" }}>Долгота</Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLongDGR", { required: true })}
                  name="DRLongDGR"
                  label="Градусы"
                  variant="outlined"
                />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLongMins", { required: true })}
                  name="DRLongMins"
                  label="Минуты"
                  variant="outlined"
                />
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <TextField
                  {...register("DRLongDir", { required: true })}
                  name="DRLongDir"
                  label="Наименование"
                  variant="outlined"
                />
              </Item>
            </Grid>
          </Grid>
        </Box>

        <ButtonCard>
          <Button type="submit" onClick={onSubmit}>
            Вычислить
          </Button>
        </ButtonCard>
      </form>
    </div>
  );
}

export default App;
