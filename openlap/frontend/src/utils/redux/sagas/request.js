import {Backend} from "../../backend";

export function requestGetUserQuestionAndIndicators(userName) {
  return Backend.get("/AnalyticsEngine/GetIndicatorsByUserName", {params: {userName: userName}});
}

export function requestGoals() {
  return Backend.get("/AnalyticsEngine/GetActiveGoals");
}

export function requestStatements() {
  return Backend.get("/v1/statements/list/customQueryAll?pageNumber=1&pageSize=15000");
}