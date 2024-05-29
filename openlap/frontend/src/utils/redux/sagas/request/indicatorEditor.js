import {Backend, org_id, lrs_id} from "../../../../utils/backend";
console.log('org_id',org_id)

// Request custom unique data
export function requestData(requestedData) {
  return Backend.post("/v1/statements/list/customQueryUnique", requestedData, {
    params: {OrganizationId: org_id, LrsId: lrs_id}
  })
}

// Request activity extension ids
export function requestActivityTypeExtensionIds(selectedActivityType) {
  return Backend.get("/AnalyticsEngine/getActivityTypeExtensionId",
    {params: {type: encodeURIComponent(selectedActivityType)}})
}

// Request activity extension features
export function requestActivityExtensionIdOptions(selectedActivityType, selectedExtensionId) {
  return Backend.get("/AnalyticsEngine/getActivityTypeExtensionProperties",
    {params: {type: encodeURIComponent(selectedActivityType), extensionId: encodeURIComponent(selectedExtensionId)}});
}

// Request activity extension feature values
export function requestGetActivitiesExtensionContextValues(extensionId, attribute) {
  return Backend.get("/AnalyticsEngine/getActivityTypeExtensionPropertyValues",
    {params: {extensionId: extensionId, attribute: attribute}});
}

// Request Analysis Analysis
export function requestAnalysisMethods() {
  return Backend.get("/AnalyticsEngine/GetAnalyticsMethods");
}

// Request Analysis Method Inputs
export function requestAnalysisMethodInputs(id) {
  return Backend.get("/AnalyticsEngine/GetAnalyticsMethodInputs", {params: {id: id}});
}

export function requestAnalysisMethodParams(id) {
  return Backend.get("/AnalyticsEngine/GetAnalyticsMethodParams", {params: {id: id}});
}

// Request Analysis Method Outputs
export function requestAnalysisMethodOutputs(id) {
  return Backend.get("/AnalyticsEngine/GetAnalyticsMethodOutputs", {params: {id: id}});
}

// Request Visualization Analysis and Types
export function requestVisualizationMethodsAndTypes() {
  return Backend.get(`/AnalyticsEngine/GetVisualizations`);
}

// Request Visualization Method Inputs
export function requestVisualizationMethodInputs(frameworkId, methodId) {
  return Backend.get("/AnalyticsEngine/GetVisualizationMethodInputs", {
    params: {frameworkId: frameworkId, methodId: methodId}
  });
}

// Request Visualization Method Inputs
export function requestVisualizationPreview(query) {
  return Backend.post("/AnalyticsEngine/GetIndicatorPreview", query);
}

// Request Indicator name validation
export function requestValidateIndicatorName(indicatorName) {
  return Backend.get("/AnalyticsEngine/ValidateIndicatorName", {params: {name: indicatorName}});
}

