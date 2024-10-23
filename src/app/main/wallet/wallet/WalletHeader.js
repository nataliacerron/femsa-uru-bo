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
import { addWallet } from "../store/walletSlice";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { selectUser } from "app/store/userSlice";
import { upLoadSingleImg } from "../../../utils";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

function WalletHeader(props) {
  const { params } = props;

  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("img");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { walletId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);


  const handleSaveWallet = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);
    if (data.wallets[0].title === '') {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      console.log('user', user)
      console.log('data', data.wallets)
      const walletsModificados = data.wallets.map(wallet => {
        if (wallet.channel === "") {
          delete wallet.channel;
          delete wallet.gec;
          wallet.client_ids = wallet.client_ids.split(/\s*,\s*/);
        } else {
          delete wallet.client_ids;
        }
        wallet.user_id = user.id
        return wallet;
      });
      console.log('CANJES', walletsModificados)

      try {
        // Usamos Promise.all para esperar a que todas las promesas se resuelvan
        await Promise.all(walletsModificados.map(wallet => dispatch(addWallet(wallet))));
        navigate("/wallets");
      } catch (error) {
        // Maneja los errores, si es necesario
        console.error("Error al agregar wallets:", error);
      }

    }
  };

  function handleRemoveWallet() {
    const data = getValues();
    dispatch(removeWallet(data.id)).then(() => {
      navigate("/wallets");
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
              to="/wallets"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Wallets</span>
            </Typography>
          </motion.div>
          <div className="flex max-w-full">

            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {params === 'new'
                  ? "Nuevo Wallet"
                  : params === 'update'
                    ? "Actualizar Canej"
                    : 'Vista de Wallet'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del wallet
              </Typography>
            </motion.div>
          </div>
        </div>

        {walletId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveWallet}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Eliminar
            </Button>
            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveWallet(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"

            >
              <span>Guardar</span>
            </LoadingButton>
          </motion.div>
        }

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

export default WalletHeader;
