export const SET_ACTIVEUSER = 'setActiveUser';
export const USER_LOGIN = 'userLoggedIn';

export const userLogin = (data) => ({
  type: USER_LOGIN,
  email: data.email,
  password: data.password,
});


export const setActiveUser = () => ({
  type: SET_ACTIVEUSER,
});

const initialState = {
  isLoggedIn: false,
  userDetails: undefined
}


export default function loginReducer (state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVEUSER:
      return {
        ...state,
        isLoggedIn: !state.isLoggedIn,
      };
    default:
      return state;
  }
};