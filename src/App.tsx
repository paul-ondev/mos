import "./App.css";

import DRbearings_img from "./images/DRbearings.png";
import deltaU_img from "./images/deltaU.png";
import partialDerivative from "./images/partialDerivative.png";
import A_Matrix from "./images/A_Matrix.png";
import D1_Matrix from "./images/D-1_Matrix.png";

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
  latDirection,
  longDirection,
  latObject,
  longObject,
  multiplyN_MatrixAndAD_Matrix,
  toInverseN_Matrix,
  createN1_Matrix,
} from "./functions";
import { SetStateAction, useState } from "react";
import { MathType, round, transpose } from "mathjs";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ImageWithValue from "./components/ImageWithValue";
import Matrix from "./components/Matrix";

interface inputData {
  DRLatDGR: number;
  DRLatDir: latDirection;
  DRLatMins: number;
  DRLongDGR: number;
  DRLongDir: longDirection;
  DRLongMins: number;
  orientNumber1Bearing: number;
  orientNumber1LatDGR: number;
  orientNumber1LatDir: latDirection;
  orientNumber1LatMins: number;
  orientNumber1LongDGR: number;
  orientNumber1LongDir: longDirection;
  orientNumber1LongMins: number;
  orientNumber2Bearing: number;
  orientNumber2LatDGR: number;
  orientNumber2LatDir: latDirection;
  orientNumber2LatMins: number;
  orientNumber2LongDGR: number;
  orientNumber2LongDir: longDirection;
  orientNumber2LongMins: number;
  orientNumber3Bearing: number;
  orientNumber3LatDGR: number;
  orientNumber3LatDir: latDirection;
  orientNumber3LatMins: number;
  orientNumber3LongDGR: number;
  orientNumber3LongDir: longDirection;
  orientNumber3LongMins: number;
  orientNumber4Bearing: number;
  orientNumber4LatDGR: number;
  orientNumber4LatDir: latDirection;
  orientNumber4LatMins: number;
  orientNumber4LongDGR: number;
  orientNumber4LongDir: longDirection;
  orientNumber4LongMins: number;
}

interface DisplayingCalculatedData {
  initialValues: {
    DRPosition: {
      lat: latObject;
      long: longObject;
    };
    first: {
      lat: latObject;
      long: longObject;
      bearing: number;
    };
    second: {
      lat: latObject;
      long: longObject;
      bearing: number;
    };
    third: {
      lat: latObject;
      long: longObject;
      bearing: number;
    };
    fourth: {
      lat: latObject;
      long: longObject;
      bearing: number;
    };
  };
  latDiff: number[];
  departureDiff: number[];
  DRBearingsSet: number[];
  dU_Matrix: number[];
  A_Matrix: number[][];
  invertedD_Matrix: math.Matrix;
  AD_Matrix: math.Matrix | MathType | number;
  N_Matrix: math.Matrix;
  ADU_Matrix: math.Matrix | MathType | number;

  invertedN_Matrix: math.Matrix;
  N1_Matrix: math.Matrix;
  dX_Matrix: math.Matrix | MathType | number;
  compassError: number;
}

