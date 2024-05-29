package com.openlap.AnalyticsEngine.service;

import com.openlap.AnalyticsEngine.dto.OpenLapDataConverter;
import com.openlap.AnalyticsEngine.model.Organization;
import com.openlap.AnalyticsEngine.model.User;
import com.openlap.AnalyticsEngine.repo.OrganizationRepo;
import com.openlap.AnalyticsEngine.repo.UserRepo;
import com.openlap.dataset.OpenLAPColumnDataType;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class OrganizationServiceImp implements OrganizationService {
	@Autowired
	private OrganizationRepo organizationRepo;

	@Autowired
	private UserRepo userRepo;

	@Override
	public OpenLAPDataSet getOrganizationForLoggedUser(Authentication authentication)
			throws IOException, OpenLAPDataColumnException {
		User user = userRepo.findByEmail(authentication.getName());

		ObjectId userId = new ObjectId(user.getId());
		ArrayList listOfOrganizationIds = new ArrayList();
		ArrayList listOfOrganizationNames = new ArrayList();
		for (Organization organization : organizationRepo.findOrganizationsByUserId(userId)) {
			listOfOrganizationIds.add(organization.getId());
			listOfOrganizationNames.add(organization.getName());
		}
		OpenLapDataConverter dataConveter = new OpenLapDataConverter();
		dataConveter.SetOpenLapDataColumn(
				"OrganizationIds",
				OpenLAPColumnDataType.Text,
				true,
				listOfOrganizationIds,
				"",
				""
		);
		dataConveter.SetOpenLapDataColumn(
				"OrganizationNames",
				OpenLAPColumnDataType.Text,
				true,
				listOfOrganizationNames,
				"",
				""
		);
		return dataConveter.getDataSet();

	}

}
