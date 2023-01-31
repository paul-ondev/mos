import React from "react";
import {
  IntersectionProperty_RoundTo1,
  IntersectionProperty_RoundTo6,
} from "../../functions";
import ImageWithValue from "../ImageWithValue";

type Props = {
  formula_img: string;
  innerImagesArr: string[];
  dataObj1?: IntersectionProperty_RoundTo1;
  dataObj6?: IntersectionProperty_RoundTo6;
  imageClassName: string;
  formulImageClassName: string;
};

const GraphTable = ({
  dataObj1,
  dataObj6,
  formula_img,
  innerImagesArr,
  imageClassName,
  formulImageClassName,
}: Props) => {
  return (
    <div className="container">
      <ImageWithValue
        imageClassName={formulImageClassName}
        imageUrl={formula_img}
        withoutMatrixBorder
      />
      <table>
        <tbody>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[0]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_12_Intersection_RoundTo1 ||
                dataObj6?.LoP_12_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[1]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_13_Intersection_RoundTo1 ||
                dataObj6?.LoP_13_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[2]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_14_Intersection_RoundTo1 ||
                dataObj6?.LoP_14_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[3]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_23_Intersection_RoundTo1 ||
                dataObj6?.LoP_23_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[4]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_24_Intersection_RoundTo1 ||
                dataObj6?.LoP_24_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
          <tr>
            <td>
              <ImageWithValue
                imageClassName={imageClassName}
                imageUrl={innerImagesArr[5]}
                withoutMatrixBorder
              />
            </td>
            <td>
              ={" "}
              {dataObj1?.LoP_34_Intersection_RoundTo1 ||
                dataObj6?.LoP_34_Intersection_RoundTo6}
              {dataObj1 ? " °" : " "}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GraphTable;
