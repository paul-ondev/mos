import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { transpose } from "mathjs";
import React from "react";
import { DisplayingCalculatedData } from "../../App";
import ImageWithValue from "../ImageWithValue";
import Matrix from "../Matrix";

import DRbearings_1 from "./../../images/DRbearings1.png";
import DRbearings_2 from "./../../images/DRbearings2.png";
import deltaU_img from "./../../images/deltaU.png";
import partialDifferential from "./../../images/partialDifferential.png";
import A_Matrix from "./../../images/A_Matrix.png";
import D1_Matrix from "./../../images/D-1_Matrix.png";
import lambda_formula from "./../../images/lambda_formula.png";
import psiAngle from "./../../images/psiAngle.png";
import discrepancy_img from "./../../images/discrepancy.png";
import V_Matrix_img from "./../../images/V_Matrix.png";
import posteriori_N_Matrix from "./../../images/posteriori_N_Matrix.png";
import explanation from "./../../images/explanation.png";
import dX_explanation from "./../../images/dX_explanation.png";

type Props = {
  dataForIteration: DisplayingCalculatedData;
  isFirstIteration: boolean;
};

export default function IterationData({
  dataForIteration,
  isFirstIteration,
}: Props) {
  let N1_Matrix_Formula = [
    ["n11", "n12"],
    ["n21", "n22"],
  ];
  let discrepancyArray_Formula = [
    ` ${dataForIteration.discrepancyObj.angle_RoundTo1} °`,
    ` ${dataForIteration.discrepancyObj.value_RoundTo6} '`,
  ];
  return (
    <div>
      <Typography variant="h3" mt={2} mb={3}>
        {isFirstIteration ? "Первая итерация" : "Вторая итерация"}
      </Typography>

      {!isFirstIteration && (
        <div>
          <h6>Исходными данными для второй итерации являются:</h6>
          <ol>
            <li>
              исходные разности широт и отшествия от ориентиров до счислимой
              точки
            </li>
            <li>
              разность широт и отшествие от счислимой точки до обсервованной
              (получили из матрицы неизвестных в первой итерации)
            </li>
          </ol>
          <p>
            {" "}
            Таким образом, полученные в первой итерации обсервованные координаты
            (разность широт и отшествие из матрицы неизвестных ∆Х) принимаются
            за счислимые координаты во второй итерации. Далее вычисления
            выполняются аналогично.
          </p>
          <img src={explanation} alt="" width={"400px"} />
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 25 }} align="center">
                  Номер ориентира
                </TableCell>
                <TableCell sx={{ fontSize: 25 }} align="center">
                  Разность широт <b>∆φ</b>
                </TableCell>
                <TableCell sx={{ fontSize: 25 }} align="center">
                  Отшествие <b>∆w</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataForIteration.latDiff_Matrix.map((item, i) => (
                <TableRow>
                  <TableCell align="center">{i + 1} ориентир</TableCell>
                  <TableCell align="center">{item} '</TableCell>
                  <TableCell align="center">
                    {dataForIteration.departureDiff_Matrix[i]} '
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <h5>1. Найдём счислимые пеленга</h5>
      <ImageWithValue
        imageUrl={isFirstIteration ? DRbearings_1 : DRbearings_2}
        oneDimensionArr={dataForIteration.DRBearingsSet_Matrix}
        withoutMatrixBorder
      />
      <h5>2. Формируем матрицу ∆U</h5>
      <ImageWithValue
        imageUrl={deltaU_img}
        oneDimensionArr={dataForIteration.dU_Matrix}
      />
      <h5>3. Рассчитываем матрицу A.</h5>
      <h6>Находим частные производные по ∂x и ∂y и ∂z</h6>
      <img src={partialDifferential} alt="" width={"400px"} />
      <h6>Формируем матрицу A</h6>
      <ImageWithValue
        imageUrl={A_Matrix}
        twoDimensionArray={dataForIteration.A_Matrix}
      />
      <h5>
        4. Вычисляем весовую матрицу D<sup>-1</sup>
      </h5>
      <img src={D1_Matrix} alt="" />
      <h5>
        5. Вычисляем промежуточную матрицу A<sup>T</sup>× D<sup>-1</sup>
      </h5>
      <div className="container">
        <Matrix
          twoDimensionArray={transpose(dataForIteration.A_Matrix)}
          endMultiplySign
        />
        <Matrix
          twoDimensionArray={dataForIteration.invertedD_Matrix}
          endEqualSign
        />
      </div>
      <Matrix
        twoDimensionArray={JSON.parse(
          JSON.stringify(dataForIteration?.AD_Matrix)
        )}
        startEqualSign
      />
      <h5>
        6. Вычисляем матрицу коэффициентов нормального уравнения N = A
        <sup>T</sup>× D<sup>-1</sup> × A
      </h5>

      <Matrix
        twoDimensionArray={JSON.parse(
          JSON.stringify(dataForIteration?.AD_Matrix)
        )}
        endMultiplySign
      />
      <div className="container">
        <Matrix
          twoDimensionArray={dataForIteration.A_Matrix}
          startMultiplySign
        />
        <Matrix twoDimensionArray={dataForIteration.N_Matrix} startEqualSign />
      </div>

      <h5>
        7. Вычисляем ковариационную матрицу погрешностей обсервованных координат
        N<sup>-1</sup> = (A
        <sup>T</sup>× D<sup>-1</sup> × A)<sup>-1</sup> =
      </h5>
      <div className="container">
        <Matrix
          twoDimensionArray={dataForIteration.invertedN_Matrix}
          startEqualSign
          emphasizeN1Matrix
        />
        <Matrix
          twoDimensionArray={dataForIteration.N1_Matrix}
          startSign=" N1 = "
          emphasizeN1Matrix
        />
      </div>

      <h5>
        8. Вычисляем матрицу (вектор) неизвестных: ∆{" "}
        <span className="overXSign">x</span> = N<sup>-1</sup> × A<sup>T</sup> ×
        D<sup>-1</sup> × ∆U =
      </h5>
      <div className="container">
        <Matrix
          twoDimensionArray={dataForIteration.invertedN_Matrix}
          startEqualSign
        />
        <Matrix
          twoDimensionArray={JSON.parse(
            JSON.stringify(dataForIteration?.AD_Matrix)
          )}
          startMultiplySign
          endMultiplySign
        />
      </div>
      <div className="container">
        <Matrix
          oneDimensionArr={dataForIteration.dU_Matrix}
          startMultiplySign
          endEqualSign
        />

        <ImageWithValue
          imageUrl={dX_explanation}
          oneDimensionArr={JSON.parse(
            JSON.stringify(dataForIteration.dX_Matrix)
          )}
          imageClassName={"dX_explanation"}
          startSign={" = "}
        />
      </div>
      <h6>Поправка компаса = {dataForIteration.compassError_RoundTo6} °</h6>
      <h5>9. Рассчитаем параметры обсервации</h5>
      <div className="finalFirstIterationValues">
        <div>
          1) <b>φ</b>
          <sub>0</sub> = <b>φ</b>
          <sub>c</sub> + <b>∆φ</b> ={" "}
          <b>
            {" "}
            {dataForIteration.finalObservedCoordinates.lat.dgr +
              "°  " +
              dataForIteration.finalObservedCoordinates.lat.mins +
              "'  " +
              dataForIteration.finalObservedCoordinates.lat.seconds_RoundTo2 +
              '"  ' +
              (dataForIteration.finalObservedCoordinates.lat
                .isDirectionNorthOrEast
                ? "N"
                : "S")}
          </b>
        </div>
        <div>
          2) <b>λ</b>
          <sub>0</sub> = <b>λ</b>
          <sub>c</sub> + <b>∆λ</b> ={" "}
          <b>
            {dataForIteration.finalObservedCoordinates.lon.dgr +
              "°  " +
              dataForIteration.finalObservedCoordinates.lon.mins +
              "'  " +
              dataForIteration.finalObservedCoordinates.lon.seconds_RoundTo2 +
              '"  ' +
              (dataForIteration.finalObservedCoordinates.lon
                .isDirectionNorthOrEast
                ? "E"
                : "W")}
          </b>
        </div>
      </div>
      <div className="finalFirstIterationValues">
        <ImageWithValue
          imageUrl={discrepancy_img}
          formula_oneDimensionArray={discrepancyArray_Formula}
          withoutMatrixBorder
          imageClassName={"psiAngle_formula"}
        />
      </div>
      <h5>
        10. Априорная точность обсервации (матрица N1 рассчитана в пункте 7)
      </h5>
      <h6>
        Найдём собственные числа матрицы N1, а затем малую (b) и большую (a)
        полуоси эллипса погрешностей
      </h6>

      <ImageWithValue
        imageUrl={lambda_formula}
        imageClassName={"lambda_formula"}
        formula_twoDimensionArray={N1_Matrix_Formula}
        startSign={"N1 = "}
      />
      <div className="container">
        <table className="value withoutMatrixBorder">
          <tbody>
            <tr>
              <td>
                λ1 = {dataForIteration.prioriErrors?.firstLambda_RoundTo6}
              </td>
              <td>
                a = √λ1 = {dataForIteration.prioriErrors.a_RoundTo6} x 1852
                метра
              </td>
              <td>
                {" "}
                = {dataForIteration.prioriErrors.a_meters_RoundTo1} метров
              </td>
            </tr>
            <tr>
              <td>
                λ2 = {dataForIteration.prioriErrors?.secondLambda_RoundTo6}
              </td>
              <td>
                b = √λ2 = {dataForIteration.prioriErrors.b_RoundTo6} x 1852
                метра
              </td>
              <td>
                = {dataForIteration.prioriErrors.b_meters_RoundTo1} метров
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h6>
        Вычислим угол наклона большой полуоси относительно N-истинного, а также
        радиальную погрешность M
      </h6>

      <ImageWithValue
        imageUrl={psiAngle}
        imageClassName={"psiAngle_formula"}
        withoutMatrixBorder
        formula_oneDimensionArray={
          dataForIteration.psiAngleAndRadialErrorArr_Formula
        }
      />

      <h5>11. Апостериорная точность обсервации</h5>
      <h6> Рассчитываем вектор невязок</h6>
      <ImageWithValue
        imageUrl={V_Matrix_img}
        imageClassName={"psiAngle_formula"}
        oneDimensionArr={dataForIteration.V_Matrix}
      />
      <h6>
        {" "}
        Рассчитываем матрицу V <sup>T</sup> × D<sup>-1</sup> =
      </h6>
      {/* Transposed V matrix */}

      <Matrix
        oneDimensionRowArr={dataForIteration.V_Matrix}
        endMultiplySign
        startEqualSign
      />
      <Matrix
        twoDimensionArray={dataForIteration.invertedD_Matrix}
        endEqualSign
        startMultiplySign
      />

      <Matrix
        oneDimensionRowArr={dataForIteration.transposedVAndInvertedD_Matrix}
        startEqualSign
      />
      <ImageWithValue
        imageUrl={posteriori_N_Matrix}
        startSign={" = "}
        imageClassName={"psiAngle_formula"}
        twoDimensionArray={dataForIteration.posterioriN_Matrix}
        emphasizeN1Matrix
      />

      <h6>
        Найдём собственные числа апостериорной матрицы N1<sub>апостер</sub>, а
        затем малую (b) и большую (a) полуоси эллипса погрешностей
      </h6>

      <ImageWithValue
        imageUrl={lambda_formula}
        imageClassName={"lambda_formula"}
        formula_twoDimensionArray={N1_Matrix_Formula}
        startSign={" N1<sub>апостер</sub> = "}
      />
      <div className="container">
        <table className="value withoutMatrixBorder">
          <tbody>
            <tr>
              <td>
                λ1 ={" "}
                {dataForIteration.posterioriErrorsObj?.firstLambda_RoundTo6}
              </td>
              <td>
                a = √λ1 = {dataForIteration.posterioriErrorsObj.a_RoundTo6} x
                1852 метра
              </td>
              <td>
                {" "}
                = {dataForIteration.posterioriErrorsObj.a_meters_RoundTo1}{" "}
                метров
              </td>
            </tr>
            <tr>
              <td>
                λ2 ={" "}
                {dataForIteration.posterioriErrorsObj?.secondLambda_RoundTo6}
              </td>
              <td>
                b = √λ2 = {dataForIteration.posterioriErrorsObj.b_RoundTo6} x
                1852 метра
              </td>
              <td>
                = {dataForIteration.posterioriErrorsObj.b_meters_RoundTo1}{" "}
                метров
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h6>
        Вычислим угол наклона большой полуоси относительно N-истинного, а также
        радиальную погрешность M
      </h6>

      <ImageWithValue
        imageUrl={psiAngle}
        imageClassName={"psiAngle_formula"}
        withoutMatrixBorder
        formula_oneDimensionArray={
          dataForIteration.posterioriPsiAngleAndRadialErrorArr_Formula
        }
      />
    </div>
  );
}
