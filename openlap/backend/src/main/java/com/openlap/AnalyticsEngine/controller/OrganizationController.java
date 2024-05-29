package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.service.OrganizationService;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/v1/organizations/")
public class OrganizationController {
	@Autowired
	private OrganizationService organizationService;

	/**
	 * @param authentication
	 * @return List of organization for logged user
	 * @throws IOException
	 * @throws OpenLAPDataColumnException
	 */
//	@PreAuthorize("hasRole('site_admin')")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public OpenLAPDataSet list(Authentication authentication) throws IOException, OpenLAPDataColumnException {
		return organizationService.getOrganizationForLoggedUser(authentication);

	}
}
