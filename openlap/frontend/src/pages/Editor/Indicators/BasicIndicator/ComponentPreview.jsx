import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, styled } from "@mui/material";
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
import { useSnackbar } from "./context/SnackbarContext";
import SnackbarType from "./enum/SnackbarType";
import nameValidator from "../../Helper/nameValidator";
import imgNoPreview from "../../../../assets/img/vis-empty-state/no-indicator-preview.svg";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// DAG class definition
class DAG {
  constructor() {
    this.nodes = new Map();
  }

  addNode(node) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, []);
    }
  }

  addEdge(fromNode, toNode) {
    if (!this.nodes.has(fromNode) || !this.nodes.has(toNode)) {
      throw new Error("Both nodes need to be in the graph");
    }
    this.nodes.get(fromNode).push(toNode);
  }

  printGraph() {
    for (let [key, value] of this.nodes) {
      console.log(`${key} -> ${value.join(", ")}`);
    }
  }

  canDeleteNode(node) {
    // Check if the node has any children
    return this.nodes.has(node) && this.nodes.get(node).length === 0;
  }

}

function buildDAGFromSelections(selections) {
  const dag = new DAG();

  const rootKey = "selectedPlatform";
  const rootSelection = selections[rootKey].selection;

  if (rootSelection && rootSelection.length > 0) {
    const rootName = rootSelection[0].name;
    dag.addNode(rootName);

    // Function to add dependencies
    function addDependencies(parentNode, selectionKey) {
      const selection = selections[selectionKey];
      if (selection && selection.selection && selection.selection.length > 0) {
        const nodeNames = selection.selection.map((item) => item.name);

        nodeNames.forEach((nodeName) => {
          dag.addNode(nodeName);
          dag.addEdge(parentNode, nodeName);

          if (selectionKey === "selectedActivityTypes") {
            addDependencies(nodeName, "selectedActionOnActivities");
          }
          if (selectionKey === "selectedAnalysisMethod") {
            addDependencies(nodeName, "selectedMappingAnalysisInputAttributesData");
          }
          if (selectionKey === "selectedVisualizationMethod") {
            addDependencies(nodeName, "selectedVisualizationMethodsAndTypes");
            addDependencies(nodeName, "selectedVisualizationMapping");
          }
        });
      }
    }

    // Adding root-level dependencies
    addDependencies(rootName, "selectedActivityTypes");
    addDependencies(rootName, "selectedTimeDuration");
    addDependencies(rootName, "selectedUsers");
    addDependencies(rootName, "selectedAnalysisMethod");
    addDependencies(rootName, "selectedVisualizationMethod");
  }

  return dag;
}


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
  maxHeight: "100%",
}));

export default function ComponentPreview({
  classes,
  selections,
  activeStep,
  handleFeedbackSave,
}) {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const displayCodeData = useSelector(
    (state) =>
      state.indicatorEditorReducer.fetchedData.visualizationCode?.displayCode
  );
  const indicatorName = useSelector(
    (state) => state.indicatorEditorReducer.selectedData.indicatorName?.name
  );
  const indicatorPreviewData = useSelector(
    (state) => state.indicatorEditorReducer.selectedData?.indicatorPreview
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
    console.log("The indicator preview data is", _indicatorPreviewData);
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

  const containerStyle = {
    position: "relative",
    padding: "20px",
    border: "1px solid #C9C9C9",
    marginTop: "20px",
    borderRadius: "6px",
  };

  const keyContainerStyle = {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "0 10px",
  };

  const tagContainerStyle = {
    display: "flex",
    overflowX: "scroll",
    whiteSpace: "nowrap",
    maxWidth: "700px",
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

  const handleDelete = (nodeName) => {

    console.log("the node to be deleted is", nodeName);

    const dag = buildDAGFromSelections(selections);
  
    if (dag.canDeleteNode(nodeName)) {
      // Perform deletion logic here (not implemented in this example)
      showSnackbar(
        `Element "${nodeName}" has been deleted.`,
        SnackbarType.success
      );
      // Example of state update or dispatch action:
      // dispatch(deleteNodeAction(nodeName));
    } else {
      showSnackbar(
        `Error: Element "${nodeName}" is dependent on another node and cannot be deleted.`,
        SnackbarType.error
      );
    }
  };
  

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
                  group.items.length > 0 && (
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
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Tag
                                    key={`${key}-${index}`}
                                    color={group.color}
                                    step={group.stepIndex}
                                    label={
                                      e.outputPort
                                        ? e.outputPort.name ||
                                          e.outputPort.title
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
                                    onDelete={() => handleDelete(e.name)}
                                  />
                                {/*   <IconButton
                                    size="small"
                                    onClick={() => handleDelete(e.name)}
                                  >
                                    <DeleteIcon />
                                  </IconButton> */}
                                </div>
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

  const _buttonSave = {
    variant: "contained",
    label: "Save",
    onClick: handleSaveVisualization,
    disabled: !displayCodeData,
    hidden: !displayCodeData,
  };

  useEffect(() => {
    if (selections) {
      const dag = buildDAGFromSelections(selections);
      dag.printGraph();
    }
  }, [selections]);

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
      </div>
    </ResponsiveComponent>
  );
}
