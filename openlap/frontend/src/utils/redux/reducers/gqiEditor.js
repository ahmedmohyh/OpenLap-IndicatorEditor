// Common
export const SET_ACTIVE_GQI_STEP = "setActiveStepEditor";
export const SET_COMPLETED_GQI_STEP = "setCompletedStepEditor";
export const RESET_GQI_SESSION = "gqiSessionReset";

// Goal
export const GET_ACTIVE_GOALS = 'getActiveGoalsFromAF';
export const SET_ACTIVE_GOALS = 'setActiveGoals';
export const SELECT_DESELECT_GOAL = 'selectDeselectGoal';

// Questions
export const VALIDATE_QUESTION = 'validateQuestion';
export const SET_VALIDATE_QUESTION = 'setValidateQuestion';

export const GET_ALL_QUESTIONS = 'getAllQuestions';
export const SET_ALL_QUESTIONS = 'setAllQuestions';
export const VALIDATE_QUESTION_NAME = 'validateQuestionName';
export const SELECT_DESELECT_QUESTION = 'selectDeselectQuestion';
export const CREATE_NEW_QUESTION = 'createNewQuestion';
export const SET_QUESTION_CONFIRMATION = 'setQuestionConfirmation';

// Indicator
export const GET_INDICATORS_BY_QUESTION_ID = 'getIndicatorsByQuestionId';
export const SET_INDICATORS_BY_QUESTION_ID = 'setIndicatorsByQuestionId';
export const GET_ALL_INDICATORS = 'getAllIndicators';
export const SET_ALL_INDICATORS = 'setAllIndicators';
export const SELECT_DESELECT_INDICATOR = 'selectDeselectIndicator';

export const ADDED_NEW_INDICATOR = 'addNewIndicator';
export const SAVE_QUESTION_AND_INDICATORS = 'saveQuestionAndIndicators';
export const SET_INDICATOR_RESPONSE_SAVE = 'setIndicatorSaveResponse';
export const ADD_NEW_QUESTION_AND_INDICATOR = 'addNewQuestionAndIndicators';
export const GET_USER_QUESTIONS_AND_INDICATORS = 'getUserQuestionsAndIndicators';
export const SET_USER_QUESTIONS_AND_INDICATORS = 'setUserQuestionsAndIndicators';
export const SET_PERSONALIZED_INDICATORS = 'setPersonalizedIndicators';
export const GET_QUESTION_NAME_VALIDATION = 'getQuestionNameValidation';
export const CONFIRM_QUESTION_NAME = 'confirmQuestionName';

// TODO: Check them again
export const CREATE_NEW_INDICATOR_REQUEST = "requestedToCreateNewIndicator"
export const DISCARD_NEW_INDICATOR_REQUEST = "discardNewIndicator";

// General reducers for GQIEditor
export const setActiveStep = (step) => ({
  type: SET_ACTIVE_GQI_STEP,
  payload: {step}
})
export const setCompletedStep = (steps) => ({
  type: SET_COMPLETED_GQI_STEP,
  payload: {steps}
})
export const resetSession = () => ({type: RESET_GQI_SESSION})

// Goals
export const getActiveGoals = () => ({
  type: GET_ACTIVE_GOALS
});
export const setActiveGoals = (goals) => ({
  type: SET_ACTIVE_GOALS,
  payload: {goals}
})
export const selectDeselectGoal = (goal) => ({
  type: SELECT_DESELECT_GOAL,
  payload: {goal}
})

// Question
export const validateQuestion = (question) => ({
  type: VALIDATE_QUESTION,
  payload: {question}
})
export const setValidateQuestion = (validQuestion) => ({
  type: SET_VALIDATE_QUESTION,
  payload: {validQuestion}
})
export const getAllQuestions = (question) => ({
  type: GET_ALL_QUESTIONS,
  payload: {question}
})
export const setAllQuestions = (questions) => ({
  type: SET_ALL_QUESTIONS,
  payload: {questions}
})
export const validateQuestionName = (question, available) => ({
  type: VALIDATE_QUESTION_NAME,
  payload: {question, available}
})
export const selectDeselectQuestion = (question) => ({
  type: SELECT_DESELECT_QUESTION,
  payload: {question}
})
export const createNewQuestion = (question) => ({
  type: CREATE_NEW_QUESTION,
  payload: {question}
})
export const setQuestionConfirmation = (confirmation) => ({
  type: SET_QUESTION_CONFIRMATION,
  payload: {confirmation}
})
export const setIndicatorSaveResponse = (indicatorSaveResponses) => ({
  type: SET_INDICATOR_RESPONSE_SAVE,
  payload: {indicatorSaveResponses}
})
// Indicators
export const getIndicatorsByQuestionId = (questionId) => ({
  type: GET_INDICATORS_BY_QUESTION_ID,
  payload: {questionId}
})
export const setIndicatorsByQuestionId = (indicatorList) => ({
  type: SET_INDICATORS_BY_QUESTION_ID,
  payload: {indicatorList}
})
export const getAllIndicators = () => ({
  type: GET_ALL_INDICATORS
})
export const setAllIndicators = (allIndicators) => ({
  type: SET_ALL_INDICATORS,
  payload: {allIndicators}
})
export const selectDeselectIndicator = (selectedIndicator) => ({
  type: SELECT_DESELECT_INDICATOR,
  payload: {selectedIndicator}
})
export const addNewIndicator = (indicatorResponseData) => ({
  type: ADDED_NEW_INDICATOR,
  payload: {indicatorResponseData}
})


