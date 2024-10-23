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
  selectSliderConsumer,
  setSliderConsumer,
  resetSliderConsumer,
  newSliderConsumer,
} from "../store/sliderConsumerSlice";
import reducer from "../store";
import SliderConsumerHeader from "./SliderConsumerHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  image: yup.mixed().test("required", "You need to provide a file", (file) => {
    return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
  }),
});

function SliderConsumer(props) {
  console.log('propppppps', props)
  const dispatch = useDispatch();
  const sliderConsumer = useSelector(selectSliderConsumer);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noSliderConsumer, setnoSliderConsumer] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      enabled: false,
      image: "",
      channel: "",
      gec: "",
      type: "consumers",
    },
    resolver: yupResolver(schema),
  });
  console.log('sliderConsumer;', sliderConsumer)
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateSliderConsumerState() {
      const { sliderConsumerId } = routeParams;
      if (sliderConsumerId === "new") {
        dispatch(newSliderConsumer());
      } else {
        dispatch(setSliderConsumer(location.state));
      }
    }

    updateSliderConsumerState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!sliderConsumer) {
      return;
    }
    /**
     * Reset the form on slider state changes
     */
    reset(sliderConsumer);
  }, [sliderConsumer, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetSliderConsumer());
      setnoSliderConsumer(false);
    };
  }, [dispatch]);

  if (noSliderConsumer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Slider!
        </Typography>
        <Button
          className="mt-24 "
          component={Link}
          variant="outlined"
          to="/slidersConsumers"
          color="inherit"
        >
          Volver a Sliders
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (sliderConsumer &&
      routeParams.sliderConsumerId !== sliderConsumer.id &&
      routeParams.sliderConsumerId !== "new" &&
      routeParams.sliderConsumerId !== "update" &&
      routeParams.sliderConsumerId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<SliderConsumerHeader params={routeParams.sliderConsumerId} />}
        content={<BasicInfo params={routeParams.sliderConsumerId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("slidersConsumersApp", reducer)(SliderConsumer);
