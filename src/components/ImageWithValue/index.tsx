import React from "react";

import "./ImageWithValue.css";

import Matrix from "./../Matrix";

type Props = {
  imageUrl: string;
  oneDimensionArr?: number[];
  withoutMatrixBorder?: boolean;
  twoDimensionArray?: number[][];
};

export default function ImageWithValue({
  imageUrl,
  oneDimensionArr,
  withoutMatrixBorder,
  twoDimensionArray,
}: Props) {
  return (
    <div className="container">
      <div className="img_block">
        <img src={imageUrl} alt="crack" />
      </div>
      <Matrix
        oneDimensionArr={oneDimensionArr}
        withoutMatrixBorder={withoutMatrixBorder}
        twoDimensionArray={twoDimensionArray}
      />
    </div>
  );
}
