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
  selectNotificationConsumer,
  setNotificationConsumer,
  resetNotificationConsumer,
  newNotificationConsumer,
} from "../store/notificationConsumerSlice";
import reducer from "../store";
import NotificationConsumerHeader from "./NotificationConsumerHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  due_date: yup.string().required("Debe seleccionar ingresar una Fecha de Vencimiento"),
  title: yup.string().required("Debe ingresar un Titulo"),
});

function NotificationConsumer(props) {
  const dispatch = useDispatch();
  const notificationConsumer = useSelector(selectNotificationConsumer);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noNotificationConsumer, setnoNotificationConsumer] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      img: "",
      channel: "",
      gec: "",
      title: "",
      description: "",
    },
    resolver: yupResolver(schema),
  });
  console.log('notificationConsumer;', notificationConsumer)
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateNotificationConsumerState() {
      const { notificationConsumerId } = routeParams;
      if (notificationConsumerId === "new") {
        dispatch(newNotificationConsumer());
      } else {
        dispatch(setNotificationConsumer(location.state));
      }
    }

    updateNotificationConsumerState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!notificationConsumer) {
      return;
    }
    /**
     * Reset the form on notificationConsumer state changes
     */
    reset(notificationConsumer);
  }, [notificationConsumer, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetNotificationConsumer());
      setnoNotificationConsumer(false);
    };
  }, [dispatch]);

  if (noNotificationConsumer) {
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

          to="/consumer-notifications"
          color="inherit"
        >
          Volver a Notificationes
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (notificationConsumer &&
      routeParams.notificationConsumerId !== notificationConsumer.id &&
      routeParams.notificationConsumerId !== "new" &&
      routeParams.notificationConsumerId !== "update" &&
      routeParams.notificationConsumerId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<NotificationConsumerHeader params={routeParams.notificationConsumerId} />}
        content={<BasicInfo params={routeParams.notificationConsumerId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("notificationsConsumersApp", reducer)(NotificationConsumer);
