package com.openlap.AnalyticsEngine.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class QuestionSaveResponse {
	private boolean isQuestionSaved;
	private String errorMessage;
	private String questionRequestCode;
	private List<IndicatorSaveResponse> indicatorSaveResponses;

	public QuestionSaveResponse() {
	}

	public boolean isQuestionSaved() {
		return this.isQuestionSaved;
	}

	public void setQuestionSaved(boolean questionSaved) {
		this.isQuestionSaved = questionSaved;
	}

	public String getErrorMessage() {
		return this.errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getQuestionRequestCode() {
		return this.questionRequestCode;
	}

	public void setQuestionRequestCode(String questionRequestCode) {
		this.questionRequestCode = questionRequestCode;
	}

	public List<IndicatorSaveResponse> getIndicatorSaveResponses() {
		return this.indicatorSaveResponses;
	}

	public void setIndicatorSaveResponses(List<IndicatorSaveResponse> indicatorSaveResponses) {
		this.indicatorSaveResponses = indicatorSaveResponses;
	}
}