export const saveQuestionAndIndicators = (questionAndIndicatorQueryData) => ({
  type: SAVE_QUESTION_AND_INDICATORS,
  payload: {questionAndIndicatorQueryData}
})

export const addNewQuestionAndIndicators = () => ({
  type: ADD_NEW_QUESTION_AND_INDICATOR
});

export const getUserQuestionsAndIndicators = () => ({
  type: GET_USER_QUESTIONS_AND_INDICATORS
})
export const setUserQuestionsAndIndicators = (userQuestionsAndIndicators) => ({
  type: SET_USER_QUESTIONS_AND_INDICATORS,
  payload: {userQuestionsAndIndicators}
})
export const setPersonalizedIndicators = (personalizedIndicators) => ({
  type: SET_PERSONALIZED_INDICATORS,
  payload: {personalizedIndicators}
})
export const getQuestionNameValidation = (questionName) => ({
  type: GET_QUESTION_NAME_VALIDATION,
  payload: {questionName}
})
export const confirmQuestionName = (questionName, confirm) => ({
  type: CONFIRM_QUESTION_NAME,
  payload: {questionName, confirm}
})

// Create New Indicator Modal actions
export const createNewIndicatorRequest = (indicatorType) => ({
  type: CREATE_NEW_INDICATOR_REQUEST,
  payload: {indicatorType}
})

export const discardNewIndicatorRequest = () => ({
  type: DISCARD_NEW_INDICATOR_REQUEST,
})

// Initial Redux store state for GQIEditor
const initialState = {
  common: {
    activeStep: 0,
    // activeStep: -1,
    validQuestion: undefined,
    completedStep: {},
    typedQuestion: "",
    questionConfirmed: false,
    gqiRedirect: false,
    indicatorType: "",
    userQuestionAndIndicators: [],
    userDefinedIndicators: [],
    listOfRecentlyGeneratedIndicators: [],
    listOfRecentlyGeneratedQuestions: [],
  },
  selectedData: {
    goal: {},
    question: {},
    indicators: [],
    indicatorResponseData: []
  },
  fetchedData: {
    activeGoals: [],
    questions: [],
    questionAvailable: 0,
    indicators: [],
  }
};

