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
import { addReminder, updateReminder, removeReminder } from "../store/reminderSlice";
import { useDispatch } from "react-redux";
import { upLoadSingleImg } from "../../../utils";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmationDialog from "app/shared-components/confirmationDialog";

function ReminderHeader(props) {
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
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reminderId } = routeParams;
  const [loading, setLoading] = useState(false);

  function handleSaveReminder() {
    const data = getValues();
    console.log('data', data)
    if (data.email === "") {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      console.log('reminderId', reminderId)
      if (reminderId === "new") {
        dispatch(addReminder(data)).then(() => {
          setLoading(false);
          navigate("/reminders");
        });
      } else {
        dispatch(updateReminder(data)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") navigate("/reminders");
          if (res.meta.requestStatus === "rejected") setAlert(false);
          setLoading(false);
        });
      }
    }
  }


  function handleRemoveReminder() {
    setOpenDialog(true);
  }

  function confirmRemoveReminder() {
    const data = getValues();
    dispatch(removeReminder(data.id)).then(() => {
      navigate("/reminders");
    });
    setOpenDialog(false);
  }

  function cancelRemoveReminder() {
    setOpenDialog(false);
  }


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
              to="/reminders"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Reminderes</span>
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

                {reminderId === 'updated' ? "Actualizar Notificación" :
                  reminderId === 'new' ? "Nueva Notificación" : "Ver Notificación"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del Recordatorio
              </Typography>
            </motion.div>
          </div>
        </div>
        {reminderId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveReminder}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Eliminar
            </Button>
            <ConfirmationDialog
              open={openDialog}
              title="Confirmar eliminación"
              message="¿Estás seguro de que deseas eliminar esta notificación?"
              onCancel={cancelRemoveReminder}
              onConfirm={confirmRemoveReminder}
            />
            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveReminder(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                reminderId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
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

export default ReminderHeader;
