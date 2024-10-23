
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useDispatch } from "react-redux";
import TableHead from "@mui/material/TableHead";
import { lighten } from "@mui/material/styles";

const rows = [
  {
    id: "usr",
    align: "left",
    disablePadding: false,
    label: "Usuario",
    sort: true,
  },
  {
    id: "clients",
    align: "left",
    disablePadding: false,
    label: "Clientes",
    sort: true,
  },
  {
    id: "products",
    align: "left",
    disablePadding: false,
    label: "Productos",
    sort: true,
  },

  {
    id: "prizes",
    align: "left",
    disablePadding: false,
    label: "Premios",
    sort: true,
  },

  {
    id: "directs",
    align: "left",
    disablePadding: false,
    label: "Compras",
    sort: true,
  },
  {
    id: "comercial",
    align: "left",
    disablePadding: false,
    label: "Comercializadores",
    sort: true,
  },
  {
    id: "actions",
    align: "left",
    disablePadding: false,
    label: "Acciones",
    sort: true,
  }
];

function RemindersTableHead(props) {
  const { selectedReminderIds } = props;
  const numSelected = selectedReminderIds.length;

  const [selectedRemindersMenu, setSelectedRemindersMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedRemindersMenu(event) {
    setSelectedRemindersMenu(event.currentTarget);
  }

  function closeSelectedRemindersMenu() {
    setSelectedRemindersMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              width={30}
              className="p-4 md:p-6"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? "none" : "normal"}
              sortDirection={
                props.order.id === row.id ? props.order.direction : false
              }
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={
                    row.align === "right" ? "bottom-end" : "bottom-start"
                  }
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default RemindersTableHead;
