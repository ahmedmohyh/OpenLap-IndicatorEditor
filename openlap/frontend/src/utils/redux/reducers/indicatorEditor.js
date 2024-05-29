// Common
export const RESET_INDICATOR_SESSION = "resetIndicatorEditorSession";
export const SET_ACTIVE_INDICATOR_STEP = "setActiveStep";
export const SET_COMPLETED_INDICATOR_STEP = "setCompletedStep";

// Datasets
export const GET_ALL_PLATFORMS = "getAllPlatforms";
export const SET_ALL_PLATFORMS = "setAllPlatforms";
export const SELECT_PLATFORM = "selectPlatform";
export const GET_ACTIVITY_TYPES = "getActivityTypes";
export const SET_ACTIVITY_TYPES = "setActivityTypes";
export const SELECT_ACTIVITY_TYPES = "selectActivityTypes";
export const GET_ACTION_ON_ACTIVITIES = "getActionOnActivities";
export const SET_ACTION_ON_ACTIVITIES = "setActionOnActivities";
export const SELECT_ACTION_ON_ACTIVITIES = "selectActionOnActivities";

// Filters
export const SET_TIME_DURATION = "setTimeDuration";
export const SET_USERS = "setUsers";
export const SET_ACTIVITY_EXTENSION_ID = "setActivityExtensionId";
export const GET_ACTIVITY_EXTENSION_ID_VALUES = "getActivityExtensionIdValues";
export const SET_ACTIVITY_EXTENSION_ID_VALUES = "setActivityExtensionIdValues";
export const RESET_ACTIVITY_EXTENSION_ID_VALUES = "resetActivityExtensionIdValues";
export const SELECT_DESELECT_EXTENSION_ID = "selectDeselectExtensionId";
export const GET_ALL_FILTER_DATA = "getAllFilterData";
export const SET_ALL_FILTER_DATA = "setAllFilterData";
export const RESET_FILTER_DATA = "resetFilterData";
export const SELECT_DESELECT_ACTIVITY_NAME = "selectDeselectActivityName";
export const SELECT_DESELECT_CONTEXT_ACTIVITY = "selectDeselectContextActivity";
export const SELECT_DESELECT_RESULT = "selectDeselectResult";
export const SET_ACTIVITY_ATTRIBUTES = "setActivityAttributes";

// Analysis methods
export const GET_ANALYSIS_METHODS = "getAnalysisMethods";
export const SET_ANALYSIS_METHODS = "setAnalysisMethods";
export const SELECT_DESELECT_ANALYSIS_METHOD = "selectDeselectAnalysisMethods";
export const GET_ANALYSIS_METHOD_INPUTS = "getAnalysisMethodInputs";
export const SET_ANALYSIS_METHOD_INPUTS = "setAnalysisMethodInputs";
export const SELECT_DESELECT_ANALYSIS_METHOD_PARAMS = "selectDeselectAnalysisMethodParams";
export const SELECT_DESELECT_ANALYSIS_METHOD_MAPPING = "selectDeselectAnalysisMethodMapping";
export const SELECT_DESELECT_ANALYSIS_METHOD_MAP = "selectDeselectAnalysisMethodMap";
// export const GENERATE_QUERY_FOR_ANALYSIS = "generateQueryForAnalysis";

// Visualization methods
export const GET_ANALYSIS_METHOD_OUTPUTS = "getAnalysisMethodOutputs";
export const SET_ANALYSIS_METHOD_OUTPUTS = "setAnalysisMethodOutputs";
export const GET_VISUALIZATION_METHODS_AND_TYPES = "getVisualizationMethods&Types";
export const SET_VISUALIZATION_METHOD = "setVisualizationMethod";
export const SET_VISUALIZATION_TYPE = "setVisualizationType";
export const SET_VISUALIZATION_METHODS_AND_TYPES = "setVisualizationMethods&Types";
export const SELECT_DESELECT_VISUALIZATION_METHODS_AND_TYPES = "selectDeselectVisualizationMethods&Types";
export const GET_VISUALIZATION_METHOD_INPUTS = "getVisualizationMethodInputs";
export const SET_VISUALIZATION_METHOD_INPUTS = "setVisualizationMethodInputs";
export const SELECT_DESELECT_VISUALIZATION_MAPPING = "selectDeselectVisualizationMapping";
export const SELECT_DESELECT_VIS_MAPPING = "selectDeselectVisMapping";
export const GENERATE_INDICATOR_PREVIEW = "generateIndicatorPreview";
export const SAVE_INDICATOR_PREVIEW = "saveIndicatorPreview";
export const SET_GENERATED_VISUALIZATION_CODE = "setGeneratedVisualizationCode";
export const VALIDATE_INDICATOR_NAME = "validateIndicatorName";
export const SET_INDICATOR_NAME = "setIndicatorName";

