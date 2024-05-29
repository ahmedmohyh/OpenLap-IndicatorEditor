package com.openlap.AnalyticsEngine.dto.Request;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.AnalyticsModules.model.AnalyticsGoal;

import java.util.List;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class QuestionSaveRequest {
	AnalyticsGoal goal;
	private String question;
	private List<IndicatorSaveRequest> indicators;
	private String createdBy;

	public QuestionSaveRequest() {
	}

	public QuestionSaveRequest(String question, AnalyticsGoal goal, List<IndicatorSaveRequest> indicators, String createdBy) {
		this.question = question;
		this.goal = goal;
		this.indicators = indicators;
		this.createdBy = createdBy;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getQuestion() {
		return this.question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public AnalyticsGoal getGoal() {
		return this.goal;
	}

	public void setGoalID(AnalyticsGoal goal) {
		this.goal = goal;
	}

	public List<IndicatorSaveRequest> getIndicators() {
		return this.indicators;
	}

	public void setIndicators(List<IndicatorSaveRequest> indicators) {
		this.indicators = indicators;
	}
}
