package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.Visualizer.model.VisualizationType;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateVisualizationTypeRequest {

	private VisualizationType visualizationType;

	public VisualizationType getVisualizationType() {
		return visualizationType;
	}

	public void setVisualizationType(VisualizationType visualizationType) {
		this.visualizationType = visualizationType;
	}
}
