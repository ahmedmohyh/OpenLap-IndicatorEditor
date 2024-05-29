import {Backend, org_id, lrs_id} from "../../../../utils/backend";

import {call, put} from 'redux-saga/effects';
import {v4 as uuid4} from 'uuid';
import parse from "html-react-parser";
import {
  requestIndicatorsPreviewByUserName,
  requestCompositeVisualizationPreview,
  requestSaveIndicator
} from "../request/compositeEditor";

import {
  setGeneratedVisualizationCode
} from "../../reducers/indicatorEditor";
import {
  setBasicIndicatorPreviewList,
  setIndicatorSaveResponse
} from "../../reducers/compositeEditor";
export function* handleIndicatorsPreviewByUserName() {

  try {
    const parsedUser = JSON.parse(localStorage.getItem('openlapUser'));
    const userName = parsedUser.email;
    const response = yield call(requestIndicatorsPreviewByUserName, userName);
    const {data} = response;

    if (data !== undefined) {
      let _data={}
      let filter_data = []
      filter_data = data.filter(e=>e['indicators'][0]['indicatorType']==='Basic Indicator')
      for(let i in filter_data){
        _data[filter_data[i]['id']] = filter_data[i]
      }
      // const sortedArray = (data.columns["statement.context.platform"].data).sort((a, b) => a.localeCompare(b));
      yield put(setBasicIndicatorPreviewList(_data));
    }
  } catch (error) {
  }
}
// new
export function* handleSaveIndicator(action) {
  let query = action.payload.indicatorQueryData;
  console.log("handleSaveIndicator ", query);
  try {
    let response = yield call(requestSaveIndicator, query);

    const {data: {indicatorRequestCode}} = response;
    console.log("RESPONSE data ", response);

    yield put(setIndicatorSaveResponse([indicatorRequestCode]));
  } catch (error) {
    console.log(error);
  }
}

export function* handleCompositeVisualizationPreview(action) {
  const query = action.payload.queryBuilder;
  try {
    const response = yield call(requestCompositeVisualizationPreview, query);
    const unescapedVizCode = decodeURIComponent(response.data.visualizationCode);
    let displayCode = parse(unescapedVizCode);
    let scriptData = displayCode[1].props.dangerouslySetInnerHTML.__html;
    yield put(setGeneratedVisualizationCode(displayCode, scriptData, ""));
  } catch (error) {
    let errorMessage = "Visualization not possible!"
    yield put(setGeneratedVisualizationCode("", "", errorMessage));
  }
}
