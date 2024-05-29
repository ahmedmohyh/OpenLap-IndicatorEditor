package com.openlap.Visualizer.dtos.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.dataset.OpenLAPDataSet;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateVisualizationCodeRequest {

	private String libraryName;
	private String typeName;
	private String libraryId;
	private String typeId;
	private OpenLAPDataSet dataSet;
	private OpenLAPPortConfigImp portConfiguration;
	private Map<String, Object> params;

	public String getLibraryName() {
		return libraryName;
	}

	public void setLibraryName(String libraryName) {
		this.libraryName = libraryName;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getLibraryId() {
		return libraryId;
	}

	public void setLibraryId(String libraryId) {
		this.libraryId = libraryId;
	}

	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}

	public OpenLAPDataSet getDataSet() {
		return dataSet;
	}

	public void setDataSet(OpenLAPDataSet dataSet) {
		this.dataSet = dataSet;
	}

	public OpenLAPPortConfigImp getPortConfiguration() {
		return portConfiguration;
	}

	public void setPortConfiguration(OpenLAPPortConfigImp portConfiguration) {
		this.portConfiguration = portConfiguration;
	}

	public Map<String, Object> getParams() {
		return params;
	}

	public void setParams(Map<String, Object> params) {
		this.params = params;
	}
}
