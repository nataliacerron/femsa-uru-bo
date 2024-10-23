import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import {
  getClients,
  selectClients,
  selectClientsSearchText,
} from "../../store/clientsSlice";
import { getClient, getClientData } from "../../store/clientSlice";
import ClientsTableHead from "./ClientsTableHead";
import { Button, Tooltip } from "@mui/material";
import { useRef } from "react";

function ClientsTable(props) {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const searchText = useSelector(selectClientsSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(clients);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const tableContainerRef = useRef(null);

  function goToNextPage() {

    setPage((page) => page + 1);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0; // Restablecer el scroll al inicio
    }
  }
  function goToPreviousPage() {
    setPage((page) => page - 1);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0; // Restablecer el scroll al inicio
    }
  }
  useEffect(() => {
    dispatch(getClients(page)).then((resp) => {
      setLoading(false);
    });
  }, [dispatch, page]);



  useEffect(() => {
    console.log('searchText', searchText)
    if (searchText.length !== 0) {
      dispatch(getClientData(searchText)).then((resp) => {

        setData([resp.payload]);
      });

    } else {
      console.log('hiii')
      setData(clients);
    }
  }, [clients, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }



  async function handleClickView(item) {
    try {
      const resp = await new Promise((resolve, reject) => {
        dispatch(getClientData(item.id))
          .then(resolve)
          .catch(reject);
      });

      const clientData = resp.payload;

      await props.navigate('view', {
        state: {
          ...clientData,
        },
      });
    } catch (error) {
      // Manejo del error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0 || Object.keys(data[0]).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay clientes!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full" ref={tableContainerRef} style={{ maxHeight: "400px", overflowY: "auto" }}>

      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
        <ClientsTableHead
          order={order}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
        />
        <TableBody>
          {_.orderBy(data, [(o) => o[order.id]], [order.direction]).map(
            (n) => {
              return (
                <TableRow
                  className="h-24 cursor-pointer"
                  hover
                  key={n.id}
                >
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.id}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.cuit}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.business_name}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.email}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.mobile}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.enabled ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row">
                    <Tooltip title='Ver' placement="top">
                      <Button onClick={(event) => handleClickView(n)}>
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:eye
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>

      <Box
        sx={{
          width: 200,
          alignSelf: "flex-end",
        }}
      >
        <Button disabled={page <= 0} onClick={goToPreviousPage}>
          Atras
        </Button>
        <Button disabled={searchText.length > 0} onClick={goToNextPage}>
          Siguiente
        </Button>
      </Box>
    </div>
  );
}

export default withRouter(ClientsTable);
