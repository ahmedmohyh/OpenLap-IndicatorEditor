package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Faizan Riaz on 12.06.2019.
 */

public class AnalyticsMethodReference implements Serializable {

	Map<String, AnalyticsMethodParam> analyticsMethods;

	public AnalyticsMethodReference() {
		analyticsMethods = new HashMap<String, AnalyticsMethodParam>();
	}

	public Map<String, AnalyticsMethodParam> getAnalyticsMethods() {
		return analyticsMethods;
	}

	public void setAnalyticsMethods(Map<String, AnalyticsMethodParam> analyticsMethods) {
		this.analyticsMethods = analyticsMethods;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "AnalyticsMethodReference{" +
					"analyticsMethods=" + analyticsMethods +
					'}';
		}
	}
}
