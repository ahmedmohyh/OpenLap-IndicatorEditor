import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getBasicIndicatorPreviewList,} from "../../../../utils/redux/reducers/compositeEditor";
import {resetIndicatorSession,} from "../../../../utils/redux/reducers/indicatorEditor";
import PageLayout from "../../Common/Layout/PageLayout";
import CloseIcon from '@mui/icons-material/Close';
import ModalMessage from "../../Common/Modal/ModalMessage";
import ComponentStep from "./ComponentStep";
import ComponentPreview from "./ComponentPreview";
import { SnackbarProvider } from "../BasicIndicator/context/SnackbarContext";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function CompositeIndicator() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectIndicators = useSelector((state) => state.compositeEditorReducer.selectedData.indicators);
  const activeStep = useSelector((state) => state.indicatorEditorReducer.common.activeStep);
  const selectedVisualizationMethodsAndTypes = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
  const selectedVisualizationMapping = useSelector(state => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);
  const selectedVisualizationMethod = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethod);
  const completedStep = useSelector((state) => state.indicatorEditorReducer.common.completedStep);

  const [feedback, setFeedback] = useState({
    openDiscardProgressModal: false,
    openFeedbackSaveModal: false,
  });

  const handleFeedback = (name, value) => {
    setFeedback(() => ({
      ...feedback,
      [name]: !value,
    }));
  };

  const handleDiscardProgress = () => {
    handleFeedback("openDiscardProgressModal", feedback.openDiscardProgressModal);
  };

  const handleFeedbackSave = () => {
    handleFeedback("openFeedbackSaveModal", feedback.openFeedbackSaveModal);
  };

  const handleBackToEditor = () => {
    navigate('/editor');
  };

  const closeActionObject = {
    icon: <CloseIcon />,
    onClick: () => handleDiscardProgress(),
  };

  const SELECTIONS = {
    selectedIndicators: {
      key: 'selectedIndicators',  
      selection: selectIndicators,
      color: '#9c27b0',
      step: 'Select Indicators',
      stepIndex: 0,
      completed: completedStep[0] ?? false,
      tooltip: "Selection made in Select Indicators."
    },
    selectedVisualizationMethod: {
      key: 'selectedVisualizationMethod',  
      selection: Object.keys(selectedVisualizationMethod).length === 0 ? [] : [selectedVisualizationMethod],
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[1] ?? false,
      tooltip: "Visualization Library"
    },
    selectedVisualizationMethodsAndTypes: {
      key: 'selectedVisualizationMethodsAndTypes',  
      selection: selectedVisualizationMethodsAndTypes,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[1] ?? false,
      tooltip: "Visualization Type"
    },
    selectedVisualizationMapping: {
      key: 'selectedVisualizationMapping',  
      selection: selectedVisualizationMapping,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[1] ?? false,
      tooltip: "Visualization Input"
    },
  };

  const _breadcrumbs = [
    {
      title: 'Indicator Editor',
      isLast: false,
      href: '/indicator',
      onClick: () => handleDiscardProgress()
    },
    {
      title: 'Create: Composite Indicator',
      isLast: true,
      href: null,
      onClick: null
    }
  ];

  useEffect(() => {
    dispatch(resetIndicatorSession());
    dispatch(getBasicIndicatorPreviewList());
  }, []);

  return (
    <>
      <SnackbarProvider>
        <div>
          <PageLayout
            breadcrumbs={_breadcrumbs}
            actions={[closeActionObject]}
            children={
              [
                <ComponentStep key={'Composite_Component_Step'} />,
                <ComponentPreview key={'Composite_Component_Preview'} selections={SELECTIONS} activeStep={activeStep} handleFeedbackSave={handleFeedbackSave} />
              ]
            }
          />
          {/**@author Louis Born <louis.born@stud.uni-due.de> */}
          <ModalMessage
            dialogTitle={"Success"}
            dialogPrimaryContext={`New indicator saved to the dashboard.`}
            openDialog={feedback.openFeedbackSaveModal}
            setOpenDialog={() => handleFeedback("openFeedbackSaveModal", feedback.openFeedbackSaveModal)}
            primaryAction={() => navigate("/dashboard")}
            primaryButton={"View Dashboard"}
          />
          {/**@author Louis Born <louis.born@stud.uni-due.de> */}
          <ModalMessage
            dialogTitle={"Quit Indicator Editor"}
            dialogPrimaryContext={`Are you sure you want to quit the indicator editor? All progress will be lost.`}
            openDialog={feedback.openDiscardProgressModal}
            setOpenDialog={() => handleFeedback("openDiscardProgressModal", feedback.openDiscardProgressModal)}
            primaryAction={() => handleFeedback("openDiscardProgressModal", feedback.openDiscardProgressModal)}
            primaryButton={"Proceed with indicator"}
            tertiaryAction={handleBackToEditor}
            tertiaryButton={"Exit without saving"}
          />
        </div>
      </SnackbarProvider>
    </>
  );
};