export const INDICATOR_SAVED = "indicatorSaved";
export const GET_INDICATOR_DATA_FOR_EDIT = "getIndicatorDataForEdit";
export const SET_INDICATOR_DATA_FOR_EDIT = "setIndicatorDataForEdit";

// General reducers of indicators
// Resets the indicator editor session
export const resetIndicatorSession = () => ({
  type: RESET_INDICATOR_SESSION,
})
// To set the current step the user is working on
export const setActiveIndicatorStep = (step) => ({
  type: SET_ACTIVE_INDICATOR_STEP,
  payload: {
    step
  }
})
// To set the steps to true that user has completed
export const setCompletedIndicatorStep = (steps) => ({
  type: SET_COMPLETED_INDICATOR_STEP,
  payload: {
    steps
  }
})
// Platform
export const getAllPlatforms = () => ({
  type: GET_ALL_PLATFORMS,
});
export const setAllPlatforms = (data) => ({
  type: SET_ALL_PLATFORMS,
  payload: {data}
})
export const selectPlatform = (platforms) => ({
  type: SELECT_PLATFORM,
  payload: {platforms}
})
// ActivityTypes
export const getActivityTypes = (platform) => ({
  type: GET_ACTIVITY_TYPES,
  payload: {platform}
})
export const setActivityTypes = (activityTypes, language) => ({
  type: SET_ACTIVITY_TYPES,
  payload: {activityTypes, language}
})
export const selectActivityTypes = (activityTypes) => ({
  type: SELECT_ACTIVITY_TYPES,
  payload: {activityTypes}
})
export const setActivityExtensionId = (activityTypeExtensionId) => ({
  type: SET_ACTIVITY_EXTENSION_ID,
  payload: {activityTypeExtensionId}
})
// ActionOnActivities
export const getActionOnActivities = (platformData, selectedActivityTypes) => ({
  type: GET_ACTION_ON_ACTIVITIES,
  payload: {platformData, selectedActivityTypes}
})
export const setActionOnActivities = (actionOnActivitiesData) => ({
  type: SET_ACTION_ON_ACTIVITIES,
  payload: {actionOnActivitiesData}
})
export const selectDeselectActionOnActivities = (actionOnActivities) => ({
  type: SELECT_ACTION_ON_ACTIVITIES,
  payload: {actionOnActivities}
})
// Filter.js
export const setTimeDuration = (startDate, endDate) => ({
  type: SET_TIME_DURATION,
  payload: {startDate, endDate}
})
export const setUsers = (users) => ({
    type: SET_USERS,
    payload: {users}
  })
