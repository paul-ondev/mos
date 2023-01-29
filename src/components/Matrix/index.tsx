import classNames from "classnames";
import math from "mathjs";
import React from "react";

import "./Matrix.css";

type Props = {
  startSign?: string;
  startMultiplySign?: boolean;
  startEqualSign?: boolean;
  endSign?: string;
  endMultiplySign?: boolean;
  endEqualSign?: boolean;
  oneDimensionArr?: any;
  oneDimensionRowArr?: any;
  withoutMatrixBorder?: boolean;
  twoDimensionArray?: number[][] | math.Matrix;
  formula_oneDimensionArray?: string[];
  formula_twoDimensionArray?: string[][];
};

export default function Matrix({
  startSign,
  startMultiplySign,
  startEqualSign,
  endSign,
  endMultiplySign,
  endEqualSign,
  oneDimensionArr,
  oneDimensionRowArr,
  withoutMatrixBorder,
  twoDimensionArray,
  formula_oneDimensionArray,
  formula_twoDimensionArray,
}: Props) {
  return (
    <div className="container">
      <div
        className="startSign"
        dangerouslySetInnerHTML={{
          __html:
            (startSign ? ` ${startSign} ` : "") ||
            (startMultiplySign ? " X " : "") ||
            (startEqualSign ? " = " : ""),
        }}
      >
        {/* {(startSign ? ` ${startSign} ` : false) ||
          (startMultiplySign ? " X " : false) ||
          (startEqualSign ? " = " : false)} */}
      </div>
      <table
        className={classNames("value", {
          withoutMatrixBorder: withoutMatrixBorder,
        })}
      >
        <tbody>
          <>
            {!twoDimensionArray &&
              oneDimensionArr?.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item}</td>
                </tr>
              ))}
            {twoDimensionArray &&
              twoDimensionArray?.map((item: number[], i) => (
                <tr key={i}>
                  {item.map((item: number, i) => (
                    <td key={i}>{item}</td>
                  ))}
                </tr>
              ))}
            {formula_oneDimensionArray &&
              formula_oneDimensionArray.map((item, i) => (
                <tr key={i}>
                  <td>{item}</td>
                </tr>
              ))}
            {formula_twoDimensionArray &&
              formula_twoDimensionArray.map((item, i) => (
                <tr key={i}>
                  {item.map((item: string, i) => (
                    <td key={i}>{item}</td>
                  ))}
                </tr>
              ))}
            {oneDimensionRowArr && (
              <tr>
                {oneDimensionRowArr.map((item: number, i: number) => (
                  <td key={i}>{item}</td>
                ))}
              </tr>
            )}
          </>
        </tbody>
      </table>
      <div className="endSign">
        {(endSign ? ` ${endSign} ` : false) ||
          (endMultiplySign ? " X " : false) ||
          (endEqualSign ? " = " : false)}
      </div>
    </div>
  );
}
