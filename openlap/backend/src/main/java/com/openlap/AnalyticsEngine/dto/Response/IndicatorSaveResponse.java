package com.openlap.AnalyticsEngine.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class IndicatorSaveResponse {
	private boolean isIndicatorSaved;
	private String errorMessage;
	private String indicatorClientID;
	private String indicatorRequestCode;

	public IndicatorSaveResponse() {
	}

	public boolean isIndicatorSaved() {
		return this.isIndicatorSaved;
	}

	public void setIndicatorSaved(boolean indicatorSaved) {
		this.isIndicatorSaved = indicatorSaved;
	}

	public String getErrorMessage() {
		return this.errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getIndicatorClientID() {
		return this.indicatorClientID;
	}

	public void setIndicatorClientID(String indicatorClientID) {
		this.indicatorClientID = indicatorClientID;
	}

	public String getIndicatorRequestCode() {
		return this.indicatorRequestCode;
	}

	public void setIndicatorRequestCode(String indicatorRequestCode) {
		this.indicatorRequestCode = indicatorRequestCode;
	}
}
