import {
  setActiveGoals,
  setAllIndicators,
  setAllQuestions,
  setIndicatorSaveResponse,
  setIndicatorsByQuestionId,
  validateQuestionName, setUserQuestionsAndIndicators, setPersonalizedIndicators, setValidateQuestion
} from "../../reducers/gqiEditor";
import {call, put} from 'redux-saga/effects';
import {
  requestActiveGoals,
  requestAllQuestions,
  requestGetAllIndicators,
  requestGetIndicatorsByQuestionId, requestGetUserQuestionAndIndicators,
  requestSaveQuestionAndIndicators,
  requestValidateQuestion
} from "../request/gqiEditor";

export function* handleGetActiveGoals() {
  try {
    const response = yield call(requestActiveGoals);
    yield put(setActiveGoals(response.data));
  } catch (error) {
    console.log(error);
  }
}
export function* handleValidateQuestion(action) {
  let question = action.payload.question;
  try {
    const response = yield call(requestValidateQuestion, question);
    yield put(setValidateQuestion(response.data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetAllQuestions(action) {
  let question = action.payload.question;
  try {
    let questionList = yield call(requestAllQuestions);
    yield put(setAllQuestions(questionList.data));
    try {
      let validation = yield call(requestValidateQuestion, question);
      yield put(validateQuestionName(question, validation.data));
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetIndicatorsByQuestionId(action) {
  let questionId = action.payload.questionId;
  try {
    let indicatorList = yield call(requestGetIndicatorsByQuestionId, questionId);
    yield put(setIndicatorsByQuestionId(indicatorList.data));
    try {
      let allIndicators = yield call(requestGetAllIndicators);
      yield put(setAllIndicators(allIndicators.data));
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetAllIndicators() {
  try {
    let allIndicators = yield call(requestGetAllIndicators);
    yield put(setAllIndicators(allIndicators.data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleSaveQuestionAndIndicators(action) {
  let query = action.payload.questionAndIndicatorQueryData;
  try {
    let response = yield call(requestSaveQuestionAndIndicators, query);
    const {data: {indicatorSaveResponses}} = response;
    yield put(setIndicatorSaveResponse(indicatorSaveResponses));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetUserQuestionsAndIndicators() {
  const parsedUser = JSON.parse(localStorage.getItem('openlapUser'));
  const userName = parsedUser.email;
  try {
    let response = yield call(requestGetUserQuestionAndIndicators, userName);
    console.log('response~~',response.data)
    yield put(setUserQuestionsAndIndicators(response.data));
    let personalIndicators = [];
    response.data.forEach(questionIndicators => {
      questionIndicators.indicators.forEach(indicator => {
        if (indicator.createdBy === userName && personalIndicators.filter(a => a.id === indicator.id).length === 0)
          personalIndicators.push(indicator);
      })
    })
    yield put(setPersonalizedIndicators(personalIndicators));
  } catch (error) {
    console.log(error);
  }
}
export function* handleGetQuestionNameValidation(action) {
  let question = action.payload.questionName;
  try {
    let validation = yield call(requestValidateQuestion, question);
    yield put(validateQuestionName(question, validation.data));
  } catch (error) {
    console.log(error)
  }
}
