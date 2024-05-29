import {call, put} from 'redux-saga/effects';
import {v4 as uuid4} from 'uuid';
import parse from "html-react-parser";
import {
  setActionOnActivities, setActivityAttributes,
  setActivityExtensionId,
  setActivityExtensionIdValues,
  setActivityTypes,
  setAllFilterData,
  setAllPlatforms,
  setAnalysisMethodInput,
  setAnalysisMethodOutput,
  setAnalysisMethods,
  setGeneratedVisualizationCode,
  setIndicatorDataForEdit,
  setIndicatorName, setVisualizationMethod,
  setVisualizationMethodInputs,
  setVisualizationMethodsAndTypes, setVisualizationType
} from "../../reducers/indicatorEditor";
import {
  requestActivityExtensionIdOptions,
  requestActivityTypeExtensionIds,
  requestAnalysisMethodInputs,
  requestAnalysisMethodOutputs,
  requestAnalysisMethodParams,
  requestAnalysisMethods,
  requestData,
  requestGetActivitiesExtensionContextValues,
  requestValidateIndicatorName,
  requestVisualizationMethodInputs,
  requestVisualizationMethodsAndTypes,
  requestVisualizationPreview
} from "../request/indicatorEditor";
import {cleaningResponseData, toFirstCharUppercase} from "../../../../utils/assets/functions/functions";
import {populateIndicatorQueryData, queryEngine, responseDataStorageWrapper} from "../../../ruleEngine/ruleGenerator";
import {
  setConnectionErrorActionOnActivity,
  setConnectionErrorActivityType,
  setConnectionErrorAnalysisMethod,
  setConnectionErrorAnalysisMethodInputs, setConnectionErrorAnalysisMethodOutput,
  setConnectionErrorFilterActivities,
  setConnectionErrorPlatform
} from "../../reducers/errorMessages";
import {attributeDataFunction} from "../../../../pages/Editor/Indicators/BasicIndicator/StepAnalysis/attributeData"

// const lang = "de";
const lang = "en-US";

export function* handleGetAllPlatforms() {
  try {
    const query = {type: "PLATFORM"}
    const requestPlatform = queryEngine(query);
    const response = yield call(requestData, requestPlatform);
    const {data} = response;
    if (data !== undefined) {
      const sortedArray = (data.columns["statement.context.platform"].data).sort((a, b) => a.localeCompare(b));
      const platformArray = [];
      sortedArray.forEach(data => {
        platformArray.push({
          id: uuid4(),
          type: "statement.context.platform",
          name: data,
        });
      })
      yield put(setAllPlatforms(platformArray));
    }
  } catch (error) {
    yield put(setConnectionErrorPlatform(true));
  }
}

export function* handleGetActivityTypes(action) {
  try {
    const query = {type: "ACTIVITY_TYPES", query: {platform: action.payload.platform}}
    const requestedActivityType = queryEngine(query);
    const response = yield call(requestData, requestedActivityType);
    const {data} = response;
    if (data !== undefined) {
      const typeData = data.columns["statement.object.definition.type"].data;
      const languageData = data.columns["statement.context.language"].data;
      let typeList = [];
      typeData.forEach(data => {
        const typeCleaned = toFirstCharUppercase(cleaningResponseData(data));
        typeList.push({id: uuid4(), type: data, name: typeCleaned});
      });
      typeList = typeList.sort((a, b) => (a.name > b.name) ? 1 : -1);
      let languageList = [];
      languageData.forEach(data => {
        languageList.push({id: uuid4(), name: data})
      });
      yield put(setActivityTypes(typeList, languageList));
    }
  } catch (error) {
    yield put(setConnectionErrorActivityType(true));
  }
}

export function* handleGetActionOnActivities(action) {
  try {
    const query = {
      type: "ACTION_ON_ACTIVITIES",
      query: {platform: action.payload.platformData, activityTypes: action.payload.selectedActivityTypes}
    }
    const requestedActionOnActivity = queryEngine(query);
    let response = yield call(requestData, requestedActionOnActivity);
    const {data} = response;
    if (data !== undefined) {
      const actionData = data.columns["statement.verb.id"].data;
      let actionList = [];
      actionData.forEach(data => {
        const cleanedName = cleaningResponseData(data);
        actionList.push({id: uuid4(), type: data, name: cleanedName});
      });
      actionList = actionList.sort((a, b) => (a.name > b.name) ? 1 : -1);
      yield put(setActionOnActivities(actionList));
    }
  } catch (error) {
    yield put(setConnectionErrorActionOnActivity(true));
  }
}

