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
  oneDimensionArr?: number[];
  withoutMatrixBorder?: boolean;
  twoDimensionArray?: number[][] | math.Matrix;
};

export default function Matrix({
  startSign,
  startMultiplySign,
  startEqualSign,
  endSign,
  endMultiplySign,
  endEqualSign,
  oneDimensionArr,
  withoutMatrixBorder,
  twoDimensionArray,
}: Props) {
  return (
    <div className="container">
      <div className="startSign">
        {(startSign ? ` ${startSign} ` : false) ||
          (startMultiplySign ? " X " : false) ||
          (startEqualSign ? " = " : false)}
      </div>
      <table
        className={classNames("value", {
          withoutMatrixBorder: withoutMatrixBorder,
        })}
      >
        <>
          {!twoDimensionArray &&
            oneDimensionArr?.map((item) => (
              <tr>
                <td>{item}</td>
              </tr>
            ))}
          {twoDimensionArray &&
            twoDimensionArray?.map((item: number[]) => (
              <tr>
                {item.map((item: number) => (
                  <td>{item}</td>
                ))}
              </tr>
            ))}
        </>
      </table>
      <div className="endSign">
        {(endSign ? ` ${endSign} ` : false) ||
          (endMultiplySign ? " X " : false) ||
          (endEqualSign ? " = " : false)}
      </div>
    </div>
  );
}
