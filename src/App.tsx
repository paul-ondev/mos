import "./App.css";

import distance_img from "./images/graph/distance.png";
import gradientDir_img from "./images/graph/gradientDir.png";
import gradientValue_img from "./images/graph/gradientValue.png";
import navParamDiff_img from "./images/graph/navParamDiff.png";
import transfer_img from "./images/graph/transfer.png";
import reverseBearing_img from "./images/graph/reverseBearing.png";
import SDLoP_img from "./images/graph/SDLoP.png";
import theta_img from "./images/graph/theta.png";
import t12_img from "./images/graph/t12.png";
import t13_img from "./images/graph/t13.png";
import t14_img from "./images/graph/t14.png";
import t23_img from "./images/graph/t23.png";
import t24_img from "./images/graph/t24.png";
import t34_img from "./images/graph/t34.png";
import SDIntersection_img from "./images/graph/SDIntersection.png";
import SDIntersection12_img from "./images/graph/SDIntersection12.png";
import SDIntersection13_img from "./images/graph/SDIntersection13.png";
import SDIntersection14_img from "./images/graph/SDIntersection14.png";
import SDIntersection23_img from "./images/graph/SDIntersection23.png";
import SDIntersection24_img from "./images/graph/SDIntersection24.png";
import SDIntersection34_img from "./images/graph/SDIntersection34.png";
import weight_formula_img from "./images/graph/weight_formula.png";
import w12_img from "./images/graph/w12.png";
import w13_img from "./images/graph/w13.png";
import w14_img from "./images/graph/w14.png";
import w23_img from "./images/graph/w23.png";
import w24_img from "./images/graph/w24.png";
import w34_img from "./images/graph/w34.png";
import dPhi_dDep_img from "./images/graph/dPhi_dDep.png";
import weightsSum_img from "./images/graph/weightsSum.png";

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
  latDirection,
  longDirection,
  latObject,
  longObject,
  calculateIterationData,
  roundIterationObjectValues,
  calculateGraphicMethodData,
  GraphicData,
} from "./functions";
import { useState } from "react";
import { MathType, round } from "mathjs";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import IterationData from "./components/IterationData";
import ImageWithValue from "./components/ImageWithValue";
import GraphTable from "./components/GraphTable";

export interface inputData {
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

export interface DisplayingCalculatedData {
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
  latDiff_Matrix: number[];
  departureDiff_Matrix: number[];
  DRBearingsSet_Matrix: number[];
  dU_Matrix: number[];
  A_Matrix: number[][];
  invertedD_Matrix: math.Matrix;
  AD_Matrix: math.Matrix | MathType | number;
  N_Matrix: math.Matrix;
  ADU_Matrix: math.Matrix | MathType | number;

  invertedN_Matrix: math.Matrix;
  N1_Matrix: math.Matrix;
  dX_Matrix: math.Matrix | MathType | number;
  compassError_RoundTo6: number;
  finalObservedCoordinates: {
    lat: {
      dgr: number;
      mins: number;
      seconds_RoundTo4: number;
      isDirectionNorthOrEast: boolean;
    };
    lon: {
      dgr: number;
      mins: number;
      seconds_RoundTo4: number;
      isDirectionNorthOrEast: boolean;
    };
  };
  prioriErrors: {
    firstLambda_RoundTo6: number;
    secondLambda_RoundTo6: number;
    a_RoundTo6: number;
    b_RoundTo6: number;
    a_meters_RoundTo1: number;
    b_meters_RoundTo1: number;
    radialError_RoundTo1: number;
  };

  psiAngleAndRadialErrorArr_Formula: string[];
  discrepancyObj: {
    angle_RoundTo1: number;
    value_RoundTo6: number;
  };
  V_Matrix: MathType;
  transposedVAndInvertedD_Matrix: math.Matrix;
  posterioriN_Matrix: math.Matrix;
  posterioriErrorsObj: {
    firstLambda_RoundTo6: number;
    secondLambda_RoundTo6: number;
    a_RoundTo6: number;
    b_RoundTo6: number;
    a_meters_RoundTo1: number;
    b_meters_RoundTo1: number;
    radialError_RoundTo1: number;
  };

  posterioriPsiAngleAndRadialErrorArr_Formula: string[];
}

type genericForIteration = DisplayingCalculatedData | undefined;

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
    useState<genericForIteration>(undefined);

  const [dataForSecondIteration, setDataForSecondIteration] =
    useState<any>(undefined);

  const [dataForGraphicMethod, setDataForGraphicMethod] = useState<
    GraphicData | undefined
  >(undefined);

