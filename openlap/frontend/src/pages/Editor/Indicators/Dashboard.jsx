import React, { useEffect, useState } from "react";
import {
  AppBar,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAllPlatforms,
  resetIndicatorSession,
} from "../../../utils/redux/reducers/indicatorEditor";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { showVisualization } from "../../../utils/backend";
import { deleteIndicator } from "../../../utils/backend";
import Preview from "./Preview/Preview";
import Box from "@mui/material/Box";
import { createNewIndicatorRequest } from "../../../utils/redux/reducers/gqiEditor";
import PreviewIcon from "@mui/icons-material/Preview";
import ModalMessage from "../Common/Modal/ModalMessage";
import { getUserQuestionsAndIndicators } from "../../../utils/redux/reducers/reducer";
import { scrollToTop } from "../../../utils/utils";
import config from "./config";
import CloseIcon from "@mui/icons-material/Close";
import SelectContainer from "../Common/SelectContainer/SelectContainer";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuSingleSelect from "../Common/MenuSingleSelect/MenuSingleSelect";
import ConditionalSelectionRender from "../Common/ConditionalSelectionRender/ConditionalSelectionRender";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WifiIcon from "@mui/icons-material/Wifi";
import LinkIcon from "@mui/icons-material/Link";
import SettingsIcon from "@mui/icons-material/Link";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const indicatorTypes = [
  "Basic Indicator",
  "Composite Indicator",
  "Multi-level Indicator",
];

