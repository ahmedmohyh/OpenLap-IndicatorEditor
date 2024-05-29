export const SET_STEP_EDITOR = "Set step in editor";
export const GET_GOALS = "Fetch list of goals";
export const SET_GOALS = "Store list of goals";
export const SELECT_GOAL = "User selected a goal";

export const setStepEditor = (step) => ({
  type: SET_STEP_EDITOR,
  step
});

export const getGoals = () => ({
  type: GET_GOALS
});

export const setGoals = (goals) => ({
  type: SET_GOALS,
  goals
});

export const selectGoal = (goal) => ({
  type: SELECT_GOAL,
  goal
})

const initialState = {
  common: {
    step: -1
  },
  selectedData: {
    goal: {},
    question: {},
    indicators: [],
    indicatorResponseData: []
  },
  fetchedData: {
    goals: [],
    questions: [],
    questionAvailable: 0,
    indicators: [],
  }
};

export default function editorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STEP_EDITOR:
      return {...state, common: {...state.common, step: action.step}};
    case SET_GOALS:
      return {...state, fetchedData: {...state.fetchedData, goals: action.goals}};
    case SELECT_GOAL:
      return {...state, selectedData: {...state.selectedData, goal: action.goal}}
    default:
      return state;
  }

}
