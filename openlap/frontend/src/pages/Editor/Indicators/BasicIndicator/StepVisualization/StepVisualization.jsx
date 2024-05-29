import React, { useEffect } from 'react';
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    getVisualizationMethodInputs,
    getVisualizationMethodsAndTypes,
    selectDeselectVisMapping,
    selectDeselectVisualizationMethodsAndTypes,
    setGeneratedVisualizationCode,
    setVisualizationMethod,
    setVisualizationMethodInputs,
    setVisualizationType
} from "../../../../../utils/redux/reducers/indicatorEditor";
import MenuSingleSelect from "../../../Common/MenuSingleSelect/MenuSingleSelect";
import VizMappingChoices from "./VisualizationChoices/VizMappingChoices";
import SvgSingleSelect from '../../../Common/SvgSingleSelect/SvgSingleSelect';
import config from './config';
import ConditionalSelectionRender from '../../../Common/ConditionalSelectionRender/ConditionalSelectionRender';
import SelectContainer from '../../../Common/SelectContainer/SelectContainer';
import slower from '../../../Helper/slower';
import { useSnackbar } from '../context/SnackbarContext';

export default function Visualize({ onStepComplete, onStepIncomplete }) {
    const visualizationMethodAndTypeData = useSelector(state => state.indicatorEditorReducer.fetchedData.visualizationMethodsAndTypes);
    const visualizationMethodInputsData = useSelector(state => state.indicatorEditorReducer.fetchedData.visualizationMethodInputs);
    const analysisMethodOutputsData = useSelector(state => state.indicatorEditorReducer.fetchedData.analysisMethodOutputs);
    const selectedVisualizationMethodsAndTypes = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethodsAndTypes);
    const selectedVisualizationMapping = useSelector(state => state.indicatorEditorReducer.selectedData.mappingVizInputAnalysisOutput);
    const selectedVisualizationType = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationType);
    const selectedVisualizationMethod = useSelector(state => state.indicatorEditorReducer.selectedData.visualizationMethod);
    const dispatch = useDispatch();
    const showSnackbar = useSnackbar();

    const isStepComplete = () => {
        const amountRequiredVisualizationMapping = selectedVisualizationMapping.reduce((count, obj) => {
            if (obj.inputPort.hasOwnProperty('required') && obj.inputPort.required === true) {
                return count + 1;
            }
            return count;
        }, 0);

        return selectedVisualizationMethod.length !== 0 && Object.keys(selectedVisualizationType).length !== 0 && selectedVisualizationMapping.length >= amountRequiredVisualizationMapping;
    };

    useEffect(() => {
        if (Object.values(selectedVisualizationMethod).length === 0)
            dispatch(getVisualizationMethodsAndTypes());
    }, []);

    useEffect(() => {
        if (isStepComplete()) {
            onStepComplete(config.id);
        } else {
            onStepIncomplete(config.id);
        }
    }, [selectedVisualizationMethod, selectedVisualizationType, selectedVisualizationMapping]);

    const handleVisualizationMethod = (event, values) => {
        if (values) {
            dispatch(setVisualizationMethod(values));
        } else {
            dispatch(setVisualizationMethod({}));

        }
    };

    const handleVisualizationType = (event, values) => {
        dispatch(setVisualizationMethodInputs([]));
        slower(() => {
            dispatch(setVisualizationType(values));
            dispatch(getVisualizationMethodInputs(selectedVisualizationMethod.id, values.id))
            let vizMethodAndType = [];
            vizMethodAndType.push({
                id: selectedVisualizationMethod.id,
                name: selectedVisualizationMethod.name,
                creator: selectedVisualizationMethod.creator,
                description: selectedVisualizationMethod.description,
                vId: values.id,
                vName: values.name,
            });
            dispatch(selectDeselectVisMapping([]));
            dispatch(selectDeselectVisualizationMethodsAndTypes(vizMethodAndType));
            dispatch(setGeneratedVisualizationCode("", ""));
            showSnackbar('Your selection for Visualization Type has been saved.');
        });
    }

    return (
        <>
            <Grid container direction="column" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
                <Grid item xs={12}>
                    <h1 style={{ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', color: '#000' }}>
                        {config.title}:
                    </h1>
                </Grid>
                {/** Visualization library selection. */}
                <ConditionalSelectionRender
                    isRendered={true}
                    isLoading={(visualizationMethodAndTypeData.length === 0)}
                    hasError={false}
                    handleRefresh={null}
                    refreshType={null}
                >
                    <div>
                        <SelectContainer
                            name={config.vis_library.name}
                            isMandatory={config.vis_library.mandatory}
                            allowsMultipleSelections={config.vis_library.multiple_selections}
                            helper={config.vis_library.helper}
                        >
                            <MenuSingleSelect
                                name={config.vis_library.name}
                                dataSource={visualizationMethodAndTypeData}
                                itemName={Object.values(selectedVisualizationMethod).length === 0 ? null : [selectedVisualizationMethod][0]}
                                handleChange={handleVisualizationMethod}
                            />
                        </SelectContainer>
                        {(Object.keys(selectedVisualizationMethod).length !== 0) &&
                            <SelectContainer
                                name={config.vis_type.name}
                                isMandatory={config.vis_type.mandatory}
                                allowsMultipleSelections={config.vis_type.multiple_selections}
                                helper={config.vis_type.helper}
                            >
                                <SvgSingleSelect
                                    name={config.vis_type.name}
                                    dataSource={selectedVisualizationMethod.values}
                                    itemName={Object.values(selectedVisualizationMethod).length === 0 ? null : [selectedVisualizationType][0]}
                                    handleChange={handleVisualizationType}
                                />
                            </SelectContainer>
                        }
                        {/** Visualization Method Inputs selection. */}
                        <ConditionalSelectionRender
                            isRendered={(selectedVisualizationMethodsAndTypes.length !== 0)}
                            isLoading={(visualizationMethodInputsData.length === 0)}
                            hasError={false}
                            handleRefresh={null}
                            refreshType={null}
                        >
                            <>
                                {visualizationMethodInputsData.map((vizDataInput, index) => {
                                    return (
                                        <VizMappingChoices
                                            key={index}
                                            vizDataInput={vizDataInput}
                                            selectedVisualizationMapping={selectedVisualizationMapping}
                                            analysisMethodOutputsData={analysisMethodOutputsData} />
                                    )
                                })}
                            </>
                        </ConditionalSelectionRender>
                    </div>
                </ConditionalSelectionRender>
            </Grid>
        </>
    )
}
