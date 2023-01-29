import {
  diag,
  fix,
  index,
  inv,
  map,
  MathType,
  multiply,
  range,
  round,
  sec,
  subset,
  subtract,
  transpose,
} from "mathjs";
import { DisplayingCalculatedData, inputData } from "../App";

export const toMins = (dgr: number, mins: number): number => {
  return dgr * 60 + mins;
};

export type latDirection = "n" | "N" | "s" | "S";
export type longDirection = "w" | "W" | "e" | "E";
export type whatIteration = "First Iteration" | "Second Iteration";

export interface latObject {
  dgr: number;
  mins: number;
  dir: latDirection;
}
export interface longObject {
  dgr: number;
  mins: number;
  dir: longDirection;
}

export function latDiff(observedLat: latObject, DRLat: latObject) {
  let observedLatInMins = toMins(observedLat.dgr, observedLat.mins);
  observedLatInMins =
    observedLat.dir === "n" || observedLat.dir === "N"
      ? observedLatInMins
      : -observedLatInMins;
  let DRLatInMins = toMins(DRLat.dgr, DRLat.mins);
  DRLatInMins =
    DRLat.dir === "n" || DRLat.dir === "N" ? DRLatInMins : -DRLatInMins;
  return observedLatInMins - DRLatInMins;
}

export const dgrToRadians = (dgr: number) => {
  return dgr * (Math.PI / 180);
};

export const radiansToDgr = (rad: number) => {
  return rad * (180 / Math.PI);
};

export const departureDiff = (
  observedLong: longObject,
  DRlong: longObject,
  meanLatDGR: number
) => {
  let observedLongInMins = toMins(observedLong.dgr, observedLong.mins);
  observedLongInMins =
    observedLong.dir === "e" || observedLong.dir === "E"
      ? observedLongInMins
      : -observedLongInMins;
  let DRlongInMins = toMins(DRlong.dgr, DRlong.mins);
  DRlongInMins =
    DRlong.dir === "e" || DRlong.dir === "E" ? DRlongInMins : -DRlongInMins;
  return (
    (observedLongInMins - DRlongInMins) * Math.cos(dgrToRadians(meanLatDGR))
  );
};

export const DRBearing = (departureDiff: number, latDiff: number): number => {
  let bearing_quarter = Math.atan(departureDiff / latDiff);

  if (departureDiff > 0) {
    return bearing_quarter > 0 ? bearing_quarter : bearing_quarter + Math.PI;
  }
  if (departureDiff < 0) {
    return bearing_quarter > 0
      ? bearing_quarter + Math.PI
      : bearing_quarter + 2 * Math.PI;
  }
  console.log("ERROR departureDiff = 0");
  return 0;
};

export const createDeltaUMatrix = (
  firstArr: number[],
  secondArr: number[],
  thirdArr: number[],
  fourthArr: number[]
) => {
  // обсервованный НП - Счислимый НП in rad
  let dU1 = firstArr[0] - firstArr[1];
  let dU2 = secondArr[0] - secondArr[1];
  let dU3 = thirdArr[0] - thirdArr[1];
  let dU4 = fourthArr[0] - fourthArr[1];
  // return [dU1, dU2, dU3, dU4];
  return map([dU1, dU2, dU3, dU4], (i) => {
    return i;
  });
};

export function createAMatrix(
  firstDepartureAndDeltaLat: number[],
  secondDepartureAndDeltaLat: number[],
  thirdDepartureAndDeltaLat: number[],
  fourthDepartureAndDeltaLat: number[]
) {
  //отшествие и разность широт
  let resultArr: number[][] = [];
  const args = Array.from(arguments);

  args.map((arg, index) =>
    resultArr.push([
      args[index][0] / (args[index][0] ** 2 + args[index][1] ** 2),
      // why negative?
      -args[index][1] / (args[index][0] ** 2 + args[index][1] ** 2),
      1,
    ])
  );
  return resultArr;
}

export const createInvertedD_Matrix = () => {
  let matrixElement = 1 / dgrToRadians(0.2) ** 2;
  matrixElement = round(matrixElement, 8);
  return diag([matrixElement, matrixElement, matrixElement, matrixElement]);
};

export const multiplyTransposedA_MatrixAndInvertedD_Matrix = (
  A_Matrix: number[][],
  invertedD_Matrix: number[][] | math.Matrix
) => {
  return multiply(transpose(A_Matrix), invertedD_Matrix);
};

export const findN_matrix = (
  transposedA_MatrixAndInvertedD_Matrix: any,
  A_Matrix: number[][] | math.Matrix
) => {
  return multiply(transposedA_MatrixAndInvertedD_Matrix, A_Matrix);
};

