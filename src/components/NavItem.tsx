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

const NavItem = ({ number, register }) => {
  let actualNumber = number + 1;
  return (
    <div>
      <div className="divider"></div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>{actualNumber} ориентир</Item>
        </Grid>
        <Grid item xs={3}>
          <Item sx={{ height: "80%" }}>Широта</Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LatDGR`, { required: true })}
              name={actualNumber + `LatDGR`}
              label="Градусы"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LatMins`, { required: true })}
              name={actualNumber + "LatMins"}
              label="Минуты"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LatDir`, { required: true })}
              name={actualNumber + "LatDir"}
              label="Наименование"
              variant="outlined"
            />
          </Item>
        </Grid>

        <Grid item xs={3}>
          <Item sx={{ height: "80%" }}>Долгота</Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LongDGR`, { required: true })}
              name={actualNumber + `LongDGR`}
              label="Градусы"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LongMins`, { required: true })}
              name={actualNumber + "LongMins"}
              label="Минуты"
              variant="outlined"
            />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <TextField
              {...register(actualNumber + `LongDir`, { required: true })}
              name={actualNumber + "LongDir"}
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
              {...register(actualNumber + `LatBearing`, { required: true })}
              name={actualNumber + "LatBearing"}
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
