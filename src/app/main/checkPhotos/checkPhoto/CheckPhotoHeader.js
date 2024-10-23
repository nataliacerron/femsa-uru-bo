import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Alert from "@mui/material/Alert";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addCheckPhoto, updateCheckPhoto, removeCheckPhoto } from "../store/checkPhotoSlice";
import { useDispatch } from "react-redux";
import { upLoadSingleImg } from "../../../utils";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

function CheckPhotoHeader(props) {
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const images = watch("img");
  const name = watch("channel");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkPhotoId } = routeParams;
  const [loading, setLoading] = useState(false);

  function handleSaveCheckPhoto() {
    const data = getValues();
    console.log('data', data)
    if (
      data.channel === "0" ||
      data.gec === "0" ||
      data.title === "" ||
      data.description === null ||
      data.date_due === null ||
      data.img === null
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      console.log('checkPhotoId', checkPhotoId)
      if (checkPhotoId === "new") {
        upLoadSingleImg(data, images).then(() => {
          data.img = data.image
          delete data.image
          console.log('data1', data)
          dispatch(addCheckPhoto(data)).then(() => {
            setLoading(false);
            navigate("/checkPhotos");
          });
        });
      } else {
        delete data.updated_at
        if (typeof images === "string") {
          data.img = images
          dispatch(updateCheckPhoto(data)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") navigate("/checkPhotos");
            if (res.meta.requestStatus === "rejected") setAlert(false);
            setLoading(false);
          });


        } else {
          upLoadSingleImg(data, images).then(() => {
            data.img = data.image
            delete data.image
            dispatch(updateCheckPhoto(data)).then((res) => {
              if (res.meta.requestStatus === "fulfilled") navigate("/checkPhotos");
              if (res.meta.requestStatus === "rejected") setAlert(false);
              setLoading(false);
            });
          });
        }
      }
    }
  }

  function handleRemoveCheckPhoto() {
    const data = getValues();
    dispatch(removeCheckPhoto(data.id)).then(() => {
      navigate("/checkPhotos");
    });
  }

  /*useEffect(() => {
    //actualizo la imagen en el header
    if (images?.name !== undefined) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreview(reader.result);
      });
      reader.readAsDataURL(images);
    } else {
      setPreview(images);
    }
  }, [images]);*/

  return (
    <div className="flex flex-col flex-1 w-full ">
      <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
        <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          >
            <Typography
              className="flex items-center sm:mb-12"
              component={Link}
              role="button"
              to="/checkPhotos"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">CheckPhotoes</span>
            </Typography>
          </motion.div>

          <div className="flex items-center max-w-full">
            {/*<div className="flex items-center">
              <motion.div
                className="hidden sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                {images !== "" ? (
                  <img
                    //  className="w-52 sm:w-48 rounded"
                    width={150}
                    src={preview}
                  />
                ) : (
                  <img
                    //    className="w-32 sm:w-48 rounded"
                    width={100}
                    src="assets/images/apps/ecommerce/product-image-placeholder.png"
                  />
                )}
              </motion.div>
                </div>*/}
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {console.log('name', name)}
                {checkPhotoId === 'updated' ? "Actualizar Notificación" :
                  checkPhotoId === 'new' ? "Nueva Notificación" : "Ver Notificación"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Notificación
              </Typography>
            </motion.div>
          </div>
        </div>
        {checkPhotoId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              color="secondary"
              onClick={handleRemoveCheckPhoto}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Eliminar
            </Button>
            <LoadingButton
              color="secondary"
              onClick={() => { handleSaveCheckPhoto(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                checkPhotoId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
              }
            >
              <span>Guardar</span>
            </LoadingButton>
          </motion.div>
        }
      </div>
      {
        openAlert.alert && (
          <Alert severity="success">Los datos se guardaron correctamente</Alert>
        )
      }
      {
        openAlert.alert === false ? (
          <Alert severity="error">{openAlert.msg}</Alert>
        ) : null
      }
    </div >
  );
}

export default CheckPhotoHeader;
