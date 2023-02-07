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

export type IntersectionProperty_RoundTo1 = {
  LoP_12_Intersection_RoundTo1: number;
  LoP_13_Intersection_RoundTo1: number;
  LoP_14_Intersection_RoundTo1: number;
  LoP_23_Intersection_RoundTo1: number;
  LoP_24_Intersection_RoundTo1: number;
  LoP_34_Intersection_RoundTo1: number;
};
export type IntersectionProperty_RoundTo6 = {
  LoP_12_Intersection_RoundTo6: number;
  LoP_13_Intersection_RoundTo6: number;
  LoP_14_Intersection_RoundTo6: number;
  LoP_23_Intersection_RoundTo6: number;
  LoP_24_Intersection_RoundTo6: number;
  LoP_34_Intersection_RoundTo6: number;
};
export interface GraphicData {
  distancesSet_MRoundTo2: number[];
  gradientDirection_MRoundTo2: number[];
  gradientValue_MRoundTo2: number[];
  navParameterDiff_MRoundTo2: number[];
  transferDistances_MRoundTo2: number[];
  reverseBearings_MRoundTo1: number[];
  LoPStandardDeviation_MRoundTo2: number[];
  thetaAngleObj: IntersectionProperty_RoundTo1;
  standardDeviationForIntersectionPoint: IntersectionProperty_RoundTo6;
  weights: IntersectionProperty_RoundTo6;
  totalWeight_RoundTo6: number;
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
  let bearing = atanNavigational(departureDiff, latDiff);
  return bearing;
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
  DRLongObject: longObject,
  dX_MatrixAfterFirstIteration?: any
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

