package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.dataset.OpenLAPDataSet;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AddNewVisualizationSuggestionRequest {
	private Long visualizationMethodId;
	private OpenLAPDataSet olapDataSet;

	public Long getVisualizationMethodId() {
		return visualizationMethodId;
	}

	public void setVisualizationMethodId(Long visualizationMethodId) {
		this.visualizationMethodId = visualizationMethodId;
	}

	public OpenLAPDataSet getOlapDataSet() {
		return olapDataSet;
	}

	public void setOlapDataSet(OpenLAPDataSet olapDataSet) {
		this.olapDataSet = olapDataSet;
	}
}
