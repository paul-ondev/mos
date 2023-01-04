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

  const onSubmit = (data: any) => {
    console.log(data);
  };
  let dU_Matrix = createDeltaUMatrix(
    [dgrToRadians(29.9), DRBearing(4, 8)],
    [dgrToRadians(56.9), DRBearing(6, 4.3)],
    [dgrToRadians(115.2), DRBearing(7.7, -3.1)],
    [dgrToRadians(349.4), DRBearing(-1.4, 5.9)]
  );
  let a = createInvertedD_Matrix();
  let A_Matrix = createAMatrix([4, 8], [6, 4.3], [7.7, -3.1], [-1.4, 5.9]);
  let AD_matrix = multiplyTransposedA_MatrixAndInvertedD_Matrix(A_Matrix, a);
  let N_Matrix = findN_matrix(AD_matrix, A_Matrix);
  let ADU_Matrix = multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix(
    AD_matrix,
    dU_Matrix
  );
  let deltaX_Matrix = createDeltaX_Matrix(N_Matrix, ADU_Matrix);
  let compassError = calculateCompassError(deltaX_Matrix);

  console.log(compassError);

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
