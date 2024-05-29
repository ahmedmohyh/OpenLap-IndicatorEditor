import { v4 as uuid4 } from "uuid";
import { cleaningResponseData, toFirstCharUppercase } from "../utils";
import { attributes } from "../data/rules";

export function queryEngine(action) {
  const { type, query, languages, duration } = action;
  let generatedRules = "";
  if (query) {
    generatedRules = queryGeneratorWrapper(query);
  }
  if (type === "PLATFORM") {
    return {
      parametersToBeReturnedInResult: {
        "statement.context.platform": 1,
      },
      query: [{}],
      statementDuration: [{}],
    };
  }

  if (type === "ACTIVITY_TYPES") {
    return {
      parametersToBeReturnedInResult: {
        "statement.context.language": 1,
        "statement.object.definition.type": 1,
      },
      query: generatedRules,
      statementDuration: [{}],
    };
  }

  if (type === "ACTION_ON_ACTIVITIES") {
    return {
      parametersToBeReturnedInResult: {
        "statement.verb.id": 1,
      },
      query: generatedRules,
      statementDuration: [{}],
    };
  }

  if (type === "GET_ALL_FILTER_DATA") {
    const activityName = "statement.object.definition.name.";
    const parent =
      "statement.context.contextActivities.parent.definition.name.";
    const grouping =
      "statement.context.contextActivities.grouping.definition.name.";

    const queryWrapper = {
      parametersToBeReturnedInResult: {
        "statement.result.score.scaled": 1,
        "statement.result.score.max": 1,
        "statement.result.score.min": 1,
        "statement.result.score.raw": 1,
        "statement.result.success": 1,
        "statement.result.completed": 1,
        "statement.result.response": 1,
        "statement.context.instructor.name": 1,
        "statement.context.contextActivities.parent.definition.type": 1,
        "statement.context.contextActivities.grouping.definition.type": 1,
      },
      // Comment to get all data
      query: generatedRules,
      // query: [{}],
      statementDuration: [{}],
    };
    // Added the language Ids to parent and grouping
    languages.forEach((lang) => {
      let activityDefName = "";
      let parentDefName = "";
      let groupDefName = "";
      activityDefName = activityName + lang.name;
      parentDefName = parent + lang.name;
      groupDefName = grouping + lang.name;
      queryWrapper.parametersToBeReturnedInResult[activityDefName] = 1;
      queryWrapper.parametersToBeReturnedInResult[parentDefName] = 1;
      queryWrapper.parametersToBeReturnedInResult[groupDefName] = 1;
    });
    return queryWrapper;
  }
}

export function queryGeneratorWrapper(query) {
  const {
    platform,
    activityTypes,
    actionOnActivities,
    result,
    contextActivities,
    activityExtensionId,
    activityName,
    // TODO: create similar if statements for user
    // users
  } = query;
  let wrapper = [];

  if (platform) {
    const objectWrapper = {};
    objectWrapper["$or"] = [];
    platform.forEach((data) => {
      const query = {};
      query["statement.context.platform"] = data.name;
      objectWrapper["$or"].push(query);
    });
    wrapper.push(objectWrapper);
  }
  if (activityTypes) {
    const objectWrapper = {};
    objectWrapper["$or"] = [];
    activityTypes.forEach((data) => {
      const query = {};
      query["statement.object.definition.type"] = data.type;
      objectWrapper["$or"].push(query);
    });
    wrapper.push(objectWrapper);
  }
  if (actionOnActivities) {
    const objectWrapper = {};
    objectWrapper["$or"] = [];
    actionOnActivities.forEach((data) => {
      const query = {};
      query["statement.verb.id"] = data.type;
      objectWrapper["$or"].push(query);
    });
    wrapper.push(objectWrapper);
  }
  // TODO: Under development: START
  if (activityName) {
    if (activityName.length !== 0) {
      const objectWrapper = {};
      objectWrapper["$or"] = [];
      activityName.forEach((data) => {
        const query = {};
        query[data.type] = data.name;
        objectWrapper["$or"].push(query);
      });
      wrapper.push(objectWrapper);
    }
  }
  if (contextActivities) {
    if (contextActivities.length !== 0) {
      const objectWrapper = {};
      objectWrapper["$or"] = [];
      contextActivities.forEach((data) => {
        const query = {};
        query[data.values.type] = data.values.name;
        objectWrapper["$or"].push(query);
      });
      wrapper.push(objectWrapper);
    }
  }
  if (result) {
    if (result.length !== 0) {
      const objectWrapper = {};
      objectWrapper["$or"] = [];
      result.forEach((data) => {
        const query = {};
        if (
          data.values.type === "statement.result.success" ||
          data.values.type === "statement.result.response"
        )
          query[data.values.type] = data.values.name === "True";
        else query[data.values.type] = { [data.operatorId]: data.values.name };
        objectWrapper["$or"].push(query);
      });
      wrapper.push(objectWrapper);
    }
  }
  if (activityExtensionId) {
    if (activityExtensionId.length !== 0) {
      const objectWrapper = {};
      objectWrapper["$or"] = [];
      activityExtensionId.forEach((data) => {
        const query = {};
        query[
          "statement.object.definition.extensions." +
            data.type +
            "." +
            data.name
        ] = data.values.name;
        objectWrapper["$or"].push(query);
      });
      wrapper.push(objectWrapper);
    }
  }
  // TODO: create similar if statements for user
  // if (users) {
  //
  // }
  return wrapper;
}

