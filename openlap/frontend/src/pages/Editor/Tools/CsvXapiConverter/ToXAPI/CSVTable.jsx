import React, { useRef, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setDatasetColumnDef,
  setDatasetRowData,
} from "../../../../../utils/redux/reducers/csvxapiReducer";
import ApplyButton from "./ApplyButton";


const CSVTable = ({ columns, setColumns, rows, setRows, handleUploadCSV, xapi, setXapi, checker, setChecker, allValid, setAllValid, errors, setErrors}) => {
  // const dispatch = useDispatch();
  // const gridRef = useRef();
  // const rowData = useSelector((state) => state.csvxapiReducer.data.rowData);
  // const columnDefs = useSelector(
  //   (state) => state.csvxapiReducer.data.columnDefs
  // );

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport
          csvOptions={{
            fileName: "customerDataBase",
            delimiter: ",",
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    const rowIndex = rows.findIndex((row) => row.id === updatedRow.id);
    const updatedRows = [...rows];
    updatedRows[rowIndex] = updatedRow;
    setRows(updatedRows);
    return updatedRow;
  };

  return (
    <>
      <Grid container>
        <Grid item xs>
          <Grid container sx={{ pb: 1, pt: 1 }}>
            <Grid item xs>
              <div
                className="ag-theme-alpine"
                style={{ height: "300px", borderRadius: "16px" }}
              >
                <DataGrid
                  columns={columns}
                  rows={rows}
                  initialState={{
                    columns: {
                      columnVisibilityModel: {
                        id: false,
                      },
                    },
                  }}
                  slots={{ toolbar: CustomToolbar }}
                  editMode="row"
                  processRowUpdate={handleProcessRowUpdate}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={{ width: 38 }}></Grid>
      </Grid>
      <ApplyButton //doesn't get re-rendered to have edited rowData
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
      />

    </>
  );
};

export default CSVTable;
