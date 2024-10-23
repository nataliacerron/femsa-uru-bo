import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import { useDeepCompareEffect } from "@fuse/hooks";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  selectReminder,
  setReminder,
  resetReminder,
  newReminder,
} from "../store/reminderSlice";
import reducer from "../store";
import ReminderHeader from "./ReminderHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  email: yup.string()
    .email("Debe ingresar una dirección de correo electrónico válida")
    .required("Debe ingresar un E-mail"),
});

function Reminder(props) {
  const dispatch = useDispatch();
  const reminder = useSelector(selectReminder);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noReminder, setnoReminder] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      purchases: false,
      clients: false,
      commercials: false,
      products: false,
      prizes: false
    },
    resolver: yupResolver(schema),
  });

  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateReminderState() {
      const { reminderId } = routeParams;
      if (reminderId === "new") {
        dispatch(newReminder());
      } else {
        dispatch(setReminder(location.state));
      }
    }

    updateReminderState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!reminder) {
      return;
    }
    /**
     * Reset the form on reminder state changes
     */
    reset(reminder);
  }, [reminder, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetReminder());
      setnoReminder(false);
    };
  }, [dispatch]);

  if (noReminder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Notificacion!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/reminders"
          color="inherit"
        >
          Volver a Reminderes
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (reminder &&
      routeParams.reminderId !== reminder.id &&
      routeParams.reminderId !== "new" &&
      routeParams.reminderId !== "update" &&
      routeParams.reminderId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<ReminderHeader params={routeParams.reminderId} />}
        content={<BasicInfo params={routeParams.reminderId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("remindersApp", reducer)(Reminder);
