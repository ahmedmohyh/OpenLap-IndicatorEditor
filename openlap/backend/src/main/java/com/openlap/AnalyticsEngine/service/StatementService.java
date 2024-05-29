package com.openlap.AnalyticsEngine.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.openlap.AnalyticsEngine.dto.LrsObjects;
import com.openlap.AnalyticsEngine.dto.QueryParameters;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONException;

import java.util.List;

public interface StatementService {
    OpenLAPDataSet getAllActions(
            ObjectId organizationId,
            ObjectId lrsId
    ) throws JSONException, OpenLAPDataColumnException;

//	OpenLAPDataSet getActions(
//			ObjectId organizationId,
//			ObjectId lrsId,
//			String platform,
//			String activityType,
//			String activityNameId,
//			String activityName
//	) throws JSONException, OpenLAPDataColumnException;

    OpenLAPDataSet getAllStatementsByCustomQuery(
            ObjectId organizationId,
            ObjectId lrsId,
            QueryParameters queryParameters
    ) throws JSONException, OpenLAPDataColumnException, JsonProcessingException;

    OpenLAPDataSet getCustomQueryUnique(
            ObjectId organizationId,
            ObjectId lrsId,
            QueryParameters queryParameters
    ) throws JSONException, OpenLAPDataColumnException, JsonProcessingException;

    List<LrsObjects> getCustomQueryAll(
            int pageNumber,
            int pageSize
    ) throws JSONException, OpenLAPDataColumnException, JsonProcessingException;

    OpenLAPDataSet getActivityTypes(
            ObjectId organizationId,
            ObjectId lrsId
    ) throws JSONException, OpenLAPDataColumnException;

    OpenLAPDataSet getActivityTypeNames(
            ObjectId organizationId,
            ObjectId lrsId,
            String type
    ) throws JSONException, OpenLAPDataColumnException;

    OpenLAPDataSet getActivityTypeExtensionId(
            ObjectId organizationId,
            ObjectId lrsId,
            String type
    ) throws JSONException, OpenLAPDataColumnException;

    OpenLAPDataSet getActivityTypeExtensionProperties(
            ObjectId organizationId,
            ObjectId lrsId,
            String type,
            String extensionId
    ) throws JSONException, OpenLAPDataColumnException;


    OpenLAPDataSet getActivityTypeExtensionPropertyValues(
            ObjectId organizationId,
            ObjectId lrsId,
            String extensionId,
            String attribute
    ) throws JSONException, OpenLAPDataColumnException;


}
