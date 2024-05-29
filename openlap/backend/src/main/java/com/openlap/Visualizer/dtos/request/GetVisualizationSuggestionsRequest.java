package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.dataset.OpenLAPDataSet;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GetVisualizationSuggestionsRequest {

	private OpenLAPPortConfigImp olapPortConfiguration;
	private OpenLAPDataSet dataSetConfiguration;

	public OpenLAPPortConfigImp getOlapPortConfiguration() {
		return olapPortConfiguration;
	}

	public void setOlapPortConfiguration(OpenLAPPortConfigImp olapPortConfiguration) {
		this.olapPortConfiguration = olapPortConfiguration;
	}

	public OpenLAPDataSet getDataSetConfiguration() {
		return dataSetConfiguration;
	}

	public void setDataSetConfiguration(OpenLAPDataSet dataSetConfiguration) {
		this.dataSetConfiguration = dataSetConfiguration;
	}
}