  const lat = dX_MatrixAfterFirstIteration
    ? convertMinutesToDMSFromMinutes(
        DRLatInMins + dX_Matrix[0] + dX_MatrixAfterFirstIteration[0]
      )
    : convertMinutesToDMSFromMinutes(DRLatInMins + dX_Matrix[0]);
  const lon = dX_MatrixAfterFirstIteration
    ? convertMinutesToDMSFromMinutes(
        DRLongInMins + 2 * dX_Matrix[1] + 2 * dX_MatrixAfterFirstIteration[1]
      )
    : convertMinutesToDMSFromMinutes(DRLongInMins + 2 * dX_Matrix[1]);

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
  let seconds_RoundTo4 = minutesAndSecondsArray[1] * 60;
  return {
    dgr: degreesAndMinutesArray[0],
    mins: minutesAndSecondsArray[0],
    seconds_RoundTo4,
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
  let angle_RoundTo1 = radiansToDgr(
    atanNavigational(dX_Matrix[1], dX_Matrix[0])
  );

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
  let compassError_RoundTo6 =
    whatIteration === "First Iteration"
      ? calculateCompassError(dX_Matrix)
      : calculateCompassError(dX_Matrix) +
        calculateCompassError(dX_MatrixAfterFirstIteration);

  let finalObservedCoordinates = {
    lat: {
      dgr: 0,
      mins: 0,
      seconds_RoundTo4: 0,
      isDirectionNorthOrEast: false,
    },
    lon: {
      dgr: 0,
      mins: 0,
      seconds_RoundTo4: 0,
      isDirectionNorthOrEast: false,
    },
  };
  if (whatIteration === "First Iteration") {
    finalObservedCoordinates = calculateObservedCoordinates(
      dX_Matrix,
      { dgr: +data.DRLatDGR, mins: +data.DRLatMins, dir: data.DRLatDir },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir }
    );
  }
  if (whatIteration === "Second Iteration") {
    finalObservedCoordinates = calculateObservedCoordinates(
      dX_Matrix,
      { dgr: +data.DRLatDGR, mins: +data.DRLatMins, dir: data.DRLatDir },
      { dgr: +data.DRLongDGR, mins: +data.DRLongMins, dir: data.DRLongDir },
      dX_MatrixAfterFirstIteration
    );
  }

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
          dgr: +data.DRLatDGR,
          mins: +data.DRLatMins,
          dir: data.DRLatDir,
        },
        long: {
          dgr: +data.DRLongDGR,
          mins: +data.DRLongMins,
          dir: data.DRLongDir,
        },
      },
      first: {
        lat: {
          dgr: +data.orientNumber1LatDGR,
          mins: +data.orientNumber1LatMins,
          dir: data.orientNumber1LatDir,
        },
        long: {
          dgr: +data.orientNumber1LongDGR,
          mins: +data.orientNumber1LongMins,
          dir: data.orientNumber1LongDir,
        },
        bearing: +data.orientNumber1Bearing,
      },
      second: {
        lat: {
          dgr: +data.orientNumber2LatDGR,
          mins: +data.orientNumber2LatMins,
          dir: data.orientNumber2LatDir,
        },
        long: {
          dgr: +data.orientNumber2LongDGR,
          mins: +data.orientNumber2LongMins,
          dir: data.orientNumber2LongDir,
        },
        bearing: +data.orientNumber2Bearing,
      },
      third: {
        lat: {
          dgr: +data.orientNumber3LatDGR,
          mins: +data.orientNumber3LatMins,
          dir: data.orientNumber3LatDir,
        },
        long: {
          dgr: +data.orientNumber3LongDGR,
          mins: +data.orientNumber3LongMins,
          dir: data.orientNumber3LongDir,
        },
        bearing: +data.orientNumber3Bearing,
      },
      fourth: {
        lat: {
          dgr: +data.orientNumber4LatDGR,
          mins: +data.orientNumber4LatMins,
          dir: data.orientNumber4LatDir,
        },
        long: {
          dgr: +data.orientNumber4LongDGR,
          mins: +data.orientNumber4LongMins,
          dir: data.orientNumber4LongDir,
        },
        bearing: +data.orientNumber4Bearing,
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
    if (key.includes("_MRoundTo2")) {
      if (Array.isArray(roundedData[key])) {
        roundedData[key] = roundedData[key].map((val: any) => {
          if (Array.isArray(val)) {
            return val.map((nestedVal: any) => {
              if (typeof nestedVal === "number") return nestedVal.toFixed(2);
              else if (Array.isArray(nestedVal))
                return roundIterationObject_MatrixValues(nestedVal);
              else return nestedVal;
            });
          }

          if (typeof val === "number") return val.toFixed(2);
          else return val;
        });
      }

      if (typeof roundedData[key] === "number") {
        roundedData[key] = roundedData[key].toFixed(2);
      }
    }
    if (key.includes("_MRoundTo1")) {
      if (Array.isArray(roundedData[key])) {
        roundedData[key] = roundedData[key].map((val: any) => {
          if (Array.isArray(val)) {
            return val.map((nestedVal: any) => {
              if (typeof nestedVal === "number") return nestedVal.toFixed(1);
              else if (Array.isArray(nestedVal))
                return roundIterationObject_MatrixValues(nestedVal);
              else return nestedVal;
            });
          }

          if (typeof val === "number") return val.toFixed(1);
          else return val;
        });
      }

      if (typeof roundedData[key] === "number") {
        roundedData[key] = roundedData[key].toFixed(1);
      }
    }
  });
  return roundedData;
}

