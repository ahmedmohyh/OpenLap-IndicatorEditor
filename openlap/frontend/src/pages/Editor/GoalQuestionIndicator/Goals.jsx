import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGoals, selectGoal } from "../../../utils/redux/reducers/editor";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { LinearProgressWithLabel } from "./GQIIntro";
import { green } from "@mui/material/colors";
import { goalImages } from "../../../utils/data/images";

const Goals = (props) => {
  const { progress, handleClick, style } = props;
  const dispatch = useDispatch();
  const listOfGoals = useSelector(
    (state) => state.editorReducer.fetchedData.goals
  );
  const selectedGoal = useSelector(
    (state) => state.editorReducer.selectedData.goal
  );
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    if (listOfGoals.length === 0) {
      dispatch(getGoals());
    }
  }, [listOfGoals]);

  return (
    <>
      <Grid container style={{ marginBottom: 8 }}>
        <Grid item xs={12} lg={8}>
          <Grid container alignItems="center">
            <Button onClick={(e) => handleClick(e, -1)}>
              {" "}
              <ArrowBackIosIcon fontSize="small" /> Back{" "}
            </Button>
            <Grid item xs style={{ marginLeft: 32 }}>
              <LinearProgressWithLabel value={progress} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        lg={8}
        style={{
          borderRadius: style.borderRadius,
          padding: style.containerPadding,
          minHeight: style.height,
        }}
      >
        {listOfGoals.length ? (
          <Grid item style={{ marginBottom: 8 }}>
            <Grid container spacing={2} justifyContent="center">
              {listOfGoals.map((goal, index) => {
                let goalImage = goalImages.filter((i) => i.name === goal.name);
                let selected = Boolean(goal.id === selectedGoal.id);
                let unselected = Boolean(
                  Object.keys(selectedGoal).length !== 0
                );
                return (
                  <Grid item key={index}>
                    <Tooltip
                      title={
                        <Typography variant="body2">
                          {" "}
                          {goal.description}{" "}
                        </Typography>
                      }
                      arrow
                    >
                      <Card
                        raised={index === hover || selected}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(-1)}
                        style={{
                          width: 200,
                          borderRadius: style.borderRadius,
                          opacity: unselected && !selected ? 0.35 : "",
                          borderColor: selected ? green[500] : "",
                          borderStyle: selected ? "solid" : "",
                        }}
                      >
                        <CardActionArea
                          onClick={() => dispatch(selectGoal(goal))}
                        >
                          <CardHeader
                            title={
                              <Typography align="center">
                                {goal.name}
                              </Typography>
                            }
                          />
                          <CardMedia
                            style={{ height: 200 }}
                            image={goalImage[0].img}
                          />
                        </CardActionArea>
                      </Card>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{ marginTop: 64 }}
          >
            <CircularProgress />
            <Typography variant="overline">Loading</Typography>
          </Grid>
        )}
        <Grid container justifyContent="center" style={{ marginTop: 16 }}>
          <Box width={style.buttonWidth}>
            <Button
              onClick={(e) => handleClick(e, 1)}
              color="primary"
              variant="contained"
              style={{ borderRadius: style.borderRadius }}
              fullWidth
            >
              <Grid container alignItems="center">
                <Grid item xs>
                  {" "}
                  Next{" "}
                </Grid>
                <ArrowForwardIcon />
              </Grid>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Goals;
