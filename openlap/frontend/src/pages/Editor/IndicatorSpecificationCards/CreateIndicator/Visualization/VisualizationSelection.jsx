import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Done as DoneIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import BarChart from "./Charts/BarChart.jsx";
import BoxPlot from "./Charts/BoxPlot.jsx";
import ChartList from "./components/ChartList.jsx";
import DotChart from "./Charts/DotChart.jsx";
import LineChart from "./Charts/LineChart.jsx";
import GroupedBarChart from "./Charts/GroupedBarChart.jsx";
import HeatMap from "./Charts/HeatMap.jsx";
import PieChart from "./Charts/PieChart/PieChart.jsx";
import PolarAreaChart from "./Charts/PieChart/PolarAreaChart.jsx";
import ScatterPl from "./Charts/ScatterPlot/Scatter.jsx";
import StackedBarChart from "./Charts/StackedBarChart.jsx";
import TreeMap from "./Charts/TreeMap.jsx";

export default function VisualizationSelection({
  openEditor,
  toggleEditPanel,
  chartSelected,
  setChartSelected,
  dataState,
  handleAddIndicatorData,
  handleAddNewRows,
  handleDeleteIndicatorData,
}) {
  const [openChart, setOpenChart] = useState({
    open: false,
    archorEl: null,
  });
  const [typeSelected, setTypeSelected] = useState({
    type: { name: "", image: "", description: "" },
    openFilter: false,
  });

  useEffect(() => {
    let currentISC = JSON.parse(sessionStorage.getItem("openlap-isc-data"));
    if (currentISC?.chartType) {
      setChartSelected(currentISC.chartType);
    }
  }, []);

  const handleTypeSelected = useCallback(
    (type) => {
      setTypeSelected((prevState) => ({
        ...prevState,
        type,
      }));
    },
    [setTypeSelected]
  );

  const handleShowDetails = useCallback(() => {
    setChartSelected((prevState) => ({
      ...prevState,
      showDetails: !prevState.showDetails,
    }));
  }, [setChartSelected]);

  const handleOpenCharts = (event) => {
    setOpenChart({
      ...openChart,
      open: !openChart.open,
      anchorEl: Boolean(openChart.archorEl) ? null : event.currentTarget,
    });
  };

  return (
    <>
      <Grid container justifyContent="space-between" spacing={2} sx={{ pb: 4 }}>
        <Grid item>
          {Boolean(chartSelected?.name) && (
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography variant="body2">Change chart: </Typography>
              </Grid>
              <Grid item>
                <Chip
                  color="primary"
                  deleteIcon={<EditIcon color="primary" />}
                  label={chartSelected.name}
                  onDelete={handleOpenCharts}
                  onClick={handleOpenCharts}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      <ChartCanvas
        openEditor={openEditor}
        toggleEditPanel={toggleEditPanel}
        dataState={dataState}
        handleAddIndicatorData={handleAddIndicatorData}
        handleAddNewRows={handleAddNewRows}
        handleDeleteIndicatorData={handleDeleteIndicatorData}
        chartSelected={chartSelected}
        handleOpenCharts={handleOpenCharts}
      />

      {/* // TODO: This has to be a separate component */}
      <Dialog
        open={openChart.open}
        onClose={handleOpenCharts}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Grid container justifyContent="space-between">
            <Grid item xs>
              Charts
              <Typography gutterBottom>
                Select a chart based on the recommendation of possible chart
                types and/or available data
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleOpenCharts}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <ChartList
            dataState={dataState}
            chartSelected={chartSelected}
            setChartSelected={setChartSelected}
            toggleEditPanel={toggleEditPanel}
          />
        </DialogContent>

        <DialogActions>
          {chartSelected?.name && (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleOpenCharts}
              startIcon={<DoneIcon />}
            >
              Select
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

const ChartCanvas = ({
  openEditor,
  toggleEditPanel,
  dataState,
  handleAddIndicatorData,
  handleAddNewRows,
  handleDeleteIndicatorData,
  chartSelected: { code },
  handleOpenCharts,
}) => {
  useEffect(() => {}, [code]);
  return (
    <>
      {code === "bar" ? (
        <BarChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "box" ? (
        <BoxPlot />
      ) : code === "dot" ? (
        <DotChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "heatmap" ? (
        <HeatMap />
      ) : code === "histogram" ? (
        <BarChart dataState={dataState} histogram={true} />
      ) : code === "line" ? (
        <LineChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "pie" ? (
        <PieChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "polar-area" ? (
        <PolarAreaChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "scatter-plot" ? (
        <ScatterPl
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "stacked-bar" ? (
        <StackedBarChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "grouped-bar" ? (
        <GroupedBarChart
          openEditor={openEditor}
          toggleEditPanel={toggleEditPanel}
          dataState={dataState}
          handleAddIndicatorData={handleAddIndicatorData}
          handleAddNewRows={handleAddNewRows}
          handleDeleteIndicatorData={handleDeleteIndicatorData}
        />
      ) : code === "treemap" ? (
        <TreeMap />
      ) : (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Typography sx={{ mb: 2 }}>Start by selecting a chart</Typography>
          </Grid>
          <Grid item>
            <Paper
              elevation={0}
              sx={{
                height: 150,
                width: 150,
                border: "3px solid",
                borderColor: "openlapTheme.secondary",
                "&:hover": {
                  boxShadow: 5,
                  backgroundColor: "openlapTheme.light",
                },
                p: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleOpenCharts}
            >
              <Typography variant="h6" align="center">
                Select Chart
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};
