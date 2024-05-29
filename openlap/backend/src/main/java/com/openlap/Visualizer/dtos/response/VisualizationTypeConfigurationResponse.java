package com.openlap.Visualizer.dtos.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.Visualizer.dtos.VisualizationTypeConfiguration;


@JsonIgnoreProperties(ignoreUnknown = true)
public class VisualizationTypeConfigurationResponse {

	private VisualizationTypeConfiguration typeConfiguration;

	public VisualizationTypeConfiguration getTypeConfiguration() {
		return typeConfiguration;
	}

	public void setTypeConfiguration(VisualizationTypeConfiguration typeConfiguration) {
		this.typeConfiguration = typeConfiguration;
	}
}