export const multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix = (
  transposedA_MatrixAndInvertedD_Matrix: math.MathType,
  dU: number[]
) => {
  return multiply(transposedA_MatrixAndInvertedD_Matrix, dU);
};

export const multiplyN_MatrixAndAD_Matrix = (
  N_Matrix: math.Matrix,
  AD_Matrix: MathType
) => {
  return multiply(N_Matrix, AD_Matrix);
};

export const toInverseN_Matrix = (N_Matrix: math.Matrix) => {
  return inv(N_Matrix);
};

export const createN1_Matrix = (invertedN_Matrix: math.Matrix) => {
  return subset(invertedN_Matrix, index(range(0, 2), range(0, 2)));
};

export const createDeltaX_Matrix = (
  N_Matrix: math.Matrix,
  // Doesn't work either way!!!
  ADU_Matrix: math.Matrix | MathType | number | number[]
) => {
  return multiply(N_Matrix, ADU_Matrix);
};

// problems with types' assigning
export const calculateCompassError = (deltaX_Matrix: any) => {
  return radiansToDgr(deltaX_Matrix[2]);
};

export const calculateObservedCoordinates = (
  dX_Matrix: any,
  DRLatObject: latObject,
  DRLongObject: longObject
) => {
  let DRLatInMins = toMins(DRLatObject.dgr, DRLatObject.mins);

  DRLatInMins =
    DRLatObject.dir === "n" || DRLatObject.dir === "N"
      ? DRLatInMins
      : -DRLatInMins;

  let DRLongInMins = toMins(DRLongObject.dgr, DRLongObject.mins);
  DRLongInMins =
    DRLongObject.dir === "e" || DRLongObject.dir === "E"
      ? DRLongInMins
      : -DRLongInMins;

  const lat = convertMinutesToDMSFromMinutes(
    DRLatInMins + radiansToDgr(dX_Matrix[0]) / 60
  );
  const lon = convertMinutesToDMSFromMinutes(
    DRLongInMins + (radiansToDgr(dX_Matrix[1]) / 60) * sec(dgrToRadians(60))
  );

  return { lat, lon };
};

const extractIntegerPartAndRemainderFromDivision = (
  divisible: number,
  divider: number
) => {
  const quotient = fix(divisible / divider);
  const remainder = divisible % divider;

  return [quotient, remainder];
};

export const convertMinutesToDMSFromMinutes = (minuets: number) => {
  let isDirectionNorthOrEast = minuets > 0 ? true : false;
  let positiveMinutes = Math.abs(minuets);

  let degreesAndMinutesArray = extractIntegerPartAndRemainderFromDivision(
    positiveMinutes,
    60
  );

  let minutesAndSecondsArray = extractIntegerPartAndRemainderFromDivision(
    degreesAndMinutesArray[1],
    1
  );
  let seconds_RoundTo2 = minutesAndSecondsArray[1] * 60;
  return {
    dgr: degreesAndMinutesArray[0],
    mins: minutesAndSecondsArray[0],
    seconds_RoundTo2,
    isDirectionNorthOrEast,
  };
};

export const calculatePrioriErrors = (N1_Matrix: any) => {
  let firstLambda_RoundTo6 =
    (N1_Matrix[0][0] +
      N1_Matrix[1][1] +
      Math.sqrt(
        (N1_Matrix[0][0] - N1_Matrix[1][1]) ** 2 + 4 * N1_Matrix[0][1] ** 2
      )) /
    2;
  let secondLambda_RoundTo6 =
    (N1_Matrix[0][0] +
      N1_Matrix[1][1] -
      Math.sqrt(
        (N1_Matrix[0][0] - N1_Matrix[1][1]) ** 2 + 4 * N1_Matrix[0][1] ** 2
      )) /
    2;
  let a_RoundTo6 = Math.sqrt(firstLambda_RoundTo6);
  let b_RoundTo6 = Math.sqrt(secondLambda_RoundTo6);
  let a_meters_RoundTo1 = a_RoundTo6 * 1852;
  let b_meters_RoundTo1 = b_RoundTo6 * 1852;
  return {
    firstLambda_RoundTo6,
    secondLambda_RoundTo6,
    a_RoundTo6,
    b_RoundTo6,
    a_meters_RoundTo1,
    b_meters_RoundTo1,
    radialError_RoundTo1: Math.sqrt(
      a_meters_RoundTo1 ** 2 + b_meters_RoundTo1 ** 2
    ),
  };
};

export const findPsiAngle = (firstLambda_RoundTo6: number, N1_Matrix: any) => {
  let angle = Math.atan(
    (firstLambda_RoundTo6 - N1_Matrix[0][0]) / N1_Matrix[0][1]
  );
  return angle > 0 ? radiansToDgr(angle) : 180 + radiansToDgr(angle);
};

