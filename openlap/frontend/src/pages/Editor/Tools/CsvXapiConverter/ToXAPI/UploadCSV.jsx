import React, { useState } from "react";
import { Box, Button, Grid, IconButton, Link, Typography,} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import Papa from "papaparse";
import {
  setDatasetColumnDef,
  setDatasetRowData,
  setSelectedFile,
} from "../../../../../utils/redux/reducers/csvxapiReducer";
import { useDispatch, useSelector } from "react-redux";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { GridDeleteIcon } from "@mui/x-data-grid";

const UploadCSV = ({
  rows,
  setRows,
  columns,
  setColumns,
  reload,
  setReload,
  xapi,
  checker,
  onJSON,
  handleUploadCSV,
  selectedFile,
  setSelectedFile,
}) => {
  const dispatch = useDispatch();
  // const [selectedFile, setSelectedFile] = useState({
  //   name: "",
  //   uploaded: false,
  // });

  // const xapi = useSelector((state) => state.csvxapiReducer.xapi);

  const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  const columnDefs = useSelector((state) => state.csvxapiReducer.data.columnDefs);

  // const id = useSelector((state) => state.csvxapiReducer.xapi.id);
  // const actor = useSelector((state) => state.csvxapiReducer.xapi.actor);
  // const verb = useSelector((state) => state.csvxapiReducer.xapi.verb);
  // const object = useSelector((state) => state.csvxapiReducer.xapi.object);
  // const context = useSelector((state) => state.csvxapiReducer.xapi.context);
  // const timestamp = useSelector((state) => state.csvxapiReducer.xapi.timestamp);

  const [json, setJson] = useState({
    name: "",
  });

  const selectFile = (event) => {
    // console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
    //dispatch(setSelectedFile(event.target.files[0]));
  };

  const cancelSelect = () => {
    setSelectedFile({ name: "" });
  };

  const [check, setCheck] = useState(true);

  //console.log(xapi[0]);
  const onDelete = async (id) => {

    // alert("delete" + id);
    // console.log(rows[id]);
    // console.log(rowData[id]);
    let newRows = rowData.filter((row) => row.id !== id);
    // console.log(newRows);
    dispatch(setDatasetRowData(newRows));
    setRows(newRows);
    //setRows(rows.filter((row) => row.id !== id));
   // console.log(rows);
    //handleUploadCSV(); 
    //problem: resets dataset, so no delete
    // --> need to find a way to rerender without using handleUploadCSV
    //but using states instead didn't work for onJSON for example
    //bc table only reloads with handleUploadCSV
    //maybe rerendering CSVTable instead of UploadCSV? using useEffect maybe?
    //but useEffect only happens WHEN rerendering happens
    //so i can't trigger rerendering using useEffect...
  };

  //console.log(rows);



  const uploadFile = async() => {

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
        dynamicTyping: true,
        delimiter: "",	
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
        //https://www.papaparse.com/docs
      });

      const parsedData = csv?.data;


      //prepare row data & xapi

      let newRowData = [];
      let newXapiData = [];

      for (let i = 0; i < parsedData.length; i++) {
        let newObj = {
          id: i,
          ...parsedData[i],
        };
        newRowData.push(newObj);
        newXapiData.push({});
      };

      dispatch(setDatasetRowData(newRowData));
      setRows(newRowData);


      //prepare column data

      const columns = Object.keys(parsedData[0]);

      let newColumnData = [
        { field: "id", headerName: "id" },
        {
          field: "json",
          headerName: "JSON",
          width: 80,
          renderCell: (params) => {
            return (
              <>
              <Button onClick={() => onJSON(params.row)}>
                <SearchIcon />
                {checker[params.row.id] ? (<CheckCircleIcon color="success"/>):(<CancelIcon color="warning"/>)}
              </Button>
              </>
            );
          },
        },
        {
          field: "delete",
          headerName: "",
          width: 50,
          renderCell: (params) => {
            return (
              <>
              <Button  onClick={() => onDelete(params.row.id)}>
                <GridDeleteIcon/>
              </Button>
              </>
            );
          },
        },
      ];
      columns.forEach((col) => {
        let newCol = { field: col, headerName: col, editable: true };
        newColumnData.push(newCol);
      });

      dispatch(setDatasetColumnDef(newColumnData));

      handleUploadCSV();
    };
    reader.readAsText(selectedFile);
    if(reload==false){
      handleUploadCSV();
    }
    setReload(true);
  };

  
  if (reload) {
    return (
      <Grid container justifyContent="center" sx={{ pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={!Boolean(selectedFile.name)}
          onClick={uploadFile}
        >
          Confirm
        </Button>
      </Grid>
    );
  } else {
    return (
      // selectedFile.uploaded ? (<></>):(
      <>
        {/*<Typography sx={{ py: 1.5, fontWeight: "bold" }}>Load CSV</Typography>*/}

        <Box sx={{ pt: 2 }}>
          {selectedFile.name ? (
            <>
              <Grid container sx={{ height: 50 }} alignItems="center">
                <Grid item xs>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs>
                      <Grid container alignItems="center">
                        <InsertDriveFileIcon sx={{ color: "primary.main" }} />
                        <Typography sx={{ fontWeight: "bold", ml: 1 }}>
                          {selectedFile.name}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container alignItems="center">
                        <Box
                          sx={{
                            borderRadius: 1,
                            px: 1,
                            mx: 1.5,
                            py: 0.5,
                            backgroundColor: "openlapbg.light",
                          }}
                        >
                          <Typography variant="body2">
                            {selectedFile.size} KB
                          </Typography>
                        </Box>

                        <IconButton
                          onClick={cancelSelect}
                          size="small"
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                  border: "2px dotted #C4C4C4",
                  height: 50,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <Link component="label" sx={{ cursor: "pointer" }}>
                  Choose file
                  <input
                    hidden
                    multiple
                    onChange={selectFile}
                    type="file"
                    accept=".csv"
                  />
                </Link>
              </Grid>
            </>
          )}
        </Box>
        <Grid container justifyContent="center" sx={{ pt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GetAppIcon />}
            disabled={!Boolean(selectedFile.name)}
            onClick={uploadFile}
          >
            Load data
          </Button>
        </Grid>
      </>
    );
  }
};

export default UploadCSV;
