export const RESET_ERRORS = "resetAllErrors";
export const CONNECTION_ERROR_PLATFORM = "setConnectionErrorPlatform";
export const CONNECTION_ERROR_ACTIVITY_TYPE = "setConnectionErrorActivityType";
export const CONNECTION_ERROR_ACTION_ON_ACTIVITY = "setConnectionErrorActionOnActivity";
export const CONNECTION_ERROR_ALL_FILTER_DATA = "setConnectionErrorAllFilterData";
export const CONNECTION_ERROR_ANALYSIS_METHOD = "setConnectionErrorAnalysisMethod";
export const CONNECTION_ERROR_ANALYSIS_METHOD_INPUTS = "setConnectionErrorAnalysisMethodInputs";
export const CONNECTION_ERROR_ANALYSIS_METHOD_OUTPUT = "setConnectionErrorAnalysisMethodOutput";
export const CONNECTION_ERROR_FILTER_ACTIVITIES = "setConnectionErrorFilterActivities";

// Errors
export const resetAllErrors = () => ({type: RESET_ERRORS})
export const setConnectionErrorPlatform = (errorMessage) => ({
  type: CONNECTION_ERROR_PLATFORM,
  payload: {errorMessage}
});
export const setConnectionErrorActivityType = (errorMessage) => ({
  type: CONNECTION_ERROR_ACTIVITY_TYPE,
  payload: {errorMessage}
});
export const setConnectionErrorActionOnActivity = (errorMessage) => ({
  type: CONNECTION_ERROR_ACTION_ON_ACTIVITY,
  payload: {errorMessage}
});
export const setConnectionErrorAllFilterData = (errorMessage) => ({
  type: CONNECTION_ERROR_ALL_FILTER_DATA,
  payload: {errorMessage}
});
export const setConnectionErrorAnalysisMethod = (errorMessage) => ({
  type: CONNECTION_ERROR_ANALYSIS_METHOD,
  payload: {errorMessage}
});
export const setConnectionErrorAnalysisMethodInputs = (errorMessage) => ({
  type: CONNECTION_ERROR_ANALYSIS_METHOD_INPUTS,
  payload: {errorMessage}
});
export const setConnectionErrorAnalysisMethodOutput = (errorMessage) => ({
  type: CONNECTION_ERROR_ANALYSIS_METHOD_OUTPUT,
  payload: {errorMessage}
});
export const setConnectionErrorFilterActivities = (errorMessage) => ({
  type: CONNECTION_ERROR_FILTER_ACTIVITIES,
  payload: {errorMessage}
});

const initialState = {
  connectionErrors: {
    platform: false,
    activityType: false,
    actionOnActivity: false,
    filter: false,
    analysisMethod: false,
    analysisMethodInputs: false,
    analysisMethodOutput: false,
    activitiesMethodOutput: false,
  }
}

export default function errorMessages(state = initialState, action) {
  switch (action.type) {
    case CONNECTION_ERROR_PLATFORM: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          platform: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ACTIVITY_TYPE: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          activityType: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ACTION_ON_ACTIVITY: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          actionOnActivity: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ALL_FILTER_DATA: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          filter: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ANALYSIS_METHOD: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          analysisMethod: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ANALYSIS_METHOD_INPUTS: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          analysisMethodInputs: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_ANALYSIS_METHOD_OUTPUT: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          analysisMethodOutput: action.payload.errorMessage
        }
      }
    }
    case CONNECTION_ERROR_FILTER_ACTIVITIES: {
      return {
        ...state,
        connectionErrors: {
          ...state.connectionErrors,
          activitiesMethodOutput: action.payload.errorMessage
        }
      }
    }
    case RESET_ERRORS: {
      return {
        ...state,
        platform: false,
        activityType: false,
        actionOnActivity: false,
        filter: false
      }
    }
    // Default
    default:
      return state;
  }
}