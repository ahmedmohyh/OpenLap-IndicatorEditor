package com.openlap.AnalyticsEngine.dto.Response;

import com.openlap.AnalyticsEngine.dto.QueryParameters;
import com.openlap.AnalyticsModules.model.*;
import com.openlap.dataset.OpenLAPDataSet;
import lombok.Data;

import java.util.List;
import java.util.Map;
@Data
public class IndicatorResponse {
	List<OpenLAPDataSetMergeMapping> dataSetMergeMappingList;
	private String id;
	private String name;
	private Map<String, QueryParameters> query;
	private IndicatorReference indicatorReference;
	private AnalyticsMethodReference analyticsMethodReference;
	private VisualizerReference visualizationReference;
	private Map<String, OpenLAPPortConfigImp> queryToMethodConfig;
	private OpenLAPPortConfigImp methodToVisualizationConfig;
	private Map<String, String> methodInputParams;
	private Map<String, String> visualizationInputParams;
	private Map<String, Object> additionalParams;
	private OpenLAPDataSet outputs;
	private String parameters;
	private String indicatorType;
	private String createdBy;
	private String indicatorRequestCode;

	public IndicatorResponse() {
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Map<String, QueryParameters> getQuery() {
		return this.query;
	}

	public void setQuery(Map<String, QueryParameters> query) {
		this.query = query;
	}

	public IndicatorReference getIndicatorReference() {
		return this.indicatorReference;
	}

	public void setIndicatorReference(IndicatorReference indicatorReference) {
		this.indicatorReference = indicatorReference;
	}

	public AnalyticsMethodReference getAnalyticsMethodReference() {
		return this.analyticsMethodReference;
	}

	public void setAnalyticsMethodReference(AnalyticsMethodReference analyticsMethodReference) {
		this.analyticsMethodReference = analyticsMethodReference;
	}

	public VisualizerReference getVisualizationReference() {
		return this.visualizationReference;
	}

	public void setVisualizationReference(VisualizerReference visualizationReference) {
		this.visualizationReference = visualizationReference;
	}

	public Map<String, OpenLAPPortConfigImp> getQueryToMethodConfig() {
		return this.queryToMethodConfig;
	}

	public void setQueryToMethodConfig(Map<String, OpenLAPPortConfigImp> queryToMethodConfig) {
		this.queryToMethodConfig = queryToMethodConfig;
	}

	public OpenLAPPortConfigImp getMethodToVisualizationConfig() {
		return this.methodToVisualizationConfig;
	}

	public void setMethodToVisualizationConfig(OpenLAPPortConfigImp methodToVisualizationConfig) {
		this.methodToVisualizationConfig = methodToVisualizationConfig;
	}

	public Map<String, String> getMethodInputParams() {
		return this.methodInputParams;
	}

	public void setMethodInputParams(Map<String, String> methodInputParams) {
		this.methodInputParams = methodInputParams;
	}

	public Map<String, String> getVisualizationInputParams() {
		return this.visualizationInputParams;
	}

	public void setVisualizationInputParams(Map<String, String> visualizationInputParams) {
		this.visualizationInputParams = visualizationInputParams;
	}

	public Map<String, Object> getAdditionalParams() {
		return this.additionalParams;
	}

	public void setAdditionalParams(Map<String, Object> additionalParams) {
		this.additionalParams = additionalParams;
	}

	public String getParameters() {
		return this.parameters;
	}

	public void setParameters(String parameters) {
		this.parameters = parameters;
	}

	public String getIndicatorType() {
		return this.indicatorType;
	}

	public void setIndicatorType(String indicatorType) {
		this.indicatorType = indicatorType;
	}

	public String getCreatedBy() {
		return this.createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public List<OpenLAPDataSetMergeMapping> getDataSetMergeMappingList() {
		return this.dataSetMergeMappingList;
	}

	public void setDataSetMergeMappingList(List<OpenLAPDataSetMergeMapping> dataSetMergeMappingList) {
		this.dataSetMergeMappingList = dataSetMergeMappingList;
	}
}