export function statementDurationWrapper(timeDuration) {
  const { startDate, endDate } = timeDuration;

  let wrapper = [];
  if (startDate) {
    let objectWrapper = {};
    objectWrapper["statement.stored"] = { $gte: startDate };
    wrapper.push(objectWrapper);
  }
  if (endDate) {
    let objectWrapper = {};
    objectWrapper["statement.stored"] = { $lte: endDate };
    wrapper.push(objectWrapper);
  }
  return wrapper;
}

export function compositeQueryWrapper(indicatorData) {
    console.log("BEFORE PARSING ", indicatorData);
  let objectWrapper = {};

  const parsedUser = JSON.parse(localStorage.getItem("openlapUser"));
  // const createdBy = parsedUser.firstname + " " + parsedUser.lastname;
  const createdBy = parsedUser.email;
  objectWrapper = indicatorData;
  const { methodInputParams } = indicatorData;
  for (let i = 0; i < Object.keys(indicatorData.queries).length; i++) {
    objectWrapper["methodInputParams"][i] =
      methodInputParams[Object.keys(methodInputParams).length < 2 ? 0 : i];
  }

  objectWrapper["createdBy"] = createdBy;

  objectWrapper["additionalParams"] = {
    width: 400,
    height: 500,
  };
  console.log("AFTER PARSE ", objectWrapper);
  return objectWrapper;
}

