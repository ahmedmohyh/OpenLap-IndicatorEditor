package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.Visualizer.model.VisualizationLibrary;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdateVisualizationLibraryRequest {

	private VisualizationLibrary visualizationLibrary;

	public VisualizationLibrary getVisualizationLibrary() {
		return visualizationLibrary;
	}

	public void setVisualizationLibrary(VisualizationLibrary visualizationLibrary) {
		this.visualizationLibrary = visualizationLibrary;
	}
}