// Reducer functions
export default function activeGoalsReducer(state = initialState, action) {
  switch (action.type) {
    // Goals
    case SET_ACTIVE_GOALS:
      return {
        ...state,
        fetchedData: {...state.fetchedData, activeGoals: action.payload.goals}
      };
    case SELECT_DESELECT_GOAL:
      return {
        ...state,
        selectedData: {...state.selectedData, goal: action.payload.goal}
      }

    case SET_VALIDATE_QUESTION: {
      return {
        ...state,
        common: {
          ...state.common,
          validQuestion: action.payload.validQuestion
        }
      }
    }

    case SET_ALL_QUESTIONS: {
      return {
        ...state,
        fetchedData: {...state.fetchedData, questions: action.payload.questions}
      }
    }
    case VALIDATE_QUESTION_NAME: {
      return {
        ...state,
        common: {
          ...state.common,
          typedQuestion: action.payload.question
        },
        fetchedData: {
          ...state.fetchedData,
          questionAvailable: action.payload.available
        }
      }
    }
    case SELECT_DESELECT_QUESTION: {
      return {
        ...state,
        selectedData: {...state.selectedData, question: action.payload.question}
      }
    }
    case CREATE_NEW_QUESTION: {
      return {
        ...state,
        selectedData: {...state.selectedData, question: action.payload.question, indicators: []}
      }
    }
    case SET_QUESTION_CONFIRMATION: {
      return {
        ...state,
        common: {...state.common, questionConfirmed: action.payload.confirmation},
        fetchedData: {...state.fetchedData, questionAvailable: action.payload.confirmation}
      }
    }


    case SET_INDICATORS_BY_QUESTION_ID: {
      return {
        ...state,
        selectedData: {...state.selectedData, indicators: action.payload.indicatorList}
      }
    }
    case SET_ALL_INDICATORS: {
      const newSortedSelectedIndicators = action.payload.allIndicators.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return {
        ...state,
        fetchedData: {...state.fetchedData, indicators: newSortedSelectedIndicators}
      }
    }
    case SELECT_DESELECT_INDICATOR: {
      let currentSelectedIndicators = [];
      const validateIndicator = action.payload.selectedIndicator;
      // if true, this indicator is selected
      if (state.selectedData.indicators.some(ind => ind.id === validateIndicator.id)) {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            indicators: state.selectedData.indicators.filter(a => a.id !== validateIndicator.id)
          }
        }
      } else {
        currentSelectedIndicators.push(validateIndicator);
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            indicators: state.selectedData.indicators.concat(currentSelectedIndicators)
          }
        }
      }
    }

    case ADDED_NEW_INDICATOR: {
      let newIndicatorData = [];
      newIndicatorData.push(action.payload.indicatorResponseData);

      const newList = state.common.listOfRecentlyGeneratedIndicators.concat(newIndicatorData);

      const newSelectedIndicators = state.selectedData.indicators.concat(newIndicatorData);
      const newSortedSelectedIndicators = newSelectedIndicators.sort((a, b) => (a.name > b.name) ? 1 : -1);

      const newFetchedIndicators = state.fetchedData.indicators.concat(newIndicatorData);
      const newSortedFetchedIndicators = newFetchedIndicators.sort((a, b) => (a.name > b.name) ? 1 : -1);
      return {
        ...state,
        common: {
          ...state.common,
          listOfRecentlyGeneratedIndicators: newList
        },
        selectedData: {
          ...state.selectedData,
          indicators: newSortedSelectedIndicators
        },
        fetchedData: {
          ...state.fetchedData,
          indicators: newSortedFetchedIndicators
        }
      }
    }



    case SET_USER_QUESTIONS_AND_INDICATORS: {
      return {
        ...state,
        common: {
          ...state.common,
          userQuestionAndIndicators: action.payload.userQuestionsAndIndicators
        }
      }
    }
    case SET_PERSONALIZED_INDICATORS: {
      return {
        ...state,
        common: {
          ...state.common,
          userDefinedIndicators: action.payload.personalizedIndicators
        }
      }
    }
    case CONFIRM_QUESTION_NAME: {
      return {
        ...state,
        common: {
          ...state.common,
          questionConfirmed: action.payload.confirm
        },
        selectedData: {
          ...state.selectedData,
          question: {
            ...state.selectedData.question,
            name: action.payload.questionName
          }
        }
      }
    }


    case ADD_NEW_QUESTION_AND_INDICATOR: {
      let newQuestionAndIndicatorData = []
      newQuestionAndIndicatorData.push(state.selectedData)
      const newList = state.common.listOfRecentlyGeneratedQuestions.concat(newQuestionAndIndicatorData);
      return {
        ...state,
        common: {
          ...state.common,
          listOfRecentlyGeneratedQuestions: newList
        }
      }
    }

    case CREATE_NEW_INDICATOR_REQUEST:
      return {
        ...state,
        common: {
          ...state.common,
          gqiRedirect: true,
          indicatorType: action.payload.indicatorType
        }
      }

    case DISCARD_NEW_INDICATOR_REQUEST:
      return {
        ...state,
        common: {
          ...state.common,
          gqiRedirect: false
        }
      }


    // Common
    case RESET_GQI_SESSION:
      return {
        ...state,
        common: {
          ...state.common,
          activeStep: 0,
          completedStep: {},
          typedQuestion: "",
          gqiRedirect: false
        },
        selectedData: {
          ...state.selectedData,
          goal: {},
          question: {},
          indicators: [],
        },
        fetchedData: {
          ...state.fetchedData,
          activeGoals: [],
          questions: [],
          questionAvailable: 0,
          indicators: [],
        }
      };

    case SET_ACTIVE_GQI_STEP:
      return {
        ...state,
        common: {
          ...state.common,
          activeStep: action.payload.step}
      };

    case SET_COMPLETED_GQI_STEP:
      return {
        ...state,
        common: {...state.common, completedStep: action.payload.steps}
      };

    default:
      return state;
  }
}
