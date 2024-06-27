import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Grid, TextField, styled } from "@mui/material";
import {
  indicatorSaved,
  resetIndicatorSession,
} from "../../../../utils/redux/reducers/indicatorEditor";
import {
  discardNewIndicatorRequest,
  getUserQuestionsAndIndicators,
} from "../../../../utils/redux/reducers/gqiEditor";
import { saveIndicator } from "../../../../utils/redux/reducers/compositeEditor";
import ResponsiveComponent from "../../Common/Layout/PageComponent";
import Tag from "../../Common/Tag/Tag";
import Preview from "./Preview/Preview";
import { useSnackbar } from "./context/SnackbarContext";
import SnackbarType from "./enum/SnackbarType";
import nameValidator from "../../Helper/nameValidator";
import imgNoPreview from "../../../../assets/img/vis-empty-state/no-indicator-preview.svg";
import ConditionalSelectionRender from "../../Common/ConditionalSelectionRender/ConditionalSelectionRender";

const Section = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  borderTop: "1px solid #C9C9C9",
  marginLeft: "-16px",
  marginRight: "-16px",
  padding: "10px 16px 10px 16px",
  "&.first": {
    padding: "0 16px 10px 16px",
    borderTop: "none",
  },
}));

const ScrollableContainer = styled("div")(() => ({
  overflowY: "auto",
  overflowX: "hidden", // Changed from "hidden" to "auto"
  maxHeight: "238px",
}));

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function ComponentPreview({
  classes,
  selections,
  activeStep,
  handleFeedbackSave,
}) {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const completePreviewStep = useSelector(
    (state) => state.indicatorEditorReducer.common.completePreviewStep
  );

  const displayCodeData = useSelector(
    (state) =>
      state.indicatorEditorReducer.fetchedData.visualizationCode?.displayCode
  );
  const indicatorName = useSelector(
    (state) => state.indicatorEditorReducer.selectedData.indicatorName?.name
  );
  const indicatorType = useSelector(
    (state) => state.gqiEditorReducer.common?.indicatorType
  );
  const indicatorNameAvailable = useSelector(
    (state) =>
      state.indicatorEditorReducer.selectedData.indicatorName?.available
  );
  const scriptCodeData = useSelector(
    (state) =>
      state.indicatorEditorReducer.fetchedData.visualizationCode?.scriptCode
  );
  const indicatorPreviewData = useSelector(
    (state) => state.indicatorEditorReducer.selectedData?.indicatorPreview
  );
  const errorMessage = useSelector(
    (state) =>
      state.indicatorEditorReducer.fetchedData.visualizationCode?.errorMessage
  );

  const [errorInput, setErrorInput] = useState(false);
  const [selection, setSelection] = useState({
    indicatorName: indicatorName ? indicatorName : "",
    errorMessage: "",
  });

  const handleSaveVisualization = () => {
    if (!nameValidator(selection.indicatorName)) {
      showSnackbar(
        "Error: Indicator name can not be empty.",
        SnackbarType.error
      );
      setSelection({
        ...selection,
        errorMessage: "Indicator name can not be empty.",
      });
      setErrorInput(!errorInput);
      return;
    }

    let _indicatorPreviewData = indicatorPreviewData;
    const parsedUser = JSON.parse(localStorage.getItem("openlapUser"));
    const createdBy = parsedUser.email;
    _indicatorPreviewData["name"] = selection.indicatorName;
    _indicatorPreviewData["createdBy"] = createdBy;
    _indicatorPreviewData["indicatorType"] = "Basic Indicator";

    dispatch(indicatorSaved());
    dispatch(saveIndicator(_indicatorPreviewData));
    dispatch(getUserQuestionsAndIndicators());
    dispatch(discardNewIndicatorRequest());
    dispatch(resetIndicatorSession());
    handleFeedbackSave();
  };

  const handleSetIndicatorName = (e) => {
    const { name, value } = e.target;
    setSelection({
      ...selection,
      [name]: value,
    });
    if (errorInput) {
      setErrorInput(false);
    }
  };

  console.log("The user selections are", selections);

  const containerStyle = {
    position: "relative", // Needed for absolute positioning of children
    padding: "20px", // Adjust as needed, provides space inside the border
    border: "1px solid #C9C9C9", // Creates the border around the container
    marginTop: "20px",
    borderRadius: "6px", // Optional: adds rounded corners
  };

  const keyContainerStyle = {
    position: "absolute", // Position relative to its nearest positioned ancestor (containerStyle with position: 'relative')
    top: "-10px", // Halfway outside the container; adjust as needed
    left: "50%", // Center horizontally
    transform: "translateX(-50%)", // Adjust for exact centering
    backgroundColor: "white", // Match the background of your page or container
    padding: "0 10px", // Adjust as needed
  };

  const tagContainerStyle = {
    display: "flex",
    overflowX: "scroll", // Enable horizontal scrolling
    whiteSpace: "nowrap", // Prevent tags from wrapping to the next line
    // Set a max-width or width as per your design requirements, for example:
    maxWidth: "700px", // Adjust this value based on your layout needs
  };

  const groupSelectionsByKey = (selections) => {
    const groupedSelections = {};

    Object.entries(selections).forEach(([key, value]) => {
      if (!groupedSelections[key]) {
        groupedSelections[key] = {
          color: value.color,
          step: value.step,
          stepIndex: value.stepIndex,
          completed: value.completed,
          tooltip: value.tooltip,
          items: [],
        };
      }

      value.selection.forEach((e) => {
        groupedSelections[key].items.push(e);
      });
    });

    return groupedSelections;
  };

  const groupedSelections = groupSelectionsByKey(selections);

  const _selections = ({ selections }) => {
    const noSelectionMade = Object.values(selections).every(
      ({ selection }) => !selection || selection.length === 0
    );

    return (
      <Section sx={{ flex: 2 }}>
        <span
          style={{ fontSize: "14px", color: "#5F6368", marginBottom: "16px" }}
        >
          Selections
        </span>
        {noSelectionMade ? (
          <div
            style={{
              minHeight: "96px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#5F6368",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            If you make selections in the following steps, your choices will be
            displayed here for review.
          </div>
        ) : (
          <ScrollableContainer>
            <ul style={{ padding: 0, margin: 0 }}>
              {Object.entries(groupedSelections).map(
                ([key, group]) =>
                  group.items.length > 0 && ( // Check if the items array is not empty
                    <li key={key} style={{ marginBottom: "20px" }}>
                      <div style={containerStyle}>
                        <span style={keyContainerStyle}>{group.tooltip}</span>
                        <div style={tagContainerStyle}>
                          {group.items.map((e, index) => {
                            if (
                              e.hasOwnProperty("value") &&
                              e.value === e.defaultValue
                            ) {
                              return null;
                            } else {
                              return (
                                <Tag
                                  key={`${key}-${index}`}
                                  color={group.color}
                                  step={group.stepIndex}
                                  label={
                                    e.outputPort
                                      ? e.outputPort.name || e.outputPort.title
                                      : e.vName
                                      ? e.vName
                                      : e.value || e.name
                                      ? e.value || e.name
                                      : "null"
                                  }
                                  completed={
                                    group.completed &&
                                    group.stepIndex !== activeStep
                                  }
                                  tooltip={
                                    e.inputPort
                                      ? e.inputPort.name || e.inputPort.title
                                      : group.tooltip
                                  }
                                />
                              );
                            }
                          })}
                        </div>
                      </div>
                    </li>
                  )
              )}
            </ul>
          </ScrollableContainer>
        )}
      </Section>
    );
  };

  const _preview = () => {
    return (
      <Section sx={{ flex: 4 }}>
        <span
          style={{ fontSize: "14px", color: "#5F6368", marginBottom: "16px" }}
        >
          Preview
        </span>
        <Grid container direction="column">
          {displayCodeData ? (
            <Grid item>
              <Preview
                indicatorType={indicatorType}
                indicatorName={indicatorName}
                indicatorNameAvailable={indicatorNameAvailable}
                displayCodeData={displayCodeData}
                scriptCodeData={scriptCodeData}
                indicatorPreviewData={indicatorPreviewData}
                classes={classes}
              />
            </Grid>
          ) : errorMessage ? (
            <Alert severity="error">
              Error: Unable to generate visualization preview due to an error.
            </Alert>
          ) : (
            <>
              {!displayCodeData && !completePreviewStep ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#5F6368",
                    fontSize: "14px",
                    minHeight: "156px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "16px",
                      color: "#5F6368",
                      fontSize: "14px",
                      minHeight: "156px",
                    }}
                  >
                    <img width="96px" height="96px" src={imgNoPreview} />
                    Preview is available only when all steps are completed.
                  </div>
                </div>
              ) : (
                <ConditionalSelectionRender
                  isRendered={true}
                  isLoading={!displayCodeData && completePreviewStep}
                  hasError={errorMessage}
                  handleRefresh={() => {}}
                ></ConditionalSelectionRender>
              )}
            </>
          )}
        </Grid>
      </Section>
    );
  };

  const _buttonSave = {
    variant: "contained",
    label: "Save",
    onClick: handleSaveVisualization,
    disabled: !displayCodeData,
    hidden: !displayCodeData,
  };

  return (
    <ResponsiveComponent
      gridSpace={6}
      title={"Preview"}
      buttons={[_buttonSave]}
    >
      <div
        key={"Basic_Responsive_Component_Preview_Child"}
        style={{ display: "flex", flexDirection: "column", maxHeight: "700px" }}
      >
        <Section className="first" sx={{ flex: 1 }}>
          <span
            style={{ fontSize: "14px", color: "#5F6368", marginBottom: "16px" }}
          >
            Name:
          </span>
          <TextField
            id="indicatorName"
            name="indicatorName"
            variant="filled"
            required
            margin="dense"
            value={selection.indicatorName}
            onChange={(e) => handleSetIndicatorName(e)}
            placeholder="Unnamed Indicator"
            fullWidth
            error={errorInput}
            helperText={errorInput ? selection.errorMessage : ""}
            sx={{ marginTop: "-8px" }}
          />
        </Section>
        <_selections selections={selections} />
        <_preview />
      </div>
    </ResponsiveComponent>
  );
}
