import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { styled } from '@mui/material';
import {
    Box,
    Step,
    StepLabel, Stepper,
    StepButton,
    Tooltip,
} from "@mui/material";
import {
    generateIndicatorPreview,
    saveIndicatorPreview,
    setActiveIndicatorStep,
    setCompletedIndicatorStep,
    setGeneratedVisualizationCode
} from "../../../../utils/redux/reducers/indicatorEditor";
import StepDataset from "./StepDataset/StepDataset";
import StepFilter from "./StepFilter/StepFilter";
import StepAnalysis from "./StepAnalysis/StepAnalysis";
import StepVisualization from "./StepVisualization/StepVisualization";
import { queryGeneratorWrapper, statementDurationWrapper } from "../../../../utils/ruleEngine/ruleGenerator";
import ResponsiveComponent from '../../Common/Layout/PageComponent';
import CheckIcon from '@mui/icons-material/Check';

/**
 * @todo Extract this component into a separate file for better organization.
 * @author Louis Born <louis.born@stud.uni-due.de> 
 */
export default function ComponentStep(props) {
    const dispatch = useDispatch();
    const [completed, setCompleted] = useState([]);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const activeStep = useSelector((state) => state.indicatorEditorReducer.common.activeStep);
    const completedStep = useSelector((state) => state.indicatorEditorReducer.common.completedStep);
    const selectedAnalysisMethod = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethod);
    const selectedVisualizationMethodsAndTypes = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
    const selectedVisualizationMapping = useSelector(state => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);
    const selectedPlatform = useSelector(state => state.indicatorEditorReducer.selectedData.platforms);
    const selectedActivityName = useSelector(state => state.indicatorEditorReducer.selectedData.activityName);
    const selectedActivityTypes = useSelector(state => state.indicatorEditorReducer.selectedData.activityTypes);
    const selectedActionOnActivities = useSelector(state => state.indicatorEditorReducer.selectedData.actionOnActivities);
    const selectedActivityExtensionData = useSelector(state => state.indicatorEditorReducer.selectedData.activityExtensionId);
    const selectedContextActivities = useSelector(state => state.indicatorEditorReducer.selectedData.contextActivities);
    const selectedResult = useSelector(state => state.indicatorEditorReducer.selectedData.result);
    const timeDurationData = useSelector(state => state.indicatorEditorReducer.selectedData.timeDuration);
    const selectedMappingAnalysisInputAttributesData = useSelector(state => state.indicatorEditorReducer.selectedData.mappingAnalysisInputAttributesData);
    const selectedAnalyticsMethodParams = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethodParams);

    // Method to generate indicator preview -> differs for each indicator type (basic, composite and multi-level)
    const handleOpenVisualization = () => {
        handleStepForward();
        dispatch(setGeneratedVisualizationCode("", ""))

        let queryBuilder = {
            platform: selectedPlatform,
            activityTypes: selectedActivityTypes,
            actionOnActivities: selectedActionOnActivities,
            activityName: selectedActivityName,
            result: selectedResult,
            contextActivities: selectedContextActivities,
            activityExtensionId: selectedActivityExtensionData
        };
        let parametersToBeReturnedInResult = {}
        selectedMappingAnalysisInputAttributesData.forEach(data => {
            parametersToBeReturnedInResult[data.outputPort.id] = 1
        })
        let methodInputParams = JSON.stringify(selectedAnalyticsMethodParams.reduce((obj, item) => {
            obj[item.id] = item.value.toString()
            return obj
        }, {}))
        let getIndicatorPreviewCode = {
            queries: {
                "0": {
                    parametersToBeReturnedInResult: parametersToBeReturnedInResult,
                    query: queryGeneratorWrapper(queryBuilder),
                    statementDuration: statementDurationWrapper(timeDurationData)
                }
            },
            analyticsMethodId: { "0": selectedAnalysisMethod[0].id },
            queryToMethodConfig: { "0": { mapping: selectedMappingAnalysisInputAttributesData } },
            methodInputParams: { "0": methodInputParams },
            visualizationInputParams: { "0": "" },
            additionalParams: { width: 400, height: 200 },
            visualizationLibraryId: selectedVisualizationMethodsAndTypes[0].id,
            visualizationTypeId: selectedVisualizationMethodsAndTypes[0].vId,
            methodToVisualizationConfig: { mapping: selectedVisualizationMapping },
        }
        dispatch(generateIndicatorPreview(getIndicatorPreviewCode));
        dispatch(saveIndicatorPreview(getIndicatorPreviewCode));
    }

    // Methods to handle general step component functionality
    const handleStepForward = () => {
        const newCompleted = completedStep;
        newCompleted[activeStep] = true;
        dispatch(setCompletedIndicatorStep(newCompleted));
        dispatch(setActiveIndicatorStep(activeStep + 1));
    }

    const handleStepBackward = () => {
        const remainingCompleted = completedStep;
        delete remainingCompleted[activeStep - 1];
        dispatch(setCompletedIndicatorStep(remainingCompleted));
        dispatch(setActiveIndicatorStep(activeStep - 1));
    }

    const handleStepComplete = (name) => {
        setCompleted((prev) => [...prev, name]);
    };

    const handleStepIncomplete = (name) => {
        setCompleted((prev) => prev.filter(e => e !== name));
    }

    const handleStep = (step) => () => {
        dispatch(setActiveIndicatorStep(step));
    }

    useEffect(() => {
        (!completed.includes(STEPS[activeStep]?.name)) ? setNextBtnDisabled(true) : setNextBtnDisabled(false);
    }, [completed]);

    const STEPS = [
        {
            name: "Dataset",
            component: <StepDataset onStepComplete={handleStepComplete} onStepIncomplete={handleStepIncomplete} />,
            color: '#9c27b0'
        },
        {
            name: "Filter",
            component: <StepFilter onStepComplete={handleStepComplete} onStepIncomplete={handleStepIncomplete} />,
            color: '#03a9f4'
        },
        {
            name: "Analysis",
            component: <StepAnalysis onStepComplete={handleStepComplete} onStepIncomplete={handleStepIncomplete} />,
            color: '#8bc34a'
        },
        {
            name: "Visualization",
            component: <StepVisualization onStepComplete={handleStepComplete} onStepIncomplete={handleStepIncomplete} />,
            color: '#ff9800'
        }
    ];

    const _customStepLast = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 56px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>Name your indicator.</p>
                <span style={{ fontSize: '16px' }}>
                    All steps are completed. Please name your indicator and save it on the bottom to your workspace.
                </span>
            </div>
        </div>
    );

    /**
     * Custom Step Icon component for use in the Stepper component.
     *
     * @param {Object} props - The properties for the CustomStepIcon component.
     * @param {boolean} props.completed - Indicates whether the step is completed.
     * @param {number} props.icon - The step number.
     * @returns {JSX.Element} - CustomStepIcon component.
     */
    const _customStepIcon = (props) => {
        const { completed, icon } = props;

        const ColoredStepIcon = styled('div')(({ theme, active, completed, error, color }) => ({
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: error ? theme.palette.error.main : completed ? color : active ? color : '#eeeeee',
            color: error || completed || active ? '#fff' : '#9e9e9e',
            '& .CustomStepIcon-completedIcon': {
                color: '#ffffff',
                zIndex: 1,
                fontSize: 18,
            },
        }));

        return (
            <ColoredStepIcon {...props} color={STEPS[(icon - 1)].color}>
                {completed ? (<CheckIcon className='CustomStepIcon-completedIcon' />) : (<div>{icon}</div>)}
            </ColoredStepIcon>
        );
    };

    const _customStep = (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep}>
                {STEPS.map((step, index) => {
                    return (
                        <Step key={index} completed={completed.includes(step.name)}>
                            {(activeStep < index) ? (
                                <Tooltip title={<span style={{ fontSize: '16px' }}>
                                    This step is disabled. Complete the current to proceed.
                                </span>}>
                                    <span>
                                        <StepButton onClick={handleStep(index)} disabled={(activeStep < index)}>
                                            <StepLabel StepIconComponent={_customStepIcon}>
                                                <div style={{ fontSize: '18px' }}>{step.name}</div>
                                            </StepLabel>
                                        </StepButton>
                                    </span>
                                </Tooltip>
                            ) : (
                                <StepButton onClick={handleStep(index)}>
                                    <StepLabel StepIconComponent={_customStepIcon}>
                                        <div style={{ fontSize: '18px' }}>{step.name}</div>
                                    </StepLabel>
                                </StepButton>
                            )}
                        </Step>
                    )
                })}
            </Stepper>
        </Box>
    );


    const _buttonForward = {
        variant: "contained",
        label: (STEPS.length - 1 === activeStep) ? 'Generate Preview' : 'Continue',
        onClick: (STEPS.length - 1 === activeStep) ? handleOpenVisualization : handleStepForward,
        disabled: nextBtnDisabled,
        hidden: (STEPS.length === activeStep)
    };

    const _buttonBackward = {
        variant: "outlined",
        label: "Back",
        onClick: handleStepBackward,
        disabled: false,
        hidden: (activeStep === 0)
    };

    return (
        <ResponsiveComponent
            gridSpace={6}
            title={_customStep}
            buttons={[_buttonForward, _buttonBackward]}
        >
            {/* Content */}
            <div key={'Basic_Responsive_Component_Step_Child'}>
                {((STEPS.length) !== activeStep) ? (
                    STEPS[activeStep].component
                ) : (_customStepLast)}
            </div>
        </ResponsiveComponent>
    )
}
