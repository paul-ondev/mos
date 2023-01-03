import { diag, multiply, round, transpose } from "mathjs";

export const toMins = (dgr: number, mins: number): number => {
  return dgr * 60 + mins;
};

interface latDiffParam {
  dgr: number;
  mins: number;
  dir: "n" | "N" | "s" | "S";
}
interface longParam {
  dgr: number;
  mins: number;
  dir: "w" | "W" | "e" | "E";
}

export function latDiff(observedLat: latDiffParam, DRLat: latDiffParam) {
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

export const departureDiff = (
  observedLong: longParam,
  DRlong: longParam,
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

export const DRBearing = (departureDiff: number, latDiff: number) => {
  return Math.atan(departureDiff / latDiff);
};

export const deltaUMatrix = (
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
  return [dU1, dU2, dU3, dU4];
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
