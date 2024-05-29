package com.openlap.AnalyticsEngine.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.openlap.AnalyticsEngine.model.Question;
import com.openlap.AnalyticsModules.model.AnalyticsGoal;

import java.util.List;

@JsonIgnoreProperties(
		ignoreUnknown = true
)
public class QuestionIndicatorResponse {
	AnalyticsGoal goal;
	List<IndicatorSaveResponse> indicatorSaveResponses;
	private Question question;
	private List<IndicatorResponse> indicators;
	private String questionCode;


	public QuestionIndicatorResponse() {
	}

	public QuestionIndicatorResponse(Question question,
																	 AnalyticsGoal goal,
																	 List<IndicatorResponse> indicators,
																	 List<IndicatorSaveResponse> indicatorSaveResponses,
																	 String questionCode) {
		this.question = question;
		this.goal = goal;
		this.indicators = indicators;
		this.indicatorSaveResponses = indicatorSaveResponses;
		this.questionCode = questionCode;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public AnalyticsGoal getGoal() {
		return goal;
	}

	public void setGoal(AnalyticsGoal goal) {
		this.goal = goal;
	}

	public List<IndicatorResponse> getIndicators() {
		return indicators;
	}

	public void setIndicators(List<IndicatorResponse> indicators) {
		this.indicators = indicators;
	}

	public List<IndicatorSaveResponse> getIndicatorSaveResponses() {
		return indicatorSaveResponses;
	}

	public void setIndicatorSaveResponses(List<IndicatorSaveResponse> indicatorSaveResponses) {
		this.indicatorSaveResponses = indicatorSaveResponses;
	}

	public String getQuestionCode() {
		return questionCode;
	}

	public void setQuestionCode(String questionCode) {
		this.questionCode = questionCode;
	}

	@Override
	public String toString() {
		return "QuestionIndicatorResponse{" +
				"goal=" + goal +
				", question=" + question +
				", indicators=" + indicators +
				", indicatorSaveResponses=" + indicatorSaveResponses +
				", questionCode='" + questionCode + '\'' +
				'}';
	}
}
