import { call, put } from "redux-saga/effects";
import {
  requestGetUserQuestionAndIndicators,
  requestGoals,
  requestStatements,
} from "./request";
import {
  setUserGeneratedIndicators,
  setUserQuestionsAndIndicators,
} from "../reducers/reducer";
import { setGoals } from "../reducers/editor";
import { setStatements } from "../reducers/csvxapiReducer";

export function* handleGetUserQuestionsAndIndicators() {
  const parsedUser = JSON.parse(sessionStorage.getItem("openlapUser"));
  const userName = parsedUser.email;
  try {
    let response = yield call(requestGetUserQuestionAndIndicators, userName);
    yield put(setUserQuestionsAndIndicators(response.data));
    yield put(setUserGeneratedIndicators(response.data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetGoals() {
  try {
    const response = yield call(requestGoals);
    yield put(setGoals(response.data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetStatements() {
  try {
    const response = yield call(requestStatements);
    yield put(setStatements(response.data));
  } catch (error) {
    console.log(error);
  }
}