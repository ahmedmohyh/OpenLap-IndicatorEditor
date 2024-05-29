package com.openlap.AnalyticsEngine.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class QuestionResponse {
	private String id;
	private String name;
	private int indicatorCount;

	public QuestionResponse() {
	}

	public QuestionResponse(String id, String name, int indicatorCount) {
		this.name = name;
		this.id = id;
		this.indicatorCount = indicatorCount;
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

	public int getIndicatorCount() {
		return this.indicatorCount;
	}

	public void setIndicatorCount(int indicatorCount) {
		this.indicatorCount = indicatorCount;
	}
}
