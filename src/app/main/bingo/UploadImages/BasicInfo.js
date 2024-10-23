import { useEffect, useState } from "react";
import { lighten } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Dropzone from "react-dropzone";
import Typography from "@mui/material/Typography";
import { formatFileSize } from "../../../utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { listAllByFolder } from "app/configs/fbServices";
import { Grid, TextField, Select, MenuItem, Button, CircularProgress } from "@mui/material";
import "./styles.css";
import IconButton from '@mui/material/IconButton';
import { getImages, updateImages } from "../store/bingoSlice";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import 'firebase/storage';
import firebase from 'firebase/app';
import { getStorage, ref, deleteObject, refFromURL, getMetadata, uploadBytes } from "firebase/storage";
import { UTurnLeftSharp } from "@mui/icons-material";
import { getDay } from "../../../utils";


function BasicInfo(props) {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;
  const images = watch("images");
  const [data, setData] = useState({});
  const [list, setList] = useState()
  const [lista, setLista] = useState([])
  const [listaFull, setListaFull] = useState()
  const [tipo, setTipo] = useState();
  const [editando, setEditando] = useState([])
  const [loading, setLoading] = useState(false)
  const storage = getStorage();
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null); // Estado para saber qué imagen está siendo hoverada
  const [editIndex, setEditIndex] = useState(null); // Estado para saber qué campo de texto está habilitado para edición
  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteImage = (url) => {
    const desertRef = ref(storage, url.url);
    // Elimina el archivo
    deleteObject(desertRef).then(() => {
      window.location.reload(false);
    }).catch((error) => {
      console.log(`Error al eliminar el archivo: ${error}`);
    });
  }


  const getImageNames = (urls, tipoFolder) => {

    //console.log('urls es un array:', Array.isArray(urls))
    let imageNames = [];
    urls.map((url) => {
      //console.log('ur', url)
      let fileName = url.split('%2F').pop().split('?')[0];
      fileName = fileName.replace(/%20/g, ' ');
      imageNames.push(fileName);
    });
    //console.log('imageNamesimageNamesimageNames', imageNames)
    const listurri = imageNames.map((n) => ({ name: n, type: tipoFolder }))
    //console.log('listurri', listurri)
    setData({ list: listurri })

  };



  const saveLabel = (datos, index) => {
    const dataAguardar = {
      name: datos.name,
      type: datos.type,
      label: datos.label,
    };

    setIsSaving(true); // Mostrar spinner al comenzar

    dispatch(updateImages(dataAguardar)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("hecho");
        setEditIndex(null); // Desactivar la edición
      }
      if (res.meta.requestStatus === "rejected") {
        console.log("rechazo");
      }

      setIsSaving(false); // Ocultar spinner al finalizar
    });
  };

  const handleChange = (event, index) => {
    const updatedLabels = [...lista];
    updatedLabels[index].label = event.target.value;
    setLista(updatedLabels);
  };

  const changeSelectImg = async (e) => {
    //await setList([]);
    let tipoFolder;

    switch (e) {
      case 1:
        tipoFolder = "logos_con_fondo";
        break;
      case 2:
        tipoFolder = "logos_sin_fondo";
        break;
      case 3:
        tipoFolder = "empaques";
        break;
      default:
        tipoFolder = "";
        break;
    }
    setTipo(tipoFolder)
    try {
      const listaImages = await listAllByFolder(`images/${tipoFolder}`);
      //console.log('listttttttttttaaaaaaaaa', listaImages);
      setTimeout(() => {
        setList(listaImages);
        getImageNames(listaImages, tipoFolder);
        //setEditando(listaImages.map(() => false));
        setLoading(false)
      }, 2000);


    } catch (error) {
      console.error("Error al obtener las imágenes:", error);
    }

  }

  useEffect(() => {
    console.log('data', data)
    if (Object.keys(data).length !== 0) {
      dispatch(getImages(data)).then((resp) => {
        console.log('resp', resp)
        if (resp.payload) {
          const respuesta = list.map((l, index) => {
            return {
              url: l,
              label: resp.payload[index]?.label,
              name: resp.payload[index]?.name,
              type: resp.payload[index]?.type
            }
          })
          setLista(respuesta)
        }
      });
    }
    setLoading(false)

  }, [data])

  const handleSaveCoupon = async () => {
    console.log('images', images)
    const today = getDay();
    await Promise.all(
      images.map(async (item) => {
        const imageRef = ref(
          storage,
          `images/${tipo}/${item.name}`
        );
        await uploadBytes(imageRef, item);
      })

    ).then(() => {
      window.location.reload(false);

    }).catch((error) => {
      console.log(error)
    });
  };


  return (
    <div className="flex flex-col flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-20 px-24 md:px-20">
      <Controller
        name="images"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <Grid
              container
              padding={5}
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 1, md: 3 }}
              alignItems={"center"}
            >

              <Grid item xs={6} md={6} textAlign={"center"}>
                <Typography className="text-16 sm:text-16 truncate font-semibold">
                  Imagenes
                </Typography>
                <Select
                  id="selectImg"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setLoading(true)
                    const val = e.target.value
                    changeSelectImg(val)
                  }}
                  defaultValue={-1}
                >
                  <MenuItem key={3} value={-1} disabled> Seleccione una Categoria</MenuItem>
                  <MenuItem key={1} value={1} > Imagenes con Fondo</MenuItem>
                  <MenuItem key={2} value={2} > Imagenes sin Fondo</MenuItem>
                  <MenuItem key={4} value={3} > Empaques</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={5} textAlign={"center"}>
                <Dropzone onDrop={onChange}>
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      sx={{ /* flexDirection: "column", */ width: 380 }}
                      className="flex items-center justify-center "
                    >
                      <Typography className="text-14 sm:text-14 mb-20 " sx={{ maxWidth: 230, wordBreak: 'break-all' }}>
                        Arrastre y suelte la imágen aqui, o haga click y
                        seleccione
                      </Typography>
                      <Box
                        {...getRootProps()}
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                              ? lighten(theme.palette.background.default, 0.4)
                              : lighten(theme.palette.background.default, 0.02),
                        }}
                        component="label"
                        htmlFor="button-file"
                        className="productImageUpload flex items-center justify-center relative w-112 h-112 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                      >
                        <input {...getInputProps()} />

                        <FuseSvgIcon size={24} color="action">
                          heroicons-outline:upload
                        </FuseSvgIcon>
                      </Box>
                    </Box>
                  )}
                </Dropzone>
              </Grid>
              <Grid item xs={6} md={1} >
                <Button
                  className="whitespace-nowrap mx-4 custom-button"
                  variant="contained"
                  color="secondary"
                  disabled={!tipo}
                  onClick={handleSaveCoupon}
                >
                  Subir
                </Button>
              </Grid>

            </Grid>

            {value.length != 0 &&
              <>
                <Typography> Previsualizacion de imagen </Typography>
                <ImageList sx={{ width: 500, height: 250, justifyContent: 'center', alignContent: 'center' }}>
                  {value.map((item, key) => (
                    <ImageListItem key={key}>
                      <img
                        src={URL.createObjectURL(item)}
                        alt={item.name}
                        loading="lazy"
                        className="imgUpload"
                      />
                      <ImageListItemBar
                        title={item.name}
                        subtitle={formatFileSize(item.size)}
                        position="below"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            }


            <Grid
              container
              padding={5}
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            >
              {loading ? (
                <FuseLoading />
              ) : (
                lista?.map((el, i) => (
                  <Grid
                    key={i}
                    item
                    xs={6}
                    md={2}
                    textAlign={"center"}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    {/* Contenedor de imagen con efecto de escalado en hover */}
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '10px', // Bordes redondeados
                        transition: 'transform 0.3s ease-in-out', // Suavidad al hacer hover
                        margin: '5px'

                      }}
                      className="hover-scale"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'; // Escalar al 105%
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'; // Volver al tamaño normal
                      }}
                    >
                      <img
                        width={"100%"}
                        className="rounded"
                        src={el.url}
                        alt="imagen"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                          transition: 'transform 0.3s ease, opacity 0.3s ease', // Efecto suave al hacer hover

                        }}
                      />

                      {/* Botón Editar solo visible en hover */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: '0',
                          transition: 'opacity 0.3s ease',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente en hover
                        }}
                        className="hover-opacity"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1'; // Mostrar fondo oscuro
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0'; // Ocultar fondo oscuro
                        }}
                      >
                        {/* Botón Editar en hover */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setEditIndex(i)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>

                    {/* Texto o TextField según el modo de edición */}
                    {editIndex === i ? (
                      <TextField
                        value={el.label || ""}
                        onChange={(event) => handleChange(event, i)}
                        fullWidth
                        style={{ marginTop: '8px' }}
                      />
                    ) : (
                      <span style={{ display: 'block', marginTop: '8px', fontSize: '16px' }}>
                        {el.label || ""}
                      </span>
                    )}

                    {/* Botones Guardar y Eliminar solo en modo de edición */}
                    {editIndex === i && (
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <Button onClick={() => saveLabel(el)} variant="contained" color="primary">
                          {isSaving && editIndex === i ? <CircularProgress size={20} /> : "Guardar"}
                        </Button>
                        <Button onClick={() => handleDeleteImage(el)} variant="contained" color="error">
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </Grid>
                ))
              )}
            </Grid>


          </>
        )}
      />
    </div>
  );
}

export default BasicInfo;