import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { requestStatements } from "../../../../../utils/redux/sagas/request";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


const CSVPreview = () => {
  
  const statements = useSelector((state) => state.csvxapiReducer.statements);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // Recursive function to extract key-value pairs
  const extractKeyValue = (obj, prefix, result) => {
    // Iterate over the object and extract the key-value pairs
    for (const [key, value] of Object.entries(obj)) {
      // Create a new prefix by combining the current prefix and the current key
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      // If the value is an object, recurse into it
      if (typeof value === "object") {
        extractKeyValue(value, newPrefix, result);
      } else {
        // Otherwise, add the key-value pair to the result object
        if(value !== undefined){
          result[newPrefix] = value;
        }else{
          result[newPrefix] = "";
        }
      }
    }
  };

  const [vModel, setVModel] = useState({});


  useEffect(async () => {
    try {
      let response = await requestStatements();
      const { data } = response;
      let rowArray = [];
      let rowArrayError = [];
      for (let i = 0; i < data.length; i++) {
        let keyValObj = {};
        try{
        extractKeyValue(data[i], "", keyValObj);
      }catch(err){
        rowArrayError.push(data[i]);
      }    
        rowArray.push(keyValObj);
      }

      setRows(rowArray);

      let colArray = [];
      let vm = {};
      const cols = Object.keys(rowArray[1]);

      for (let i = 0; i < cols.length; i++) {
        let col = cols[i];

        //if col

        let newCol = {
          field: col,
          headerName: col,
          width: 240,
          hide: true,
          editable: true,
        };
        colArray.push(newCol);
        vm[col] = false;
      }


      vm["statement.actor.account.name"] = true;
      vm["statement.verb.display.en-US"] = true;
      vm["statement.object.definition.name.en-US"] = true;
      vm["statement.context.platform"] = true;
      vm["statement.timestamp"] = true;

      setVModel(vm);
      setColumns(colArray);


    } catch (error) {
      throw error;
    }
  }, [statements]);

  const [openColumnDefs, setOpenColumnDefs] = useState(false);
  const [column, setColumn] = useState({
    columnName: "",
    selectedColumnToEdit: "",
    deleteColumn: false,
    editColumn: false,
  });

  const [columnIssues, setColumnIssues] = useState([]);


  // Function to rename a key in object while retaining its position
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

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport
          csvOptions={{
            fileName: "xapi2csv_output",
            delimiter: ",",
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  const handleToggleEditColumn = () => {
    setColumn({
      ...column,
      columnName: Boolean(column.columnName) ? "" : column.columnName,
      editColumn: !column.editColumn,
    });
  };

  const confirmRenameColumn = () => {
    let tempRowData = [];
    let tempColumnDefs = [];
    let columnToRename = column.selectedColumnToEdit;
    let newColumnName = column.columnName;

    columns.forEach((col) => {
      if (col.field === columnToRename) {
        tempColumnDefs.push({
          ...col,
          headerName: newColumnName,
          //field: newColumnName,
        });
      } else tempColumnDefs.push(col);
    });

    // for (let row of rows) {
    //   let index = rows.indexOf(row);
    //   let newRowData = renameObjKey(rows[index], columnToRename, newColumnName);
    //   tempRowData.push(newRowData);
    // }

//    setRows(tempRowData);
    setColumns(tempColumnDefs);

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

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={column.editColumn}
        startIcon={<EditIcon />}
        onClick={(event) => handleToggleEditColumn()}
      >
        Rename Header
      </Button>
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
                    onClose={() => setOpenColumnDefs((prevState) => !prevState)}
                    onOpen={() => setOpenColumnDefs((prevState) => !prevState)}
                    onChange={(event) => {
                      setColumn({
                        ...column,
                        selectedColumnToEdit: event.target.value,
                      });
                    }}
                  >
                    {columns.map((col, index) => {
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

      {rows.length > 0 && columns.length > 0 ? (
        <>
          <Box sx={{ height: 400, width: 900 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
                columns: {
                  columnVisibilityModel: vModel,
                },
              }}
              pageSizeOptions={[5]}
              slots={{ toolbar: CustomToolbar }}
            />
          </Box>
        </>
      ) : (
        <>
        <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <CircularProgress color="inherit" size={72} />
        </Grid>
        <Grid item>
          <Typography variant="h5">Data being loaded</Typography>
        </Grid>
      </Grid></>
      )}

    </>
  );
};

export default CSVPreview;
