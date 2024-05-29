import React from "react";
import {styled} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector from "@mui/material/StepConnector";
import Box from "@mui/material/Box";
import {StepButton} from "@mui/material";
import ColourStepIcon from "./ColourStepIcon";
import {useSelector} from "react-redux";

const useStyles = styled((theme) => ({
  root: {
    width: "100%",
  },
  alternativeLabel: {
    top: 25
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg, rgb(9, 123, 237) 0%, rgb(15, 105, 219) 50%, rgb(15, 105, 219) 100%)"
    }
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg, rgb(9, 123, 237) 0%, rgb(15, 105, 219) 50%, rgb(15, 105, 219) 100%)"
    }
  },
  line: {
    height: 2,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1
  }
}));

export default function Steppers(props) {
  // Props
  const {steps: {icons, names}, activeStep, completedStep, handleStep} = props;
  // Local constant
  const classes = useStyles();
  const darkMode = useSelector((state) => state.commonSettings.darkMode);

  return (
    <Box className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<StepConnector classes={classes}/>}
        style={{backgroundColor: !darkMode ? "#FFFFFF" : "#212121"}}
      >
        {names.map((label, index) => (
          <Step key={label}>
            <StepButton
              disabled={(!completedStep[index])} onClick={handleStep(index)} completed={completedStep[index]}
              icon={
                <ColourStepIcon
                  active={activeStep}
                  completed={completedStep[index]}
                  index={index}
                  icon={icons[index]}
                />}
            >
              <StepLabel>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
