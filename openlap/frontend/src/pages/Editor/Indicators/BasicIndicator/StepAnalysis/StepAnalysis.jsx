import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalysisMethodInputs,
  getAnalysisMethodOutputs,
  getAnalysisMethods,
  selectDeselectAnalysisMethod,
  setActivityAttributes
} from "../../../../../utils/redux/reducers/indicatorEditor";
import Grid from "@mui/material/Grid";
import MenuSingleSelect from "../../../Common/MenuSingleSelect/MenuSingleSelect";
import AnalysisMappingChoices from "./AnalysisMethodMapping/AnalysisMappingChoices";
import Choices from "./AnalysisMethodParams/Choices";
import TextBox from "./AnalysisMethodParams/TextBox";
import CheckBox from "./AnalysisMethodParams/CheckBox";
import { attributeDataFunction } from './attributeData';
import SelectionAccordion from '../../../Common/Accordion/Accordion';
import config from './config';
import ConditionalSelectionRender from '../../../Common/ConditionalSelectionRender/ConditionalSelectionRender';
import SelectContainer from '../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function StepAnalysis(props) {
  const { classes, onStepComplete, onStepIncomplete } = props;

  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const resultData = useSelector(state => state.indicatorEditorReducer.fetchedData.result);
  const analysisMethodsData = useSelector(state => state.indicatorEditorReducer.fetchedData.analysisMethods);
  const analysisMethodInputsData = useSelector(state => state.indicatorEditorReducer.fetchedData.analysisMethodInputs);
  const activityAttributesData = useSelector(state => state.indicatorEditorReducer.fetchedData.activityAttributes);
  const selectedAnalysisMethod = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethod);
  const selectedMappingAnalysisInputAttributesData = useSelector(state => state.indicatorEditorReducer.selectedData.mappingAnalysisInputAttributesData);
  const selectedAnalyticsMethodParams = useSelector(state => state.indicatorEditorReducer.selectedData.analysisMethodParams);
  const errorAnalysisMethod = useSelector(state => state.errorMessagesReducer.connectionErrors.analysisMethod);
  const errorAnalysisMethodInputsAndParams = useSelector(state => state.errorMessagesReducer.connectionErrors.analysisMethodInputs);

  const handleRefresh = (refreshType) => {
    showSnackbar(`Refreshing...`);
    if (refreshType === config.analysis_method.refresh_type) {
      dispatch(getAnalysisMethods());
    }

    if (refreshType === config.input_params.refresh_type) {
      dispatch(getAnalysisMethodInputs(selectedAnalysisMethod));
      dispatch(getAnalysisMethodOutputs(selectedAnalysisMethod));
    }
  }

  const handleSelectAnalysisMethod = (event, value) => {
    showSnackbar(`Your selection for ${config.analysis_method.name} has been saved.`);
    dispatch(selectDeselectAnalysisMethod((value === null ? [] : [value])));

    if (value !== null) {
        dispatch(getAnalysisMethodInputs(value));
        dispatch(getAnalysisMethodOutputs(value));
    }
  };

  /**
   * Check if the step is complete
   * @returns {boolean} - True if step is complete, false otherwise
   */
  const isStepComplete = () => {
    let amountRequiredInputAttributesData = 0;

    if (analysisMethodInputsData.length > 0) {
      amountRequiredInputAttributesData = analysisMethodInputsData.reduce((count, obj) => {
        if (obj && typeof obj === 'object' && obj.hasOwnProperty('required') && obj.required === true) {
          return count + 1;
        }
        return count;
      }, 0);
    } else {
        return false; // Quick fix: analysisMethodInputsData length is 0 even when analysis method selection was made and inputs are shown ???
    }

    return selectedAnalysisMethod.length !== 0 && selectedMappingAnalysisInputAttributesData.length >= amountRequiredInputAttributesData;
  };

  useEffect(() => {
    dispatch(setActivityAttributes(attributeDataFunction(resultData)));
    if (selectedAnalysisMethod.length === 0)
      dispatch(getAnalysisMethods());
  }, []);

  /**
   * useEffect to update step completeness on selected data change
   */
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete(config.id);
    } else {
      onStepIncomplete(config.id);
    }
  }, [selectedAnalysisMethod, selectedMappingAnalysisInputAttributesData]);

  return (
    <>
      <Grid container direction="column" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
        <Grid item xs={12}>
          <h1 style={{ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', color: '#000' }}>
            {config.title}:
          </h1>
        </Grid>
        {/** Analysis Method selection. */}
        <ConditionalSelectionRender
          isRendered={true}
          isLoading={(analysisMethodsData?.length === 0)}
          hasError={errorAnalysisMethod}
          handleRefresh={handleRefresh}
          refreshType={config.analysis_method.refresh_type}
        >
          <SelectContainer
            name={config.analysis_method.name}
            isMandatory={config.analysis_method.mandatory}
            allowsMultipleSelections={config.analysis_method.multiple_selections}
            helper={config.analysis_method.helper}
          >
            <MenuSingleSelect
              name={config.analysis_method.name}
              dataSource={analysisMethodsData.filter(e => e.type !== '')}
              itemName={selectedAnalysisMethod[0]}
              handleChange={handleSelectAnalysisMethod}
            />
          </SelectContainer>
        </ConditionalSelectionRender>
        {/** Analysis Method Inputs Data selection. */}
        <ConditionalSelectionRender
          isRendered={(selectedAnalysisMethod.length !== 0)}
          isLoading={(analysisMethodInputsData.length === 0 && selectedMappingAnalysisInputAttributesData.length === 0)}
          hasError={errorAnalysisMethodInputsAndParams}
          handleRefresh={handleRefresh}
          refreshType={config.input_params.refresh_type}
        >
          <>
            {analysisMethodInputsData.map((analysisInput, index) => {
              return (
                <AnalysisMappingChoices
                  key={index}
                  analysisInput={analysisInput}
                  selectedMappingAnalysisInputAttributesData={selectedMappingAnalysisInputAttributesData}
                  classes={classes}
                  activityAttributesData={activityAttributesData} />
              )
            })}
            {selectedAnalyticsMethodParams.length !== 0 ? (
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
            ) : <></>}
          </>
        </ConditionalSelectionRender>
      </Grid>
    </>
  )
};
