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
  selectWallet,
  setWallet,
  resetWallet,
  newWallet,
} from "../store/walletSlice";
import reducer from "../store";
import WalletHeader from "./WalletHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  //category: yup.string().required("Debe seleccionar una categoria"),
  //points: yup.string().required("Debe seleccionar ingresar los Puntos"),

  //max_exchange: yup.string().required("Debe ingresar una Descripcion"),

});

function Wallet(props) {
  const dispatch = useDispatch();
  const Wallet = useSelector(selectWallet);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noWallet, setnoWallet] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      qty: null,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateWalletState() {
      const { WalletId } = routeParams;

      if (WalletId === "new") {
        dispatch(newWallet());
      } else {
        dispatch(setWallet(location.state));
      }
    }

    updateWalletState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!Wallet) {
      return;
    }
    /**
     * Reset the form on Wallet state changes
     */
    reset(Wallet);
  }, [Wallet, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetWallet());
      setnoWallet(false);
    };
  }, [dispatch]);

  if (noWallet) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Competencias
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/Wallets"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (Wallet &&
      routeParams.WalletId !== Wallet.id &&
      routeParams.WalletId !== "new" &&
      routeParams.WalletId !== "update" &&
      routeParams.WalletId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<WalletHeader params={routeParams.WalletId} />}
        content={<BasicInfo params={routeParams.WalletId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("WalletsApp", reducer)(Wallet);
