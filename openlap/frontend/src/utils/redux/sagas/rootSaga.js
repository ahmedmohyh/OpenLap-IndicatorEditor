import { takeLatest } from 'redux-saga/effects';
import { GET_USER_QUESTIONS_AND_INDICATORS } from "../reducers/reducer";
import { handleGetGoals, handleGetUserQuestionsAndIndicators, handleGetStatements } from "./handler";
import { GET_GOALS } from "../reducers/editor";
import { GET_STATEMENTS } from "../reducers/csvxapiReducer";
import {
  GET_ACTIVE_GOALS,
  GET_ALL_INDICATORS,
  GET_ALL_QUESTIONS,
  GET_INDICATORS_BY_QUESTION_ID,
  GET_QUESTION_NAME_VALIDATION,
  SAVE_QUESTION_AND_INDICATORS, VALIDATE_QUESTION,
} from "../reducers/gqiEditor";
import {
  handleGetActiveGoals,
  handleGetAllIndicators,
  handleGetAllQuestions,
  handleGetIndicatorsByQuestionId,
  handleGetQuestionNameValidation,
  handleSaveQuestionAndIndicators, handleValidateQuestion
} from "./handler/gqiEditor";
import {
  GENERATE_INDICATOR_PREVIEW,
  GET_ACTION_ON_ACTIVITIES,
  GET_ACTIVITY_EXTENSION_ID_VALUES,
  GET_ACTIVITY_TYPES,
  GET_ALL_FILTER_DATA,
  GET_ALL_PLATFORMS,
  GET_ANALYSIS_METHOD_INPUTS,
  GET_ANALYSIS_METHOD_OUTPUTS,
  GET_ANALYSIS_METHODS, GET_INDICATOR_DATA_FOR_EDIT,
  GET_VISUALIZATION_METHOD_INPUTS,
  GET_VISUALIZATION_METHODS_AND_TYPES,
  VALIDATE_INDICATOR_NAME
} from "../reducers/indicatorEditor";
import {
  handleGenerateIndicatorPreview,
  handleGetActionOnActivities,
  handleGetActivityExtensionIdValues,
  handleGetActivityTypes,
  handleGetAllFilterData,
  handleGetAllPlatforms,
  handleGetAnalysisMethodInputs,
  handleGetAnalysisMethodOutputs,
  handleGetAnalysisMethods, handleGetIndicatorDataForEdit,
  handleGetVisualizationMethodInputs,
  handleGetVisualizationMethodsAndTypes,
  handleValidateIndicatorName
} from "./handler/indicatorEditor";
import {
  GET_BASIC_INDICATOR_PREIVEW_LIST,
  GENERATE_COMPOSITE_INDICATOR_PREVIEW,
  SAVE_INDICATOR
} from "../reducers/compositeEditor";
import {
  handleIndicatorsPreviewByUserName,
  handleCompositeVisualizationPreview,
  handleSaveIndicator
} from "./handler/compositeEditor";
import {
  GET_BASIC_INDICATOR_PREIVEW_LISTML,
  GENERATE_MULTI_LEVEL_INDICATOR_PREVIEW,
  SAVE_INDICATORML
} from "../reducers/multiLevelEditor";
import {
  handleIndicatorsPreviewByUserNameML,
  handleMultiLevelVisualizationPreviewML,
  handleSaveIndicatorML,
  handleGetAnalysisMethodOutputsML,
  handleGetAnalysisMethodInputsML
} from "./handler/multiLevelEditor";

import {
  GET_ANALYSIS_METHOD_INPUTSML,
  GET_ANALYSIS_METHOD_OUTPUTSML
} from "../reducers/multiLevelEditor";

export function* watcherSaga() {
  yield takeLatest(GET_USER_QUESTIONS_AND_INDICATORS, handleGetUserQuestionsAndIndicators);

  yield takeLatest(GET_GOALS, handleGetGoals);

  yield takeLatest(GET_STATEMENTS, handleGetStatements);
  // GQI Editor
  yield takeLatest(GET_ACTIVE_GOALS, handleGetActiveGoals);
  yield takeLatest(VALIDATE_QUESTION, handleValidateQuestion);
  yield takeLatest(GET_ALL_QUESTIONS, handleGetAllQuestions);
  yield takeLatest(GET_INDICATORS_BY_QUESTION_ID, handleGetIndicatorsByQuestionId);
  yield takeLatest(GET_ALL_INDICATORS, handleGetAllIndicators);
  yield takeLatest(SAVE_QUESTION_AND_INDICATORS, handleSaveQuestionAndIndicators);
  yield takeLatest(GET_QUESTION_NAME_VALIDATION, handleGetQuestionNameValidation);
  // Editor
  yield takeLatest(GET_ALL_PLATFORMS, handleGetAllPlatforms);
  yield takeLatest(GET_ACTIVITY_TYPES, handleGetActivityTypes);
  yield takeLatest(GET_ACTION_ON_ACTIVITIES, handleGetActionOnActivities);
  yield takeLatest(GET_ALL_FILTER_DATA, handleGetAllFilterData);
  yield takeLatest(GET_ACTIVITY_EXTENSION_ID_VALUES, handleGetActivityExtensionIdValues);
  yield takeLatest(GET_ANALYSIS_METHODS, handleGetAnalysisMethods);
  yield takeLatest(GET_ANALYSIS_METHOD_INPUTS, handleGetAnalysisMethodInputs);
  yield takeLatest(GET_ANALYSIS_METHOD_OUTPUTS, handleGetAnalysisMethodOutputs);
  yield takeLatest(GET_VISUALIZATION_METHODS_AND_TYPES, handleGetVisualizationMethodsAndTypes);
  yield takeLatest(GET_VISUALIZATION_METHOD_INPUTS, handleGetVisualizationMethodInputs);
  yield takeLatest(GENERATE_INDICATOR_PREVIEW, handleGenerateIndicatorPreview);
  yield takeLatest(VALIDATE_INDICATOR_NAME, handleValidateIndicatorName);
  yield takeLatest(GET_INDICATOR_DATA_FOR_EDIT, handleGetIndicatorDataForEdit);
  // Composite Editor
  yield takeLatest(GET_BASIC_INDICATOR_PREIVEW_LIST, handleIndicatorsPreviewByUserName);
  yield takeLatest(GENERATE_COMPOSITE_INDICATOR_PREVIEW, handleCompositeVisualizationPreview);
  yield takeLatest(SAVE_INDICATOR, handleSaveIndicator);
  // MultiLevel Editor
  yield takeLatest(GET_BASIC_INDICATOR_PREIVEW_LISTML, handleIndicatorsPreviewByUserNameML);
  yield takeLatest(GENERATE_MULTI_LEVEL_INDICATOR_PREVIEW, handleMultiLevelVisualizationPreviewML);
  yield takeLatest(SAVE_INDICATORML, handleSaveIndicatorML);
  yield takeLatest(GET_ANALYSIS_METHOD_OUTPUTSML, handleGetAnalysisMethodOutputsML);
  yield takeLatest(GET_ANALYSIS_METHOD_INPUTSML, handleGetAnalysisMethodInputsML);
}
