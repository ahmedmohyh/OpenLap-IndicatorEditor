import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ModalMessage from "../../Common/Modal/ModalMessage";
import PageLayout from '../../Common/Layout/PageLayout';
import CloseIcon from '@mui/icons-material/Close';
import ComponentStep from './ComponentStep';
import ComponentPreview from './ComponentPreview';
import { SnackbarProvider } from './context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function BasicIndicator(props) {
  const { classes } = props;
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    openSaveProgressErrorSnackbar: false,
    openFeedbackSaveModal: false,
  });

  const activeStep = useSelector((state) => state.indicatorEditorReducer.common.activeStep);
  const completedStep = useSelector((state) => state.indicatorEditorReducer.common.completedStep);
  const selectedAnalysisMethod = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethod);
  const selectedVisualizationMethodsAndTypes = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
  const selectedVisualizationMapping = useSelector(state => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);
  const selectedPlatform = useSelector(state => state.indicatorEditorReducer.selectedData.platforms);
  const selectedActivityName = useSelector(state => state.indicatorEditorReducer.selectedData.activityName);
  const selectedActivityTypes = useSelector(state => state.indicatorEditorReducer.selectedData.activityTypes);
  const selectedActionOnActivities = useSelector(state => state.indicatorEditorReducer.selectedData.actionOnActivities);
  const selectedMappingAnalysisInputAttributesData = useSelector(state => state.indicatorEditorReducer.selectedData.mappingAnalysisInputAttributesData);
  const selectedAnalyticsMethodParams = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethodParams);
  const selectedVisualizationMethod = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethod);
  const selectedTimeDuration = useSelector(state => state.indicatorEditorReducer.selectedData.timeDuration);
  const selectedUsers = useSelector(state => state.indicatorEditorReducer.selectedData.filterUsers);

  const SELECTIONS = {
    selectedPlatform: {
      key: 'selectedPlatform',
      selection: selectedPlatform,
      color: '#9c27b0',
      step: 'Dataset',
      stepIndex: 0,
      completed: completedStep[0] ?? false,
      tooltip: "Dataset"
    },
    selectedActivityTypes: {
      key: 'selectedActivityTypes',
      selection: selectedActivityTypes,
      color: '#9c27b0',
      step: 'Dataset',
      stepIndex: 0,
      completed: completedStep[0] ?? false,
      tooltip: "Activity type"
    },
    selectedActionOnActivities: {
      key: 'selectedActionOnActivities',  
      selection: selectedActionOnActivities,
      color: '#9c27b0',
      step: 'Dataset',
      stepIndex: 0,
      completed: completedStep[0] ?? false,
      tooltip: "Action"
    },
    selectedActivityName: {
      key: 'selectedActivityName',  
      selection: selectedActivityName,
      color: '#03a9f4',
      step: 'Filter',
      stepIndex: 1,
      completed: completedStep[1] ?? false,
      tooltip: "Activities"
    },
    selectedTimeDuration: {
        key: 'selectedTimeDuration',  
        selection: selectedTimeDuration.startDate === '' ? [] : [{name: `${new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(selectedTimeDuration.startDate)} - ${new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(selectedTimeDuration.endDate)}`}],
        color: '#03a9f4',
        step: 'Filter',
        stepIndex: 1,
        completed: completedStep[1] ?? false,
        tooltip: "Time Start/End Date"
    },
    selectedUsers: {
        key: 'selectedUsers', 
        selection: selectedUsers,
        color: '#03a9f4',
        step: 'Filter',
        stepIndex: 1,
        completed: completedStep[1] ?? false,
        tooltip: "Users"
      },
    selectedAnalysisMethod: {
      key: 'selectedAnalysisMethod', 
      selection: selectedAnalysisMethod,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Analysis Method"
    },
    selectedMappingAnalysisInputAttributesData: {
      key: 'selectedMappingAnalysisInputAttributesData', 
      selection: selectedMappingAnalysisInputAttributesData,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Analysis Method"
    },
    selectedAnalyticsMethodParams: {
      key: 'selectedAnalyticsMethodParams', 
      selection: selectedAnalyticsMethodParams,
      color: '#8bc34a',
      step: 'Analysis',
      stepIndex: 2,
      completed: completedStep[2] ?? false,
      tooltip: "Analysis Method"
    },
    selectedVisualizationMethod: {
      key: 'selectedVisualizationMethod',   
      selection: Object.keys(selectedVisualizationMethod).length === 0 ? [] : [selectedVisualizationMethod],
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[3] ?? false,
      tooltip: "Visualization Library"
    },
    selectedVisualizationMethodsAndTypes: {
      key: 'selectedVisualizationMethodsAndTypes',   
      selection: selectedVisualizationMethodsAndTypes,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[3] ?? false,
      tooltip: "Visualization Type"
    },
    selectedVisualizationMapping: {
      key: 'selectedVisualizationMapping',   
      selection: selectedVisualizationMapping,
      color: '#ff9800',
      step: 'Visualization',
      stepIndex: 3,
      completed: completedStep[3] ?? false,
      tooltip: "Visualization Input"
    },
  };

  const handleFeedback = (name, value) => {
    setFeedback(() => ({
      ...feedback,
      [name]: !value,
    }))
  }

  const handleFeedbackSave = () => {
    handleFeedback("openFeedbackSaveModal", feedback.openFeedbackSaveModal);
  }

  const handleDiscardProgress = () => {
    handleFeedback("openDiscardProgressModal", feedback.openDiscardProgressModal);
  }

  const handleBackToEditor = () => {
    navigate('/indicator');
  }

  const closeActionObject = {
    icon: <CloseIcon />,
    onClick: () => handleDiscardProgress(),
  };

  const _breadcrumbs = [
    {
      title: 'Indicator Editor',
      isLast: false,
      href: '/indicator',
      onClick: () => handleDiscardProgress()
    },
    {
      title: 'Create: Basic Indicator',
      isLast: true,
      href: null,
      onClick: null
    }
  ];

  return (
    <>
      <SnackbarProvider>
        <div>
          <PageLayout
            breadcrumbs={_breadcrumbs}
            actions={[closeActionObject]}
            children={
              [
                <ComponentStep key={'Basic_Component_Step'} />,
                <ComponentPreview
                  key={'Basic_Component_Preview'}
                  classes={classes}
                  selections={SELECTIONS}
                  activeStep={activeStep}
                  handleFeedbackSave={handleFeedbackSave}
                />
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
  )
}
