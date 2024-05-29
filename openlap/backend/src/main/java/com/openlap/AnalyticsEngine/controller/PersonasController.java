package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.service.PersonasService;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/v1/personas/")
public class PersonasController {
	@Autowired
	private PersonasService personasService;

	/**
	 * @return JsonArray of all the persons
	 * @throws IOException
	 * @throws OpenLAPDataColumnException
	 */
//	@PreAuthorize("hasRole('site_admin')")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public OpenLAPDataSet list(@RequestParam("OrganizationId") ObjectId OrganizationId)
			throws IOException, OpenLAPDataColumnException {

		return personasService.listOfPersonNamesByOrganization(OrganizationId);
	}
}