  const onSubmit = (data: any) => {
    let dataForFirstIterationObject = calculateIterationData(
      data,
      "First Iteration"
    );

    let dataForFirstIterationRoundedObject = roundIterationObjectValues(
      dataForFirstIterationObject
    );
    setDataForFirstIteration(dataForFirstIterationRoundedObject);

    let dataForSecondIterationObject = calculateIterationData(
      data,
      "Second Iteration",
      dataForFirstIterationObject.dX_Matrix
    );
    let dataForSecondIterationRoundedObject = roundIterationObjectValues(
      dataForSecondIterationObject
    );
    setDataForSecondIteration(dataForSecondIterationRoundedObject);
    //
    let graphicMethodData = calculateGraphicMethodData(
      dataForFirstIterationObject
    );

    setDataForGraphicMethod(roundIterationObjectValues(graphicMethodData));
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 0.7, backgroundColor: "rgb(157 143 143 / 60%)" }}>
        <Typography variant="h2" gutterBottom>
          Курсовая работа по МОС
        </Typography>
        {/* <Typography>Введите исходные данные</Typography> */}
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
              <Item sx={{ height: "80%" }}>
                Широта <b>φ</b>{" "}
              </Item>
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
              <Item sx={{ height: "80%" }}>
                Долгота <b>λ</b>
              </Item>
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
            =
          </Button>
        </ButtonCard>
      </form>
      {dataForFirstIteration?.compassError_RoundTo6 && (
        <Box mt={6}>
          <Typography>Исходные данные</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Номер ориентира</TableCell>
                  <TableCell align="right">
                    Широта <b>φ</b>{" "}
                  </TableCell>
                  <TableCell align="right">
                    Долгота <b>λ</b>
                  </TableCell>
                  <TableCell align="right">Пеленг обсервованный </TableCell>
                  <TableCell align="right">
                    Разность широт <b>∆φ</b>
                  </TableCell>
                  <TableCell align="right">
                    Отшествие <b>∆w</b>
                  </TableCell>
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
                    {round(dataForFirstIteration?.latDiff_Matrix[0], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff_Matrix[0], 2)}
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
                    {round(dataForFirstIteration?.latDiff_Matrix[1], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff_Matrix[1], 2)}
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
                    {round(dataForFirstIteration?.latDiff_Matrix[2], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff_Matrix[2], 2)}
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
                    {round(dataForFirstIteration?.latDiff_Matrix[3], 2)}
                  </TableCell>
                  <TableCell align="right">
                    {round(dataForFirstIteration?.departureDiff_Matrix[3], 2)}
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

          <IterationData
            dataForIteration={dataForFirstIteration}
            isFirstIteration={true}
          />
          <IterationData
            dataForIteration={dataForSecondIteration}
            isFirstIteration={false}
          />
        </Box>
      )}
      <Typography variant="h2" mt={10} mb={5}>
        Графоаналитический метод
      </Typography>
      {dataForGraphicMethod && (
        <div>
          <h5>Рассчитаем параметры для построения ЛП</h5>
          <div className="container">
            <ImageWithValue
              imageUrl={distance_img}
              formula_oneDimensionArray={dataForGraphicMethod.distancesSet_MRoundTo2.map(
                (item) => `${item} '`
              )}
              withoutMatrixBorder
            />
            <ImageWithValue
              imageUrl={gradientDir_img}
              formula_oneDimensionArray={dataForGraphicMethod.gradientDirection_MRoundTo2.map(
                (item) => `${item} °`
              )}
              withoutMatrixBorder
            />
          </div>

          <div className="container">
            <ImageWithValue
              imageUrl={gradientValue_img}
              formula_oneDimensionArray={dataForGraphicMethod.gradientValue_MRoundTo2.map(
                (item) => `${item} [°/м миля]`
              )}
              withoutMatrixBorder
            />
            <ImageWithValue
              imageUrl={navParamDiff_img}
              formula_oneDimensionArray={dataForGraphicMethod.navParameterDiff_MRoundTo2.map(
                (item) => `${item} °`
              )}
              withoutMatrixBorder
            />
          </div>
          <div className="container">
            <ImageWithValue
              imageUrl={transfer_img}
              formula_oneDimensionArray={dataForGraphicMethod.transferDistances_MRoundTo2.map(
                (item) => `${item} '`
              )}
              withoutMatrixBorder
            />
            <ImageWithValue
              imageUrl={SDLoP_img}
              formula_oneDimensionArray={dataForGraphicMethod.LoPStandardDeviation_MRoundTo2.map(
                (item) => `${item} '`
              )}
              withoutMatrixBorder
            />
          </div>
          <ImageWithValue
            imageUrl={reverseBearing_img}
            formula_oneDimensionArray={dataForGraphicMethod.reverseBearings_MRoundTo1.map(
              (item) => `${item} °`
            )}
            withoutMatrixBorder
          />
          <GraphTable
            formulaImageClassName="SDIntersection"
            dataObj1={dataForGraphicMethod.thetaAngleObj}
            formula_img={theta_img}
            imageClassName="theta"
            innerImagesArr={[
              t12_img,
              t13_img,
              t14_img,
              t23_img,
              t24_img,
              t34_img,
            ]}
          />
          <h5>Вычислим СКП каждой точки пересечения двух линий положения </h5>
          <GraphTable
            formulaImageClassName="SDIntersection"
            dataObj6={
              dataForGraphicMethod.standardDeviationForIntersectionPoint
            }
            formula_img={SDIntersection_img}
            imageClassName="SDIntersection"
            innerImagesArr={[
              SDIntersection12_img,
              SDIntersection13_img,
              SDIntersection14_img,
              SDIntersection23_img,
              SDIntersection24_img,
              SDIntersection34_img,
            ]}
          />
          <h5>Вычислим вес каждой точки пересечения двух линий положения </h5>

          <GraphTable
            formulaImageClassName="weightImg"
            dataObj6={dataForGraphicMethod.weights}
            formula_img={weight_formula_img}
            imageClassName="weightImg"
            innerImagesArr={[
              w12_img,
              w13_img,
              w14_img,
              w23_img,
              w24_img,
              w34_img,
            ]}
          />
          <div className="container">
            <ImageWithValue
              imageClassName="SDIntersection dX_explanation"
              imageUrl={weightsSum_img}
              withoutMatrixBorder
              oneDimensionArr={[dataForGraphicMethod.totalWeight_RoundTo6]}
            />
          </div>

          <h5>
            Вычислим средневзвешенные значения приращений координат относительно
            счислимой точки. Отшествие и разность широт снимаются с графика.
          </h5>
          <ImageWithValue
            imageClassName="SDIntersection"
            imageUrl={dPhi_dDep_img}
            withoutMatrixBorder
          />
        </div>
      )}
    </div>
  );
}

export default App;
// Write TS function that will return summary of all values of given object