function roundObject_RoundToValues(data: any) {
  const roundedData = JSON.parse(JSON.stringify(data));

  function roundValues(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object") {
          roundValues(obj[key]);
        } else if (typeof obj[key] === "number" && key.includes("_RoundTo6")) {
          obj[key] = +obj[key].toFixed(6);
        } else if (typeof obj[key] === "number" && key.includes("_RoundTo4")) {
          obj[key] = +obj[key].toFixed(4);
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

export const roundIterationObjectValues = (data: any) => {
  let matrixesRounded = roundIterationObject_MatrixValues(data);
  return roundObject_RoundToValues(matrixesRounded);
};

export const atanNavigational = (x: number, y: number) => {
  let angle = Math.atan(x / y);
  if (x > 0 && y > 0) angle = Math.abs(angle);
  if (x > 0 && y < 0) angle = Math.PI - Math.abs(angle);
  if (x < 0 && y < 0) angle = Math.PI + Math.abs(angle);
  if (x < 0 && y > 0) angle = 2 * Math.PI - Math.abs(angle);
  return angle;
};
// Graphic Method
const calculateDistance = (latDiff: number, departureDiff: number) => {
  return Math.sqrt(latDiff ** 2 + departureDiff ** 2);
};

export const calculateGraphicMethodData = (
  dataFromFirstIteration: DisplayingCalculatedData
): GraphicData => {
  let distancesSet_MRoundTo2 = [
    calculateDistance(
      dataFromFirstIteration.latDiff_Matrix[0],
      dataFromFirstIteration.departureDiff_Matrix[0]
    ),
    calculateDistance(
      dataFromFirstIteration.latDiff_Matrix[1],
      dataFromFirstIteration.departureDiff_Matrix[1]
    ),
    calculateDistance(
      dataFromFirstIteration.latDiff_Matrix[2],
      dataFromFirstIteration.departureDiff_Matrix[2]
    ),
    calculateDistance(
      dataFromFirstIteration.latDiff_Matrix[3],
      dataFromFirstIteration.departureDiff_Matrix[3]
    ),
  ];

  let gradientDirection_MRoundTo2 = [
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0]) < 90
      ? 360 + radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0]) - 90
      : radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0]) - 90,
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1]) < 90
      ? 360 + radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1]) - 90
      : radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1]) - 90,
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2]) < 90
      ? 360 + radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2]) - 90
      : radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2]) - 90,
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3]) < 90
      ? 360 + radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3]) - 90
      : radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3]) - 90,
  ];

  let gradientValue_MRoundTo2 = [
    180 / (Math.PI * distancesSet_MRoundTo2[0]),
    180 / (Math.PI * distancesSet_MRoundTo2[1]),
    180 / (Math.PI * distancesSet_MRoundTo2[2]),
    180 / (Math.PI * distancesSet_MRoundTo2[3]),
  ];

  let navParameterDiff_MRoundTo2 = [
    dataFromFirstIteration.initialValues.first.bearing <
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0])
      ? 360 +
        dataFromFirstIteration.initialValues.first.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0])
      : dataFromFirstIteration.initialValues.first.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[0]),
    dataFromFirstIteration.initialValues.second.bearing <
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1])
      ? 360 +
        dataFromFirstIteration.initialValues.second.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1])
      : dataFromFirstIteration.initialValues.second.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[1]),
    dataFromFirstIteration.initialValues.third.bearing <
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2])
      ? 360 +
        dataFromFirstIteration.initialValues.third.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2])
      : dataFromFirstIteration.initialValues.third.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[2]),
    dataFromFirstIteration.initialValues.fourth.bearing <
    radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3])
      ? 360 +
        dataFromFirstIteration.initialValues.fourth.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3])
      : dataFromFirstIteration.initialValues.fourth.bearing -
        radiansToDgr(dataFromFirstIteration.DRBearingsSet_Matrix[3]),
  ];

  let transferDistances_MRoundTo2 = [
    navParameterDiff_MRoundTo2[0] / gradientValue_MRoundTo2[0],
    navParameterDiff_MRoundTo2[1] / gradientValue_MRoundTo2[1],
    navParameterDiff_MRoundTo2[2] / gradientValue_MRoundTo2[2],
    navParameterDiff_MRoundTo2[3] / gradientValue_MRoundTo2[3],
  ];

  let LoPStandardDeviation_MRoundTo2 = [
    dgrToRadians(0.2) * distancesSet_MRoundTo2[0],
    dgrToRadians(0.2) * distancesSet_MRoundTo2[1],
    dgrToRadians(0.2) * distancesSet_MRoundTo2[2],
    dgrToRadians(0.2) * distancesSet_MRoundTo2[3],
  ];

  let thetaAngleObj = {
    LoP_12_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[1],
      gradientDirection_MRoundTo2[0]
    ),
    LoP_13_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[2],
      gradientDirection_MRoundTo2[0]
    ),
    LoP_14_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[3],
      gradientDirection_MRoundTo2[0]
    ),
    LoP_23_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[2],
      gradientDirection_MRoundTo2[1]
    ),
    LoP_24_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[3],
      gradientDirection_MRoundTo2[1]
    ),
    LoP_34_Intersection_RoundTo1: calculateThetaAcuteAngle(
      gradientDirection_MRoundTo2[3],
      gradientDirection_MRoundTo2[2]
    ),
  };

  let standardDeviationForIntersectionPoint = {
    LoP_12_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_12_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[0],
      LoPStandardDeviation_MRoundTo2[1]
    ),
    LoP_13_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_13_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[0],
      LoPStandardDeviation_MRoundTo2[2]
    ),
    LoP_14_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_14_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[0],
      LoPStandardDeviation_MRoundTo2[3]
    ),
    LoP_23_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_23_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[1],
      LoPStandardDeviation_MRoundTo2[2]
    ),
    LoP_24_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_24_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[1],
      LoPStandardDeviation_MRoundTo2[3]
    ),
    LoP_34_Intersection_RoundTo6: calculateStandardDeviationForPoint(
      thetaAngleObj.LoP_34_Intersection_RoundTo1,
      LoPStandardDeviation_MRoundTo2[2],
      LoPStandardDeviation_MRoundTo2[3]
    ),
  };

  let weights = {
    LoP_12_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_12_Intersection_RoundTo6
    ),
    LoP_13_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_13_Intersection_RoundTo6
    ),
    LoP_14_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_14_Intersection_RoundTo6
    ),
    LoP_23_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_23_Intersection_RoundTo6
    ),
    LoP_24_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_24_Intersection_RoundTo6
    ),

    LoP_34_Intersection_RoundTo6: calculateWeight(
      standardDeviationForIntersectionPoint.LoP_34_Intersection_RoundTo6
    ),
  };
  let totalWeight_RoundTo6 = summarizeObject(weights);
  let reverseBearings_MRoundTo1 = [
    calculateReverseBearing(dataFromFirstIteration.initialValues.first.bearing),
    calculateReverseBearing(
      dataFromFirstIteration.initialValues.second.bearing
    ),
    calculateReverseBearing(dataFromFirstIteration.initialValues.third.bearing),
    calculateReverseBearing(
      dataFromFirstIteration.initialValues.fourth.bearing
    ),
  ];

  return {
    distancesSet_MRoundTo2,
    gradientDirection_MRoundTo2,
    gradientValue_MRoundTo2,
    navParameterDiff_MRoundTo2,
    transferDistances_MRoundTo2,
    reverseBearings_MRoundTo1,
    LoPStandardDeviation_MRoundTo2,
    thetaAngleObj,
    standardDeviationForIntersectionPoint,
    weights,
    totalWeight_RoundTo6,
  };
};

function calculateThetaAcuteAngle(dir1: number, dir2: number): number {
  let angle = Math.abs(dir2 - dir1);
  if (angle >= 180) {
    angle = angle - 180 > 90 ? 180 - (angle - 180) : angle - 180;
  }

  return angle;
}

const calculateStandardDeviationForPoint = (
  thetaAngle: number,
  SD1: number,
  SD2: number
) => {
  let result =
    (1 / Math.sin(dgrToRadians(thetaAngle))) * Math.sqrt(SD1 ** 2 + SD2 ** 2);
  return result;
};

const calculateWeight = (LoP_intersection_SD: number) => {
  return 1 / LoP_intersection_SD ** 2;
};

function summarizeObject(obj: any): number {
  let sum = 0;
  for (const key in obj) {
    sum += obj[key];
  }
  return sum;
}

const calculateReverseBearing = (trueBearingDgr: number) => {
  if (trueBearingDgr <= 180) {
    return trueBearingDgr + 180;
  }
  if (trueBearingDgr > 180) {
    return trueBearingDgr - 180;
  }
  return trueBearingDgr;
};