export function responseDataStorageWrapper(responseData, language) {
  const { columns } = responseData;
  /* Results */
  const response = "statement.result.response";
  const scaled = "statement.result.score.scaled";
  const min = "statement.result.score.min";
  const max = "statement.result.score.max";
  const raw = "statement.result.score.raw";
  const completed = "statement.result.completed";
  const success = "statement.result.success";

  /* Activity */
  const activityTypeName = "statement.object.definition.name";
  let actTypeName = [];

  /* Context Activities */
  const instructor = "statement.context.instructor.name";
  const parent = "statement.context.contextActivities.parent";
  let parentDefinitionName = [];
  const parentDefinition = parent + ".definition.name";
  const parentType = parent + ".definition.type";
  const grouping = "statement.context.contextActivities.grouping";
  const groupingDefinition = grouping + ".definition.name";
  const groupingDefinitionName = [];
  const groupingType = grouping + ".definition.type";

  const objectWrapper = {};
  objectWrapper["result"] = [];
  objectWrapper["contextActivities"] = [];
  objectWrapper["activityName"] = [];
  let activityNamesUuid = [];
  let valuesParent = [];
  let valuesGrouping = [];

  if (columns.hasOwnProperty(response)) {
    let successData = columns[response].data;
    let sortedResponse = successData.sort((a, b) => (a > b ? 1 : -1));
    let sortedResponseUuid = [];
    for (let list of sortedResponse) {
      sortedResponseUuid.push({ id: uuid4(), type: response, name: list });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: response,
      name: "Response",
      values: sortedResponseUuid,
    });
  }
  if (columns.hasOwnProperty(scaled)) {
    let sortedScaled = columns[scaled].data.sort((a, b) => (a > b ? -1 : 1));
    let sortedScaledUuid = [];
    for (let list in sortedScaled) {
      sortedScaledUuid.push({ id: uuid4(), type: scaled, name: list });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: scaled,
      name: "Scaled",
      values: sortedScaledUuid,
    });
  }
  if (columns.hasOwnProperty(min)) {
    let sortedMin = columns[min].data.sort((a, b) => (a > b ? -1 : 1));
    let sortedMinUuid = [];
    for (let list in sortedMin) {
      sortedMinUuid.push({ id: uuid4(), type: min, name: list });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: min,
      name: "Min",
      values: sortedMinUuid,
    });
  }
  if (columns.hasOwnProperty(max)) {
    let sortedMax = columns[max].data.sort((a, b) => (a > b ? -1 : 1));
    let sortedMaxUuid = [];
    for (let list in sortedMax) {
      sortedMaxUuid.push({ id: uuid4(), type: max, name: list });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: max,
      name: "Max",
      values: sortedMaxUuid,
    });
  }
  if (columns.hasOwnProperty(raw)) {
    let sortedRaw = columns[raw].data.sort((a, b) => (a > b ? -1 : 1));
    let sortedRawUuid = [];
    for (let list in sortedRaw) {
      sortedRawUuid.push({ id: uuid4(), type: raw, name: list });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: raw,
      name: "Raw",
      values: sortedRawUuid,
    });
  }
  if (columns.hasOwnProperty(success)) {
    let successList = [];
    let successData = columns[success].data;
    for (let list of successData) {
      let listName = toFirstCharUppercase(list.toString());
      successList.push({ id: uuid4(), type: success, name: listName });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: success,
      name: "Success",
      values: successList,
    });
  }
  if (columns.hasOwnProperty(completed)) {
    let completedList = [];
    let completedData = columns[completed].data;
    for (let list of completedData) {
      let listName = toFirstCharUppercase(list.toString());
      completedList.push({ id: uuid4(), type: completed, name: listName });
    }
    objectWrapper["result"].push({
      id: uuid4(),
      type: completed,
      name: "Completed",
      values: completedList,
    });
  }
  /* Creating the language ids */
  language.forEach((lang) => {
    let actName;
    actName = activityTypeName + "." + lang.name;
    let parentDefName;
    parentDefName = parentDefinition + "." + lang.name;
    let groupDefName;
    groupDefName = groupingDefinition + "." + lang.name;
    actTypeName.push({ lang: lang, dName: actName });
    parentDefinitionName.push({ lang: lang, dName: parentDefName });
    groupingDefinitionName.push({ lang: lang, dName: groupDefName });
  });

  /* Activity Type Name (including Language) */
  // actTypeName.forEach((typeName) => {
  //   if (columns.hasOwnProperty(typeName.dName)) {
  //     let sortedActivityNames = columns[typeName.dName].data.sort((a, b) => (a > b) ? 1 : -1);
  //     let sortedActivityNamesUuid = [];
  //     for (let list of sortedActivityNames) {
  //       sortedActivityNamesUuid.push({id: uuid4(), name: list})
  //     }
  //     let actName = "Activity Name (" + typeName.lang.name + ")";
  //     objectWrapper["activityName"].push({id: typeName.dName, name: actName, values: sortedActivityNamesUuid});
  //   }
  // });
  actTypeName.forEach((typeName) => {
    if (columns.hasOwnProperty(typeName.dName)) {
      let activityNames = columns[typeName.dName].data;
      for (let activityName of activityNames) {
        activityNamesUuid.push({
          id: uuid4(),
          type: typeName.dName,
          name: activityName,
        });
      }
    }
  });

  /* Context Activities */
  /* Instructor ==> May be removed*/
  if (columns.hasOwnProperty(instructor)) {
    let sortedInstructor = columns[instructor].data.sort((a, b) =>
      a > b ? 1 : -1
    );
    let sortedInstructorUuid = [];
    for (let list of sortedInstructor) {
      sortedInstructorUuid.push({ id: uuid4(), type: instructor, name: list });
    }
    objectWrapper["contextActivities"].push({
      id: uuid4(),
      type: instructor,
      name: "Instructor",
      values: sortedInstructorUuid,
    });
  }
  /* Parent Definition Name (including Language) */
  let parentDefValueUuid = [];
  parentDefinitionName.forEach((defName) => {
    if (columns.hasOwnProperty(defName.dName)) {
      let data = columns[defName.dName].data;
      for (let list of data) {
        parentDefValueUuid.push({
          id: uuid4(),
          type: defName.dName,
          name: list,
        });
      }
    }
  });
  if (parentDefValueUuid.length !== 0) {
    parentDefValueUuid = parentDefValueUuid.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    valuesParent.push({
      id: parentDefinition,
      name: "Activity Name",
      values: parentDefValueUuid,
    });
  }
  /* Parent type */
  if (columns.hasOwnProperty(parentType)) {
    let valueType = [];
    columns[parentType].data.forEach((data) => {
      let typeName = toFirstCharUppercase(cleaningResponseData(data));
      valueType.push({ id: data, name: typeName });
    });
    valueType = valueType.sort((a, b) => (a.name > b.name ? 1 : -1));
    valuesParent.push({
      id: parentType,
      name: "Activity type",
      values: valueType,
    });
  }
  /* Grouping Definition Name (including Language) */
  let groupingDefValueUuid = [];
  groupingDefinitionName.forEach((defName) => {
    if (columns.hasOwnProperty(defName.dName)) {
      let data = columns[defName.dName].data;
      for (let list of data) {
        groupingDefValueUuid.push({
          id: uuid4(),
          type: defName.dName,
          name: list,
        });
      }
    }
  });
  if (groupingDefValueUuid.length !== 0) {
    valuesGrouping = valuesGrouping.sort((a, b) => (a.name > b.name ? 1 : -1));
    valuesGrouping.push({
      id: groupingDefinition,
      name: "Activity Name",
      values: groupingDefValueUuid,
    });
  }
  /* Grouping type */
  if (columns.hasOwnProperty(groupingType)) {
    let valueType = [];
    columns[groupingType].data.forEach((data) => {
      let typeName = toFirstCharUppercase(cleaningResponseData(data));
      valueType.push({ id: data, name: typeName });
    });
    valueType = valueType.sort((a, b) => (a.name > b.name ? 1 : -1));
    valuesGrouping.push({
      id: groupingType,
      name: "Activity type",
      values: valueType,
    });
  }

  /* Checks if Activity Name Values exists */
  if (activityNamesUuid.length !== 0) {
    let sortedActivityNames = activityNamesUuid.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );
    Array.prototype.push.apply(
      objectWrapper["activityName"],
      sortedActivityNames
    );
  }
  /* Checks if Context Parent Values exists */
  if (valuesParent.length !== 0) {
    objectWrapper["contextActivities"].push({
      id: uuid4(),
      type: parent,
      name: "Parent",
      values: valuesParent,
    });
  }
  /* Checks if Context Grouping Values exists */
  if (valuesGrouping.length !== 0) {
    objectWrapper["contextActivities"].push({
      id: uuid4(),
      type: grouping,
      name: "Grouping",
      values: valuesGrouping,
    });
  }

  return objectWrapper;
}