export const getAllFilterData = (selectedPlatform, selectedActivityTypes, selectActionOnActivities, languages) => ({
  type: GET_ALL_FILTER_DATA,
  payload: {selectedPlatform, selectedActivityTypes, selectActionOnActivities, languages}
})
export const setAllFilterData = (filterData) => ({
  type: SET_ALL_FILTER_DATA,
  payload: {filterData}
})
export const resetFilterData = () => ({
  type: RESET_FILTER_DATA,
})
export const selectDeselectActivityName = (selectedActivityName) => ({
  type: SELECT_DESELECT_ACTIVITY_NAME,
  payload: {selectedActivityName}
})
export const getActivityExtensionIdValues = (activityFeatures, details) => ({
  type: GET_ACTIVITY_EXTENSION_ID_VALUES,
  payload: {activityFeatures, details}
})
export const setActivityExtensionIdValues = (selectedExtensionId, selectedExtensionIdDetails, selectedExtensionIdDetailsValues) => ({
  type: SET_ACTIVITY_EXTENSION_ID_VALUES,
  payload: {selectedExtensionId, selectedExtensionIdDetails, selectedExtensionIdDetailsValues}
})
export const selectDeselectExtensionId = (selectedExtensionId) => ({
  type: SELECT_DESELECT_EXTENSION_ID,
  payload: {selectedExtensionId}
})
export const resetActivityExtensionIdValues = () => ({
  type: RESET_ACTIVITY_EXTENSION_ID_VALUES,
})
export const selectDeselectContextActivity = (selectedContextActivity, contextActivityData) => ({
  type: SELECT_DESELECT_CONTEXT_ACTIVITY,
  payload: {selectedContextActivity, contextActivityData}
})
export const selectDeselectResult = (selectedResult, resultData) => ({
  type: SELECT_DESELECT_RESULT,
  payload: {selectedResult, resultData}
})
export const setActivityAttributes = (attributes) => ({
  type: SET_ACTIVITY_ATTRIBUTES,
  payload: {attributes}
})

// Analysis Analysis
export const getAnalysisMethods = () => ({
  type: GET_ANALYSIS_METHODS
})
export const setAnalysisMethods = (analysisMethodsData) => ({
  type: SET_ANALYSIS_METHODS,
  payload: {analysisMethodsData}
})
export const selectDeselectAnalysisMethod = (selectedAnalysisMethod) => ({
  type: SELECT_DESELECT_ANALYSIS_METHOD,
  payload: {selectedAnalysisMethod}
})
export const getAnalysisMethodInputs = (selectedAnalysisMethod) => ({
  type: GET_ANALYSIS_METHOD_INPUTS,
  payload: {selectedAnalysisMethod}
})
export const setAnalysisMethodInput = (analysisMethodInputsData, analysisMethodParamsData) => ({
  type: SET_ANALYSIS_METHOD_INPUTS,
  payload: {analysisMethodInputsData, analysisMethodParamsData}
})
export const selectDeselectAnalysisMethodParams = (selectedAnalysisMethodParams) => ({
  type: SELECT_DESELECT_ANALYSIS_METHOD_PARAMS,
  payload: {selectedAnalysisMethodParams}
})
export const selectDeselectAnalysisMethodMapping = (selectedAnalysisMethodMapping, analysisMethodInputsData) => ({
  type: SELECT_DESELECT_ANALYSIS_METHOD_MAPPING,
  payload: {selectedAnalysisMethodMapping, analysisMethodInputsData}
})
export const selectDeselectAnalysisMethodMap = (selectedAnalysisMethodMapping) => ({
  type: SELECT_DESELECT_ANALYSIS_METHOD_MAP,
  payload: {selectedAnalysisMethodMapping}
})


// Visualize.jsx
export const getAnalysisMethodOutputs = (selectedAnalysisMethod) => ({
  type: GET_ANALYSIS_METHOD_OUTPUTS,
  payload: {selectedAnalysisMethod}
})
export const setAnalysisMethodOutput = (analysisMethodOutputsData) => ({
  type: SET_ANALYSIS_METHOD_OUTPUTS,
  payload: {analysisMethodOutputsData}
})
export const getVisualizationMethodsAndTypes = () => ({
  type: GET_VISUALIZATION_METHODS_AND_TYPES
});

export const setVisualizationMethod = (selectedVisualizationMethod) => ({
  type: SET_VISUALIZATION_METHOD,
  payload: {selectedVisualizationMethod}
});
export const setVisualizationType = (selectedVisualizationType) => ({
  type: SET_VISUALIZATION_TYPE,
  payload: {selectedVisualizationType}
});

