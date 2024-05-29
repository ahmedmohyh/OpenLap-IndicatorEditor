export const SELECT_INDICATORS_ML = "selectIndicatorsML";
export const SET_BASIC_INDICATOR_PREIVEW_LISTML = 'setBasicIndicatorPreviewListML';
export const GET_BASIC_INDICATOR_PREIVEW_LISTML = 'getBasicIndicatorPreviewListML';
export const GENERATE_MULTI_LEVEL_INDICATOR_PREVIEW = 'generateMultiLevelIndicatorPreview'
export const SET_GENERATED_MULTI_LEVEL_VISUALIZATION_CODE = "setGeneratedMultiLevelVisualizationCode";
export const SAVE_MULTI_LEVEL_INDICATOR_PREVIEW = "saveMultiLevelIndicatorPreview";
export const SET_INDICATOR_RESPONSE_SAVEML = 'setIndicatorSaveResponseML';
export const SAVE_INDICATORML = 'saveIndicatorML';
export const RESET_INDICATOR_SESSION = "resetIndicatorEditorSession";
export const SET_ACTIVITY_ATTRIBUTESML = "setActivityAttributesML";
export const GET_ANALYSIS_METHOD_OUTPUTSML = "getAnalysisMethodOutputsML";
export const GET_ANALYSIS_METHOD_INPUTSML = "getAnalysisMethodInputsML";
export const SELECT_DESELECT_ANALYSIS_METHODML = "selectDeselectAnalysisMethodML";
export const SELECT_DESELECT_ANALYSIS_METHOD_MAPML = "selectDeselectAnalysisMethodMapML";
export const GET_ANALYSIS_METHODS = "getAnalysisMethods";
export const SET_ANALYSIS_METHOD_OUTPUTSML = "setAnalysisMethodOutputsML";
export const SET_ANALYSIS_METHOD_INPUTSML = "setAnalysisMethodInputsML";
export const SET_INDREFPARAMS = "setIndRefParams";
export const GET_INDREFPARAMS = "getIndRefParams";
export const SELECT_DESELECT_ANALYSIS_METHOD_PARAMSML = "selectDeselectAnalysisMethodParamsML"

export const selectIndicatorsML = (indicators) => ({
    type: SELECT_INDICATORS_ML,
    payload: { indicators }
})

export const getAnalysisMethodOutputsML = (selectedAnalysisMethod) => ({
    type: GET_ANALYSIS_METHOD_OUTPUTSML,
    payload: {
        selectedAnalysisMethod
    }
})

export const getAnalysisMethodInputsML = (selectedAnalysisMethod) => ({
    type: GET_ANALYSIS_METHOD_INPUTSML,
    payload: {
        selectedAnalysisMethod
    }
})
export const selectDeselectAnalysisMethodML = (selectedAnalysisMethod) => ({
    type: SELECT_DESELECT_ANALYSIS_METHODML,
    payload: {
        selectedAnalysisMethod
    }
})
export const selectDeselectAnalysisMethodMapML = (selectedAnalysisMethodMapping) => ({
    type: SELECT_DESELECT_ANALYSIS_METHOD_MAPML,
    payload: {
        selectedAnalysisMethodMapping
    }
})
export const setAnalysisMethodInputML = (analysisMethodInputsData, analysisMethodParamsData) => ({
    type: SET_ANALYSIS_METHOD_INPUTSML,
    payload: { analysisMethodInputsData, analysisMethodParamsData }
})

export const setAnalysisMethodOutputML = (analysisMethodOutputsData) => ({
    type: SET_ANALYSIS_METHOD_OUTPUTSML,
    payload: { analysisMethodOutputsData }
})
export const getAnalysisMethods = () => ({
    type: GET_ANALYSIS_METHODS
})

export const setActivityAttributesML = (attributes) => ({
    type: SET_ACTIVITY_ATTRIBUTESML,
    payload: { attributes }
})
export const selectDeselectAnalysisMethodParamsML = (selectedAnalysisMethodParams) => ({
    type: SELECT_DESELECT_ANALYSIS_METHOD_PARAMSML,
    payload: { selectedAnalysisMethodParams }
})

export const saveIndicatorML = (indicatorQueryData) => ({
    type: SAVE_INDICATORML,
    payload: {
        indicatorQueryData
    }
})

export const setIndRefParams = (indRefParams) => ({
    type: SET_INDREFPARAMS,
    payload: {
        indRefParams
    }
})
export const resetIndicatorSession = () => ({
    type: RESET_INDICATOR_SESSION,
})