export function indicatorResponseToQueryWrapper(indicatorData) {
  let objectWrapper = {};
  if (indicatorData.indicatorType === "Basic Indicator") {
    objectWrapper["queries"] = {
      0: indicatorData.query["0"],
    };
    objectWrapper["queryToMethodConfig"] = {
      0: indicatorData.queryToMethodConfig["0"],
    };
    const {
      analyticsMethodReference: { analyticsMethods },
    } = indicatorData;
    objectWrapper["analyticsMethodId"] = {
      0: analyticsMethods[0].id,
    };
    const methodInputParams = JSON.stringify(
      analyticsMethods[0].additionalParams
    );
    objectWrapper["methodInputParams"] = {
      0: methodInputParams,
    };
    objectWrapper["visualizationInputParams"] = {
      0: "",
    };
    objectWrapper["additionalParams"] = {
      width: 400,
      height: 500,
    };
    const {
      visualizationReference: { typeId, libraryId },
    } = indicatorData;
    objectWrapper["visualizationLibraryId"] = libraryId;
    objectWrapper["visualizationTypeId"] = typeId;
    objectWrapper["methodToVisualizationConfig"] =
      indicatorData.methodToVisualizationConfig;
  }

  if (
    indicatorData.indicatorType === "composite" ||
    indicatorData.indicatorType === "multianalysis"
  ) {
    const parsedUser = JSON.parse(localStorage.getItem("openlapUser"));
    // const createdBy = parsedUser.firstname + " " + parsedUser.lastname;
    const createdBy = parsedUser.email;
    objectWrapper = {
      queries: {},
      queryToMethodConfig: {},
      analyticsMethodId: {},
      methodInputParams: {},
    };
    for (let i = 0; i < Object.keys(indicatorData.query).length; i++) {
      objectWrapper["queries"][i] = indicatorData.query[i];
      objectWrapper["queryToMethodConfig"][i] =
        indicatorData.queryToMethodConfig[i];
      const {
        analyticsMethodReference: { analyticsMethods },
      } = indicatorData;
      objectWrapper["analyticsMethodId"][i] =
        analyticsMethods[
          indicatorData.indicatorType === "composite" ? 0 : i
        ].id;
      objectWrapper["methodInputParams"][i] = JSON.stringify(
        analyticsMethods[i].additionalParams
      );
    }
    objectWrapper["visualizationInputParams"] =
      indicatorData.visualizationInputParams;
    objectWrapper["createdBy"] = createdBy;
    objectWrapper["additionalParams"] = {
      rid: crypto.randomUUID(),
      width: 400,
      height: 500,
    };
    const {
      visualizationReference: { typeId, libraryId },
    } = indicatorData;
    objectWrapper["visualizationLibraryId"] = libraryId;
    objectWrapper["indicatorType"] = indicatorData.indicatorType;
    objectWrapper["visualizationTypeId"] = typeId;
    objectWrapper["methodToVisualizationConfig"] =
      indicatorData.methodToVisualizationConfig;
  }

  if (indicatorData.indicatorType === "multianalysis") {
    objectWrapper["queries"][0] = {};
    objectWrapper["dataSetMergeMappingList"] =
      indicatorData["indicatorReference"]["dataSetMergeMappingList"];
  }

  return objectWrapper;
}

