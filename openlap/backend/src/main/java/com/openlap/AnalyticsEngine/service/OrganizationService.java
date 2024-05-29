package com.openlap.AnalyticsEngine.service;

import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.springframework.security.core.Authentication;

import java.io.IOException;

public interface OrganizationService {
	OpenLAPDataSet getOrganizationForLoggedUser(Authentication authentication)
			throws IOException, OpenLAPDataColumnException;
}
