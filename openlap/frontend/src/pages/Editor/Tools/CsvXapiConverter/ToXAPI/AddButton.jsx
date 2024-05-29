import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItemIcon from "@mui/material/ListItemIcon";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CloseIcon from "@mui/icons-material/Close";
import {
  setDatasetColumnDef,
  setDatasetRowData,
} from "../../../../../utils/redux/reducers/csvxapiReducer";
import { useDispatch, useSelector } from "react-redux";

const AddButton = ({ setSelectedRows }) => {
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  const columnDefs = useSelector((state) => state.csvxapiReducer.data.columnDefs);

  const [openAddMenu, setOpenAddMenu] = useState(null);
  const [column, setColumn] = useState({
    columnName: "",
    //columnType: "",
    addColumn: false,
  });

  const handleToggleColumn = () => {
    setColumn({
      ...column,
      addColumn: !column.addColumn,
    });
    if (openAddMenu) setOpenAddMenu(null);
  };

  const handleColumnName = (event) => {
    setColumn({
      ...column,
      columnName: event.target.value,
    });
  };

  const confirmAddColumn = () => {
    let tempColumnDefs = [...columnDefs];
    tempColumnDefs.push({
      headerName: column.columnName,
    });
    dispatch(setDatasetColumnDef(tempColumnDefs));

    let tempRowData = rowData.map((row) => ({
      ...row,
      [column.columnName]: "",
    }));
    dispatch(setDatasetRowData(tempRowData));

    setColumn({
      columnName: "",
      addColumn: !column.addColumn,
    });
  };

  const confirmAddRow = () => {
    let tempObject = {};
    let tempRow = [...rowData];
    tempObject["id"] = rowData.length;
    columnDefs.forEach((col) => {
      tempObject[Object.values(col)] = "";
    });
    tempRow.push(tempObject);
    dispatch(setDatasetRowData(tempRow));
    setSelectedRows([]);
    if (openAddMenu) setOpenAddMenu(null);
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setOpenAddMenu(event.currentTarget)}
      >
        Add
      </Button>
      <Menu
        open={Boolean(openAddMenu)}
        anchorEl={openAddMenu}
        onClose={() => setOpenAddMenu(null)}
      >
        <Tooltip
          title={!Boolean(columnDefs.length) ? "Need to add column first" : ""}
          placement="left"
          arrow
        >
          <div style={{ display: "inline-block", width: "100%" }}>
            <MenuItem
              onClick={confirmAddRow}
              component="div"
              disabled={!Boolean(columnDefs.length)}
            >
              <ListItemIcon>
                <TableRowsIcon color="primary" />
              </ListItemIcon>
              <Typography>Add row</Typography>
            </MenuItem>
          </div>
        </Tooltip>

        <MenuItem onClick={handleToggleColumn} disabled={column.addColumn}>
          <ListItemIcon>
            <ViewColumnIcon color="primary" />
          </ListItemIcon>
          <Typography>Add column</Typography>
        </MenuItem>
      </Menu>

      {column.addColumn ? (
        <>
          <Dialog open={column.addColumn} onClose={handleToggleColumn}>
            <DialogTitle>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                Add new column
                <IconButton onClick={handleToggleColumn}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={confirmAddColumn} style={{ width: 350 }}>
                <TextField
                  label="Column name"
                  variant="outlined"
                  required
                  fullWidth
                  // onChange={handleColumnName}
                  onInput={handleColumnName}
                  sx={{ mt: 1, mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  disabled={
                    !Boolean(column.columnName)
                  }
                  // onClick={confirmAddColumn}
                  type="submit"
                >
                  Confirm
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddButton;