export function* handleGetActivityExtensionIdValues(action) {
  try {
    const selectedActivityFeatures = action.payload.activityFeatures;
    const selectedActivityFeatureDetail = action.payload.details;
    const extensionId = encodeURIComponent(selectedActivityFeatures.type);
    const attribute = selectedActivityFeatureDetail.name
    const response = yield call(requestGetActivitiesExtensionContextValues, extensionId, attribute);
    const {data: {columns: {[attribute]: {data}}}} = response;
    let value = data.sort((a, b) => (a > b) ? 1 : -1);
    value = value.filter(Boolean)
    let extensionData = [];
    value.forEach(data => {
      extensionData.push({
        id: uuid4(),
        name: data
      })
    })
    yield put(setActivityExtensionIdValues(selectedActivityFeatures, selectedActivityFeatureDetail, extensionData))
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetAllFilterData(action) {
  try {
    const query = {
      type: "GET_ALL_FILTER_DATA",
      query: {
        platform: action.payload.selectedPlatform,
        activityTypes: action.payload.selectedActivityTypes,
        actionOnActivities: action.payload.selectActionOnActivities
      },
      // languages: action.payload.languages
      languages: [{id: uuid4(), name: lang}]
    }
    const requestedAllFilterData = queryEngine(query);
    const response = yield call(requestData, requestedAllFilterData);
    const {data} = response;
    if (data !== undefined) {
      const filterData = responseDataStorageWrapper(data, action.payload.languages);
      yield put(setAllFilterData(filterData));
    }
    // Requests Activity Extension Ids and saves in store
    try {
      const activityTypes = action.payload.selectedActivityTypes;
      let currentActivityExtensionId = [];
      for (let activityType of activityTypes) {
        let response = yield call(requestActivityTypeExtensionIds, activityType.type);
        let {data: {columns: {activityExtensionIds: {data}}}} = response;
        if (data !== undefined) {
          for (let extensionId of data) {
            let incomingActivityExtensionId = []
            try {
              let responseExtensionId = yield call(requestActivityExtensionIdOptions, activityType.type, extensionId);
              const {data: {columns: {activityProperties: {data}}}} = responseExtensionId;
              let extensionCleaned = toFirstCharUppercase(cleaningResponseData(extensionId));
              let valueList = data.sort((a, b) => (a > b) ? 1 : -1);
              let valueListUuid = [];
              for (let list of valueList) {
                valueListUuid.push({id: uuid4(), name: list})
              }
              incomingActivityExtensionId.push({
                id: uuid4(),
                type: extensionId,
                name: extensionCleaned,
                values: valueListUuid
              })
              // Getting the unique extensionIds out of stored(currentActivityExtensionId) and fetched(incomingActivityExtensionId)
              let newActivityExtensionId = incomingActivityExtensionId.filter(
                ({type: incomingType}) =>
                  !currentActivityExtensionId.some(({type: currentType}) => incomingType === currentType)
              );
              if (currentActivityExtensionId.length !== 0) {
                currentActivityExtensionId.forEach(extension => {
                  incomingActivityExtensionId.forEach(newExtension => {
                    if (extension.type === newExtension.type) {
                      let difference = newExtension.values.filter(o => !extension.values.some(v => v.name === o.name))
                      extension.values = extension.values.concat(difference);
                      extension.values.sort((a, b) => (a.name > b.name) ? 1 : -1)
                    }
                  })
                })
              }
              if (newActivityExtensionId.length !== 0) {
                currentActivityExtensionId = currentActivityExtensionId.concat(newActivityExtensionId)
              }
              currentActivityExtensionId.sort((a, b) => (a.type > b.type) ? 1 : -1)
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
      yield put(setActivityExtensionId(currentActivityExtensionId));
    } catch (error) {
      yield put(setConnectionErrorFilterActivities(true));
      console.log(error)
    }
  } catch (error) {
    yield put(setConnectionErrorFilterActivities(true));
    console.log(error);
  }
}

// Analysis Method handler functions
export function* handleGetAnalysisMethods() {
  try {
    const response = yield call(requestAnalysisMethods);
    const {data} = response;
    yield put(setAnalysisMethods(data));
  } catch (error) {
    yield put(setConnectionErrorAnalysisMethod(true));
  }
}

export function* handleGetAnalysisMethodInputs(action) {
  try {
    let response = yield call(requestAnalysisMethodInputs, action.payload.selectedAnalysisMethod.id);
    const analysisMethodInputData = response.data;
    try {
      response = yield call(requestAnalysisMethodParams, action.payload.selectedAnalysisMethod.id)
      const analysisMethodParamsData = response.data;
      analysisMethodParamsData.forEach(data => {
        let newPossibleValues = []
        if (data.possibleValues) {
          let {possibleValues} = data;
          newPossibleValues = possibleValues.split(",")
          data.possibleValues = newPossibleValues;
        }
        if (data.defaultValue || data.defaultValue === "") {
          data.value = data.defaultValue;
        }
      });
      yield put(setAnalysisMethodInput(analysisMethodInputData, analysisMethodParamsData));
    } catch (error) {
      yield put(setConnectionErrorAnalysisMethodInputs(true))
    }
  } catch (error) {
    yield put(setConnectionErrorAnalysisMethodInputs(true));
  }
}

// Visualization Method handler functions
export function* handleGetAnalysisMethodOutputs(action) {
  try {
    const response = yield call(requestAnalysisMethodOutputs, action.payload.selectedAnalysisMethod.id);
    const {data} = response;
    yield put(setAnalysisMethodOutput(data));
  } catch (error) {
    yield put(setConnectionErrorAnalysisMethodOutput(true));
  }
}

export function* handleGetVisualizationMethodsAndTypes() {
  try {
    const response = yield call(requestVisualizationMethodsAndTypes);
    const {data} = response;
    let visualizationMethodsTypesData = [];
    for (let vizData of data) {
      let {id, name, creator, description, frameworkLocation, visualizationTypes} = vizData;
      visualizationMethodsTypesData.push({
        id,
        name,
        creator,
        description,
        frameworkLocation,
        values: visualizationTypes
      })
    }
    yield put(setVisualizationMethodsAndTypes(visualizationMethodsTypesData));
  } catch (error) {
    console.log(error)
  }
}

export function* handleGetVisualizationMethodInputs(action) {
  const frameworkId = action.payload.selectedVisualizationMethodId;
  const methodId = action.payload.selectionVisualizationTypeId;
  try {
    const response = yield call(requestVisualizationMethodInputs, frameworkId, methodId);
    const visualizationMethodInputData = response.data;
    yield put(setVisualizationMethodInputs(visualizationMethodInputData));
  } catch (error) {
    console.log(error)
  }
}

export function* handleGenerateIndicatorPreview(action) {
  const query = action.payload.queryBuilder;
  try {
    const response = yield call(requestVisualizationPreview, query);
    const unescapedVizCode = decodeURIComponent(response.data.visualizationCode);
    let displayCode = parse(unescapedVizCode);
    let scriptData = displayCode[1].props.dangerouslySetInnerHTML.__html;
    yield put(setGeneratedVisualizationCode(displayCode, scriptData, ""));
  } catch (error) {
    console.log(error);
    let errorMessage = "Visualization not possible!"
    yield put(setGeneratedVisualizationCode("", "", errorMessage));
  }
}

export function* handleValidateIndicatorName(action) {
  const indicatorName = action.payload.indicatorName;
  try {
    const response = yield call(requestValidateIndicatorName, indicatorName)
    if (response.data) {
      yield put(setIndicatorName(indicatorName, true));
    } else {
      yield put(setIndicatorName("", false));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetIndicatorDataForEdit(action) {
  const indicatorData = action.payload.indicatorData;
  let populateIndicatorData = populateIndicatorQueryData(indicatorData);
  const {
    platforms,
    activityTypes,
    actionOnActivities,
    activityName,
    analysisMethod,
    vizMethodType
  } = populateIndicatorData
  try {
    const query = {type: "PLATFORM"}
    const requestPlatform = queryEngine(query);
    const response = yield call(requestData, requestPlatform);
    const {data} = response;
    if (data !== undefined) {
      const sortedArray = (data.columns["statement.context.platform"].data).sort((a, b) => a.localeCompare(b));
      const platformArray = [];
      sortedArray.forEach(data => {
        platformArray.push({
          id: uuid4(),
          type: "statement.context.platform",
          name: data,
        });
      })
      let newPlatform = platformArray.filter(({name: name1}) =>
        !platforms.some(({name: name2}) => name2 === name1));
      newPlatform = newPlatform.concat(platforms);
      yield put(setAllPlatforms(newPlatform));

      if (platformArray === 0) {
        let typeList = [];
        let languageList = [];
        yield put(setActivityTypes(typeList, languageList));
      } else {
        try {
          const query = {type: "ACTIVITY_TYPES", query: {platform: platforms}}
          const requestedActivityType = queryEngine(query);
          const response = yield call(requestData, requestedActivityType);
          const {data} = response;
          if (data !== undefined) {
            const typeData = data.columns["statement.object.definition.type"].data;
            const languageData = data.columns["statement.context.language"].data;
            let typeList = [];
            typeData.forEach(data => {
              const typeCleaned = toFirstCharUppercase(cleaningResponseData(data));
              typeList.push({id: uuid4(), type: data, name: typeCleaned});
            });
            typeList = typeList.sort((a, b) => (a.name > b.name) ? 1 : -1);
            let languageList = [];
            languageData.forEach(data => {
              languageList.push({id: uuid4(), name: data})
            });
            let newTypeList = typeList.filter(({name: name1}) =>
              !activityTypes.some(({name: name2}) => name2 === name1));
            newTypeList = newTypeList.concat(activityTypes);
            newTypeList = newTypeList.sort((a, b) => (a.name > b.name) ? 1 : -1);
            yield put(setActivityTypes(newTypeList, languageList));
          }
          try {
            const query = {
              type: "ACTION_ON_ACTIVITIES",
              query: {platform: platforms, activityTypes: activityTypes}
            }
            const requestedActionOnActivity = queryEngine(query);
            let response = yield call(requestData, requestedActionOnActivity);
            const {data} = response;
            if (data !== undefined) {
              const actionData = data.columns["statement.verb.id"].data;
              let actionList = [];
              actionData.forEach(data => {
                const typeCleaned = cleaningResponseData(data);
                actionList.push({id: uuid4(), type: data, name: typeCleaned});
              });
              actionList = actionList.sort((a, b) => (a.name > b.name) ? 1 : -1);
              let newTypeList = actionList.filter(({type: type1}) =>
                !actionOnActivities.some(({type: type2}) => type2 === type1));
              newTypeList= newTypeList.concat(actionOnActivities);
              newTypeList = newTypeList.sort((a, b) => (a.name > b.name) ? 1 : -1);
              yield put(setActionOnActivities(newTypeList));
            }

            try {
              const query = {
                type: "GET_ALL_FILTER_DATA",
                query: {
                  platform: platforms,
                  activityTypes: activityTypes,
                  actionOnActivities: actionOnActivities
                },
                // languages: action.payload.languages
                languages: [{id: uuid4(), name: lang}]
              }
              const requestedAllFilterData = queryEngine(query);
              const response = yield call(requestData, requestedAllFilterData);
              const {data} = response;
              if (data !== undefined) {
                let filterData = responseDataStorageWrapper(data, [{id: uuid4(), name: lang}]);
                let newActivityNameList = filterData.activityName.filter(({name: name1}) =>
                  !activityName.some(({name: name2}) => name2 === name1));
                newActivityNameList = newActivityNameList.concat(activityName);
                newActivityNameList = newActivityNameList.sort((a, b) => (a.name > b.name) ? 1 : -1);
                filterData = {
                  ...filterData,
                  activityName: newActivityNameList
                }
                yield put(setAllFilterData(filterData));
                yield put(setActivityAttributes(attributeDataFunction(filterData.result)));
              }
              // Requests Activity Extension Ids and saves in store
              try {
                let currentActivityExtensionId = [];
                for (let activityType of activityTypes) {
                  let response = yield call(requestActivityTypeExtensionIds, activityType.type);
                  let {data: {columns: {activityExtensionIds: {data}}}} = response;
                  if (data !== undefined) {
                    for (let extensionId of data) {
                      let incomingActivityExtensionId = []
                      try {
                        let responseExtensionId = yield call(requestActivityExtensionIdOptions, activityType.type, extensionId);
                        const {data: {columns: {activityProperties: {data}}}} = responseExtensionId;
                        let extensionCleaned = toFirstCharUppercase(cleaningResponseData(extensionId));
                        let valueList = data.sort((a, b) => (a > b) ? 1 : -1);
                        let valueListUuid = [];
                        for (let list of valueList) {
                          valueListUuid.push({id: uuid4(), name: list})
                        }
                        incomingActivityExtensionId.push({
                          id: uuid4(),
                          type: extensionId,
                          name: extensionCleaned,
                          values: valueListUuid
                        })
                        // Getting the unique extensionIds out of stored(currentActivityExtensionId) and fetched(incomingActivityExtensionId)
                        let newActivityExtensionId = incomingActivityExtensionId.filter(
                          ({type: incomingType}) =>
                            !currentActivityExtensionId.some(({type: currentType}) => incomingType === currentType)
                        );
                        if (currentActivityExtensionId.length !== 0) {
                          currentActivityExtensionId.forEach(extension => {
                            incomingActivityExtensionId.forEach(newExtension => {
                              if (extension.type === newExtension.type) {
                                let difference = newExtension.values.filter(o => !extension.values.some(v => v.name === o.name))
                                extension.values = extension.values.concat(difference);
                                extension.values.sort((a, b) => (a.name > b.name) ? 1 : -1)
                              }
                            })
                          })
                        }
                        if (newActivityExtensionId.length !== 0) {
                          currentActivityExtensionId = currentActivityExtensionId.concat(newActivityExtensionId)
                        }
                        currentActivityExtensionId.sort((a, b) => (a.type > b.type) ? 1 : -1)
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }
                }
                yield put(setActivityExtensionId(currentActivityExtensionId));
              } catch (error) {
                console.log(error)
              }

            } catch (error) {
              yield put(setConnectionErrorFilterActivities("Error"));
              console.log(error);
            }

          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  // Analysis and visualization part
  try {
    let response = yield call(requestAnalysisMethods);
    const {data} = response;
    // let newMethods = data.filter(a => a.id !== analysisMethod.id);
    analysisMethod["method"] = data.filter(a => a.id === analysisMethod.id);
    yield put(setAnalysisMethods(data));

    try {
      response = yield call(requestAnalysisMethodParams, analysisMethod.id)
      let analysisMethodParamsData = response.data;
      analysisMethodParamsData.forEach(data => {
        let newPossibleValues = []
        if (data.possibleValues) {
          let {possibleValues} = data;
          newPossibleValues = possibleValues.split(",")
          data.possibleValues = newPossibleValues;
        }
        if (data.defaultValue || data.defaultValue === "") {
          for (const [key, value] of Object.entries(analysisMethod.additionalParams)) {
            if (data.id === key)
              data.value = value;
          }
        }
      });
      yield put(setAnalysisMethodInput([], analysisMethodParamsData));
      try {
        const response = yield call(requestVisualizationMethodsAndTypes);
        const {data} = response;
        let visualizationMethodsTypesData = [];
        for (let vizData of data) {
          let {id, name, creator, description, frameworkLocation, visualizationTypes} = vizData;
          visualizationMethodsTypesData.push({
            id,
            name,
            creator,
            description,
            frameworkLocation,
            values: visualizationTypes
          })
        }
        let newVizMethod = visualizationMethodsTypesData.filter(a => a.id === vizMethodType.libraryId);
        let newVizType = newVizMethod[0].values.filter(a => a.id === vizMethodType.typeId);
        newVizMethod[0]["vId"] = newVizType[0].id;
        newVizMethod[0]["vName"] = newVizType[0].name;
        vizMethodType["vizMethod"] = newVizMethod;
        yield put(setVisualizationMethod(newVizMethod[0]));
        yield put(setVisualizationType(newVizType[0]));
        yield put(setVisualizationMethodsAndTypes(visualizationMethodsTypesData));
        yield put(setIndicatorDataForEdit(populateIndicatorData));
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error)
  }

}




