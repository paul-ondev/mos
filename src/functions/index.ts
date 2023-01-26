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
  transpose,
} from "mathjs";

export const toMins = (dgr: number, mins: number): number => {
  return dgr * 60 + mins;
};

export type latDirection = "n" | "N" | "s" | "S";
export type longDirection = "w" | "W" | "e" | "E";

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

// export const calculateObservedCoordinates = (
//   dX_Matrix: any,
//   DRLatObject: latObject,
//   DRLongObject: longObject
// ) => {
//   let result = [];
//   let DRLatInMins = toMins(DRLatObject.dgr, DRLatObject.mins);

//   DRLatInMins =
//     DRLatObject.dir === "n" || DRLatObject.dir === "N"
//       ? DRLatInMins
//       : -DRLatInMins;

//   result.push(DRLatInMins + radiansToDgr(dX_Matrix[0]) / 60);

//   let DRLongInMins = toMins(DRLongObject.dgr, DRLongObject.mins);
//   DRLongInMins =
//     DRLongObject.dir === "e" || DRLongObject.dir === "E"
//       ? DRLongInMins
//       : -DRLongInMins;

//   result.push(
//     DRLongInMins + (radiansToDgr(dX_Matrix[1]) / 60) * sec(dgrToRadians(60))
//   );

//   return result;
// };

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
  let seconds = minutesAndSecondsArray[1] * 60;
  return {
    dgr: degreesAndMinutesArray[0],
    mins: minutesAndSecondsArray[0],
    seconds,
    isDirectionNorthOrEast,
  };
};

export const calculatePrioriErrors = (N1_Matrix: any) => {
  let firstLambda =
    (N1_Matrix[0][0] +
      N1_Matrix[1][1] +
      Math.sqrt(
        (N1_Matrix[0][0] - N1_Matrix[1][1]) ** 2 + 4 * N1_Matrix[0][1] ** 2
      )) /
    2;
  let secondLambda =
    (N1_Matrix[0][0] +
      N1_Matrix[1][1] -
      Math.sqrt(
        (N1_Matrix[0][0] - N1_Matrix[1][1]) ** 2 + 4 * N1_Matrix[0][1] ** 2
      )) /
    2;
  let a = Math.sqrt(firstLambda);
  let b = Math.sqrt(secondLambda);
  let a_meters = a * 1852;
  let b_meters = b * 1852;
  return {
    firstLambda,
    secondLambda,
    a,
    b,
    a_meters,
    b_meters,
    radialError: Math.sqrt(a_meters ** 2 + b_meters ** 2),
  };
};

export const findPsiAngle = (firstLambda: number, N1_Matrix: any) => {
  let angle = Math.atan((firstLambda - N1_Matrix[0][0]) / N1_Matrix[0][1]);
  console.log(angle);
  return angle > 0 ? radiansToDgr(angle) : 180 + radiansToDgr(angle);
};
