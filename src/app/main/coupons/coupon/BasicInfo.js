import { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { Button, Typography, Grid, Select, MenuItem, } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import {
  getVariables
} from '../store/couponsSlice';
import { useDispatch, useSelector } from "react-redux";

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    img_brief,
    img_description,
    channel,
    gec
  } = control._formValues;
  const [channels, setChannels] = useState([]);
  const [gecs, setGecs] = useState();
  const [imgDescription, setImgDescription] = useState(img_description)
  const [imgBrief, setImgBrief] = useState(img_brief)

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
    });
  }, [dispatch]);

  const channelSelected = (ev) => {
    const gecList = channels.find(item => item.canal === ev.target.value)
    setGecs(gecList.gec)
  }

  useEffect(() => {

    if (control._formValues.channel) {
      if (channels.length >= 1) {
        const gecList = channels.find(item => item.canal === control._formValues.channel)
        console.log('gec', gec)
        setGecs(gecList.gec)
      }
    }

  }, [channels])

  const onChangeImg = (e, name) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (name === 'mini') {
        setImgBrief(reader.result);
      } else {
        setImgDescription(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="m-10">

      <Grid
        container
        padding={4}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"
      >
        <Grid item xs={6} md={6} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Titulo
          </Typography>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField

                required
                {...field}
                autoFocus
                placeholder="Ingrese el Nombre"
                id="title"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={2} md={2} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Puntos
          </Typography>
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                value={field.value || ''}
                placeholder="Ingrese la cantidad de Puntos"
                id="points"
                variant="outlined"
                fullWidth
                type="number"
                disabled={params === 'view'}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}

              />
            )}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          {params !== "new" ? (
            <div>
              {" "}
              <label style={{ marginLeft: 10 }}>Habilitar</label>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </div>
          ) : null}
        </Grid>
      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}

        alignItems="center"


      >
        <Grid item xs={4} md={4}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Canal
          </Typography>
          <Controller
            name="channel"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="channel"
                value={field.value || '0'}
                variant="outlined"
                fullWidth
                onChange={(ev) => {
                  const value = ev.target.value;
                  field.onChange(value);
                  channelSelected(ev);
                }}
              >
                <MenuItem value='0' > Seleccione un Canal</MenuItem>
                {channels?.map((c, ci) => {
                  return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            GEC
          </Typography>
          <Controller
            name="gec"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="gec"
                value={field.value || '0'}
                variant="outlined"
                fullWidth

              >
                <MenuItem value='0' > Seleccione un GEC</MenuItem>
                {gecs?.map((g, gi) => {

                  return <MenuItem key={gi} value={g} > {g}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Vencimiento
          </Typography>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ''}

                error={!!errors.due_date}
                type="date"
                required
                helperText={errors?.due_date?.message}
                id="due_date"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Grid>
        {/* <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.type}
            required
            helperText={errors?.type?.message}
            label="Canal"
            autoFocus
            id="type"
            variant="outlined"
            fullWidth
            disabled
          />
        )}
      />*/ }
      </Grid>

      <Grid
        container
        padding={4}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"
        textAlign="center"
      >
        <Grid item xs={6} md={3}>
          <Controller
            name="img_brief"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mt-8 mb-16">
                <Button variant="contained" component="label" color="primary">
                  Cargar imagen - Miniatura
                  <input
                    accept="image/*"
                    className="hidden"
                    id="button-avatar"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      onChange(file);
                      onChangeImg(e, 'mini')
                    }}
                  />
                </Button>
              </div>
            )}
          />
        </Grid>
        <Grid item xs={6} md={3} textAlign='center'>
          <img width={"30%"} src={imgBrief || ""} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Controller
            name="img_description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mt-8 mb-16">
                <Button variant="contained" component="label" color="primary">
                  Cargar imagen - Detallada
                  <input
                    accept="image/*"
                    className="hidden"
                    id="button-avatar"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      onChange(file);
                      onChangeImg(e, 'detail')
                    }}
                  />
                </Button>
              </div>
            )}
          />
        </Grid>
        <Grid item xs={6} md={3} textAlign='center'>
          <img width={"30%"} src={imgDescription || ""} />
        </Grid>

      </Grid>
    </div>
  );
}

export default BasicInfo;
