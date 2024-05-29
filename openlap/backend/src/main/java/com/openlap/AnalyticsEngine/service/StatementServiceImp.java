package com.openlap.AnalyticsEngine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.internal.Streams;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import com.openlap.AnalyticsEngine.dto.*;
import com.openlap.AnalyticsEngine.model.Statement;
import com.openlap.AnalyticsEngine.repo.StatementRepo;
import com.openlap.AnalyticsEngine.repo.StatementTemplateRepo;
import com.openlap.dataset.OpenLAPColumnDataType;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
public class StatementServiceImp implements StatementService {
    private final StatementRepo statementsRepo;
    @Autowired
    StatementTemplateRepo statementTemplateRepo;

    @Autowired
    MongoTemplate mongoTemplate;

    public StatementServiceImp(StatementRepo statementsRepo) {
        this.statementsRepo = statementsRepo;
    }

    //	Fetches all the available platforms in the LRS
    public OpenLAPDataSet getAllPlatforms(
            ObjectId organizationId,
            ObjectId lrsId
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfPlatforms = new ArrayList<>();
        for (Platforms platforms : statementsRepo.findAllPlatformsByOrganizationAndLrs(organizationId, lrsId)) {
            String statement = new Gson().toJson(platforms.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject platformObject = statementObject.getJSONObject("context");
            try {
                if (!listOfPlatforms.contains(platformObject.get("platform"))) {
                    listOfPlatforms.add(platformObject.get("platform"));
                }
            } catch (JSONException ignored) {
            }
        }
        dataConverter.SetOpenLapDataColumn(
                "platforms",
                OpenLAPColumnDataType.Text,
                true,
                listOfPlatforms,
                "List of all platforms available in LRS",
                "statement.context.platform"
        );
        return dataConverter.getDataSet();
    }

    //	Fetches all the verbs in the LRS
    @Override
    public OpenLAPDataSet getAllActions(
            ObjectId organizationId,
            ObjectId lrsId
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfVerbs = new ArrayList<>();
        ArrayList<Object> listOfVerbsIds = new ArrayList<>();
        for (Verb verb : statementsRepo.getAllActions(organizationId, lrsId)) {
            String statement = new Gson().toJson(verb.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject verbObject = statementObject.getJSONObject("verb");
            JSONObject displayObject = verbObject.getJSONObject("display");
            Iterator<?> displayKey = displayObject.keys();
            if (!listOfVerbsIds.contains(verbObject.get("id"))) {
                listOfVerbsIds.add(verbObject.get("id"));
                while (displayKey.hasNext()) {
                    String DynamicLanguageKey = (String) displayKey.next();
                    listOfVerbs.add(displayObject.get(DynamicLanguageKey));
                }
            }
        }
        dataConverter.SetOpenLapDataColumn(
                "actionNames",
                OpenLAPColumnDataType.Text,
                true,
                listOfVerbs,
                "List of action names",
                "statement.verb.display"
        );
        dataConverter.SetOpenLapDataColumn(
                "actionIds",
                OpenLAPColumnDataType.Text,
                true,
                listOfVerbsIds,
                "List of action IDs",
                "statement.verb.id"

        );
        return dataConverter.getDataSet();
    }

    //	Fetches all the verbs in the LRS
//	@Override
//	public OpenLAPDataSet getActions(
//			ObjectId organizationId,
//			ObjectId lrsId,
//			String platform,
//			String activityType,
//			String activityNameId,
//			String activityName
//	) throws JSONException, OpenLAPDataColumnException {
//		OpenLapDataConverter dataConverter = new OpenLapDataConverter();
//		ArrayList<Object> listOfVerbs = new ArrayList<>();
//		ArrayList<Object> listOfVerbsIds = new ArrayList<>();
//		for (LrsObjects verb : statementsRepo.getActions(
//				organizationId,
//				lrsId,
//				platform,
//				activityType,
//				activityNameId,
//				activityName
//		)) {
//			String statement = new Gson().toJson(verb.getStatement());
//			JSONObject statementObject = new JSONObject(statement);
//			JSONObject verbObject = statementObject.getJSONObject("verb");
//			JSONObject displayObject = verbObject.getJSONObject("display");
//			Iterator<?> displayKey = displayObject.keys();
//			if (!listOfVerbsIds.contains(verbObject.get("id"))) {
//				listOfVerbsIds.add(verbObject.get("id"));
//				while (displayKey.hasNext()) {
//					String DynamicLanguageKey = (String) displayKey.next();
//					listOfVerbs.add(displayObject.get(DynamicLanguageKey));
//				}
//			}
//		}
//		dataConverter.SetOpenLapDataColumn(
//				"actionNames",
//				OpenLAPColumnDataType.Text,
//				true,
//				listOfVerbs,
//				"List of action names",
//				"statement.verb.display"
//		);
//		dataConverter.SetOpenLapDataColumn(
//				"actionIds",
//				OpenLAPColumnDataType.Text,
//				true,
//				listOfVerbsIds,
//				"List of action IDs",
//				"statement.verb.id"
//
//		);
//		return dataConverter.getDataSet();
//	}

    //	Custom query to the LRS
    @Override
    public OpenLAPDataSet getAllStatementsByCustomQuery(
            ObjectId organizationId,
            ObjectId lrsId,
            QueryParameters queryParameters
    ) throws JSONException, OpenLAPDataColumnException {
        //MultiValueMap map = new MultiValueMap();
        Map<String, ArrayList<Object>> map = new HashMap();
        String[] xAPIObjectsToReturn = null;
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        Gson gson = new Gson();
        ObjectMapper objectMapper = new ObjectMapper();
        // Converting Java Object to Json
        String query = gson.toJson(queryParameters.getQuery());
        String agg = gson.toJson(queryParameters.getAgg());
        // 【TODO】如果是正常的query请求
        if (!query.equals("null")) {
            String statementDuration = gson.toJson(queryParameters.getStatementDuration());
            String parametersToReceive = gson.toJson(queryParameters.getParametersToBeReturnedInResult());
            // Converting Json to DBObject for MongoDB
            DBObject queryObject = (DBObject) JSON.parse(query);
            @SuppressWarnings("deprecation")
            DBObject statementDurationObject = (DBObject) JSON.parse(statementDuration);
            @SuppressWarnings("deprecation")
            DBObject parametersToReceiveObject = (DBObject) JSON.parse(parametersToReceive);
            // Converting Returned parameters given in the query to JsonObject
            JSONObject xAPIStatement = new JSONObject(parametersToReceive);
            // Extracting keys from xAPIStatement Object
            Iterator<?> xAPIStatementProperties = xAPIStatement.keys();
            ArrayList<String> listOfReturnedxAPIStatementProperties = new ArrayList<String>();
            while (xAPIStatementProperties.hasNext()) {
                // loop to get the dynamic key
                String valuesToReturn = (String) xAPIStatementProperties.next();
                listOfReturnedxAPIStatementProperties.add(valuesToReturn);
            }
            /*
             * Getting query results from database and returning in the form of List of
             * Statement Model.And reading each statement one by one
             */
            List<Statement> allStatements = statementsRepo.findDataByCustomQuery(queryObject, statementDurationObject, parametersToReceiveObject, organizationId, lrsId);
            for (Statement statment : allStatements) {
                /**
                 * Getting statement object from Statement Collection and converting to
                 * JsonObject
                 */
                String statement = new Gson().toJson(statment.getStatement());
                JSONObject statementObject = new JSONObject(statement);
                JSONObject xAPIObject = null;
                // looping through List of parameters available in parametersToReceive Object
                for (int countReturnParamters = 0; countReturnParamters < listOfReturnedxAPIStatementProperties
                        .size(); countReturnParamters++) {
                    /*
                     * getting return keys like (statement.verb.name or statement.actor.name) from
                     * list
                     */
                    String returnKeys = listOfReturnedxAPIStatementProperties.get(countReturnParamters);
                    /*
                     * Splitting return keys(statement.verb.name or statement.actor.name) with dot
                     * operator to extract statement,verb,name or statement,actor,name separately
                     *
                     */
                    xAPIObjectsToReturn = returnKeys.split("\\.");
                    int returnObjectCount;
                    // Reading each Object like statement,verb,actor these are three objects reading
                    // them one by one from returned results from database and reading only those
                    // objects that are given in parametersToReceive
                    for (returnObjectCount = 1; returnObjectCount < xAPIObjectsToReturn.length - 1; returnObjectCount++) {
                        if (returnObjectCount == 1) {
                            xAPIObject = statementObject.getJSONObject(xAPIObjectsToReturn[returnObjectCount]);
                        } else {
                            xAPIObject = xAPIObject.getJSONObject(xAPIObjectsToReturn[returnObjectCount]);
                        }
                    }
                    if (xAPIObjectsToReturn.length == 2)
                        xAPIObject = statementObject;
                    /**
                     * After reading setting name of objects to be returned as key and values of
                     * those objects as values in multimap
                     */
                    if (xAPIObject.has(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1])) {
                        //		if (!map.containsValue(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1])))
                        if (map.containsKey(returnKeys))
                            map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                        else {
                            map.put(returnKeys, new ArrayList<Object>());
                            map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                        }//map.put(returnKeys, xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                    }
                }
            }
            /**
             * Iterating throw multimap keys and values to convert the data into
             * OpenLAP-DataSET
             */
            Set<String> columnNames = map.keySet();
            for (String columnName : columnNames) {
                dataConverter.SetOpenLapDataColumn(
                        columnName,
                        OpenLAPColumnDataType.Text,
                        true,
                        map.get(columnName),
                        "",
                        ""
                );
            }
		/*List<Object> xAPIObjectsList;
		Set<?> entrySet = map.entrySet();
		Iterator<?> it = entrySet.iterator();
		ArrayList<Object> listOfxAPIObjectKeys = new ArrayList<Object>();
		ArrayList<Object> listOfxAPIObjectValues;
		ArrayList<String> mylist = null;
		while (it.hasNext()) {
			Map.Entry mapEntry = (Map.Entry) it.next();
			xAPIObjectsList = (List) map.get(mapEntry.getKey());
			for (int xAPIObjectCount = 0; xAPIObjectCount < xAPIObjectsList.size(); xAPIObjectCount++) {
				if (!listOfxAPIObjectKeys.contains(mapEntry.getKey().toString())) {
					listOfxAPIObjectKeys.add(mapEntry.getKey().toString());
					listOfxAPIObjectValues = new ArrayList<Object>();
					listOfxAPIObjectValues.add(mapEntry.getValue());
					String xapi = objectMapper.writeValueAsString(listOfxAPIObjectValues);
					String xapitrim = xapi.substring(2,xapi.length()-2);
					mylist = new ArrayList<String>(Arrays.asList(xapitrim));
					dataConveter.SetOpenLapDataColumn(mapEntry.getKey().toString(),	OpenLAPColumnDataType.Text, true, mylist, "", "");
				}
			}
		}*/
        }
        // 【TODO】如果是aggregate请求
        else if (!agg.equals("null")) {
            String parametersToReceive = gson.toJson(queryParameters.getParametersToBeReturnedInResult());
            JSONObject xAPIStatement = new JSONObject(parametersToReceive);
            // Extracting keys from xAPIStatement Object
            Iterator<?> xAPIStatementProperties = xAPIStatement.keys();
            ArrayList<String> listOfReturnedxAPIStatementProperties = new ArrayList<String>();
            while (xAPIStatementProperties.hasNext()) {
                // loop to get the dynamic key
                String valuesToReturn = (String) xAPIStatementProperties.next();
                listOfReturnedxAPIStatementProperties.add(valuesToReturn);
            }
            String columnName = listOfReturnedxAPIStatementProperties.get(0);
            String columnName2 = listOfReturnedxAPIStatementProperties.get(1);
            List<AggItems> dataByCustomAggregate = statementTemplateRepo.findDataByCustomAggregate();
            // 【TODO】 这里逻辑需要调整
            List<AggItems> AggItemsColelct = dataByCustomAggregate.stream().filter(e -> e.getId().length() < 5).collect(Collectors.toList());
            List<Object> ids = AggItemsColelct.stream().map((AggItems::getId)).collect(Collectors.toList());
            List<Object> collect = AggItemsColelct.stream().map((AggItems::getResult)).collect(Collectors.toList());
            System.out.println(ids);
            System.out.println(collect);
            dataConverter.SetOpenLapDataColumn(
                    columnName,
                    OpenLAPColumnDataType.Numeric,
                    true,
                    (ArrayList) ids,
                    "",
                    ""
            );
            dataConverter.SetOpenLapDataColumn(
                    columnName2,
                    OpenLAPColumnDataType.Numeric,
                    true,
                    (ArrayList) collect,
                    "",
                    ""
            );
        }
        return dataConverter.getDataSet();
    }

    @Override
    public List<LrsObjects> getCustomQueryAll(int pageNumber, int pageSize) {
        Query query = new Query();
        query.skip((pageNumber - 1) * pageSize); //skip records
        query.limit(pageSize); //limit return records
        List<LrsObjects> documents = mongoTemplate.find(query, LrsObjects.class, "statements");
        return documents;
    }


    //  Created by: Shoeb Joarder
    //	Custom query to the LRS to retrieve unique values
    @Override
    public OpenLAPDataSet getCustomQueryUnique(
            ObjectId organizationId,
            ObjectId lrsId,
            QueryParameters queryParameters
    ) throws JSONException, OpenLAPDataColumnException {
        Gson gson = new Gson();
        String query = gson.toJson(queryParameters.getQuery());
        String statementDuration = gson.toJson(queryParameters.getStatementDuration());
        String parametersToReceive = gson.toJson(queryParameters.getParametersToBeReturnedInResult());

        DBObject queryObject = (DBObject) JSON.parse(query);
        @SuppressWarnings("deprecation")
        DBObject statementDurationObject = (DBObject) JSON.parse(statementDuration);
        @SuppressWarnings("deprecation")
        DBObject parametersToReceiveObject = (DBObject) JSON.parse(parametersToReceive);

        JSONObject xAPIStatement = new JSONObject(parametersToReceive);
        Iterator<?> xAPIStatementProperties = xAPIStatement.keys();
        ArrayList<String> listOfReturnedxAPIStatementProperties = new ArrayList<String>();
        while (xAPIStatementProperties.hasNext()) {
            String valuesToReturn = (String) xAPIStatementProperties.next();
            listOfReturnedxAPIStatementProperties.add(valuesToReturn);
        }
        Map<String, ArrayList<Object>> map = new HashMap();

        for (Statement statements : statementsRepo.findDataByCustomQuery(queryObject, statementDurationObject, parametersToReceiveObject, organizationId, lrsId)) {
            String statement = new Gson().toJson(statements.getStatement());
            JSONObject statementObject = new JSONObject(statement);

            JSONObject xAPIObject = null;
            for (int countReturnParameters = 0;
                 countReturnParameters < listOfReturnedxAPIStatementProperties.size();
                 countReturnParameters++
            ) {
                try {
                    String returnKeys = listOfReturnedxAPIStatementProperties.get(countReturnParameters);
                    String[] xAPIObjectsToReturn = returnKeys.split("\\.");
                    for (int returnObjectCount = 1; returnObjectCount < xAPIObjectsToReturn.length - 1; returnObjectCount++) {
                        if (returnObjectCount == 1) {
                            xAPIObject = statementObject.getJSONObject(xAPIObjectsToReturn[returnObjectCount]);
                        } else {
                            try {
                                xAPIObject = xAPIObject.getJSONObject(xAPIObjectsToReturn[returnObjectCount]);
                            } finally {
                                try {
                                    JSONArray o = xAPIObject.getJSONArray(xAPIObjectsToReturn[returnObjectCount]);
                                    for (int i = 0; i < o.length(); i++) {
                                        JSONObject inputJSON = (JSONObject) o.get(i);
                                        for (int j = returnObjectCount + 1; j < xAPIObjectsToReturn.length - 1; j++) {
                                            xAPIObject = inputJSON.getJSONObject(xAPIObjectsToReturn[j]);
                                            if (j == xAPIObjectsToReturn.length - 2) {
                                                if (xAPIObject.has(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1])) {
                                                    if (map.containsKey(returnKeys))
                                                        map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                                                    else {
                                                        map.put(returnKeys, new ArrayList<Object>());
                                                        map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } catch (JSONException e) {
                                    continue;
                                }
                            }
                        }
                    }
                    if (xAPIObject.has(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1])) {
                        if (map.containsKey(returnKeys))
                            map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                        else {
                            map.put(returnKeys, new ArrayList<Object>());
                            map.get(returnKeys).add(xAPIObject.get(xAPIObjectsToReturn[xAPIObjectsToReturn.length - 1]));
                        }
                    }
                } catch (JSONException e) {
                    continue;
                }
            }
        }
        Set<String> columnNames = map.keySet();
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        for (String columnName : columnNames) {
            ArrayList<Object> listOfList = map.get(columnName);
            ArrayList<Object> uniqueList = (ArrayList<Object>) listOfList.stream().distinct().collect(Collectors.toList());
            dataConverter.SetOpenLapDataColumn(
                    columnName,
                    OpenLAPColumnDataType.Text,
                    true,
                    uniqueList,
                    "",
                    ""
            );
        }
        return dataConverter.getDataSet();
    }

    //  Fetches all the object types
    @Override
    public OpenLAPDataSet getActivityTypes(
            ObjectId organizationId,
            ObjectId lrsId
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfObjectTypes = new ArrayList<>();
        for (LrsObjects objectType : statementsRepo.findActivityTypes(organizationId, lrsId)) {
            String statement = new Gson().toJson(objectType.getStatement());
            JSONObject statementObject = new JSONObject(statement);

            JSONObject objectObject = statementObject.getJSONObject("object");
            JSONObject definitionObject = objectObject.getJSONObject("definition");
            try {
                if (!listOfObjectTypes.contains(definitionObject.get("type"))) {
                    listOfObjectTypes.add(definitionObject.get("type"));
                }
            } catch (JSONException e) {
                continue;
            }
        }
        dataConverter.SetOpenLapDataColumn(
                "activityTypes",
                OpenLAPColumnDataType.Text,
                true,
                listOfObjectTypes,
                "List of all the object / activity types in LRS",
                "statement.object.definition.type"

        );
        return dataConverter.getDataSet();
    }

    //  Fetches all the object names
    @Override
    public OpenLAPDataSet getActivityTypeNames(
            ObjectId organizationId,
            ObjectId lrsId,
            String type
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfObjectNames = new ArrayList<>();
        ArrayList<Object> listOfObjectDisplayLanguage = new ArrayList<>();
        for (LrsObjects object : statementsRepo.findActivityTypeNames(organizationId, lrsId, type)) {
            String statement = new Gson().toJson(object.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject objectObject = statementObject.getJSONObject("object");
            JSONObject definitionObject = objectObject.getJSONObject("definition");
            try {
                JSONObject nameObject = definitionObject.getJSONObject("name");
                Iterator<?> nameKey = nameObject.keys();
                while (nameKey.hasNext()) {
                    String DynamicLanguageKey = (String) nameKey.next();
                    if (!listOfObjectNames.contains(nameObject.get(DynamicLanguageKey))) {
                        listOfObjectNames.add(nameObject.get(DynamicLanguageKey));
                        listOfObjectDisplayLanguage.add("statement.object.definition.name." + DynamicLanguageKey);
                    }
                }
            } catch (JSONException e) {
                continue;
            }
        }
        dataConverter.SetOpenLapDataColumn(
                "activityNames",
                OpenLAPColumnDataType.Text,
                true,
                listOfObjectNames,
                "List of all the object / activity names searched by the type of object / activity " +
                        "(language type has been avoided, recommended not to use id for query, instead use the value)",
                "Use the displayLanguage data for generating query"
        );
        dataConverter.SetOpenLapDataColumn(
                "displayLanguage",
                OpenLAPColumnDataType.Text,
                true,
                listOfObjectDisplayLanguage,
                "List of all display Language",
                "statement.object.definition.name"
        );
        return dataConverter.getDataSet();
    }

    //	Fetches the extension ID of the object
    @Override
    public OpenLAPDataSet getActivityTypeExtensionId(
            ObjectId organizationId,
            ObjectId lrsId,
            String type
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfExtensionId = new ArrayList<>();
        for (LrsObjects object : statementsRepo.findActivityTypeExtensionId(
                organizationId,
                lrsId,
                type
        )) {
            String statement = new Gson().toJson(object.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject objectObject = statementObject.getJSONObject("object");
            JSONObject definitionObject = objectObject.getJSONObject("definition");
            try {
                JSONObject extensionObject = definitionObject.getJSONObject("extensions");
                Iterator<?> extensionKey = extensionObject.keys();
                while (extensionKey.hasNext()) {
                    String DynamicExtensionKey = (String) extensionKey.next();
                    if (!listOfExtensionId.contains((DynamicExtensionKey))) {
                        listOfExtensionId.add((DynamicExtensionKey));
                    }
                }
            } catch (JSONException e) {
                continue;
            }
        }
        dataConverter.SetOpenLapDataColumn(
                "activityExtensionIds",
                OpenLAPColumnDataType.Text,
                true,
                listOfExtensionId,
                "Provides the list of associated extension IDs of a particular object / activity type",
                "statement.object.definition.extensions"
        );
        return dataConverter.getDataSet();
    }

    //	Fetches the object attributes using object type, name & extensionId
    @Override
    public OpenLAPDataSet getActivityTypeExtensionProperties(
            ObjectId organizationId,
            ObjectId lrsId,
            String type,
            String extensionId
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfAttributesByExtensionId = new ArrayList<>();
        for (LrsObjects object : statementsRepo.findActivityTypeExtensionProperties(
                organizationId,
                lrsId,
                "statement.object.definition.extensions",
                type,
                extensionId
        )) {
            String statement = new Gson().toJson(object.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject objectObject = statementObject.getJSONObject("object");
            JSONObject definitionObject = objectObject.getJSONObject("definition");

            try {
                JSONObject extensionObject = definitionObject.getJSONObject("extensions");
                JSONObject extensionDetails = extensionObject.getJSONObject(extensionId);
                Iterator<?> extensionDetailsKey = extensionDetails.keys();
                while (extensionDetailsKey.hasNext()) {
                    String DynamicExtensionDetailsKey = (String) extensionDetailsKey.next();
                    if (!listOfAttributesByExtensionId.contains((DynamicExtensionDetailsKey))) {
                        listOfAttributesByExtensionId.add((DynamicExtensionDetailsKey));
                    }
                }
            } catch (JSONException e) {
                continue;
            }

        }
        dataConverter.SetOpenLapDataColumn(
                "activityProperties",
                OpenLAPColumnDataType.Text,
                true,
                listOfAttributesByExtensionId,
                "Provides a list of all the attributes for a particular object / activity type",
                "statement.object.definition.extensions." + extensionId
        );
        return dataConverter.getDataSet();
    }

    //	Fetches the attribute values of a specified attribute of an object
    @Override
    public OpenLAPDataSet getActivityTypeExtensionPropertyValues(
            ObjectId organizationId,
            ObjectId lrsId,
            String extensionId,
            String attribute
    ) throws JSONException, OpenLAPDataColumnException {
        OpenLapDataConverter dataConverter = new OpenLapDataConverter();
        ArrayList<Object> listOfAttributeValuesByExtensionId = new ArrayList<>();
        for (LrsObjects object : statementsRepo.findActivityTypeExtensionPropertyValues(
                organizationId,
                lrsId,
                "statement",
                "object",
                "definition",
                "extensions",
                extensionId,
                attribute
        )) {
            String statement = new Gson().toJson(object.getStatement());
            JSONObject statementObject = new JSONObject(statement);
            JSONObject objectObject = statementObject.getJSONObject("object");
            JSONObject definitionObject = objectObject.getJSONObject("definition");
            JSONObject extensionObject = definitionObject.getJSONObject("extensions");
            if (!extensionObject.toString().equals("{}")) {
                JSONObject extensionDetails = extensionObject.getJSONObject(extensionId);
                if (!listOfAttributeValuesByExtensionId.contains(extensionDetails.get(attribute))) {
                    listOfAttributeValuesByExtensionId.add(extensionDetails.get(attribute));
                }
            }
        }
        dataConverter.SetOpenLapDataColumn(
                attribute,
                OpenLAPColumnDataType.Text,
                true,
                listOfAttributeValuesByExtensionId,
                "",
                ""
        );
        return dataConverter.getDataSet();
    }


}
