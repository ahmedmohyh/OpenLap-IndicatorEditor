export const SET_THEME = "Theme changed"
export const SET_SIDEBAR_MENU = "Sidebar menu changed";
export const GET_USER_QUESTIONS_AND_INDICATORS = "Fetch user's questions and indicators";
export const SET_USER_QUESTIONS_AND_INDICATORS = "Store user generated questions and it's associated indicators";
export const SET_USER_GENERATED_INDICATORS = "Store user generated indicators";

export const setTheme = (value) => ({
  type: SET_THEME,
  value
});

export const setSidebarMenu = (value) => ({
  type: SET_SIDEBAR_MENU,
  value,
});

export const getUserQuestionsAndIndicators = () => ({
  type: GET_USER_QUESTIONS_AND_INDICATORS
})

export const setUserQuestionsAndIndicators = (questionsAndIndicators) => ({
  type: SET_USER_QUESTIONS_AND_INDICATORS,
  payload: {questionsAndIndicators}
})

export const setUserGeneratedIndicators = (definedIndicators) => ({
  type: SET_USER_GENERATED_INDICATORS,
  payload: {definedIndicators}
})


const initialState = {
  themeMode: false,
  sidebarMenu: '/indicator',
  user: {
    questionsAndIndicators: [],
    definedIndicators: []
  }
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      return {...state, themeMode: action.value}

    case SET_SIDEBAR_MENU:
      return {...state, sidebarMenu: action.value};

    case SET_USER_QUESTIONS_AND_INDICATORS: {
      return {
        ...state,
        user: {
          ...state.user,
          questionsAndIndicators: action.payload.questionsAndIndicators
        }
      }
    }
    case SET_USER_GENERATED_INDICATORS: {
      return {
        ...state,
        user: {
          ...state.user,
          definedIndicators: action.payload.definedIndicators
        }
      }
    }
    default:
      return state
  }
}
