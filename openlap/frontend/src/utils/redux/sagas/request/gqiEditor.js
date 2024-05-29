import {Backend} from "../../../../utils/backend";

export function requestActiveGoals() {
  return Backend.get("/AnalyticsEngine/GetActiveGoals");
}

export function requestAllQuestions() {
  return Backend.get("/AnalyticsEngine/GetQuestions");
}

export function requestValidateQuestion(question) {
  return Backend.get("/AnalyticsEngine/ValidateQuestionName",{params: {name: question}});
}

export function requestGetIndicatorsByQuestionId(questionId) {
  return Backend.get("/AnalyticsEngine/GetIndicatorsByQuestionId",  {params: {questionId: questionId}});
}

export function requestGetAllIndicators() {
  return Backend.get("/AnalyticsEngine/GetIndicators");
}
export function requestSaveQuestionAndIndicators(query) {
  return Backend.post("/AnalyticsEngine/SaveQuestionAndIndicators", query);
}

export function requestGetUserQuestionAndIndicators(userName) {
  return Backend.get("/AnalyticsEngine/GetIndicatorsByUserName", {params: {userName: userName}});
}