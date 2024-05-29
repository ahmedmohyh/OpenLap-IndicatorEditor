package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.service.ActivityService;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/v1/activity/")
public class ActivityController {

	@Autowired
	private ActivityService activityService;

	/**
	 *  OrganizationId -The id of Organisation created in Learning Locker
	 * @param lrsId          - The id of lrs in which statements are being stored in learning
	 *                       locker
	 * @return List of all activities in OpenLAP-DataSet format
	 * @throws OpenLAPDataColumnException
	 * @throws JSONException
	 */
//	@PreAuthorize("hasRole('site_admin')")
	@RequestMapping(value = "/show/activites", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public OpenLAPDataSet activitiesList(@RequestParam("OrganizationId") ObjectId OrganizationId,
																			 @RequestParam("LrsId") ObjectId lrsId)
			throws OpenLAPDataColumnException, JSONException {
		return activityService.getActivities(OrganizationId, lrsId);
	}

	/**
	 * @param OrganizationId
	 * @param lrsId
	 * @param extensionId
	 * @param extensionContextKey
	 * @return
	 * @throws IOException
	 * @throws JSONException
	 * @throws OpenLAPDataColumnException
	 */
	@PreAuthorize("hasRole('site_admin')")
	@RequestMapping(
			value = "/show/activitesExtensionContextValues",
			method = RequestMethod.GET,
			produces = "application/json"
	)
	@ResponseBody
	public OpenLAPDataSet activitiesExtensionContextValues(@RequestParam("OrganizationId") ObjectId OrganizationId,
																												 @RequestParam("LrsId") ObjectId lrsId,
																												 @RequestParam("extensionId") String extensionId,
																												 @RequestParam("extensionContextKey") String extensionContextKey)
			throws IOException, JSONException, OpenLAPDataColumnException {
		return activityService.getActivitiesExtensionContextValues(OrganizationId, lrsId, extensionId,
				extensionContextKey);
	}

}
