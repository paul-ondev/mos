import React from "react";

import TextField from "@mui/material/TextField";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface NavItemParam {
  number: number;
  register: any;
}

const NavItem = ({ number, register }: NavItemParam) => {
  let actualNumber = number + 1;
  return (
    <div>
      <div className="divider"></div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>{actualNumber} ориентир</Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ height: "80%" }}>
            Широта <b>φ</b>{" "}
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LatDGR`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + `LatDGR`}
              label="Градусы"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LatMins`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + "LatMins"}
              label="Минуты"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LatDir`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + "LatDir"}
              label="Наименование"
              variant="outlined"
            />
          </Item>
        </Grid>

        <Grid item xs={3}>
          <Item sx={{ height: "80%" }}>
            Долгота <b>λ</b>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LongDGR`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + `LongDGR`}
              label="Градусы"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LongMins`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + "LongMins"}
              label="Минуты"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `LongDir`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + "LongDir"}
              label="Наименование"
              variant="outlined"
            />
          </Item>
        </Grid>

        <Grid item xs={6}>
          <Item sx={{ height: "80%" }}>Пеленг</Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <TextField
              {...register("orientNumber" + actualNumber + `Bearing`, {
                required: true,
              })}
              name={"orientNumber" + actualNumber + "Bearing"}
              label="Градусы"
              variant="outlined"
            />
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default NavItem;