// To set the current theme to either dark or light
export const setBasicIndicatorPreviewListML = (value) => ({
    type: SET_BASIC_INDICATOR_PREIVEW_LISTML,
    value
});

export const getBasicIndicatorPreviewListML = () => ({
    type: GET_BASIC_INDICATOR_PREIVEW_LISTML
});

export const setIndicatorSaveResponseML = (indicatorSaveResponses) => ({
    type: SET_INDICATOR_RESPONSE_SAVEML,
    payload: {
        indicatorSaveResponses
    }
})

export const saveMultiLevelIndicatorPreview = (multiLevelQueryBuilder) => ({
    type: SAVE_MULTI_LEVEL_INDICATOR_PREVIEW,
    payload: {
        multiLevelQueryBuilder
    }
})
export const generateMultiLevelIndicatorPreview = (queryBuilder) => ({
    type: GENERATE_MULTI_LEVEL_INDICATOR_PREVIEW,
    payload: {
        queryBuilder
    }
})
export const setGeneratedMultiLevelVisualizationCode = (divData, scriptData, errorMessage) => ({
    type: SET_GENERATED_MULTI_LEVEL_VISUALIZATION_CODE,
    payload: {
        divData,
        scriptData,
        errorMessage
    }
})
// Initial state for User Preferences
const initialState = {
    common: {
        activeStep: 0, completedStep: {}, indicatorSaved: false
    },
    baiscIndicatorPreviewList: [],
    selectedData: {
        indicators: [],
        multiLevelIndicatorPreview: {},
        indicatorResponseData: [],
        platforms: [],
        activityTypes: [],
        indRefParams: [],
        actionOnActivities: [],
        activityName: [],
        activityExtensionId: [],
        contextActivities: [],
        result: [],
        analysisMethod: [],
        analysisMethodParams: [],
        mappingAnalysisInputAttributesData: [],
        visualizationMethod: {},
        visualizationType: {},
        visualizationMethodsAndTypes: [],
        mappingVizInputAnalysisOutput: [],
        userData: {},
        timeDuration: {
            startDate: "",
            endDate: ""
        },
        indicatorName: {
            name: "",
            available: true,
            confirmed: false,
        },
        indicatorPreview: {}
    },
    fetchedData: {
        platforms: [],
        activityTypes: [],
        language: [],
        actionOnActivities: [],
        activityName: [],
        activityExtensionId: [],
        activityExtensionIdValue: [],
        contextActivities: [],
        result: [],
        analysisMethods: [],
        analysisMethodInputs: [],
        activityAttributes: [],
        analysisMethodOutputs: [],
        visualizationMethodsAndTypes: [],
        visualizationMethodInputs: [],
        visualizationCode: {
            displayCode: "",
            scriptCode: "",
            errorMessage: ""
        }
    }
};

