export const toMins = (dgr: number, mins: number): number => {
  return dgr * 60 + mins;
};

interface latDiffParam {
  dgr: number;
  mins: number;
  dir: "n" | "N" | "s" | "S";
}

export function latDiff(observedLat: latDiffParam, DRLat: latDiffParam) {
  let observedLatInMins = toMins(observedLat.dgr, observedLat.mins);
  observedLatInMins =
    observedLat.dir === "n" || observedLat.dir === "N"
      ? observedLatInMins
      : -observedLatInMins;
  let DRLatInMins = toMins(DRLat.dgr, DRLat.mins);
  let DRLatInMins1 =
    DRLat.dir === "n" || DRLat.dir === "N" ? DRLatInMins : -DRLatInMins;
  return observedLatInMins - DRLatInMins1;
}
