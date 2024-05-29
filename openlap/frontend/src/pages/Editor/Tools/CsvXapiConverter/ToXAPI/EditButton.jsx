import React, { useState } from "react";
import {
  Button, Menu,
  MenuItem, Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItemIcon from "@mui/material/ListItemIcon";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import { setDatasetRowData } from "../../../../../../utils/redux/reducers/iscReducer";
import { useDispatch, useSelector } from "react-redux";

const EditButton = (props) => {
  const {
    columns,
    column,
    handleToggleReplaceValueColumn,
    handleToggleEditColumn,
    selectedRows,
    setSelectedRows,
  } = props;
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.iscReducer.data.rowData);
  const columnDefs = useSelector((state) => state.iscReducer.data.columnDefs);

  const [openEditMenu, setOpenEditMenu] = useState(null);

  const handeCloseMenuEditRenameMode = () => {
    handleToggleEditColumn();
    if (openEditMenu) setOpenEditMenu(null);
  };
  const handeCloseMenuEditReplaceMode = () => {
    handleToggleReplaceValueColumn();
    if (openEditMenu) setOpenEditMenu(null);
  };

  return (
    <>
      <Button
        disabled={
          column.editColumn || column.replaceValueColumn
        }
        startIcon={<EditIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setOpenEditMenu(event.currentTarget)}
      >
        Edit
      </Button>
      <Menu
        open={Boolean(openEditMenu)}
        anchorEl={openEditMenu}
        onClose={() => setOpenEditMenu(null)}
      >
        <MenuItem
          onClick={handeCloseMenuEditRenameMode}
          disabled={!Boolean(columnDefs.length)}
        >
          <ListItemIcon>
            <DriveFileRenameOutlineIcon color="primary" />
          </ListItemIcon>
          <Typography>Rename column</Typography>
        </MenuItem>
        <MenuItem
          onClick={handeCloseMenuEditReplaceMode}
          disabled={!Boolean(columnDefs.length)}
        >
          <ListItemIcon>
            <DriveFileRenameOutlineIcon color="primary" />
          </ListItemIcon>
          <Typography>Replace Value</Typography>
        </MenuItem>
     </Menu>
    </>
  );
};

export default EditButton;
