import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { setStepEditor } from "../../../utils/redux/reducers/editor";
import Goals from "./Goals";

const text =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.";

const style = {
  buttonWidth: 300,
  breadCrumb: "h6",
  borderRadius: "12px 4px 12px 4px",
  containerPadding: 16,
  height: "50vh",
};

const GQIIntro = () => {
  const dispatch = useDispatch();
  const activeStep = useSelector((state) => state.editorReducer.common.step);
  const [progress, setProgress] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    handleBreadcrumbs(activeStep);
  }, [activeStep]);

  const handleClick = (event, value) => {
    event.preventDefault();
    dispatch(setStepEditor(value));
    handleBreadcrumbs(value);
  };

  const handleBreadcrumbs = (value) => {
    if (value === 0) {
      setProgress(0);
      setBreadcrumbs([
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, -1)}
        >
          GQI Editor
        </Link>,
        <Typography variant={style.breadCrumb} color="textPrimary">
          {" "}
          Goal{" "}
        </Typography>,
      ]);
    } else if (value === 1) {
      setProgress(33);
      // setIndex(value);
      setBreadcrumbs([
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, -1)}
        >
          GQI Editor
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 0)}
        >
          Goal
        </Link>,
        <Typography variant={style.breadCrumb} color="textPrimary">
          {" "}
          Question{" "}
        </Typography>,
      ]);
    } else if (value === 2) {
      setProgress(67);
      // setIndex(value);
      setBreadcrumbs([
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, -1)}
        >
          GQI Editor
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 0)}
        >
          Goal
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 1)}
        >
          Question
        </Link>,
        <Typography variant={style.breadCrumb} color="textPrimary">
          {" "}
          Indicators{" "}
        </Typography>,
      ]);
    } else if (value === 3) {
      setProgress(99);
      setBreadcrumbs([
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, -1)}
        >
          GQI Editor
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 0)}
        >
          Goal
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 1)}
        >
          Question
        </Link>,
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color="inherit"
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={(e) => handleClick(e, 2)}
        >
          Indicators
        </Link>,
        <Typography variant={style.breadCrumb} color="textPrimary">
          {" "}
          Visualization{" "}
        </Typography>,
      ]);
    } else {
      setBreadcrumbs([
        <Link
          underline="hover"
          variant={style.breadCrumb}
          color={activeStep === -1 ? "textPrimary" : "inherit"}
          href="/Users/shoeb/Desktop/openlap/public"
          onClick={handleClick}
        >
          GQI Editor
        </Link>,
      ]);
    }
  };

  return (
    <Box sx={{ height: "80vh" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon />}
        aria-label="breadcrumb"
        style={{ marginBottom: 16 }}
      >
        {breadcrumbs}
      </Breadcrumbs>

      {/* The GQIIntro GQIIntro page */}
      {activeStep === -1 ? (
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
          <Grid item style={{ marginBottom: 8 }}>
            {/* TODO: Component comes here */}
            <Typography gutterBottom> GQI Editor Carousel - {text} </Typography>
          </Grid>
          <Grid container justifyContent="center">
            <Box width={style.buttonWidth}>
              <Button
                onClick={(e) => handleClick(e, 0)}
                variant="contained"
                color="primary"
                style={{ borderRadius: style.borderRadius }}
                fullWidth
              >
                <Grid container alignItems="center">
                  <Grid item xs>
                    {" "}
                    Start{" "}
                  </Grid>
                  <ArrowForwardIcon />
                </Grid>
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      {/* The Goal page */}
      {activeStep === 0 ? (
        <Goals progress={progress} handleClick={handleClick} style={style} />
      ) : (
        <></>
      )}

      {/* The Question page */}
      {activeStep === 1 ? (
        <>
          {/* TODO: handleClick and progress need to be sent as prop*/}
          <Grid container style={{ marginBottom: 8 }}>
            <Grid item xs={12} lg={8}>
              <Grid container alignItems="center">
                <Button onClick={(e) => handleClick(e, 0)}>
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
            containerxs={12}
            lg={8}
            style={{
              borderRadius: style.borderRadius,
              padding: style.containerPadding,
              minHeight: style.height,
            }}
          >
            <Grid item style={{ marginBottom: 8 }}>
              {/* TODO: Component comes here */}
              <Typography gutterBottom> Question - {text} </Typography>
            </Grid>
            <Grid container justifyContent="center">
              <Box width={style.buttonWidth}>
                <Button
                  onClick={(e) => handleClick(e, 2)}
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
      ) : (
        <></>
      )}

      {/* The Indicator page */}
      {activeStep === 2 ? (
        <>
          <Grid container style={{ marginBottom: 8 }}>
            <Grid item xs={12} lg={8}>
              <Grid container alignItems="center">
                <Button onClick={(e) => handleClick(e, 1)}>
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
            containerxs={12}
            lg={8}
            style={{
              borderRadius: style.borderRadius,
              padding: style.containerPadding,
              minHeight: style.height,
            }}
          >
            <Grid item style={{ marginBottom: 8 }}>
              {/* TODO: Component comes here */}
              <Typography gutterBottom> Indicator - {text} </Typography>
            </Grid>
            <Grid container justifyContent="center">
              <Box width={style.buttonWidth}>
                <Button
                  onClick={(e) => handleClick(e, 3)}
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
      ) : (
        <></>
      )}

      {/* The Indicator page */}
      {activeStep === 3 ? (
        <>
          <Grid container style={{ marginBottom: 8 }}>
            <Grid item xs={12} lg={8}>
              <Grid container alignItems="center">
                <Button onClick={(e) => handleClick(e, 2)}>
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
            <Grid item style={{ marginBottom: 8 }}>
              {/* TODO: Component comes here */}
              <Typography gutterBottom> {text} </Typography>
            </Grid>
            <Grid container justifyContent="center">
              <Box width={style.buttonWidth}>
                <Button
                  onClick={(e) => handleClick(e, 3)}
                  color="primary"
                  variant="contained"
                  style={{ borderRadius: style.borderRadius }}
                  fullWidth
                >
                  Save & Complete
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        {" "}
        <LinearProgress variant="determinate" {...props} />{" "}
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default GQIIntro;
