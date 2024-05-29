import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Step,
    StepLabel, Stepper,
    StepButton,
    Tooltip,
} from "@mui/material";
import StepVisualization from "./StepVisualization/StepVisualization";
import { setActiveIndicatorStep, setCompletedIndicatorStep } from "../../../../utils/redux/reducers/indicatorEditor";
import {styled} from '@mui/material';
import ResponsiveComponent from '../../Common/Layout/PageComponent';
import CheckIcon from '@mui/icons-material/Check';
import StepSelection from './StepSelection/StepSelection';
import { generateCompositeIndicatorPreview, saveCompositeIndicatorPreview, setGeneratedCompositeVisualizationCode } from '../../../../utils/redux/reducers/compositeEditor';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function ComponentStep(props) {
    const { classes } = props;
    const dispatch = useDispatch();
    const [completed, setCompleted] = useState([]);
    const [analysisMethodOutputsData, setAnalysisMethodOutputsData] = useState({});

    const selectIndicators = useSelector((state) => state.compositeEditorReducer.selectedData.indicators);
    const activeStep = useSelector((state) => state.indicatorEditorReducer.common.activeStep);
    const completedStep = useSelector((state) => state.indicatorEditorReducer.common.completedStep);
    const selectedMappingAnalysisInputAttributesData = useSelector((state) => state.indicatorEditorReducer.selectedData.mappingAnalysisInputAttributesData);
    const basicIndicatorPreviewMap = useSelector((state) => state.compositeEditorReducer.baiscIndicatorPreviewList);
    const selectedVisualizationMethodsAndTypes = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
    const selectedVisualizationMapping = useSelector(state => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);

    // Method to generate indicator preview -> differs for each indicator type (basic, composite and multi-level)
    const handleOpenVisualization = () => {
        handleStepForward();
        dispatch(setGeneratedCompositeVisualizationCode("", ""));
        let parametersToBeReturnedInResult = {};
        selectedMappingAnalysisInputAttributesData.forEach((data) => {
            parametersToBeReturnedInResult[data.outputPort.id] = 1;
        });
        let _params = {}
        let _queries = {};
        let _queryToMethodConfig = {};
        let _analyticsMethodId = {};
        let _visualizationInputParams = {};
        for (let index in Object.keys(basicIndicatorPreviewMap)) {
            if (
                selectIndicators.some((v) => v.id === Object.keys(basicIndicatorPreviewMap)[index])
            ) {
                _params[`${Object.keys(_params).length}`] = JSON.stringify(Object.values(basicIndicatorPreviewMap)[index]['methodParams'])
                _queries[`${Object.keys(_queries).length}`] = Object.values(
                    basicIndicatorPreviewMap
                )[index]["indicators"][0]["query"]["0"];
                _queryToMethodConfig[`${Object.keys(_queryToMethodConfig).length}`] =
                    Object.values(basicIndicatorPreviewMap)[index]["indicators"][0][
                    "queryToMethodConfig"
                    ]["0"];
                _analyticsMethodId[`${Object.keys(_analyticsMethodId).length}`] =
                    Object.values(basicIndicatorPreviewMap)[index]["analyticsMethodId"];
                _visualizationInputParams[
                    `${Object.keys(_visualizationInputParams).length}`
                ] = "";
            }
        }
        let getCompositeIndicatorPreviewCode = {
            queries: _queries,
            indicatorType: "composite",
            analyticsMethodId: _analyticsMethodId,
            queryToMethodConfig: _queryToMethodConfig,
            methodInputParams: _params,
            visualizationInputParams: _visualizationInputParams,
            additionalParams: { rid: Date.now(), width: 400, height: 200 },
            visualizationLibraryId: selectedVisualizationMethodsAndTypes[0].id,
            visualizationTypeId: selectedVisualizationMethodsAndTypes[0].vId,
            methodToVisualizationConfig: { mapping: selectedVisualizationMapping },
        };
        dispatch(generateCompositeIndicatorPreview(getCompositeIndicatorPreviewCode));
        dispatch(saveCompositeIndicatorPreview(getCompositeIndicatorPreviewCode));
    };

    // Methods to handle general step component functionality
    const handleStep = (step) => () => {
        dispatch(setActiveIndicatorStep(step));
    }

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

    const STEPS = [
        {
            name: "Select Indicator",
            component: <StepSelection
                classes={classes}
                setAnalysisMethodOutputsData={setAnalysisMethodOutputsData}
                onStepComplete={handleStepComplete}
                onStepIncomplete={handleStepIncomplete}
            />,
            color: '#9c27b0'
        },
        {
            name: "Visualization",
            component: <StepVisualization
                onStepComplete={handleStepComplete}
                onStepIncomplete={handleStepIncomplete}
                analysisMethodOutputsData={analysisMethodOutputsData}
            />,
            color: '#03a9f4'
        },
    ];

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
            backgroundColor: error ? theme.palette.error.main : completed ? color : active ? color : '#eee',
            color: error || completed || active ? '#fff' : '#000',
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
        disabled: (!completed.includes(STEPS[activeStep]?.name)),
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
            <div>
                {((STEPS.length) !== activeStep) ? (
                    STEPS[activeStep].component
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 56px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                            <p style={{ fontSize: '20px', fontWeight: '700' }}>Name your indicator.</p>
                            <span style={{ fontSize: '16px' }}>
                                All steps are completed. Please name your indicator and save it on the bottom to your workspace.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </ResponsiveComponent>
    )
}
