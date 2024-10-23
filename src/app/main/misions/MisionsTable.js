import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getMisions,
  selectMisions,
  selectMisionsSearchText,
} from "./store/misionsSlice";
import MisionsTableHead from "./MisionsTableHead";
//import { getOneMision } from "./store/imperdibleSlice";
import { addMision, getOneMision } from "./store/misionSlice";
import moment from "moment";
import { Button, Tooltip } from "@mui/material";
require('moment/locale/es');

function MisionsTable(props) {
  const dispatch = useDispatch();
  const misions = useSelector(selectMisions);
  const searchText = useSelector(selectMisionsSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(misions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    dispatch(getMisions()).then((resp) => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(misions, (item) =>
          item.name !== null
            ? item.name.toLowerCase().includes(searchText.toLowerCase())
            : null
        )
      );
      setPage(0);
    } else {
      setData(misions);
    }
  }, [misions, searchText]);

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


  async function handleClickUpdate(item) {
    console.log('item', item)
    if (item.status !== 'publicado') {
      console.log('acaa')
      await props.navigate(`update`, {
        state: {
          ...item,
        },
      });
    }
  }

  async function handleClickView(item) {
    await props.navigate(`view`, {
      state: {
        ...item,
      },
    });
  }
  async function handleClickDuplicate(item) {
    console.log('item', item)
    dispatch(getOneMision(item)).then((resp) => {
      const data = resp.payload
      console.log(data, 'data')
      const copy = 'COPIA - '
      let dataObject = {
        name: copy + data.name,
        channel: data.channel,
        gec: data.gec,
        missions: data.missions,
        month: data.month,
        year: data.year,
        bonus: data.bonus
      }
      console.log('datasssssssssssss', dataObject)
      dispatch(addMision(dataObject)).then(() => {
        console.log(' se guardo con exito')
        location.reload();
      });
    });
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No se encontraron Misiones
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">

      <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
        <MisionsTableHead
          order={order}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
        />

        <TableBody>
          {_.orderBy(data, [(o) => o[order.id]], [order.direction])
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n) => {
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
                    {n.name}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
                    component="th"
                    scope="row"
                  >
                    {moment().month(n.month - 1).locale('es').format('MMMM').toUpperCase()}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
                    component="th"
                    scope="row"
                  >
                    {n.year}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
                    component="th"
                    scope="row"
                  >

                    {n.channel}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
                    component="th"
                    scope="row"
                  >

                    {n.gec}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {!n.enabled ? (
                      <FuseSvgIcon className="text-green" size={18}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={18}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
                    component="th"
                    scope="row"
                  >

                    {n.status}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 "
                    component="th"
                    scope="row"
                  >
                    <Tooltip title='Ver' placement="top">
                      <Button onClick={(event) => handleClickView(n)}>
                        <FuseSvgIcon size={18} color="action">
                          heroicons-outline:eye
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                    {n.status !== "publicado" &&
                      <Tooltip title='Editar' placement="top">
                        <Button onClick={(event) => handleClickUpdate(n)} disabled={n.status === "publicado"} >
                          <FuseSvgIcon size={18} color="action">
                            heroicons-outline:pencil
                          </FuseSvgIcon>
                        </Button>
                      </Tooltip>
                    }
                    {/*<Tooltip title='Descargar' placement="top">
                        <Button>
                          <FuseSvgIcon size={18} color="action">
                            heroicons-outline:download
                          </FuseSvgIcon>
                        </Button>
                      </Tooltip>*/}
                    <Tooltip title='Duplicar' placement="top">
                      <Button onClick={(event) => handleClickDuplicate(n)}>
                        <FuseSvgIcon size={18} color="action">
                          heroicons-outline:duplicate
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              );
            })}
        </TableBody>
      </Table>


      <TablePagination
        className="shrink-0 border-t-1"
        style={{ position: 'sticky', bottom: 0, zIndex: 1000, backgroundColor: '#ffffffff' }}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(MisionsTable);