type genericForFirstIteration = DisplayingCalculatedData | undefined;

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

  const [dataForFirstIteration, setDataForFirstIteration] =
    useState<genericForFirstIteration>(undefined);

  const onSubmit = (data: any) => {
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

    let DRBearingsSet = [
      DRBearing(departureDiffOrient_1, latDiffOrient_1),
      DRBearing(departureDiffOrient_2, latDiffOrient_2),
      DRBearing(departureDiffOrient_3, latDiffOrient_3),
      DRBearing(departureDiffOrient_4, latDiffOrient_4),
    ];

    let dU_Matrix = createDeltaUMatrix(
      [dgrToRadians(+data.orientNumber1Bearing), DRBearingsSet[0]],
      [dgrToRadians(+data.orientNumber2Bearing), DRBearingsSet[1]],
      [dgrToRadians(+data.orientNumber3Bearing), DRBearingsSet[2]],
      [dgrToRadians(+data.orientNumber4Bearing), DRBearingsSet[3]]
    );
    let invertedD_Matrix = createInvertedD_Matrix();
    let A_Matrix = createAMatrix(
      [departureDiffOrient_1, latDiffOrient_1],
      [departureDiffOrient_2, latDiffOrient_2],
      [departureDiffOrient_3, latDiffOrient_3],
      [departureDiffOrient_4, latDiffOrient_4]
    );
    let AD_Matrix = multiplyTransposedA_MatrixAndInvertedD_Matrix(
      A_Matrix,
      invertedD_Matrix
    );
    let N_Matrix = findN_matrix(AD_Matrix, A_Matrix);
    let ADU_Matrix =
      multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix(
        AD_Matrix,
        dU_Matrix
      );

    let invertedN_Matrix = toInverseN_Matrix(N_Matrix);
    let N1_Matrix = createN1_Matrix(invertedN_Matrix);
    let dX_Matrix = createDeltaX_Matrix(invertedN_Matrix, ADU_Matrix);
    let compassError = calculateCompassError(dX_Matrix);

    let dataForFirstIterationObject = {
      initialValues: {
        DRPosition: {
          lat: {
            dgr: data.DRLatDGR,
            mins: data.DRLatMins,
            dir: data.DRLatDir,
          },
          long: {
            dgr: data.DRLongDGR,
            mins: data.DRLongMins,
            dir: data.DRLongDir,
          },
        },
        first: {
          lat: {
            dgr: data.orientNumber1LatDGR,
            mins: data.orientNumber1LatMins,
            dir: data.orientNumber1LatDir,
          },
          long: {
            dgr: data.orientNumber1LongDGR,
            mins: data.orientNumber1LongMins,
            dir: data.orientNumber1LongDir,
          },
          bearing: data.orientNumber1Bearing,
        },
        second: {
          lat: {
            dgr: data.orientNumber2LatDGR,
            mins: data.orientNumber2LatMins,
            dir: data.orientNumber2LatDir,
          },
          long: {
            dgr: data.orientNumber2LongDGR,
            mins: data.orientNumber2LongMins,
            dir: data.orientNumber2LongDir,
          },
          bearing: data.orientNumber2Bearing,
        },
        third: {
          lat: {
            dgr: data.orientNumber3LatDGR,
            mins: data.orientNumber3LatMins,
            dir: data.orientNumber3LatDir,
          },
          long: {
            dgr: data.orientNumber3LongDGR,
            mins: data.orientNumber3LongMins,
            dir: data.orientNumber3LongDir,
          },
          bearing: data.orientNumber3Bearing,
        },
        fourth: {
          lat: {
            dgr: data.orientNumber4LatDGR,
            mins: data.orientNumber4LatMins,
            dir: data.orientNumber4LatDir,
          },
          long: {
            dgr: data.orientNumber4LongDGR,
            mins: data.orientNumber4LongMins,
            dir: data.orientNumber4LongDir,
          },
          bearing: data.orientNumber4Bearing,
        },
      },
      latDiff: [
        latDiffOrient_1,
        latDiffOrient_2,
        latDiffOrient_3,
        latDiffOrient_4,
      ],
      departureDiff: [
        departureDiffOrient_1,
        departureDiffOrient_2,
        departureDiffOrient_3,
        departureDiffOrient_4,
      ],
      DRBearingsSet,

      dU_Matrix,
      A_Matrix,
      invertedD_Matrix,
      AD_Matrix: AD_Matrix,
      N_Matrix,
      ADU_Matrix,
      invertedN_Matrix,
      N1_Matrix,
      dX_Matrix,
      compassError,
    };
    setDataForFirstIteration(dataForFirstIterationObject);
  };
  console.log(dataForFirstIteration?.dX_Matrix);

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
      {dataForFirstIteration?.compassError && (
        <Box mt={6}>
          <Typography variant="h3" mt={2} mb={3}>
            Первая итерация
          </Typography>
          <Typography>Исходные данные</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Номер ориентира</TableCell>
                  <TableCell align="right">Широта</TableCell>
                  <TableCell align="right">Долгота</TableCell>
                  <TableCell align="right">Пеленг обсервованный </TableCell>
                  <TableCell align="right">Разность широт</TableCell>
                  <TableCell align="right">Отшествие</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1 ориентир</TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.first.lat.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.first.lat.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.first.lat.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.first.long.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.first.long.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.first.long.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.first.bearing + "°"}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.latDiff[0], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff[0], 2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>2 ориентир</TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.second.lat.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.second.lat.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.second.lat.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.second.long.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.second.long.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.second.long.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.second.bearing + "°"}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.latDiff[1], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff[1], 2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>3 ориентир</TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.third.lat.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.third.lat.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.third.lat.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.third.long.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.third.long.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.third.long.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.third.bearing + "°"}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.latDiff[2], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff[2], 2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>4 ориентир</TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.fourth.lat.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.fourth.lat.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.fourth.lat.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.fourth.long.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.fourth.long.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.fourth.long.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.fourth.bearing + "°"}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.latDiff[3], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff[3], 2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Счислимые координаты</TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.DRPosition.lat.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.DRPosition.lat.mins +
                      "' " +
                      dataForFirstIteration?.initialValues.DRPosition.lat.dir}
                  </TableCell>
                  <TableCell align="right">
                    {dataForFirstIteration?.initialValues.DRPosition.long.dgr +
                      "°" +
                      dataForFirstIteration?.initialValues.DRPosition.long
                        .mins +
                      "' " +
                      dataForFirstIteration?.initialValues.DRPosition.long.dir}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <h5>1. Найдём счислимые пеленга</h5>
          <ImageWithValue
            imageUrl={DRbearings_img}
            oneDimensionArr={dataForFirstIteration.DRBearingsSet}
            withoutMatrixBorder
          />

          <h5>2. Формируем матрицу ∆U</h5>
          <ImageWithValue
            imageUrl={deltaU_img}
            oneDimensionArr={dataForFirstIteration.dU_Matrix}
          />

          <h5>3. Рассчитываем матрицу A.</h5>
          <h6>Находим частные производные по ∂x и ∂y и ∂z</h6>
          <img src={partialDerivative} alt="" />
          <h6>Формируем матрицу A</h6>
          <ImageWithValue
            imageUrl={A_Matrix}
            twoDimensionArray={dataForFirstIteration.A_Matrix}
          />
          <h5>
            4. Вычисляем весовую матрицу D<sup>-1</sup>
          </h5>
          <img src={D1_Matrix} alt="" />
          <h5>
            5. Вычисляем промежуточную матрицу A<sup>T</sup>× D<sup>-1</sup>
          </h5>

          <Matrix
            twoDimensionArray={transpose(dataForFirstIteration.A_Matrix)}
            endMultiplySign
          />
          <Matrix
            twoDimensionArray={dataForFirstIteration.invertedD_Matrix}
            startMultiplySign
            endEqualSign
          />
          <Matrix
            twoDimensionArray={JSON.parse(
              JSON.stringify(dataForFirstIteration?.AD_Matrix)
            )}
            startEqualSign
          />
          <h5>
            6. Вычисляем матрицу коэффициентов нормального уравнения N = A
            <sup>T</sup>× D<sup>-1</sup> × A
          </h5>

          <Matrix
            twoDimensionArray={JSON.parse(
              JSON.stringify(dataForFirstIteration?.AD_Matrix)
            )}
            endMultiplySign
          />
          <Matrix
            twoDimensionArray={dataForFirstIteration.A_Matrix}
            startMultiplySign
            endEqualSign
          />
          <Matrix
            twoDimensionArray={dataForFirstIteration.N_Matrix}
            startEqualSign
          />

          <h5>
            7. Вычисляем априорно ковариационную матрицу N<sup>-1</sup> = (A
            <sup>T</sup>× D<sup>-1</sup> × A)<sup>-1</sup> =
          </h5>
          <Matrix
            twoDimensionArray={dataForFirstIteration.invertedN_Matrix}
            startEqualSign
          />
          <Matrix
            twoDimensionArray={dataForFirstIteration.N1_Matrix}
            startSign=" N1 = "
          />

          <h5>
            8. Вычисляем матрицу (вектор) неизвестных: ∆ x = N<sup>-1</sup> × A
            <sup>T</sup> × D<sup>-1</sup> × ∆U =
          </h5>
          <Matrix
            twoDimensionArray={dataForFirstIteration.invertedN_Matrix}
            startEqualSign
            endMultiplySign
          />
          <Matrix
            twoDimensionArray={JSON.parse(
              JSON.stringify(dataForFirstIteration?.AD_Matrix)
            )}
            startMultiplySign
            endMultiplySign
          />
          <Matrix
            oneDimensionArr={dataForFirstIteration.dU_Matrix}
            startMultiplySign
            endEqualSign
          />
          <Matrix
            oneDimensionArr={JSON.parse(
              JSON.stringify(dataForFirstIteration.dX_Matrix)
            )}
            startEqualSign
          />
          <h6>Поправка компаса = {dataForFirstIteration.compassError} °</h6>
        </Box>
      )}
    </div>
  );
}

export default App;
