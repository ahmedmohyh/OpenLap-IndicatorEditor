import {Backend, org_id, lrs_id} from "../../../backend";
// Request custom unique data
export function requestIndicatorsPreviewByUserNameML(userName) {
    return Backend.get("/AnalyticsEngine/GetIndicatorsPreviewByUserName", {
      params: {userName}
    })
  }

//   export function requestData(requestedData) {
//     return Backend.post("/v1/statements/list/customQueryUnique", requestedData, {
//       params: {OrganizationId: org_id, LrsId: lrs_id}
//     })
//   }
export function requestSaveIndicatorML(query) {
  return Backend.post("/AnalyticsEngine/SaveIndicatorML", query);
}


// Request Visualization Method Inputs
export function requestMultiLevelVisualizationPreviewML(query) {
  return Backend.post("/AnalyticsEngine/GetMLAIIndicatorPreview", query);
}
