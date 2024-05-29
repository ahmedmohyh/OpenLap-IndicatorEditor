import React from "react";
import {
  Collapse, Grid,
  Typography, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import IndicatorCard from "./IndicatorCard";
// import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import {
  setDefault,
  getStatements,
} from "../../../../utils/redux/reducers/csvxapiReducer";

// const handleGoToCSV = () => {
//   navigate("/isc/indicator");
//   dispatch(setDefault());
// };

const CsvXapiConverter = () => {
  const toCSVOrToXAPI = ["xAPI to CSV", "CSV to xAPI"];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleSelectConverter = () => {
  //   navigate("/csv-xapi-converter/to-csv");
  //   dispatch(setDefault());
  //   alert('to CSV selected');
  // };

  const selectConverter = (converter) => {
    if (converter === toCSVOrToXAPI[0]) {
      dispatch(getStatements());
      navigate("/csv-xapi-converter/to-csv");
      dispatch(setDefault());
    } else {
      navigate("/csv-xapi-converter/to-xapi");
      dispatch(setDefault());
    }
  };

  return (
    <>
      <Collapse in={selectConverter}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <Grid container direction="column">
              <Typography variant="h6" gutterBottom>
                CSV - xAPI Converter
              </Typography>
              <Typography variant="body2">
                This tool allows to convert CSV data to xAPI and vice versa
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Typography align="center">
          Pick which converter you want to use
        </Typography>
        <Grid container justifyContent="center" spacing={4} sx={{ py: 2 }}>
          {toCSVOrToXAPI.map((converter, index) => {
            return (
              <Grid item key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    height: 150,
                    width: 150,
                    border: "3px solid",
                    borderColor: "openlapbg.secondary",
                    "&:hover": {
                      boxShadow: 5,
                      backgroundColor: "openlapbg.light",
                    },
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  // onClick={handleSelectConverter}
                  onClick={() => selectConverter(converter)}
                >
                  <Typography variant="h6" align="center">
                    {converter}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>

      {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
    </>
  );
};

export default CsvXapiConverter;