export function queryToIndicatorResponseWrapper(
  queryData,
  indicatorType,
  indicatorName
) {
  // Works only for basic indicator
  const parsedUser = JSON.parse(localStorage.getItem("openlapUser"));
  // const createdBy = parsedUser.firstname + " " + parsedUser.lastname;
  const createdBy = parsedUser.email;
  let objectWrapper = {};
  if (indicatorType === "Basic Indicator") {
    objectWrapper["id"] = uuid4();
    objectWrapper["name"] = indicatorName;
    objectWrapper["query"] = queryData.queries;
    objectWrapper["analyticsMethodReference"] = {
      analyticsMethods: {
        0: {
          id: queryData.analyticsMethodId["0"],
          additionalParams: JSON.parse(queryData.methodInputParams["0"]),
        },
      },
    };
    objectWrapper["visualizationReference"] = {
      libraryId: queryData.visualizationLibraryId,
      typeId: queryData.visualizationTypeId,
    };
    let mapped = [];
    queryData.queryToMethodConfig["0"].mapping.forEach((map) => {
      mapped.push(map);
    });
    objectWrapper["queryToMethodConfig"] = {
      0: {
        mapping: mapped,
      },
    };
    objectWrapper["methodToVisualizationConfig"] = {
      mapping: queryData.methodToVisualizationConfig.mapping,
    };
    objectWrapper["indicatorType"] = indicatorType;
    objectWrapper["createdBy"] = createdBy;
  }

  return objectWrapper;
}

export function saveQuestionAndIndicatorWrapper(question, goal, indicatorList) {
  const parsedUser = JSON.parse(localStorage.getItem("openlapUser"));
  // const createdBy = parsedUser.firstname + " " + parsedUser.lastname;
  const createdBy = parsedUser.email;
  let objectWrapper = {};
  objectWrapper["question"] = question.name;
  objectWrapper["goal"] = goal;
  let newIndicatorQueryList = [];
  indicatorList.forEach((indicator) => {
    let queryIndicator = indicatorResponseToQueryWrapper(indicator);
    queryIndicator.additionalParams.width = "";
    queryIndicator.additionalParams.height = "";
    queryIndicator["name"] = indicator.name;
    queryIndicator["createdBy"] = indicator.createdBy;
    queryIndicator["parameters"] = "";
    // indicatorClientID: stores the triad id of existing indicator or random uuid from indicator generation process
    queryIndicator["indicatorClientID"] = indicator.id;
    queryIndicator["serverID"] = { 0: "" };
    queryIndicator["indicatorType"] = indicator.indicatorType;
    newIndicatorQueryList.push(queryIndicator);
  });
  objectWrapper["indicators"] = newIndicatorQueryList;
  objectWrapper["createdBy"] = createdBy;

  return objectWrapper;
}

