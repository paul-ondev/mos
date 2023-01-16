import classNames from "classnames";
import React from "react";

import "./ImageWithValue.css";

import Matrix from "./../Matrix";

type Props = {
  imageUrl: string;
  oneDimensionArr?: number[];
  matrixBorder?: boolean;
  twoDimensionArray?: number[][];
};

export default function ImageWithValue({
  imageUrl,
  oneDimensionArr,
  matrixBorder,
  twoDimensionArray,
}: Props) {
  return (
    <div className="container">
      <div className="img_block">
        <img src={imageUrl} alt="crack" />
      </div>
      <Matrix
        oneDimensionArr={oneDimensionArr}
        matrixBorder={matrixBorder}
        twoDimensionArray={twoDimensionArray}
      />
    </div>
  );
}
