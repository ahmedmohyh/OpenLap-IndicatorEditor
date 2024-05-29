import {Backend, org_id, lrs_id} from "../../../../utils/backend";
// Request custom unique data
export function requestIndicatorsPreviewByUserName(userName) {
    return Backend.get("/AnalyticsEngine/GetIndicatorsPreviewByUserName", {
      params: {userName}
    })
  }

//   export function requestData(requestedData) {
//     return Backend.post("/v1/statements/list/customQueryUnique", requestedData, {
//       params: {OrganizationId: org_id, LrsId: lrs_id}
//     })
//   }
export function requestSaveIndicator(query) {
  return Backend.post("/AnalyticsEngine/SaveIndicator", query);
}


// Request Visualization Method Inputs
export function requestCompositeVisualizationPreview(query) {
  return Backend.post("/AnalyticsEngine/GetCompositeIndicatorPreview", query);
}
