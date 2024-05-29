import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAnalysisMethodInputsML,
    getAnalysisMethodOutputsML,
    getAnalysisMethods,
} from '../../../../../utils/redux/reducers/multiLevelEditor';
import AnalysisMappingChoices from './AnalysisMethodMapping/AnalysisMappingChoices';
import Choices from './AnalysisMethodParams/Choices';
import TextBox from './AnalysisMethodParams/TextBox';
import CheckBox from './AnalysisMethodParams/CheckBox';
import SelectionAccordion from '../../../Common/Accordion/Accordion';
import ConditionalSelectionRender from '../../../Common/ConditionalSelectionRender/ConditionalSelectionRender';
import config from './config';
import Tag from '../../../Common/Tag/Tag';

export default function AnalysisOption({
    classes,
    handleStepBackward,
    handleStepForward,
    selectedIndicators,
    continueToVisualizations,
}) {
    const analysisMethodInputsData = useSelector(
        (state) => state.multiLevelEditorReducer.fetchedData.analysisMethodInputs
    );
    const selectedMappingAnalysisInputAttributesData = useSelector(
        (state) =>
            state.multiLevelEditorReducer.selectedData
                .mappingAnalysisInputAttributesData
    );
    const selectedAnalysisMethod = useSelector(
        (state) => state.multiLevelEditorReducer.selectedData.analysisMethod
    );
    const selectedAnalyticsMethodParams = useSelector(
        (state) => state.multiLevelEditorReducer.selectedData.analysisMethodParams
    );
    const errorAnalysisMethodInputsAndParams = useSelector(
        (state) => state.errorMessagesReducer.connectionErrors.analysisMethodInputs
    );
    const activityAttributesData = useSelector(
        (state) => state.multiLevelEditorReducer.fetchedData.activityAttributes
    );
    const basicIndicatorPreviewMap = useSelector(
        (state) => state.multiLevelEditorReducer.baiscIndicatorPreviewList
    );
    const [resultList, setRersultList] = React.useState([]);

    const analysisMethodsData = useSelector(
        (state) => state.indicatorEditorReducer.fetchedData.analysisMethods
    );

    const dispatch = useDispatch();
    useEffect(() => {
    }, [selectedMappingAnalysisInputAttributesData.length]);

    const handleRefresh = (errorMessage) => {
        if (errorMessage === 'ANALYSIS_METHOD') dispatch(getAnalysisMethods());
        if (errorMessage === 'INPUT_PARAMS') {
            dispatch(getAnalysisMethodInputsML(selectedAnalysisMethod));
            dispatch(getAnalysisMethodOutputsML(selectedAnalysisMethod));
        }
    };
    useEffect(() => {
    }, []);


    useEffect(() => {
        getNormalMethodResultName();
    }, [resultList.length]);

    const getNormalMethodResultName = () => {
        let _l = [];
        selectedIndicators.forEach((e) => {
            let instance = basicIndicatorPreviewMap[e.id];
            let a = analysisMethodsData.filter(
                (item) => item.id === instance.analyticsMethodId
            );
            a[0].outputs.split(',').forEach((o) => {
                if (_l.indexOf(o) === -1) {
                    _l.push(o);
                }
            });
        });
        setRersultList(_l)
        activityAttributesData.map((e, i) => {
            e.id = _l[i]
            e.name = _l[i]
        })
    };

    return (
        <>
            <ConditionalSelectionRender
                isRendered={(selectedAnalysisMethod.length !== 0)}
                isLoading={(false)}
                hasError={errorAnalysisMethodInputsAndParams}
                handleRefresh={handleRefresh}
                refreshType={config.input_params.refresh_type}
            >
                {analysisMethodInputsData.map((analysisInput, index) => {
                    return (
                        <div key={`${analysisInput.title}-${index}`}>
                            <div style={{ marginTop: '32px', marginBottom: '-8px' }}>
                                <span style={{ fontSize: '14px' }}>Select Attributes for:</span> <Tag
                                    color='#9c27b0'
                                    step={0}
                                    label={basicIndicatorPreviewMap[selectedIndicators[index].id]['name']}
                                    completed={true}
                                    tooltip={undefined}>
                                </Tag>
                            </div>
                            <AnalysisMappingChoices
                                key={index}
                                analysisInput={analysisInput}
                                selectedMappingAnalysisInputAttributesData={
                                    selectedMappingAnalysisInputAttributesData
                                }
                                classes={classes}
                                activityAttributesData={activityAttributesData}
                            />
                            {index !== analysisMethodInputsData.length - 1 ? <hr style={{ marginTop: '32px', backgroundColor: '#e0e0e0', height: '1px', border: 0 }} /> : ''}
                        </div>
                    );
                })}
            </ConditionalSelectionRender>
            {selectedAnalyticsMethodParams.length !== 0 ? (
                <>
                    <>
                        <SelectionAccordion summary="More Parameters">
                            {selectedAnalyticsMethodParams.map((data, index) => {
                                if (data.type === "Choice")
                                    return <Choices key={index} paramData={data}
                                        selectedAnalyticsMethodParams={selectedAnalyticsMethodParams} />;
                                else if (data.type === "Textbox")
                                    return <TextBox key={index} paramData={data} sx={{ my: 1 }}
                                        selectedAnalyticsMethodParams={selectedAnalyticsMethodParams} />;
                                else if (data.type === "Checkbox")
                                    return <CheckBox key={index} paramData={data}
                                        selectedAnalyticsMethodParams={selectedAnalyticsMethodParams} />;
                                else return <></>;
                            })}
                        </SelectionAccordion>
                    </>
                </>
            ) : (
                <></>
            )}
        </>
    );
}