import {Backend, org_id, lrs_id} from "../../../backend";

import {call, put} from 'redux-saga/effects';
import {v4 as uuid4} from 'uuid';
import parse from "html-react-parser";
import {
  requestIndicatorsPreviewByUserNameML,
  requestMultiLevelVisualizationPreviewML,
  requestSaveIndicatorML
} from "../request/multiLevelEditor";
import{  requestActivityExtensionIdOptions,
  requestActivityTypeExtensionIds,
  requestAnalysisMethodInputs,
  requestAnalysisMethodOutputs,
  requestAnalysisMethodParams,
  requestAnalysisMethods,
  requestData,
  requestGetActivitiesExtensionContextValues,
  requestValidateIndicatorName,
  requestVisualizationMethodInputs,
  requestVisualizationMethodsAndTypes,
  requestVisualizationPreview
}
from "../request/indicatorEditor"
import {
  setConnectionErrorActionOnActivity,
  setConnectionErrorActivityType,
  setConnectionErrorAnalysisMethod,
  setConnectionErrorAnalysisMethodInputs, setConnectionErrorAnalysisMethodOutput,
  setConnectionErrorPlatform
} from "../../reducers/errorMessages";

import {
  setGeneratedVisualizationCode
} from "../../reducers/indicatorEditor";
import {
  setBasicIndicatorPreviewListML,
  setIndicatorSaveResponseML,
  setAnalysisMethodInputML,
  setAnalysisMethodOutputML
} from "../../reducers/multiLevelEditor";
export function* handleIndicatorsPreviewByUserNameML() {
  
  try {
    const parsedUser = JSON.parse(localStorage.getItem('openlapUser'));
    const userName = parsedUser.email;
    const response = yield call(requestIndicatorsPreviewByUserNameML, userName);
    const {data} = response;

    if (data !== undefined) {
      let _data={}
      let filter_data = []
      filter_data = data.filter(e=>e['indicators'][0]['indicatorType']==='Basic Indicator')
      for(let i in filter_data){
        _data[filter_data[i]['id']] = filter_data[i]
      }
      // const sortedArray = (data.columns["statement.context.platform"].data).sort((a, b) => a.localeCompare(b));
      yield put(setBasicIndicatorPreviewListML(_data));
    }
  } catch (error) {
  }
}
// new
export function* handleSaveIndicatorML(action) {
  console.log('action',action)

  let query = action.payload.indicatorQueryData;
  try {
    let response = yield call(requestSaveIndicatorML, query);

    const {data: {indicatorRequestCode}} = response;

    yield put(setIndicatorSaveResponseML([indicatorRequestCode]));
  } catch (error) {
    console.log(error);
  }
}


export function* handleMultiLevelVisualizationPreviewML(action) {
  const query = action.payload.queryBuilder;
  try {
    console.log("QUERY!!!!! ", query);
    const response = yield call(requestMultiLevelVisualizationPreviewML, query);
    const unescapedVizCode = decodeURIComponent(response.data.visualizationCode);
    let displayCode = parse(unescapedVizCode);
    console.log("CODE ", displayCode);
    let scriptData = displayCode[1].props.dangerouslySetInnerHTML.__html;
    yield put(setGeneratedVisualizationCode(displayCode, scriptData, ""));
  } catch (error) {
    let errorMessage = "Visualization not possible!"
    yield put(setGeneratedVisualizationCode("", "", errorMessage));
  }
}


export function* handleGetAnalysisMethodInputsML(action) {
  try {
    let response = yield call(requestAnalysisMethodInputs, action.payload.selectedAnalysisMethod.id);
    const analysisMethodInputData = response.data;
    try {
      response = yield call(requestAnalysisMethodParams, action.payload.selectedAnalysisMethod.id)
      const analysisMethodParamsData = response.data;
      analysisMethodParamsData.forEach(data => {
        let newPossibleValues = []
        if (data.possibleValues) {
          let {possibleValues} = data;
          newPossibleValues = possibleValues.split(",")
          data.possibleValues = newPossibleValues;
        }
        if (data.defaultValue || data.defaultValue === "") {
          data.value = data.defaultValue;
        }
      });
      yield put(setAnalysisMethodInputML(analysisMethodInputData, analysisMethodParamsData));
    } catch (error) {
      yield put(setConnectionErrorAnalysisMethodInputs(true))
    }
  } catch (error) {
    yield put(setConnectionErrorAnalysisMethodInputs(true));
  }
}

// Visualization Method handler functions
export function* handleGetAnalysisMethodOutputsML(action) {
  try {
    const response = yield call(requestAnalysisMethodOutputs, action.payload.selectedAnalysisMethod.id);
    const {data} = response;
    yield put(setAnalysisMethodOutputML(data));
  } catch (error) {
    yield put(setConnectionErrorAnalysisMethodOutput(true));
  }
}
