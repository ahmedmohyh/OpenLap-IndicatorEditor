package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Faizan Riaz on 12.06.2019.
 */

public class AnalyticsMethodParam implements Serializable {

	//HashMap to store the ids of the analytics method and json of HashMap for additional input parameters

	String id;
	Map<String, String> additionalParams;

	public AnalyticsMethodParam() {
		additionalParams = new HashMap<String, String>();
	}

	public AnalyticsMethodParam(String id, Map<String, String> additionalParams) {
		this.id = id;
		this.additionalParams = additionalParams;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Map<String, String> getAdditionalParams() {
		return additionalParams;
	}

	public void setAdditionalParams(Map<String, String> additionalParams) {
		this.additionalParams = additionalParams;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "AnalyticsMethodEntry{" +
					"id=" + id +
					", additionalParams=" + additionalParams +
					'}';
		}
	}
}
