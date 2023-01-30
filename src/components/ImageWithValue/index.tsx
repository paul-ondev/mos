import React from "react";

import "./ImageWithValue.css";

import Matrix from "./../Matrix";
import classNames from "classnames";

type Props = {
  imageUrl: string;
  imageClassName?: string;
  oneDimensionArr?: any;
  withoutMatrixBorder?: boolean;
  twoDimensionArray?: any;
  startSign?: string;
  endSign?: string;
  formula_oneDimensionArray?: string[];
  formula_twoDimensionArray?: string[][];
  emphasizeN1Matrix?: boolean;
};

export default function ImageWithValue({
  imageUrl,
  imageClassName,
  oneDimensionArr,
  withoutMatrixBorder,
  twoDimensionArray,
  startSign,
  endSign,
  formula_oneDimensionArray,
  formula_twoDimensionArray,
  emphasizeN1Matrix,
}: Props) {
  return (
    <div className="container">
      <div className={classNames("img_block", imageClassName)}>
        <img src={imageUrl} alt="crack" />
      </div>
      <Matrix
        oneDimensionArr={oneDimensionArr}
        withoutMatrixBorder={withoutMatrixBorder}
        twoDimensionArray={twoDimensionArray}
        startSign={startSign}
        endSign={endSign}
        formula_oneDimensionArray={formula_oneDimensionArray}
        formula_twoDimensionArray={formula_twoDimensionArray}
        emphasizeN1Matrix={emphasizeN1Matrix}
      />
    </div>
  );
}
