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
  getSlidersConsumers,
  selectSlidersConsumers,
  selectSlidersConsumersSearchText,
} from "./store/slidersConsumersSlice";
import SlidersConsumersTableHead from "./SlidersConsumersTableHead";
import { Button, Tooltip } from "@mui/material";

function SlidersConsumersTable(props) {
  const dispatch = useDispatch();
  const slidersConsumers = useSelector(selectSlidersConsumers);
  const searchText = useSelector(selectSlidersConsumersSearchText);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(slidersConsumers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {

    dispatch(getSlidersConsumers()).then((resp) => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(slidersConsumers, (item) =>
          item.type.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setPage(0);
    } else {
      setData(slidersConsumers);
    }
  }, [slidersConsumers, searchText]);

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

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  /*function handleClick(item) {
    props.navigate(`update`, {
      state: {
        image: item.image,
        enabled: item.enabled,
        type: item.type,
        id: item.id,
        channel: item.channel,
        gec: item.gec,
      },
    });
  }*/

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  async function handleClickUpdate(item) {
    await props.navigate(`update`, {
      state: {
        image: item.image,
        enabled: item.enabled,
        type: item.type,
        id: item.id,
        channel: item.channel,
        gec: item.gec,
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
          No se encontraron Sliders
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">

      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
        <SlidersConsumersTableHead
          selectedSliderIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
          onMenuItemClick={handleDeselect}
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
                  <TableCell component="th" scope="row" padding="none">
                    <img
                      width={100}
                      className="rounded m-10"
                      src={n.image}
                      alt={n.id}
                    />
                  </TableCell>
                  <TableCell
                    className="p-4 md:p-16 "
                    component="th"
                    scope="row"
                  >
                    {n.channel}
                  </TableCell>
                  <TableCell
                    className="p-4 md:p-16 "
                    component="th"
                    scope="row"
                  >
                    {n.gec}
                  </TableCell>

                  <TableCell
                    className="p-4 md:p-16"
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
                  <TableCell
                    className="p-4 md:p-16"
                    component="th"
                    scope="row"
                  >
                    {/*<Tooltip title='Ver' placement="top">
                        <Button onClick={(event) => handleClickView(n)}>
                          <FuseSvgIcon size={20} color="action">
                            heroicons-outline:eye
                          </FuseSvgIcon>
                        </Button>
                      </Tooltip>*/}
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

export default withRouter(SlidersConsumersTable);
