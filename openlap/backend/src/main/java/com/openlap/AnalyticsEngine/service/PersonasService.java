package com.openlap.AnalyticsEngine.service;

import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;

import java.io.IOException;

public interface PersonasService {
	OpenLAPDataSet listOfPersonNamesByOrganization(ObjectId OrganizationId)
			throws IOException, OpenLAPDataColumnException;
}
