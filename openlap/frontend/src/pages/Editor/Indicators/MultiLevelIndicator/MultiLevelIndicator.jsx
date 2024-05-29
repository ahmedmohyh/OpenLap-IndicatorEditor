import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBasicIndicatorPreviewListML } from '../../../../utils/redux/reducers/multiLevelEditor';
import {resetIndicatorSession} from '../../../../utils/redux/reducers/indicatorEditor';
import { SnackbarProvider } from '../BasicIndicator/context/SnackbarContext';
import PageLayout from '../../Common/Layout/PageLayout';
import ComponentStep from './ComponentStep';
import ComponentPreview from './ComponentPreview';
import CloseIcon from '@mui/icons-material/Close';
import ModalMessage from "../../Common/Modal/ModalMessage";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function MultiLevelIndicator() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectionIndicators = useSelector((state) => state.multiLevelEditorReducer.selectedData.indicators);
  const activeStep = useSelector((state) => state.indicatorEditorReducer.common.activeStep);
  const completedStep = useSelector((state) => state.indicatorEditorReducer.common.completedStep);
  const selectedAnalysisMethod = useSelector((state) => state.multiLevelEditorReducer.selectedData.analysisMethod);
  const selectedVisualizationMethodsAndTypes = useSelector((state) => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
  const selectedVisualizationMapping = useSelector((state) => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);
  const selectedMappingAnalysisInputAttributesData = useSelector((state) => state.multiLevelEditorReducer.selectedData.mappingAnalysisInputAttributesData);
  const selectedAnalyticsMethodParams = useSelector((state) => state.multiLevelEditorReducer.selectedData.analysisMethodParams);
  const selectedVisualizationMethod = useSelector((state) => state.indicatorEditorReducer.selectedData.visualizationMethod);

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

  const SELECTIONS = {
    selectedIndicators: {
      key: 'selectedIndicators',
      selection: selectionIndicators,
      color: '#9c27b0',
      step: 'Select Indicators',
      stepIndex: 0,
      completed: completedStep[0] ?? false,
      tooltip: "Selection made in Select Indicators."
    },
    selectedAnalysisMethod: {
      key: 'selectedAnalysisMethod',
      selection: selectedAnalysisMethod,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 1,
      completed: completedStep[1] ?? false,
      tooltip: "Analysis Method"
    },
    selectedMappingAnalysisInputAttributesData: {
      key: 'selectedMappingAnalysisInputAttributesData',
      selection: selectedMappingAnalysisInputAttributesData,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 1,
      completed: completedStep[1] ?? false,
      tooltip: "Analysis Method"
    },
    selectedAnalyticsMethodParams: {
      key: 'selectedAnalyticsMethodParams',
      selection: selectedAnalyticsMethodParams,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 1,
      completed: completedStep[1] ?? false,
      tooltip: "Analysis Method"
    },
    selectedVisualizationMethod: {
      key: 'selectedVisualizationMethod',
      selection: Object.keys(selectedVisualizationMethod).length === 0 ? [] : [selectedVisualizationMethod],
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Visualization Library"
    },
    selectedVisualizationMethodsAndTypes: {
      key: 'selectedVisualizationMethodsAndTypes',
      selection: selectedVisualizationMethodsAndTypes,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Visualization Type"
    },
    selectedVisualizationMapping: {
      key: 'selectedVisualizationMapping',
      selection: selectedVisualizationMapping,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Visualization Input" // Tooltip is used as fallback if no valuable text information from selection obj is available.
    }
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

  const _breadcrumbs = [
    {
      title: 'Indicator Editor',
      isLast: false,
      href: '/indicator',
      onClick: () => handleDiscardProgress()
    },
    {
      title: 'Create: Multi-Level Indicator',
      isLast: true,
      href: null,
      onClick: null
    }
  ];

  const closeActionObject = {
    icon: <CloseIcon />,
    onClick: () => handleDiscardProgress(),
  };

  useEffect(() => {
    dispatch(getBasicIndicatorPreviewListML());
    dispatch(resetIndicatorSession())
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
                <ComponentStep key={'Multi_Component_Step'}/>,
                <ComponentPreview key={'Multi_Component_Preview'} selections={SELECTIONS} activeStep={activeStep} handleFeedbackSave={handleFeedbackSave} />
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
}