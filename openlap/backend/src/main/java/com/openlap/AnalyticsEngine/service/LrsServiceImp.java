package com.openlap.AnalyticsEngine.service;

import com.openlap.AnalyticsEngine.dto.OpenLapDataConverter;
import com.openlap.AnalyticsEngine.model.Lrs;
import com.openlap.AnalyticsEngine.repo.LrsRepo;
import com.openlap.dataset.OpenLAPColumnDataType;
import com.openlap.dataset.OpenLAPDataSet;
import com.openlap.exceptions.OpenLAPDataColumnException;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class LrsServiceImp implements LrsService {

	@Autowired
	private LrsRepo lrsRepo;

	@Override
	public OpenLAPDataSet listOfLrsByOrganization(ObjectId organizationId)
			throws OpenLAPDataColumnException, JSONException {
		ArrayList listOfLrsIds = new ArrayList();
		ArrayList listOfLrsTitles = new ArrayList();

		for (Lrs lrs : lrsRepo.findLrsByOrganizationsId(organizationId)) {
			listOfLrsIds.add(lrs.getId());
			listOfLrsTitles.add(lrs.getTitle());
		}
		OpenLapDataConverter dataConveter = new OpenLapDataConverter();
		dataConveter.SetOpenLapDataColumn(
				"LrsIds",
				OpenLAPColumnDataType.Text,
				true, listOfLrsIds,
				"",
				""
		);
		dataConveter.SetOpenLapDataColumn(
				"LrsTitles",
				OpenLAPColumnDataType.Text,
				true, listOfLrsTitles,
				"",
				""
		);
		return dataConveter.getDataSet();
	}

}
