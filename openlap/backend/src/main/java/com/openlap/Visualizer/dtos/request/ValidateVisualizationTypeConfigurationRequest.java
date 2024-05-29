package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ValidateVisualizationTypeConfigurationRequest {

	private OpenLAPPortConfigImp configurationMapping;

	public OpenLAPPortConfigImp getConfigurationMapping() {

		return configurationMapping;
	}

	public void setConfigurationMapping(OpenLAPPortConfigImp configurationMapping) {
		this.configurationMapping = configurationMapping;
	}
}