export default function userPreferencesReducer(state = initialState, action) {
    switch (action.type) {
        /**@author Louis Born <louis.born@stud.uni-due.de> */
        case SELECT_INDICATORS_ML:
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
        case SET_BASIC_INDICATOR_PREIVEW_LISTML:
            return {
                ...state, baiscIndicatorPreviewList: action.value
            }
        case SET_GENERATED_MULTI_LEVEL_VISUALIZATION_CODE: {
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
        case SET_INDICATOR_RESPONSE_SAVEML: {
            return {
                ...state,
                selectedData: {
                    ...state.selectedData,
                    indicatorResponseData: action.payload.indicatorSaveResponses
                }
            }
        }
        case SET_INDREFPARAMS: {
            return {
                ...state,
                selectedData: {
                    ...state.selectedData,
                    indRefParams: action.payload.indRefParams
                }
            }
        }
        case SAVE_MULTI_LEVEL_INDICATOR_PREVIEW: {
            return {
                ...state,
                selectedData: {
                    ...state.selectedData,
                    multiLevelIndicatorPreview: action.payload.multiLevelQueryBuilder
                }
            }
        }
        case SELECT_DESELECT_ANALYSIS_METHOD_PARAMSML:
            return {
                ...state,
                selectedData: {
                    ...state.selectedData,
                    analysisMethodParams: action.payload.selectedAnalysisMethodParams.length !== 0 ? action.payload.selectedAnalysisMethodParams : []
                }
            }
        case RESET_INDICATOR_SESSION:
            return {
                common: {
                    activeStep: 0, completedStep: {}, indicatorSaved: false
                },
                baiscIndicatorPreviewList: [],
                selectedData: {
                    indicators: [],
                    multiLevelIndicatorPreview: {},
                    indicatorResponseData: [],
                    platforms: [],
                    activityTypes: [],
                    indRefParams: [],
                    actionOnActivities: [],
                    activityName: [],
                    activityExtensionId: [],
                    contextActivities: [],
                    result: [],
                    analysisMethod: [],
                    analysisMethodParams: [],
                    mappingAnalysisInputAttributesData: [],
                    visualizationMethod: {},
                    visualizationType: {},
                    visualizationMethodsAndTypes: [],
                    mappingVizInputAnalysisOutput: [],
                    userData: {},
                    timeDuration: {
                        startDate: "",
                        endDate: ""
                    },
                    indicatorName: {
                        name: "",
                        available: true,
                        confirmed: false,
                    },
                    indicatorPreview: {}
                },
                fetchedData: {
                    platforms: [],
                    activityTypes: [],
                    language: [],
                    actionOnActivities: [],
                    activityName: [],
                    activityExtensionId: [],
                    activityExtensionIdValue: [],
                    contextActivities: [],
                    result: [],
                    analysisMethods: [],
                    analysisMethodInputs: [],
                    activityAttributes: [],
                    analysisMethodOutputs: [],
                    visualizationMethodsAndTypes: [],
                    visualizationMethodInputs: [],
                    visualizationCode: {
                        displayCode: "",
                        scriptCode: "",
                        errorMessage: ""
                    }
                }
            }
        case SELECT_DESELECT_ANALYSIS_METHODML:
            /**@author Louis Born <louis.born@stud.uni-due.de> */
            if (action.payload.selectedAnalysisMethod.length !== 0) {
                return {
                    ...state,
                    selectedData: {
                        ...state.selectedData,
                        analysisMethod: action.payload.selectedAnalysisMethod
                    }
                }
            } else {
                return {
                    ...state,
                    selectedData: {
                        ...state.selectedData,
                        analysisMethod: [],
                        mappingAnalysisInputAttributesData: []
                    }
                }
            }
        case SET_ACTIVITY_ATTRIBUTESML:
            return {
                ...state,
                fetchedData: {
                    ...state.fetchedData,
                    activityAttributes: action.payload.attributes,
                }
            }
        case SELECT_DESELECT_ANALYSIS_METHOD_MAPML:
            /**@author Louis Born <louis.born@stud.uni-due.de> */
            let updatedAnalysisMapping = state.selectedData.mappingAnalysisInputAttributesData;

            if (action.payload.selectedAnalysisMethodMapping.length != 0) {
                const payload = action.payload.selectedAnalysisMethodMapping[0];

                if (action.payload.selectedAnalysisMethodMapping.output === null) {
                    // Selection is removed -> remove array from state.
                    updatedAnalysisMapping = updatedAnalysisMapping.filter(a => a.inputPort.id !== payload.input.id);
                } else {
                    updatedAnalysisMapping = updatedAnalysisMapping.filter(a => a.inputPort.id !== payload.input.id);

                    updatedAnalysisMapping.push({
                        inputPort: payload.input,
                        outputPort: payload.input
                    });
                }
            }
            return {
                ...state,
                selectedData: {
                    ...state.selectedData,
                    mappingAnalysisInputAttributesData: action.payload.selectedAnalysisMethodMapping.length === 0 ?
                        [] : updatedAnalysisMapping
                }
            }
        case SET_ANALYSIS_METHOD_OUTPUTSML:
            return {
                ...state,
                fetchedData: {
                    ...state.fetchedData,
                    analysisMethodOutputs: action.payload.analysisMethodOutputsData.length !== 0 ?
                        action.payload.analysisMethodOutputsData : []
                }
            }
        case SET_ANALYSIS_METHOD_INPUTSML:
            return {
                ...state,
                fetchedData: {
                    ...state.fetchedData,
                    analysisMethodInputs:
                        action.payload.analysisMethodInputsData.length !== 0 ?
                            action.payload.analysisMethodInputsData : [],
                },
                selectedData: {
                    ...state.selectedData,
                    analysisMethodParams: action.payload.analysisMethodParamsData.length !== 0 ?
                        action.payload.analysisMethodParamsData : []
                }
            }
        default:
            return state;
    }
}