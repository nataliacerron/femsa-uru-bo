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
  getReminders,
  selectReminders,
  selectRemindersSearchText,
} from "./store/remindersSlice";
import RemindersTableHead from "./RemindersTableHead";
import { Button, Tooltip } from "@mui/material";
import moment from "moment";

function RemindersTable(props) {
  const dispatch = useDispatch();
  const reminders = useSelector(selectReminders);
  const searchText = useSelector(selectRemindersSearchText);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(reminders);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState({
    direction: "asc",
    email: null,
  });

  useEffect(() => {
    dispatch(getReminders()).then((resp) => {
      console.log('resp', resp)
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    console.log('data2', reminders)
    if (searchText.length !== 0) {
      setData(
        _.filter(reminders, (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setPage(0);
    } else {
      setData(reminders);
    }
  }, [reminders, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.email === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.email));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  async function handleClickUpdate(item) {
    console.log('item', item)
    await props.navigate(`update`, {
      state: {
        ...item,
      },
    });
  }

  async function handleClickView(item) {
    await props.navigate(`view`, {
      state: {
        ...item,
      },
    });
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
          No se encontraron Recordatorios
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">

      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
        <RemindersTableHead
          selectedReminderIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          onMenuItemClick={handleDeselect}
        />

        <TableBody>
          {_.orderBy(data, [(o) => o[order.email]], [order.direction])
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n) => {
              return (
                <TableRow
                  className="h-24 cursor-pointer"
                  hover
                  key={n.email}
                >
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1 "
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
                    {n.clients ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.products ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>

                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.prizes ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.purchases ? (
                      <FuseSvgIcon className="text-green" size={20}>
                        heroicons-outline:check-circle
                      </FuseSvgIcon>
                    ) : (
                      <FuseSvgIcon className="text-red" size={20}>
                        heroicons-outline:minus-circle
                      </FuseSvgIcon>
                    )}
                  </TableCell>
                  <TableCell
                    className="pl-8 pt-1 pb-1 md:pl-8 pt-1 pb-1"
                    component="th"
                    scope="row"
                  >
                    {n.commercials ? (
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

                    <Tooltip title='Editar' placement="top">
                      <Button onClick={(event) => handleClickUpdate(n)}>
                        <FuseSvgIcon size={20} color="action">
                          heroicons-outline:pencil
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

export default withRouter(RemindersTable);