export const calculateDiscrepancyAngleAndValue = (dX_Matrix: any) => {
  let angle_RoundTo1 = Math.atan(dX_Matrix[1] / dX_Matrix[0]) * (180 / Math.PI);

  if (angle_RoundTo1 < 0) {
    angle_RoundTo1 = angle_RoundTo1 + 180;
  }
  let value_RoundTo6 = Math.sqrt(dX_Matrix[0] ** 2 + dX_Matrix[1] ** 2);
  return {
    angle_RoundTo1,
    value_RoundTo6,
  };
};

export const calculateV_Matrix = (
  A_Matrix: number[][],
  dX_Matrix: math.Matrix,
  dU_Matrix: number[]
) => {
  return subtract(multiply(A_Matrix, dX_Matrix), dU_Matrix);
};

export const multiplyTransposedVAndInvertedD_Matrix = (
  V_Matrix: MathType,
  invertedD_Matrix: math.Matrix
) => {
  return multiply(V_Matrix, invertedD_Matrix);
};

export const calculatePosterioriN_Matrix = (
  V_Matrix: MathType,
  transposedVAndInvertedD_Matrix: math.Matrix,
  N_Matrix: math.Matrix
) => {
  let VtD1V = multiply(transposedVAndInvertedD_Matrix, V_Matrix);
  console.log(VtD1V);
  return multiply(VtD1V, N_Matrix);
};