export function populateIndicatorQueryData(responseData) {
  const {
    name,
    methodToVisualizationConfig,
    analyticsMethodReference,
    visualizationReference,
    indicatorType,
  } = responseData;
  let selectedData = {};

  if (indicatorType === "Basic Indicator") {
    let queryWrapper = {};

    selectedData["indicatorName"] = name;
    selectedData["indicatorType"] = indicatorType;
    selectedData["analysisMethod"] =
      analyticsMethodReference.analyticsMethods["0"];
    selectedData["vizMethodType"] = visualizationReference;

    let copyOfResponseData = responseData;
    copyOfResponseData.queryToMethodConfig["0"].mapping.forEach((data) => {
      attributes.forEach((att) => {
        if (att.id === data.outputPort.id) {
          data.outputPort["name"] = att.name;
        }
      });
    });
    selectedData["mappingAnalysisInputAttributesData"] =
      copyOfResponseData.queryToMethodConfig["0"].mapping;

    selectedData["mappingVizInputAnalysisOutput"] =
      methodToVisualizationConfig.mapping;

    responseData.query["0"].query.forEach((state) => {
      state["$or"].forEach((data) => {
        let key = Object.keys(data);
        let activityName = Object.keys(data).filter((key) =>
          key.includes("statement.object.definition.name")
        );
        // Making activity name language independent
        if (activityName.length !== 0) {
          const updated = Object.entries(data).reduce((data, [key, value]) => {
            data[key.split(".").pop()] = value;
            return data;
          }, {});
          if (!queryWrapper.hasOwnProperty("statement.object.definition.name"))
            queryWrapper["statement.object.definition.name"] = [];
          queryWrapper["statement.object.definition.name"] =
            queryWrapper["statement.object.definition.name"].concat(updated);
        } else {
          if (!queryWrapper.hasOwnProperty(key)) queryWrapper[key] = [];
          queryWrapper[key] = queryWrapper[key].concat([data[key]]);
        }
      });
    });
    responseData.query["0"].statementDuration.forEach((duration) => {
      if (Object.keys(duration["statement.stored"])[0] === "$gte") {
        selectedData["timeDuration"] = {
          startDate: Object.values(duration["statement.stored"])[0],
        };
      } else if (Object.keys(duration["statement.stored"])[0] === "$lte") {
        selectedData["timeDuration"] = {
          ...selectedData["timeDuration"],
          endDate: Object.values(duration["statement.stored"])[0],
        };
      }
    });

    if (queryWrapper["statement.object.definition.type"]) {
      queryWrapper["statement.object.definition.type"].forEach((data) => {
        let name = cleaningResponseData(data);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        if (!selectedData.hasOwnProperty("activityTypes"))
          selectedData["activityTypes"] = [];
        selectedData["activityTypes"] = selectedData["activityTypes"].concat({
          id: uuid4(),
          type: data,
          name: name,
        });
      });
    }

    if (queryWrapper["statement.verb.id"]) {
      queryWrapper["statement.verb.id"].forEach((data) => {
        let name = cleaningResponseData(data);
        if (!selectedData.hasOwnProperty("actionOnActivities"))
          selectedData["actionOnActivities"] = [];
        selectedData["actionOnActivities"] = selectedData[
          "actionOnActivities"
        ].concat({
          id: uuid4(),
          type: data,
          name: name,
        });
      });
    }

    if (queryWrapper["statement.context.platform"]) {
      queryWrapper["statement.context.platform"].forEach((data) => {
        let name = cleaningResponseData(data);
        if (!selectedData.hasOwnProperty("platforms"))
          selectedData["platforms"] = [];
        selectedData["platforms"] = selectedData["platforms"].concat({
          id: uuid4(),
          type: "statement.context.platform",
          name: name,
        });
      });
    }

    if (queryWrapper["statement.object.definition.name"]) {
      queryWrapper["statement.object.definition.name"].forEach((data) => {
        if (!selectedData.hasOwnProperty("activityName"))
          selectedData["activityName"] = [];
        selectedData["activityName"] = selectedData["activityName"].concat({
          id: uuid4(),
          type: "statement.object.definition.name." + Object.keys(data),
          name: Object.values(data)[0],
        });
      });
    }
  }

  return selectedData;
}