export const setVisualizationMethodsAndTypes = (visualizationMethodsTypesData) => ({
  type: SET_VISUALIZATION_METHODS_AND_TYPES,
  payload: {visualizationMethodsTypesData}
})
export const selectDeselectVisualizationMethodsAndTypes = (selectedVisualizationMethodsTypes) => ({
  type: SELECT_DESELECT_VISUALIZATION_METHODS_AND_TYPES,
  payload: {selectedVisualizationMethodsTypes}
})
export const getVisualizationMethodInputs = (selectedVisualizationMethodId, selectionVisualizationTypeId) => ({
  type: GET_VISUALIZATION_METHOD_INPUTS,
  payload: {selectedVisualizationMethodId, selectionVisualizationTypeId}
})
export const setVisualizationMethodInputs = (visualizationMethodInputData) => ({
  type: SET_VISUALIZATION_METHOD_INPUTS,
  payload: {visualizationMethodInputData}
})
export const selectDeselectVisualizationMapping = (selectedVisualizationMapping, analysisMethodOutputsData, visualizationMethodInputsData) => ({
  type: SELECT_DESELECT_VISUALIZATION_MAPPING,
  payload: {selectedVisualizationMapping, analysisMethodOutputsData, visualizationMethodInputsData}
})
export const selectDeselectVisMapping = (selectedVisualizationMapping) => ({
  type: SELECT_DESELECT_VIS_MAPPING,
  payload: {selectedVisualizationMapping}
})
export const generateIndicatorPreview = (queryBuilder) => ({
  type: GENERATE_INDICATOR_PREVIEW,
  payload: {queryBuilder}
})
export const saveIndicatorPreview = (queryBuilder) => ({
  type: SAVE_INDICATOR_PREVIEW,
  payload: {queryBuilder}
})
export const setGeneratedVisualizationCode = (divData, scriptData, errorMessage) => ({
  type: SET_GENERATED_VISUALIZATION_CODE,
  payload: {divData, scriptData, errorMessage}
})
export const validateIndicatorName = (indicatorName) => ({
  type: VALIDATE_INDICATOR_NAME,
  payload: {indicatorName}
})
export const setIndicatorName = (indicatorName, available) => ({
  type: SET_INDICATOR_NAME,
  payload: {indicatorName, available}
})
export const indicatorSaved = () => ({
  type: INDICATOR_SAVED,
})
export const getIndicatorDataForEdit = (indicatorData) => ({
  type: GET_INDICATOR_DATA_FOR_EDIT,
  payload: {indicatorData}
})
export const setIndicatorDataForEdit = (indicatorData) => ({
  type: SET_INDICATOR_DATA_FOR_EDIT,
  payload: {indicatorData}
})



