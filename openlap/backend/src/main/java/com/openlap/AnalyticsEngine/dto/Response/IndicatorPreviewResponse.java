package com.openlap.AnalyticsEngine.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class IndicatorPreviewResponse {
	private String visualizationCode;
	private boolean isSuccess;
	private String errorMessage;

	public IndicatorPreviewResponse() {
	}

	public String getVisualizationCode() {
		return this.visualizationCode;
	}

	public void setVisualizationCode(String visualizationCode) {
		this.visualizationCode = visualizationCode;
	}

	public String getErrorMessage() {
		return this.errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public boolean isSuccess() {
		return this.isSuccess;
	}

	public void setSuccess(boolean success) {
		this.isSuccess = success;
	}
}
