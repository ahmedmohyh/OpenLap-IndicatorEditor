export const SELECT_INDICATORS = "selectIndicators";
export const SET_BASIC_INDICATOR_PREIVEW_LIST = 'setBasicIndicatorPreviewList';
export const GET_BASIC_INDICATOR_PREIVEW_LIST = 'getBasicIndicatorPreviewList';
export const GENERATE_COMPOSITE_INDICATOR_PREVIEW = 'generateCompositeIndicatorPreview'
export const SET_GENERATED_COMPOSITE_VISUALIZATION_CODE = "setGeneratedCompositeVisualizationCode";
export const SAVE_COMPOSITE_INDICATOR_PREVIEW = "saveCompositeIndicatorPreview";
export const SET_INDICATOR_RESPONSE_SAVE = 'setIndicatorSaveResponse';
export const SAVE_INDICATOR = 'saveIndicator';
export const RESET_INDICATOR_SESSION = "resetIndicatorEditorSession";

export const selectIndicators = (indicators) => ({
  type: SELECT_INDICATORS,
  payload: { indicators }
})

export const saveIndicator = (indicatorQueryData) => ({
  type: SAVE_INDICATOR,
  payload: { indicatorQueryData }
})
export const resetIndicatorSession = () => ({
  type: RESET_INDICATOR_SESSION,
})

// To set the current theme to either dark or light
export const setBasicIndicatorPreviewList = (value) => ({
  type: SET_BASIC_INDICATOR_PREIVEW_LIST,
  value
});

export const getBasicIndicatorPreviewList = () => ({
  type: GET_BASIC_INDICATOR_PREIVEW_LIST
});

export const setIndicatorSaveResponse = (indicatorSaveResponses) => ({
  type: SET_INDICATOR_RESPONSE_SAVE,
  payload: { indicatorSaveResponses }
})

export const saveCompositeIndicatorPreview = (compositeQueryBuilder) => ({
  type: SAVE_COMPOSITE_INDICATOR_PREVIEW,
  payload: { compositeQueryBuilder }
})
export const generateCompositeIndicatorPreview = (queryBuilder) => ({
  type: GENERATE_COMPOSITE_INDICATOR_PREVIEW,
  payload: {
    queryBuilder
  }
})
export const setGeneratedCompositeVisualizationCode = (divData, scriptData, errorMessage) => ({
  type: SET_GENERATED_COMPOSITE_VISUALIZATION_CODE,
  payload: {
    divData,
    scriptData,
    errorMessage
  }
})
// Initial state for User Preferences
const initialState = {
  baiscIndicatorPreviewList: [],
  selectedData: {
    indicators: [],
    indicatorResponseData: [],
    compositeIndicatorPreview: {}
  }
};

export default function userPreferencesReducer(state = initialState, action) {
  switch (action.type) {
    /**@author Louis Born <louis.born@stud.uni-due.de> */
    case SELECT_INDICATORS:
      if (!state.selectedData.indicators.some((v) => v.id === action.payload.indicators.id)) {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            indicators: [...state.selectedData.indicators, action.payload.indicators],
          },
        };
      } else {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            indicators: state.selectedData.indicators.filter((v) => v.id !== action.payload.indicators.id)
          }
        }
      }
    case SET_BASIC_INDICATOR_PREIVEW_LIST:
      return {
        ...state, baiscIndicatorPreviewList: action.value
      }
    case SET_GENERATED_COMPOSITE_VISUALIZATION_CODE: {
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          visualizationCode: {
            ...state.visualizationCode,
            displayCode: action.payload.divData ? action.payload.divData : "",
            scriptCode: action.payload.scriptData ? action.payload.scriptData : "",
            errorMessage: action.payload.errorMessage ? action.payload.errorMessage : "",
          }
        }
      }
    }
    case SET_INDICATOR_RESPONSE_SAVE: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          indicatorResponseData: action.payload.indicatorSaveResponses
        }
      }
    }
    case SAVE_COMPOSITE_INDICATOR_PREVIEW: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          compositeIndicatorPreview: action.payload.compositeQueryBuilder
        }
      }
    }
    case RESET_INDICATOR_SESSION:
      return {
        baiscIndicatorPreviewList: [],
        selectedData: {
          indicators: [],
          indicatorResponseData: [],
          compositeIndicatorPreview: {}
        }
      }
    default:
      return state;
  }
}