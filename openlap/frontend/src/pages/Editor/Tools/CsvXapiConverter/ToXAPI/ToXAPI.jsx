import React, { useMemo, useState } from "react";
import EditButton from "./EditButton";
import AddButton from "./AddButton";
import { sendXAPI } from "../../../../../utils/backend";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UploadCSV from "./UploadCSV";
import CSVTable from "../../../Tools/CsvXapiConverter/ToXAPI/CSVTable";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "react-json-editor-ui/dist/react-json-editor-ui.cjs.development.css";

import {
  setDefault,
  setDatasetColumnDef,
  setDatasetRowData,
  setXapiFinal,
} from "../../../../../utils/redux/reducers/csvxapiReducer";

import JSONPretty from "react-json-pretty";

import { useNavigate } from "react-router-dom";
import Form from "./Form";

const ToXAPI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const xapiFinal = useSelector((state) => state.csvxapiReducer.xapiFinal);

  const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const form = useSelector((state) => state.csvxapiReducer.form);

  const [selectedFile, setSelectedFile] = useState({
    name: "",
  });

  //const xapi = useSelector((state) => state.csvxapiReducer.xapi);
  const [xapi, setXapi] = useState([]);
  const [checker, setChecker] = useState([]);
  const [allValid, setAllValid] = useState(true);

  const [openMenu, setOpenMenu] = useState(null);

  const [openAddScoreMenu, setOpenAddScoreMenu] = useState(null);
  const [openAddContextActivityMenu, setOpenAddContextActivityMenu] =
    useState(null);
  const [openAddResultExtensionMenu, setOpenAddResultExtensionMenu] =
    useState(null);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [sendDialog, setSendDialog] = useState(false);

  const [error, setError] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = React.useState({
    key: "",
  });

  const handleFormFields = (event) => {
    const { name, value } = event.target;
    // if (Boolean(errorMessageEmail) && name === "email")
    //   setErrorMessageEmail("");
    // if (Boolean(errorMessagePassword) && name === "key")
    //   setErrorMessagePassword("");
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formFields);
    sendXAPI(xapiFinal, formFields.key);
    //sendXAPI(xapiFinal, "MzA4YTEzZmZiM2NiZmM4NTExMmMyMDQ3YmFjNDY4NGFjZDFkOGU5OTpmYTBiODY4MzQ3ZWNlOGJlYmZmMmU5NzYzNDE0NDhhMTBlNmVlM2Jl");
  };

  const [uploadCsv, setUploadCsv] = useState(false);
  const [jsonView, setJsonView] = useState(false);
  const [json, setJson] = useState({ test: "test" });
  const [errors, setErrors] = useState([]);

  const sample = {
    string: "ABCDE",
    number: 1,
    null: null,
    boolean: true,
    object: {
      string: "ABCDE",
      number: 1,
      null: null,
      boolean: true,
    },
  };

  const jsonStyle = {
    propertyStyle: { color: "darkorange" },
    stringStyle: { color: "blue" },
    numberStyle: { color: "blue" },
  };

  const [openColumnDefs, setOpenColumnDefs] = useState(false);
  const [openColumnContent, setOpenColumnContent] = useState(false);

  const [reload, setReload] = useState(false);

  const [selectedRow, setSelectedRow] = useState(-1);

  const onJSON = (row) => {
    if (xapi[row.id]) {
      //alert(JSON.stringify(xapi[row.id]));
      //alert(errors[row.id]);
      setSelectedRow(row.id);
      setJsonView(true);
    } else {
      alert("No rules applied yet");
    }
  };

  const handleUploadCSV = () => {
    setUploadCsv((prevState) => !prevState);
    return;
  };

  const clearDataset = () => {
    setDeleteDialog((prevState) => !prevState);
    // dispatch(setDatasetRowData([]));
    // dispatch(setDatasetColumnDef([]));
    setReload(false);
    dispatch(setDefault());
  };

  const handleSendButton = () => {
    dispatch(setXapiFinal(xapi));
    setSendDialog(true);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [column, setColumn] = useState({
    columnName: "",
    columnContent: [],
    selectedColumnToEdit: "",
    valueToReplace: "",
    newValue: "",
    replaceValueColumn: false,
    editColumn: false,
  });
  const [openError, setOpenError] = useState({
    open: false,
    severity: undefined,
    columnIssues: [],
    message: "",
  });
  const [columnIssues, setColumnIssues] = useState([]);

  const defaultColDef = useMemo(
    () => ({
      // sortable: false,
      // filter: true,
      resizeable: true,
      editable: true,
      initialWidth: 150,
      resizable: true,
    }),
    []
  );

  // Function to rename a key in object while retaining its position

  //const [selection, setSelection] = useState([]);

  // const [selectionModel, setSelectionModel] = React.useState([])

  // const handleSetSelection = (selection) => {
  //   alert("test");
  //     // selection.forEach((select) => {
  //     //     alert(select);
  //     // });
  // };

  const handleToggleEditColumn = () => {
    setColumn({
      ...column,
      columnName: Boolean(column.columnName) ? "" : column.columnName,
      editColumn: !column.editColumn,
    });
  };
  const handleToggleReplaceValueColumn = () => {
    setColumn({
      ...column,
      //columnName: Boolean(column.columnName) ? "" : column.columnName,
      replaceValueColumn: !column.replaceValueColumn,
    });
  };

  const renameObjKey = (oldObj, oldKey, newKey) => {
    const keys = Object.keys(oldObj);
    const newObj = keys.reduce((acc, val) => {
      if (val === oldKey) {
        acc[newKey] = oldObj[oldKey];
      } else {
        acc[val] = oldObj[val];
      }
      return acc;
    }, {});

    return newObj;
  };

  const confirmRenameColumn = () => {
    let tempRowData = [];
    let tempColumnDefs = [];
    let columnToRename = column.selectedColumnToEdit;
    let newColumnName = column.columnName;

    columnDefs.forEach((col) => {
      if (col.field === columnToRename) {
        tempColumnDefs.push({
          ...col,
          headerName: newColumnName,
          //field: newColumnName,
        });
      } else tempColumnDefs.push(col);
    });

    // for (let row of rowData) {
    //   let index = rowData.indexOf(row);
    //   let newRowData = renameObjKey(
    //     rowData[index],
    //     columnToRename,
    //     newColumnName
    //   );
    //   tempRowData.push(newRowData);
    // }

    // setRows(tempRowData);
    // setColumns(tempColumnDefs);
    dispatch(setDatasetRowData(tempRowData));
    dispatch(setDatasetColumnDef(tempColumnDefs));

    let issueExists = columnIssues.filter((col) => col === columnToRename);
    if (Boolean(issueExists.length)) {
      let newColumnIssues = columnIssues.filter(
        (col) => col !== columnToRename
      );
      newColumnIssues.push(newColumnName);
      setColumnIssues(newColumnIssues);
    }

    setColumn({
      ...column,
      selectedColumnToEdit: "",
      columnName: "",
    });
  };

  const confirmReplaceValueColumn = () => {
    // let tempRowData = [];
    // let tempColumnDefs = [];
    let selectedColumn = column.selectedColumnToEdit;
    let valueToReplace = column.valueToReplace;
    let newValue = column.newValue;

    rowData.forEach((row) => {
      for (const [key, value] of Object.entries(row)) {
        if (key == selectedColumn && value == valueToReplace) {
          row[key] = newValue;
        }
      }
    });

    // setRows(tempRowData);
    // setColumns(tempColumnDefs);
    // dispatch(setDatasetRowData(tempRowData));
    // dispatch(setDatasetColumnDef(tempColumnDefs));

    setColumn({
      ...column,
      selectedColumnToEdit: "",
      valueToReplace: "",
      newValue: "",
    });
  };

  const handleColumnSelected = (selectedColumn) => {
    let arr = [];

    rowData.forEach((row) => {
      for (const [key, value] of Object.entries(row)) {
        if (key === selectedColumn && !arr.includes(value)) {
          arr.push(value);
        }
      }
    });

    setColumn({
      ...column,
      selectedColumnToEdit: selectedColumn,
      columnContent: arr,
    });
  };

  return (
    <>
      <Stack direction="row" justifyContent="end">
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => handleSendButton()}
          //disabled={!allValid}
        >
          send
        </Button>
      </Stack>
      {reload ? (
        <>
          <Button onClick={() => setDeleteDialog(true)}>
            <DeleteIcon color="error" />
            Delete CSV
          </Button>
          <AddButton setSelectedRows={setSelectedRows} />
          <EditButton
            columns={columns}
            column={column}
            handleToggleReplaceValueColumn={handleToggleReplaceValueColumn}
            handleToggleEditColumn={handleToggleEditColumn}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          {/* Edit: Rename column */}
          {column.editColumn ? (
            <>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <FormControl sx={{ width: 200 }} size="small">
                      <InputLabel>Select column</InputLabel>
                      <Select
                        open={openColumnDefs}
                        label="Select column"
                        value={column.selectedColumnToEdit}
                        onClose={() =>
                          setOpenColumnDefs((prevState) => !prevState)
                        }
                        onOpen={() =>
                          setOpenColumnDefs((prevState) => !prevState)
                        }
                        onChange={(event) => {
                          setColumn({
                            ...column,
                            selectedColumnToEdit: event.target.value,
                          });
                        }}
                      >
                        {columnDefs.map((col, index) => {
                          return (
                            <MenuItem key={index} value={col.field}>
                              {col.field}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <ArrowForwardIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Rename column"
                      variant="outlined"
                      size="small"
                      value={column.columnName}
                      onChange={(event) => {
                        setColumn({
                          ...column,
                          columnName: event.target.value,
                        });
                      }}
                      sx={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant={Boolean(column.columnName) ? "contained" : ""}
                      disabled={!Boolean(column.columnName)}
                      onClick={confirmRenameColumn}
                    >
                      Confirm
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleToggleEditColumn}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {column.replaceValueColumn ? (
            <>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <FormControl sx={{ width: 200 }} size="small">
                      <InputLabel>Select column</InputLabel>
                      <Select
                        open={openColumnDefs}
                        label="Select column"
                        value={column.selectedColumnToEdit}
                        onClose={() =>
                          setOpenColumnDefs((prevState) => !prevState)
                        }
                        onOpen={() =>
                          setOpenColumnDefs((prevState) => !prevState)
                        }
                        onChange={(event) => {
                          handleColumnSelected(event.target.value);
                        }}
                      >
                        {columnDefs.map((col, index) => {
                          return (
                            <MenuItem key={index} value={col.field}>
                              {col.field}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl sx={{ width: 200 }} size="small">
                      <InputLabel>Select value to replace</InputLabel>
                      <Select
                        open={openColumnContent}
                        label="Select value to replace"
                        value={
                          column.valueToReplace == undefined
                            ? "/null value/"
                            : column.valueToReplace
                        }
                        onClose={() =>
                          setOpenColumnContent((prevState) => !prevState)
                        }
                        onOpen={() =>
                          setOpenColumnContent((prevState) => !prevState)
                        }
                        onChange={(event) => {
                          setColumn({
                            ...column,
                            valueToReplace: event.target.value,
                          });
                        }}
                      >
                        {column.columnContent.map((val, index) => {
                          if (val == undefined) {
                            return (
                              <MenuItem key={index} value={val}>
                                /null value/
                              </MenuItem>
                            );
                          } else {
                            return (
                              <MenuItem key={index} value={val}>
                                {val}
                              </MenuItem>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <ArrowForwardIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="New Value"
                      variant="outlined"
                      size="small"
                      value={column.newValue}
                      onChange={(event) => {
                        setColumn({
                          ...column,
                          newValue: event.target.value,
                        });
                      }}
                      sx={{ width: 200 }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      //variant={Boolean(column.valueToReplace) ? "contained" : ""}
                      // disabled={!Boolean(column.valueToReplace)}
                      onClick={confirmReplaceValueColumn}
                    >
                      Confirm
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleToggleReplaceValueColumn}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={handleUploadCSV}>
            Upload CSV
          </Button>
        </>
      )}

      <Dialog open={uploadCsv} fullWidth maxWidth="xs">
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            {reload ? "Please Confirm" : "Upload CSV"}
            <IconButton onClick={() => setUploadCsv((prevState) => !prevState)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <UploadCSV
            rows={rows}
            setRows={setRows}
            columns={columns}
            setColumns={setColumns}
            reload={reload}
            setReload={setReload}
            xapi={xapi}
            checker={checker}
            onJSON={onJSON}
            handleUploadCSV={handleUploadCSV}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </DialogContent>
      </Dialog>

      {/* <JSONViewer data={{json}} /> */}

      <Dialog open={jsonView} fullWidth maxWidth="xs">
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            JSON View
            <IconButton onClick={() => setJsonView((prevState) => !prevState)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ pl: 1, fontWeight: "bold" }}> errors </Typography>
          {jsonView ? (
            <>
              {errors[selectedRow].split("\n").map((i, key) => {
                return <div key={key}>{i}</div>;
              })}
            </>
          ) : (
            <></>
          )}
          <br />
          <Typography sx={{ pl: 1, fontWeight: "bold" }}> JSON </Typography>
          <JSONPretty id="json-pretty" data={xapi[selectedRow]}></JSONPretty>
          {/* <JSONViewer data={JSON.stringify(xapi[selectedRow])} /> */}
          {/* <JsonFormatter json={JSON.stringify(xapi[selectedRow])} tabWith={4} jsonStyle={jsonStyle} /> */}
        </DialogContent>
      </Dialog>

      <CSVTable
        // rows={rowData}
        // setRows={setRows}
        columns={columnDefs}
        setColumns={setColumns}
        rows={rows}
        setRows={setRows}
        handleUploadCSV={handleUploadCSV}
        xapi={xapi}
        setXapi={setXapi}
        checker={checker}
        setChecker={setChecker}
        allValid={allValid}
        setAllValid={setAllValid}
        errors={errors}
        setErrors={setErrors}
      />

      <Dialog open={deleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete dataset?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the dataset? All your progress will be
          lost!
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={clearDataset} variant="contained" color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* <ApplyButton //doesn't get re-rendered to have edited rowData
        rowData={rows}
        setRows={setRows}
        handleUploadCSV={handleUploadCSV}
        xapi={xapi}
        setXapi={setXapi}
        checker={checker}
        setChecker={setChecker}
        allValid={allValid}
        setAllValid={setAllValid}
        errors={errors}
        setErrors={setErrors}
      /> */}

      <Dialog open={sendDialog} fullWidth maxWidth="xs">
        <DialogTitle>Learning Locker Credentials</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              error={Boolean(errorMessagePassword)}
              helperText={errorMessagePassword}
              label="Basic Auth Key"
              name="key"
              placeholder="Basic Auth Key"
              autoComplete="current-password"
              onChange={handleFormFields}
            />
            <Grid container sx={{ py: 1 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              <span>Send</span>
            </LoadingButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setSendDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Form />
    </>
  );
};

export default ToXAPI;
