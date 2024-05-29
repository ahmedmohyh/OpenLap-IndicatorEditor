import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalysisMethodInputsML,
  getAnalysisMethodOutputsML,
  getAnalysisMethods,
  selectDeselectAnalysisMethodML,
  selectDeselectAnalysisMethodMapML,
  setActivityAttributesML
} from "../../../../../utils/redux/reducers/multiLevelEditor";

import { attributeDataFunction } from "./attributeData";

import { scrollToTop } from "../../../../../utils/assets/functions/functions";
import MenuSingleSelect from "../../../Common/MenuSingleSelect/MenuSingleSelect";
import ConditionalSelectionRender from '../../../Common/ConditionalSelectionRender/ConditionalSelectionRender';
import SelectContainer from '../../../Common/SelectContainer/SelectContainer';
import config from './config';
import AnalysisOption from './AnalysisOption';
import { useSnackbar } from '../../BasicIndicator/context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function StepAnalysis(props) {
  const { classes, onStepComplete, onStepIncomplete } = props;
  const [resultList, setRersultList] = useState([]);

  // Constants from redux store
  const analysisMethodsData = useSelector(state => state.indicatorEditorReducer.fetchedData.analysisMethods);
  const selectionIndicators = useSelector((state) => state.multiLevelEditorReducer.selectedData.indicators);
  const selectedAnalysisMethod = useSelector(state => state.multiLevelEditorReducer.selectedData.analysisMethod);

  const resultData = useSelector(state => state.multiLevelEditorReducer.fetchedData.result);

  // Local constants
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const errorAnalysisMethod = useSelector(state => state.errorMessagesReducer.connectionErrors.analysisMethod);
  // State for analysis options
  const activityAttributesData = useSelector((state) => state.multiLevelEditorReducer.fetchedData.activityAttributes);
  const basicIndicatorPreviewMap = useSelector((state) => state.multiLevelEditorReducer.baiscIndicatorPreviewList);


  const handleSelectAnalysisMethod = (event, value) => {
    showSnackbar(`Your selection for ${config.analysis_method.name} has been saved.`);
    dispatch(selectDeselectAnalysisMethodML((value === null) ? [] : [value]));
    
    if (value !== null) {
        dispatch(getAnalysisMethodInputsML(value));
        dispatch(getAnalysisMethodOutputsML(value));
    }
  };

  const handleRefresh = (errorMessage) => {
    if (errorMessage === config.input_params.refresh_type) dispatch(getAnalysisMethods());
    if (errorMessage === config.input_params.refresh_type) {
      dispatch(getAnalysisMethodInputsML(selectedAnalysisMethod));
      dispatch(getAnalysisMethodOutputsML(selectedAnalysisMethod));
    }
  };

  const getNormalMethodResultName = () => {
    let _l = [];
    selectionIndicators.forEach((e) => {
      let instance = basicIndicatorPreviewMap[e.id]; // [todo] instance retrieval not necessary indicator object already available in e.
      let a = analysisMethodsData.filter(
        (item) => item.id === instance.analyticsMethodId
      );
      a[0]?.outputs.split(',').forEach((o) => {
        if (_l.indexOf(o) === -1) {
          _l.push(o);
        }
      });
    });
    setRersultList(_l)
    activityAttributesData.map((e, i) => {
      e.id = _l[i]
      e.name = _l[i]
    });
  };

  /**
     * Check if the step is complete
     * @returns {boolean} - True if step is complete, false otherwise
     */
  const isStepComplete = () => {
    return selectedAnalysisMethod.length !== 0;
  };

  useEffect(() => {
    scrollToTop();
    dispatch(setActivityAttributesML(attributeDataFunction(resultData)));
    if (selectedAnalysisMethod.length === 0)
      dispatch(getAnalysisMethods());
  }, []);

  useEffect(() => {
    getNormalMethodResultName();
  }, [resultList.length]);

  /**
     * useEffect to update step completeness on selected data change
     */
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete(config.id);
    } else {
      onStepIncomplete(config.id);
    }
  }, [selectedAnalysisMethod]);

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
              dataSource={analysisMethodsData.filter(e => e.type === 'machine learning')}
              itemName={selectedAnalysisMethod[0]}
              handleChange={handleSelectAnalysisMethod}
            />
          </SelectContainer>
        </ConditionalSelectionRender>
        {/** Analysis Method Inputs Data selection. */}
        {analysisMethodsData.length !== 0 ?
          <AnalysisOption
            classes={classes}
            selectedIndicators={selectionIndicators}
          /> : <></>
        }
      </Grid>
    </>
  )
};