export const calculateIterationData = (
  data: inputData,
  whatIteration: whatIteration,
  dX_MatrixAfterFirstIteration?: any
): DisplayingCalculatedData => {
  // Departure and Latitude differences for the first iteration
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
  if (whatIteration === "Second Iteration") {
    departureDiffOrient_1 =
      departureDiffOrient_1 - dX_MatrixAfterFirstIteration[1];
    departureDiffOrient_2 =
      departureDiffOrient_2 - dX_MatrixAfterFirstIteration[1];
    departureDiffOrient_3 =
      departureDiffOrient_3 - dX_MatrixAfterFirstIteration[1];
    departureDiffOrient_4 =
      departureDiffOrient_4 - dX_MatrixAfterFirstIteration[1];
    latDiffOrient_1 = latDiffOrient_1 - dX_MatrixAfterFirstIteration[0];
    latDiffOrient_2 = latDiffOrient_2 - dX_MatrixAfterFirstIteration[0];
    latDiffOrient_3 = latDiffOrient_3 - dX_MatrixAfterFirstIteration[0];
    latDiffOrient_4 = latDiffOrient_4 - dX_MatrixAfterFirstIteration[0];
  }

  let DRBearingsSet_Matrix = [
    whatIteration === "First Iteration"
      ? DRBearing(departureDiffOrient_1, latDiffOrient_1)
      : DRBearing(departureDiffOrient_1, latDiffOrient_1) +
        dX_MatrixAfterFirstIteration[2],
    whatIteration === "First Iteration"
      ? DRBearing(departureDiffOrient_2, latDiffOrient_2)
      : DRBearing(departureDiffOrient_2, latDiffOrient_2) +
        dX_MatrixAfterFirstIteration[2],
    whatIteration === "First Iteration"
      ? DRBearing(departureDiffOrient_3, latDiffOrient_3)
      : DRBearing(departureDiffOrient_3, latDiffOrient_3) +
        dX_MatrixAfterFirstIteration[2],
    whatIteration === "First Iteration"
      ? DRBearing(departureDiffOrient_4, latDiffOrient_4)
      : DRBearing(departureDiffOrient_4, latDiffOrient_4) +
        dX_MatrixAfterFirstIteration[2],
  ];

  let dU_Matrix = createDeltaUMatrix(
    [dgrToRadians(+data.orientNumber1Bearing), DRBearingsSet_Matrix[0]],
    [dgrToRadians(+data.orientNumber2Bearing), DRBearingsSet_Matrix[1]],
    [dgrToRadians(+data.orientNumber3Bearing), DRBearingsSet_Matrix[2]],
    [dgrToRadians(+data.orientNumber4Bearing), DRBearingsSet_Matrix[3]]
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
  let ADU_Matrix = multiplyTransposedA_MatrixAndInvertedD_MatrixOnDeltaU_Matrix(
    AD_Matrix,
    dU_Matrix
  );

  let invertedN_Matrix = toInverseN_Matrix(N_Matrix);
  let N1_Matrix = createN1_Matrix(invertedN_Matrix);
  let dX_Matrix = createDeltaX_Matrix(invertedN_Matrix, ADU_Matrix);
  let compassError_RoundTo6 = calculateCompassError(dX_Matrix);
  let finalObservedCoordinates = calculateObservedCoordinates(
    dX_Matrix,
    { dgr: +data.DRLatDGR, mins: +data.DRLatMins, dir: data.DRLatDir },
    { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir }
  );
  let prioriErrors = calculatePrioriErrors(N1_Matrix);
  let psiAngle = findPsiAngle(prioriErrors.firstLambda_RoundTo6, N1_Matrix);
  let psiAngleAndRadialErrorArr_Formula = [
    `= ${psiAngle.toFixed(2)} °`,
    `= ${prioriErrors.radialError_RoundTo1.toFixed(2)} м`,
  ];
  let discrepancyObj = calculateDiscrepancyAngleAndValue(dX_Matrix);
  let V_Matrix = calculateV_Matrix(A_Matrix, dX_Matrix, dU_Matrix);
  let transposedVAndInvertedD_Matrix = multiplyTransposedVAndInvertedD_Matrix(
    V_Matrix,
    invertedD_Matrix
  );
  let posterioriN_Matrix = calculatePosterioriN_Matrix(
    V_Matrix,
    transposedVAndInvertedD_Matrix,
    invertedN_Matrix
  );
  let posterioriN1_Matrix = createN1_Matrix(posterioriN_Matrix);
  let posterioriErrorsObj = calculatePrioriErrors(posterioriN1_Matrix);
  let posterioriPsiAngle = findPsiAngle(
    posterioriErrorsObj.firstLambda_RoundTo6,
    posterioriN1_Matrix
  );
  let posterioriPsiAngleAndRadialErrorArr_Formula = [
    `= ${posterioriPsiAngle.toFixed(2)} °`,
    `= ${posterioriErrorsObj.radialError_RoundTo1.toFixed(2)} м`,
  ];

  let dataForIterationObject = {
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
    latDiff_Matrix: [
      latDiffOrient_1,
      latDiffOrient_2,
      latDiffOrient_3,
      latDiffOrient_4,
    ],
    departureDiff_Matrix: [
      departureDiffOrient_1,
      departureDiffOrient_2,
      departureDiffOrient_3,
      departureDiffOrient_4,
    ],
    DRBearingsSet_Matrix,

    dU_Matrix,
    A_Matrix,
    invertedD_Matrix,
    AD_Matrix: AD_Matrix,
    N_Matrix,
    ADU_Matrix,
    invertedN_Matrix,
    N1_Matrix,
    dX_Matrix,
    compassError_RoundTo6,
    finalObservedCoordinates,
    prioriErrors,

    psiAngleAndRadialErrorArr_Formula,
    discrepancyObj,
    V_Matrix,
    transposedVAndInvertedD_Matrix,
    posterioriN_Matrix,
    posterioriErrorsObj,

    posterioriPsiAngleAndRadialErrorArr_Formula,
  };
  return dataForIterationObject;
};

function roundIterationObject_MatrixValues(data: any) {
  const roundedData = JSON.parse(JSON.stringify(data));
  const keys = Object.keys(roundedData);

  keys.forEach((key) => {
    if (key.includes("_Matrix")) {
      if (Array.isArray(roundedData[key])) {
        roundedData[key] = roundedData[key].map((val: any) => {
          if (Array.isArray(val)) {
            return val.map((nestedVal: any) => {
              if (typeof nestedVal === "number") return nestedVal.toFixed(6);
              else if (Array.isArray(nestedVal))
                return roundIterationObject_MatrixValues(nestedVal);
              else return nestedVal;
            });
          }

          if (typeof val === "number") return val.toFixed(6);
          else return val;
        });
      }

      if (typeof roundedData[key] === "number") {
        roundedData[key] = roundedData[key].toFixed(6);
      }
    }
  });
  return roundedData;
}

function roundObject_RoundToValues(
  data: DisplayingCalculatedData
): DisplayingCalculatedData {
  const roundedData = JSON.parse(JSON.stringify(data));

  function roundValues(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object") {
          roundValues(obj[key]);
        } else if (typeof obj[key] === "number" && key.includes("_RoundTo6")) {
          obj[key] = +obj[key].toFixed(6);
        } else if (typeof obj[key] === "number" && key.includes("_RoundTo2")) {
          obj[key] = +obj[key].toFixed(2);
        } else if (typeof obj[key] === "number" && key.includes("_RoundTo1")) {
          obj[key] = +obj[key].toFixed(1);
        }
      }
    }
  }

  roundValues(roundedData);
  return roundedData;
}

export const roundIterationObjectValues = (data: DisplayingCalculatedData) => {
  let matrixesRounded = roundIterationObject_MatrixValues(data);
  return roundObject_RoundToValues(matrixesRounded);
};
