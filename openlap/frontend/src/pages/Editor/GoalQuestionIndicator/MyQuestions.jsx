import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { showVisualization } from "../../../utils/backend";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import barGraph from "../../../assets/img/isc_charts/bar_graph.svg";
import Preview from '../Indicators/Preview/Preview';

const MyQuestions = () => {
  const userQuestionsAndIndicators = useSelector(
    (state) => state.rootReducer.user.questionsAndIndicators
  );

  const [openDetails, setOpenDetails] = useState(false);
  const [visData, setVisData] = useState([]);
  const [search, setSearch] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [questions, setQuestions] = useState(userQuestionsAndIndicators);
  const [loading, setLoading] = useState(false);

  const handleVisualization = async (question) => {
    let visArray = [];
    setLoading(true);
    question.indicators.forEach((i) => {
      showVisualization(i).then((result) => {
        visArray.push(result);
        setLoading(false);
      });
    });
    setVisData(visArray);
    setQuestionName(question.question.name);
  };

  const searchQuestions = (e) => {
    setSearch(e.target.value);
    let qiArray = [];
    userQuestionsAndIndicators.forEach((qi) => {
      if (qi.question.name.match(e.target.value)) {
        qiArray.push(qi);
      }
    });
    setQuestions(qiArray);
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs>
          <Grid container direction="column">
            <Typography variant="h6" gutterBottom>
              GQI Dashboard
            </Typography>
            <Typography variant="body2">
              Shows list of questions and create a question and associate
              indicators.
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            // onClick={handleCreateQuestion}
          >
            Create Question
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <OutlinedInput
            size="small"
            value={search}
            placeholder="Search for questions"
            onChange={searchQuestions}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon color="disabled" />
              </InputAdornment>
            }
            inputProps={{ "aria-label": "weight" }}
            color="primary"
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>

      {/*<Card sx={{ mb: 4, borderRadius: borderRadius }}>*/}
      {/*  <CardHeader*/}
      {/*    action={*/}
      {/*      <Button*/}
      {/*        variant="contained"*/}
      {/*        color="primary"*/}
      {/*        sx={{ borderRadius: borderRadius }}*/}
      {/*      >*/}
      {/*        Create Question*/}
      {/*      </Button>*/}
      {/*    }*/}
      {/*    title={<Typography> Create a new question </Typography>}*/}
      {/*  />*/}
      {/*</Card>*/}

      {/*<Grid container justifyContent="space-between" sx={{ mb: 1 }}>*/}
      {/*  <Typography style={{ fontWeight: "bold" }}>*/}
      {/*    List of my questions*/}
      {/*  </Typography>*/}
      {/*  <Typography> {questions.length} questions found </Typography>*/}
      {/*</Grid>*/}

      <Grid container>
        {questions.map((question, index) => {
          return (
            <>
              <Paper
                key={index}
                sx={{
                  width: 350,
                  height: 300,
                  m: 1,
                  "&:hover": { boxShadow: 5 },
                }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  sx={{ px: 3, pt: 3, height: "83%" }}
                >
                  <Grid item xs>
                    <Grid container direction={"column"}>
                      <Grid item xs sx={{ pb: 1.5 }}>
                        <Box
                          component="img"
                          sx={{ height: 72 }}
                          src={barGraph}
                          alt="bar-chart"
                        />
                      </Grid>

                      <Grid item xs>
                        <Tooltip
                          title={question.question.name}
                          placement="bottom"
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            {question.question.name}
                          </Typography>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider />

                <Grid
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{ py: 0.5, px: 1 }}
                >
                  <Button>Edit</Button>

                  <OptionsForQuestion
                    q={question}
                    handleVisualization={handleVisualization}
                    openDetails={openDetails}
                    setOpenDetails={setOpenDetails}
                  />
                </Grid>
              </Paper>
            </>
          );
        })}
      </Grid>

      {/* Modal to preview the indicators specified for the question*/}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDetails}
        onClose={() => setOpenDetails(!openDetails)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"> {questionName} </DialogTitle>
        {!loading ? (
          <>
            <DialogContent>
              <Grid container justifyContent="center" alignItems="center">
                {visData.map((viz, index) => (
                  <Preview key={index} viz={viz} card={true} />
                ))}
              </Grid>
            </DialogContent>
          </>
        ) : (
          <Grid container direction="column" alignItems="center" sx={{ mt: 4 }}>
            <CircularProgress sx={{ mb: 1 }} />
            <Typography> Loading indicators </Typography>
          </Grid>
        )}
        <DialogActions>
          <Button onClick={() => setOpenDetails(!openDetails)}> Close </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// A separate component for menu is required for correct item when onClick action is triggered.
// Read more: https://stackoverflow.com/questions/58041935/material-ui-menu-component-only-last-menuitem-onclick-action-is-triggered
const OptionsForQuestion = ({
  q,
  handleVisualization,
  openDetails,
  setOpenDetails,
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyQuestionCode = (question) => {
    const { questionCode } = question;
    navigator.clipboard.writeText(questionCode).then(() => {
      setCopiedCode(!copiedCode);
      setOpenMenu(null);
    });
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          handleVisualization(q);
          setOpenMenu(e.currentTarget);
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={openMenu}
        keepMounted
        open={Boolean(openMenu)}
        onClose={() => setOpenMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setOpenDetails(!openDetails);
            setOpenMenu(null);
          }}
        >
          <ListItemIcon>
            {" "}
            <EqualizerIcon />{" "}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {" "}
            Show question{" "}
          </Typography>
        </MenuItem>

        <MenuItem
          style={{ margin: "8px 0 8px 0" }}
          onClick={() => copyQuestionCode(q)}
        >
          <ListItemIcon>
            {" "}
            <LinkIcon />{" "}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {" "}
            Embed code{" "}
          </Typography>
        </MenuItem>

        <Divider style={{ margin: "8px 0 8px 0" }} />

        <MenuItem onClick={() => setOpenMenu(null)}>
          <ListItemIcon>
            {" "}
            <DeleteIcon color="error" />{" "}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {" "}
            Delete{" "}
          </Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={copiedCode}
        onClose={() => setCopiedCode(false)}
        autoHideDuration={3000}
        message="Code copied!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setCopiedCode(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default MyQuestions;
