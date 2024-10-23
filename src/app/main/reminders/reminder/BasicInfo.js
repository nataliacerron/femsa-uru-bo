import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography, Grid, Select, MenuItem, } from "@mui/material";
import Switch from "@mui/material/Switch";
import { Controller, useFormContext } from "react-hook-form";
import { CheckBox } from "@mui/icons-material";
import {
  getVariables
} from '../store/remindersSlice';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    email,
    purchases,
    clients,
    commercials,
    products,
    prizes
  } = control._formValues;



  return (
    <div>
      <Grid
        container
        padding={5}
        rowSpacing={4}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"


      >
        <Grid item xs={6} md={4} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            E-mail
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                autoFocus
                placeholder="Ingrese el E-mail"
                id="email"
                variant="outlined"
                fullWidth
                disabled={params === 'update'}
                inputProps={{ maxLength: 50 }}
                type="email"
              />
            )}
          />
        </Grid>



      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={5}
        columnSpacing={{ xs: 1, sm: 1, md: 4 }}
        alignItems="center"


      >

        <Grid item xs={6} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Clientes
          </Typography>
          <Controller
            name="clients"
            control={control}
            render={({ field }) => (
              <Switch
                onChange={(e) => field.onChange(!field.value)}
                checked={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Productos
          </Typography>
          <Controller
            name="products"
            control={control}
            render={({ field }) => (
              <Switch
                onChange={(e) => field.onChange(!field.value)}
                checked={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Premios
          </Typography>
          <Controller
            name="prizes"
            control={control}
            render={({ field }) => (
              <Switch
                onChange={(e) => field.onChange(!field.value)}
                checked={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Comercializadores
          </Typography>
          <Controller
            name="commercials"
            control={control}
            render={({ field }) => (
              <Switch
                onChange={(e) => field.onChange(!field.value)}
                checked={field.value}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Compras
          </Typography>
          <Controller
            name="purchases"
            control={control}
            render={({ field }) => (
              <Switch
                onChange={(e) => field.onChange(!field.value)}
                checked={field.value}
              />
            )}
          />
        </Grid>



      </Grid>




    </div>
  );
}

export default BasicInfo;