const Section = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  borderBottom: "1px solid #C9C9C9",
  marginLeft: "-24px",
  marginRight: "-24px",
  padding: "10px 24px 10px 24px",
  minHeight: "100%",
  "&.first": {
    padding: "0 16px 10px 16px",
  },
  "&.last": {
    borderBottom: "none",
  },
}));

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function Dashboard() {
  // console.log(indicatorTypes);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const indicatorSaveResponse = useSelector(
    (state) => state.compositeEditorReducer.selectedData.indicatorResponseData
  );
  const userDefinedIndicators = useSelector(
    (state) => state.rootReducer.user.definedIndicators
  );

  const [visData, setVisData] = useState({});
  const [loading, setLoading] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [indicators, setIndicators] = useState([]);
  const [feedback, setFeedback] = useState({
    openFeedbackStartCompositeIndicator: false,
    openFeedbackStartMultiLevelIndicator: false,
  });
  const [dashboardLoading, setdashboardLoading] = useState(false);
  const [ShareCopyIndicator, setShareCopyIndicator] = useState("");

  const [feedBackDelete, setfeedBackDelete] = useState(false);
  const [indicatorNameToBeDeleted, setindicatorNameToBeDeleted] = useState("");
  const [indicatorIdToBeDeleted, setindicatorIdToBeDeleted] = useState("");

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleClose = () => {
    setfeedBackDelete(false);
    setindicatorNameToBeDeleted("");
    setindicatorIdToBeDeleted("");
  };

  const handleDeleteIndicator = () => {
    /* console.log(
      "the indicator that will be deleted is with the id: " +
        indicatorIdToBeDeleted
    ); */
    deleteIndicator(indicatorIdToBeDeleted);
    handleClose();

    // adding the time out because I want to wait till the result of the deletion comes.
    // think of using a promise here instead of deleion
    setTimeout(() => {
      dispatch(resetIndicatorSession());
      dispatch(getUserQuestionsAndIndicators());
      scrollToTop();
    }, 1000); // 10000 milliseconds = 10 seconds
  };

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedType, setSelectedType] = React.useState("");
  const [search, setSearch] = useState("");

  const [hoveredRow, setHoveredRow] = useState(null); // State to track hovered row id

  // Function to handle mouse enter event on a row
  const handleMouseEnter = (indicatorId) => {
    setHoveredRow(indicatorId);
  };

  // Function to handle mouse leave event on a row
  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectTypeFilter = (event, value) => {
    setSelectedType(value);
  };

  const searchByIndicatorName = (e) => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
  };

  // filter on the search term, type, and date
  const filteredResults = indicators.filter((item) => {
    // filter by name
    const nameMatches = item.name.toLowerCase().includes(search.toLowerCase());

    // Map 'composite' and 'multianalysis' to their corresponding types
    const typeMapping = {
      composite: "Composite Indicator",
      multianalysis: "Multi-level Indicator",
    };

    const mappedIndicatorType =
      typeMapping[item.indicatorType] || item.indicatorType;

    // filter by type
    const typeMatches = selectedType
      ? mappedIndicatorType === selectedType
      : true;

    // filter by date
    const dateMatches = selectedDate
      ? new Date(item.createdOn).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;

    return nameMatches && typeMatches && dateMatches;
  });

  const [sortConfigType, setSortConfigType] = useState({
    key: "type",
    direction: "asc",
  });
  const [sortConfigDate, setSortConfigDate] = useState({
    key: "date",
    direction: "asc",
  });

  const handleSort = (column) => {
    if (column === "type") {
      setSortConfigType((prevConfig) => ({
        key: "type",
        direction: prevConfig.direction === "asc" ? "desc" : "asc",
      }));
    } else if (column === "date") {
      setSortConfigDate((prevConfig) => ({
        key: "date",
        direction: prevConfig.direction === "asc" ? "desc" : "asc",
      }));
    }
  };

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortConfigType.direction === "asc" && a.indicatorType > b.indicatorType)
      return 1;
    if (sortConfigType.direction === "asc" && a.indicatorType < b.indicatorType)
      return -1;
    if (
      sortConfigType.direction === "desc" &&
      a.indicatorType > b.indicatorType
    )
      return -1;
    if (
      sortConfigType.direction === "desc" &&
      a.indicatorType < b.indicatorType
    )
      return 1;

    if (
      sortConfigDate.direction === "asc" &&
      new Date(a.createdOn) > new Date(b.createdOn)
    )
      return 1;
    if (
      sortConfigDate.direction === "asc" &&
      new Date(a.createdOn) < new Date(b.createdOn)
    )
      return -1;
    if (
      sortConfigDate.direction === "desc" &&
      new Date(a.createdOn) > new Date(b.createdOn)
    )
      return -1;
    if (
      sortConfigDate.direction === "desc" &&
      new Date(a.createdOn) < new Date(b.createdOn)
    )
      return 1;

    return 0;
  });

  const getSortIcon = (column) => {
    if (column === "type") {
      return sortConfigType.direction === "asc" ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      );
    } else if (column === "date") {
      return sortConfigDate.direction === "asc" ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      );
    }
    return null;
  };

  const handleShowVisualization = async (indicator) => {
    setLoading(true);
    showVisualization(indicator).then((result) => {
      setVisData(result);
      setLoading(false);
    });
  };

  const handleConfirmIndicatorChoice = (indicatorType) => {
    if (indicatorType === "Basic Indicator") {
      dispatch(createNewIndicatorRequest(indicatorType));
      dispatch(resetIndicatorSession());
      dispatch(getAllPlatforms());
      navigate("/indicator/create-basic");
    } else if (indicatorType === "Composite Indicator") {
      handleFeedbackStartCompositeIndicator();
    } else if (indicatorType === "Multi-level Indicator") {
      handleFeedbackStartMultiLevelIndicator();
    }
  };

  const handleFeedback = (name, value) => {
    setFeedback(() => ({
      ...feedback,
      [name]: !value,
    }));
  };

  const handleFeedbackStartCompositeIndicator = () => {
    handleFeedback(
      "openFeedbackStartCompositeIndicator",
      feedback.openFeedbackStartCompositeIndicator
    );
  };

  const handleFeedbackStartMultiLevelIndicator = () => {
    handleFeedback(
      "openFeedbackStartMultiLevelIndicator",
      feedback.openFeedbackStartMultiLevelIndicator
    );
  };

  const _createIndicatorItem = ({ item }) => {
    const IndicatorItemContainer = styled("div")(() => ({
      "&:hover": {
        cursor: "pointer",
        "& #item-paper": {
          boxShadow:
            "0px 2px 4px rgba(0, 0, 0, 0.2), 0px 4px 8px rgba(0, 0, 0, 0.14), 0px 8px 16px rgba(0, 0, 0, 0.12)",
        },
      },
    }));

    return (
      <IndicatorItemContainer
        style={{ maxWidth: "250px" }}
        onClick={() => handleConfirmIndicatorChoice(item.name)}
      >
        <Tooltip
          title={<span style={{ fontSize: "16px" }}>{item.tooltip}</span>}
        >
          <div style={{ padding: "2px 5px" }}>
            <Paper
              id="item-paper"
              elevation={0}
              square={false}
              sx={{
                position: "relative",
                width: "250px",
                height: "150px",
                padding: "16px",
                border: "1px solid #dadce0",
              }}
            >
              <img
                width="225px"
                height="auto"
                src={item.img}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Paper>
            <div
              style={{ paddingTop: "16px", fontSize: "14px", width: "250px" }}
            >
              {item.name}
            </div>
            <div
              style={{
                paddingTop: "4px",
                fontSize: "12px",
                color: "#5f6368",
                width: "250px",
              }}
            >
              {item.info}
            </div>
          </div>
        </Tooltip>
      </IndicatorItemContainer>
    );
  };

  const _createNewIndicator = () => {
    return (
      <div>
        <p style={{ marginTop: 0, fontSize: "16px" }}>Create new indicators</p>
        <div style={{ display: "flex", gap: "32px" }}>
          {Object.entries(config).map(([key, value]) => (
            <_createIndicatorItem key={key} item={value} />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (userDefinedIndicators.length > 0) {
      setIndicators(userDefinedIndicators[0].indicators);
      //setting loading spinner because the indicators have been loaded;
      setdashboardLoading(false);
      //console.log(userDefinedIndicators[0].indicators.createdBy);

      console.log(userDefinedIndicators[0].indicators);
    } else setdashboardLoading(false);
  }, [userDefinedIndicators]);

  useEffect(() => {
    //setting the loading spinner to true until the user indicators have loaded;
    setdashboardLoading(true);
    dispatch(resetIndicatorSession());
    dispatch(getUserQuestionsAndIndicators());
    scrollToTop();
  }, [dispatch, indicatorSaveResponse.length]);

  /* To test the loading spinner with a delay of 10 seconds*/
  /* useEffect(() => {
    setdashboardLoading(true);
    setTimeout(() => {
      dispatch(resetIndicatorSession());
      dispatch(getUserQuestionsAndIndicators());
      scrollToTop();
    }, 10000); // 10000 milliseconds = 10 seconds
  }, [dispatch, indicatorSaveResponse.length]);  */

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <AppBar position="static" elevation={0}>
            <Toolbar
              sx={{
                minHeight: "48px!important",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #C9C9C9",
              }}
            >
              <Container disableGutters maxWidth="false">
                <Box
                  sx={{
                    maxHeight: "64px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {/* Centered Page Title */}
                  <div
                    style={{
                      flexGrow: 1,
                      textAlign: "center",
                      fontSize: "1rem",
                      color: "#000000",
                    }}
                  >
                    <div role="presentation">
                      <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="text.primary">
                          Indicator Editor
                        </Typography>
                      </Breadcrumbs>
                    </div>
                  </div>
                </Box>
              </Container>
            </Toolbar>
          </AppBar>
          <Grid
            container
            style={{
              maxWidth: "990px",
              display: "flex",
              flexDirection: "column",
              margin: "24px auto",
              padding: "0 32px",
            }}
          >
            <Grid item>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <_createNewIndicator />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <TextField
                        type="search"
                        fullWidth
                        sx={{ flex: 1, backgroundColor: "#f1f3f4" }}
                        placeholder="Search"
                        onChange={searchByIndicatorName}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<SettingsInputComponentIcon />}
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        sx={{ flex: "none" }} // Prevent button from growing
                      >
                        Settings
                      </Button>
                    </div>
                    <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "16px",
                          padding: "16px",
                          backgroundColor: "#f1f3f4",
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <div>
                            <strong>Type</strong>
                          </div>
                          <SelectContainer
                            name={"Type filter"}
                            isMandatory={false}
                            allowsMultipleSelections={false}
                            hideDesc={true}
                          >
                            <MenuSingleSelect
                              name={"Type"}
                              dataSource={indicatorTypes}
                              itemName={selectedType}
                              handleChange={handleSelectTypeFilter}
                            />
                          </SelectContainer>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <div>
                            <strong>Creation date</strong>
                          </div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Pick a date"
                              value={selectedDate}
                              onChange={handleDateChange}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Box>
                    </Collapse>

                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Box display="flex" flexDirection="column">
                                <div>
                                  <strong>Indicator Name</strong>
                                </div>
                              </Box>
                            </TableCell>
                            <TableCell style={{ width: "300px" }}>
                              <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                              >
                                <div>
                                  <strong>Type</strong>
                                </div>
                                <IconButton onClick={() => handleSort("type")}>
                                  {getSortIcon("type")}
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                              >
                                <div>
                                  <strong>Date</strong>
                                </div>
                                <IconButton onClick={() => handleSort("date")}>
                                  {getSortIcon("date")}
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="center">Preview</TableCell>
                            <TableCell align="center">Share</TableCell>
                            {/* <TableCell align="center">Delete</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedResults.map((indicator) => (
                            <TableRow
                              key={indicator.id}
                              onMouseEnter={() =>
                                handleMouseEnter(indicator.id)
                              }
                              onMouseLeave={handleMouseLeave}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {indicator.name}
                              </TableCell>
                              <TableCell>
                                {indicator.indicatorType === "composite"
                                  ? "Composite Indicator"
                                  : indicator.indicatorType === "multianalysis"
                                  ? "Multi-Level Analysis Indicator"
                                  : indicator.indicatorType}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  indicator.createdOn
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Tooltip title="Open Preview">
                                    <IconButton
                                      color="priamry"
                                      sx={{ padding: 0, margin: "0 4px" }}
                                      onClick={() => {
                                        handleShowVisualization(indicator);
                                        setOpenDetails(!openDetails);
                                        setShareCopyIndicator(
                                          indicator.indicatorRequestCode
                                        );
                                      }}
                                    >
                                      <PreviewIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Tooltip title="">
                                    <IconButton
                                      color="priamry"
                                      sx={{ padding: 0, margin: "0 4px" }}
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          indicator.indicatorRequestCode
                                        );
                                      }}
                                    >
                                      <LinkIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    opacity:
                                      hoveredRow === indicator.id ? 1 : 0, // Show delete button only if hovered
                                  }}
                                >
                                  <Tooltip title="Delete Indicator">
                                    <IconButton
                                      color="error"
                                      sx={{ padding: 0, margin: "0 4px" }}
                                      onClick={() => {
                                        setfeedBackDelete(true);
                                        setindicatorNameToBeDeleted(
                                          indicator.name
                                        );
                                        setindicatorIdToBeDeleted(indicator.id);
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {filteredResults.length === 0 && search !== "" && (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#80868b",
                            margin: "30px",
                          }}
                        >
                          No indicator found with search term: "{search}".
                        </span>
                      </div>
                    )}
                    {userDefinedIndicators.length === 0 && (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#80868b",
                            margin: "30px",
                          }}
                        >
                          No user defined indicators found.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          {/* Dialog to preview the indicators */}
          <Dialog
            fullWidth
            maxWidth="sm"
            open={openDetails}
            onClose={() => setOpenDetails(!openDetails)}
            aria-labelledby="form-dialog-title"
          >
            {!loading ? (
              <>
                <DialogTitle
                  id="form-dialog-title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #C9C9C9",
                  }}
                >
                  <span>Preview: {visData.name}</span>
                  <IconButton onClick={() => setOpenDetails(!openDetails)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Preview viz={visData} />
                </DialogContent>
              </>
            ) : (
              <Grid
                container
                direction="column"
                alignItems="center"
                sx={{ mt: 5 }}
              >
                <CircularProgress sx={{ mb: 1 }} />
                <Typography>Loading indicator</Typography>
              </Grid>
            )}
            <DialogActions
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareCopyIndicator);
                  }}
                >
                  <ContentCopyIcon /> Copy
                </Button>
              </Box>
              <Box>
                <Button onClick={() => setOpenDetails(!openDetails)}>
                  Close
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
          {/* Conditional loading spinner */}
          <ConditionalSelectionRender
            isRendered={true}
            isLoading={dashboardLoading}
            hasError={false}
            handleRefresh={() => {}}
          />
          {/* Modal for composite indicator */}
          <ModalMessage
            dialogTitle={"Please note"}
            dialogPrimaryContext={`All the combining basic indicators MUST apply the same analytics method, i.e., Count.`}
            openDialog={feedback.openFeedbackStartCompositeIndicator}
            setOpenDialog={() =>
              handleFeedback(
                "openFeedbackStartCompositeIndicator",
                feedback.openFeedbackStartCompositeIndicator
              )
            }
            primaryAction={() => navigate("/indicator/create-composite")}
            primaryButton={"Continue"}
          />
          {/* Modal for multi-level indicator */}
          <ModalMessage
            dialogTitle={"Please note"}
            dialogPrimaryContext={`All the combining basic indicators MUST have at least one common attribute, i.e., student ID.`}
            openDialog={feedback.openFeedbackStartMultiLevelIndicator}
            setOpenDialog={() =>
              handleFeedback(
                "openFeedbackStartMultiLevelIndicator",
                feedback.openFeedbackStartMultiLevelIndicator
              )
            }
            primaryAction={() => navigate("/indicator/create-multi-level")}
            primaryButton={"Continue"}
          />
          {/* Modal for deleting indicator */}
          <ModalMessage
            dialogTitle={"Delete indicator: " + indicatorNameToBeDeleted}
            dialogPrimaryContext={
              `Are you sure you want to delete the indicator: ` +
              indicatorNameToBeDeleted
            }
            openDialog={feedBackDelete}
            primaryAction={handleDeleteIndicator}
            primaryButton={"yes"}
            tertiaryAction={handleClose}
            tertiaryButton={"No"}
          />
        </div>
      </div>
    </>
  );
}
