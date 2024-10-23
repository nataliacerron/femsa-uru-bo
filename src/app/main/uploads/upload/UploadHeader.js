import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { upLoadImg } from "../../../utils";

import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { selectUser } from "app/store/userSlice";
import { upLoadSingleImg } from "../../../utils";

function UploadHeader(props) {
  const { params } = props;

  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("image");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { uploadId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);
  const excel_file = watch("file_id");
  console.log('header', images)

  const handleSaveUpload = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);

    if (
      data.name === '' ||
      data.image === undefined ||
      data.type === '' ||
      data.start_date === '' ||
      data.due_date === '' ||
      data.file_id === undefined ||
      data.terms === ''
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      if (uploadId === "new") {
        const fileData = {
          //user_id: user.data.displayName,
          user_id: 'jose.bozzone',
          file_name: excel_file.name,
          type: 'competencia',
          url: '',
        };

        const fileRef = ref(storage, `files/${data.name}`);
        await uploadBytes(fileRef, excel_file);
        const response = await dispatch(addFile(fileData));
        data.file_id = response.payload.res.id;

        upLoadSingleImg(data, images).then(() => {
          dispatch(addUpload(data)).then(() => {
            navigate("/uploads");
          });
        });

      } else {
        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );
        const fileData = {
          // user_id: user.data.displayName,
          user_id: 'jose.bozzone',
          file_name: excel_file.name,
          type: 'competencia',
          url: '',
        };

        const fileRef = ref(storage, `files/${data.name}`);
        await uploadBytes(fileRef, excel_file);
        const response = await dispatch(addFile(fileData));
        result.file_id = response.payload.res.id;
        console.log('resul;t', result)
        upLoadSingleImg(result, images).then(() => {
          dispatch(updateUpload(result)).then(() => {
            navigate("/uploads");
          });
        });
        // TODO  agregar subir archivo excel al actualizar
        //updateUpload(result).then(() => setAlert(true));
        //TODO agregar codigo para subir el excel
      }
    }
  };

  function handleRemoveUpload() {
    const data = getValues();
    dispatch(removeUpload(data.id)).then(() => {
      navigate("/uploads");
    });
  }

  ///TODO eliminar este useEffect, creado para ver los archivos en el storage
  /*useEffect(() => {
    const listRef = ref(storage, "files/bingo");
  
    listAll(listRef)
      .then((res) => {
        console.log(res, "res");
        res.prefixes.forEach((folderRef) => {
          console.log(folderRef, "folderRef");
        });
        res.items.forEach((itemRef) => {
          console.log(itemRef, "itemRef");
        });
      })
      .catch((error) => { });
  }, []);*/

  useEffect(() => {
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
  }, [images]);

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
              to="/uploads"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Competencias</span>
            </Typography>
          </motion.div>
          <div className="flex max-w-full">
            <div className="flex relative ">
              <motion.div
                className="hidden  sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                {images ? (
                  <img
                    //  className="w-52 sm:w-48 rounded"
                    width={150}
                    src={preview}
                  />
                ) : (
                  <img
                    //    className="w-32 sm:w-48 rounded"
                    width={200}
                    src="assets/images/apps/ecommerce/product-image-placeholder.png"
                  />
                )}
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {params === 'new'
                  ? "Nueva Competencia"
                  : params === 'update'
                    ? "Actualizar Competencia"
                    : 'Vista de Competencia'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Competencia
              </Typography>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            disabled={params === 'view'}
            /*disabled={
              uploadId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
            }*/
            onClick={handleRemoveUpload}
          >
            Eliminar
          </Button>
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            disabled={params === 'view'}
            /*disabled={
              uploadId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
            }*/
            onClick={handleSaveUpload}
          >
            Guardar
          </Button>

        </motion.div>
      </div>
      {openAlert.alert && (
        <Alert severity="success">Los datos se guardaron correctamente</Alert>
      )}
      {openAlert.alert === false ? (
        <Alert severity="error">{openAlert.msg}</Alert>
      ) : null}
    </div>
  );
}

export default UploadHeader;
