package com.openlap.AnalyticsEngine.service;

import org.bson.types.ObjectId;
import org.json.JSONException;

import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;

public interface LrsService {
	OpenLAPDataSet listOfLrsByOrganization(ObjectId organizationId) throws OpenLAPDataColumnException, JSONException;
}
