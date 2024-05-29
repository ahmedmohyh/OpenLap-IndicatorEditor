package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.service.LrsService;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/v1/lrs/")
public class LrsController {

	@Autowired
	private LrsService lrsService;

	/**
	 * @param organizationId
	 * @return List of LRS of given organization
	 * @throws IOException
	 * @throws OpenLAPDataColumnException
	 * @throws JSONException
	 */
//	@PreAuthorize("hasRole('site_admin')")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public OpenLAPDataSet listOfLrsByOrganization(@RequestParam("OrganizationId") ObjectId organizationId)
			throws IOException, OpenLAPDataColumnException, JSONException {
		return lrsService.listOfLrsByOrganization(organizationId);
	}
}
