package com.openlap.Visualizer.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.dataset.OpenLAPDataSet;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VisualizationTypeConfiguration {

	private OpenLAPDataSet input;
	private OpenLAPDataSet output;
	public OpenLAPDataSet getInput() {
		return input;
	}
	public void setInput(OpenLAPDataSet input) {
		this.input = input;
	}

	public OpenLAPDataSet getOutput() {
		return output;
	}
	public void setOutput(OpenLAPDataSet output) {
		this.output = output;
	}
}