const initialState = {
  common: {
    activeStep: 0, completedStep: {}, indicatorSaved: false
  },
  selectedData: {
    platforms: [],
    activityTypes: [],
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
    filterUsers: [],
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

// Reducer functions
export default function editorReducer(state = initialState, action) {
  switch (action.type) {
    // Platform.js
    case SET_ALL_PLATFORMS:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          platforms: action.payload.data,
        },
      }
    case SELECT_PLATFORM:
      if (action.payload.platforms.length !== 0) {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            platforms: action.payload.platforms,
          },
        };
      } else {
        return {
          ...state,
          fetchedData: {
            ...state.selectedData,
            activityTypes: [],
            language: [],
            actionOnActivities: [],
          },
          selectedData: {
            ...state.selectedData,
            platforms: [],
            activityTypes: [],
            language: [],
            actionOnActivities: [],
          }
        }
      }

    //  ActivityTypes.js
    case SET_ACTIVITY_TYPES:
      // newAllActivityTypes -> Filter method to remove duplicates if the user has already selected
      // the activity type and later if the user selects a new source that has the same activity type
      let newAllActivityTypes =
        action.payload.activityTypes
          .filter(x => !state.selectedData.activityTypes
            .filter(y => y.type === x.type).length)
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityTypes: newAllActivityTypes,
          language: action.payload.language.length !== 0 ? action.payload.language : state.fetchedData.language
        }
      }
    case SET_ACTIVITY_EXTENSION_ID:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityExtensionId: action.payload.activityTypeExtensionId
        }
      }
    case SET_ACTIVITY_EXTENSION_ID_VALUES:
      let selectedExtensions = state.selectedData.activityExtensionId
        .filter(a => a.pId === action.payload.selectedExtensionId.id)
      let extensions = selectedExtensions.filter(a => a.id === action.payload.selectedExtensionIdDetails.id);
      let extensionValues = []
      extensions.forEach(value => {
        extensionValues.push(value.values)
      })
      let values = action.payload.selectedExtensionIdDetailsValues;
      let filtered = [].concat(
        values.filter(obj1 => extensionValues.every(obj2 => obj1.name !== obj2.name)),
        extensionValues.filter(obj2 => values.every(obj1 => obj2.name !== obj1.name))
      )
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityExtensionIdValue: filtered
        }
      }
    case RESET_ACTIVITY_EXTENSION_ID_VALUES:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityExtensionIdValue: []
        }
      }
    case SELECT_DESELECT_EXTENSION_ID:
      let newActivityExtensionId = [];
      action.payload.selectedExtensionId.forEach(value => {
        newActivityExtensionId = state.fetchedData.activityExtensionIdValue
          .filter(a => a.id !== value.values.id);
      })
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          activityExtensionId: action.payload.selectedExtensionId
        },
        fetchedData: {
          ...state.fetchedData,
          activityExtensionIdValue: newActivityExtensionId
        }
      }

    case SELECT_ACTIVITY_TYPES:
      if (action.payload.activityTypes.length !== 0) {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            activityTypes: action.payload.activityTypes,
          },
        };
      } else {
        return {
          ...state,
          fetchedData: {
            ...state.fetchedData,
            actionOnActivities: [],
          },
          selectedData: {
            ...state.selectedData,
            activityTypes: [],
            language: [],
            actionOnActivities: [],
          }
        }
      }


    // ActionOnActivities.js
    case SET_ACTION_ON_ACTIVITIES:
      let actionActivityData = action.payload.actionOnActivitiesData;
      if (actionActivityData.length !== 0) {
        state.selectedData.actionOnActivities.forEach(data => {
          actionActivityData = actionActivityData.filter(a => a.type !== data.type);
        })
      }
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          actionOnActivities: action.payload.actionOnActivitiesData
        }
      }
    case SELECT_ACTION_ON_ACTIVITIES:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          actionOnActivities: action.payload.actionOnActivities
        },
      };


    //  Filter.js
    case SET_TIME_DURATION:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          timeDuration: {
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
          }
        }
      }
      case SET_USERS:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          filterUsers: action.payload.users
        }
      }
    case SET_ALL_FILTER_DATA:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityName: action.payload.filterData.activityName.length !== 0 ? action.payload.filterData.activityName : [],
          contextActivities: action.payload.filterData.contextActivities !== 0 ? action.payload.filterData.contextActivities : [],
          result: action.payload.filterData.result !== 0 ? action.payload.filterData.result : [],
        }
      }
    case RESET_FILTER_DATA:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          activityName: [],
          activityExtensionId: [],
          contextActivities: [],
          result: [],
          analysisMethod: [],
          analysisMethodParams: [],
          mappingAnalysisInputAttributesData: [],
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
          ...state.fetchedData,
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
        },
      }
    case SELECT_DESELECT_ACTIVITY_NAME:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          activityName: action.payload.selectedActivityName.length !== 0 ? action.payload.selectedActivityName : []
        },
        // fetchedData: {
        //   ...state.fetchedData,
        //   activityName: action.payload.activityNameData.length !== 0 ? action.payload.activityNameData : []
        // }
      }
    case SELECT_DESELECT_CONTEXT_ACTIVITY:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          contextActivities: action.payload.selectedContextActivity.length !== 0 ? action.payload.selectedContextActivity : []
        },
        fetchedData: {
          ...state.fetchedData,
          contextActivities: action.payload.contextActivityData.length !== 0 ? action.payload.contextActivityData : []
        }
      }
    case SELECT_DESELECT_RESULT:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          result: action.payload.selectedResult.length !== 0 ? action.payload.selectedResult : []
        },
        fetchedData: {
          ...state.fetchedData,
          result: action.payload.resultData.length !== 0 ? action.payload.resultData : []
        }
      }
    case SET_ACTIVITY_ATTRIBUTES:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          activityAttributes: action.payload.attributes,
        }
      }

    // Analysis.js
    case SET_ANALYSIS_METHODS:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          analysisMethods: action.payload.analysisMethodsData
        }
      }
    case SELECT_DESELECT_ANALYSIS_METHOD:
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
                fetchedData: {
                    ...state.fetchedData,
                    analysisMethodInputs: [],
                },
                selectedData: {
                  ...state.selectedData,
                  analysisMethod: [],
                  mappingAnalysisInputAttributesData: []
                }
            }
        }
    case SET_ANALYSIS_METHOD_INPUTS:
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
    case SELECT_DESELECT_ANALYSIS_METHOD_PARAMS:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          analysisMethodParams: action.payload.selectedAnalysisMethodParams.length !== 0 ? action.payload.selectedAnalysisMethodParams : []
        }
      }
    case SELECT_DESELECT_ANALYSIS_METHOD_MAPPING:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          mappingAnalysisInputAttributesData: action.payload.selectedAnalysisMethodMapping.length !== 0 ?
            action.payload.selectedAnalysisMethodMapping : []
        },
        fetchedData: {
          ...state.fetchedData,
          analysisMethodInputs: action.payload.analysisMethodInputsData.length !== 0 ?
            action.payload.analysisMethodInputsData : [],
        }
      }
    case SELECT_DESELECT_ANALYSIS_METHOD_MAP:
        let updatedAnalysisMapping = state.selectedData.mappingAnalysisInputAttributesData;

        if (action.payload.selectedAnalysisMethodMapping.length != 0) {
            const payload = action.payload.selectedAnalysisMethodMapping[0];

            if (payload.output === null) {
                // Selection is removed -> remove array from state.
                updatedAnalysisMapping = updatedAnalysisMapping.filter(a => a.inputPort.id !== payload.input.id);
            } else {
                updatedAnalysisMapping = updatedAnalysisMapping.filter(a => a.inputPort.id !== payload.input.id);
        
                updatedAnalysisMapping.push({
                inputPort: payload.input,
                outputPort: payload.output
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

    //  Visualize.jsx
    case SET_ANALYSIS_METHOD_OUTPUTS:
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          analysisMethodOutputs: action.payload.analysisMethodOutputsData.length !== 0 ?
            action.payload.analysisMethodOutputsData : []
        }
      }
    case SET_VISUALIZATION_METHOD: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          visualizationMethod: action.payload.selectedVisualizationMethod
        }
      }
    }
    case SET_VISUALIZATION_TYPE: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          visualizationType: action.payload.selectedVisualizationType
        }
      }
    }
    case SET_VISUALIZATION_METHODS_AND_TYPES: {
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          visualizationMethodsAndTypes:
            action.payload.visualizationMethodsTypesData.length !== 0 ?
              action.payload.visualizationMethodsTypesData
              : []
        }
      }
    }
    case SELECT_DESELECT_VISUALIZATION_METHODS_AND_TYPES: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          visualizationMethodsAndTypes:
            action.payload.selectedVisualizationMethodsTypes.length !== 0 ?
              action.payload.selectedVisualizationMethodsTypes
              : []
        }
      }
    }
    case SET_VISUALIZATION_METHOD_INPUTS: {
      return {
        ...state,
        fetchedData: {
          ...state.fetchedData,
          visualizationMethodInputs:
            action.payload.visualizationMethodInputData.length !== 0 ?
              action.payload.visualizationMethodInputData : []
        }
      }
    }
    case SELECT_DESELECT_VISUALIZATION_MAPPING:
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          mappingVizInputAnalysisOutput: action.payload.selectedVisualizationMapping.length !== 0 ?
            action.payload.selectedVisualizationMapping : []
        },
        fetchedData: {
          ...state.fetchedData,
          analysisMethodOutputs: action.payload.analysisMethodOutputsData.length !== 0 ?
            action.payload.analysisMethodOutputsData : [],
          visualizationMethodInputs: action.payload.visualizationMethodInputsData.length !== 0 ?
            action.payload.visualizationMethodInputsData : []
        }
      }
      case SELECT_DESELECT_VIS_MAPPING:
        let updatedMapping = state.selectedData.mappingVizInputAnalysisOutput;

        if (action.payload.selectedVisualizationMapping.length != 0) {
            const payload = action.payload.selectedVisualizationMapping[0];

            if (payload.output === null) {
                // Selection is removed -> remove array from state.
                updatedMapping = updatedMapping.filter(a => a.inputPort.id !== payload.input.id);
            } else {
                updatedMapping = updatedMapping.filter(a => a.inputPort.id !== payload.input.id);

                updatedMapping.push({
                inputPort: payload.input,
                outputPort: payload.output
                });
            }
        }

        return {
            ...state,
            selectedData: {
            ...state.selectedData,
            mappingVizInputAnalysisOutput: action.payload.selectedVisualizationMapping.length === 0 ? [] : updatedMapping
            }
        };
    case SAVE_INDICATOR_PREVIEW: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          indicatorPreview: action.payload.queryBuilder
        }
      }
    }
    case SET_GENERATED_VISUALIZATION_CODE: {
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
    case SET_INDICATOR_NAME: {
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          indicatorName: {
            ...state.selectedData.indicatorName,
            name: action.payload.indicatorName,
            available: action.payload.available,
            confirmed: !state.selectedData.indicatorName.confirmed
          }
        }
      }
    }

    case SET_INDICATOR_DATA_FOR_EDIT: {
      const {
        platforms,
        activityTypes,
        activityName,
        actionOnActivities,
        indicatorName,
        mappingVizInputAnalysisOutput,
        mappingAnalysisInputAttributesData,
        timeDuration,
        analysisMethod: {method},
        vizMethodType: {vizMethod},
      } = action.payload.indicatorData;

      let vizInput = [];
      let analysisOutput = [];
      mappingVizInputAnalysisOutput.forEach(vizData => {
        let {inputPort} = vizData;
        let {outputPort} = vizData;
        vizInput.push(inputPort);
        analysisOutput.push(outputPort);
      })
      let analysisInput = [];
      mappingAnalysisInputAttributesData.forEach(analysisData => {
        let {inputPort} = analysisData;
        analysisInput.push(inputPort);
      })

      return {
        ...state,
        common: {
          ...state.common,
          activeStep: 3,
          completedStep: {0: true, 1: true, 2: true, 3: true}
        },
        selectedData: {
          ...state.selectedData,
          platforms,
          activityTypes,
          actionOnActivities,
          indicatorName: {
            ...state.selectedData.indicatorName,
            name: indicatorName
          },
          mappingVizInputAnalysisOutput,
          mappingAnalysisInputAttributesData,
          timeDuration,
          activityName,
          analysisMethod: method,
          visualizationMethodsAndTypes: vizMethod
        },
        fetchedData: {
          ...state.fetchedData,
          visualizationMethodInputs: vizInput,
          analysisMethodOutputs: analysisOutput,
          analysisMethodInputs: analysisInput
        }
      }
    }

    // Common
    case INDICATOR_SAVED: {
      return {
        ...state,
        common: {
          ...state.common,
          indicatorSaved: true
        }
      }
    }
    case RESET_INDICATOR_SESSION:
      return {
        common: {
          ...state.common,
          activeStep: 0, completedStep: {}, indicatorSaved: false
        },
        selectedData: {
          ...state.selectedData,
          platforms: [],
          activityTypes: [],
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
            ...state.selectedData.timeDuration,
            startDate: "",
            endDate: ""
          },
          indicatorName: {
            ...state.selectedData.indicatorName,
            name: "",
            available: true,
            confirmed: false,
          },
          indicatorPreview: {}
        },
        fetchedData: {
          ...state.fetchedData,
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
            ...state.fetchedData.visualizationCode,
            displayCode: "",
            scriptCode: "",
            errorMessage: ""
          }
        }
      }
    case SET_ACTIVE_INDICATOR_STEP:
      return {
        ...state,
        common: {
          ...state.common,
          activeStep: action.payload.step
        }
      };
    case SET_COMPLETED_INDICATOR_STEP:
      return {
        ...state,
        common: {
          ...state.common,
          completedStep: action.payload.steps
        }
      };

    // Default
    default:
      return state;
  }
};
