package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;

/**
 * Created by Arham on 1/3/2017.
 */
public class IndicatorEntry implements Serializable {

	//HashMap to store the ids of the analytics method and json of HashMap for additional input parameters
	String id;
	String indicatorName;

	public IndicatorEntry() {
	}

	public IndicatorEntry(String id, String indicatorName) {
		this.id = id;
		this.indicatorName = indicatorName;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIndicatorName() {
		return indicatorName;
	}

	public void setIndicatorName(String indicatorName) {
		this.indicatorName = indicatorName;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "IndicatorEntry{" +
					"id=" + id +
					", indicatorName='" + indicatorName + '\'' +
					'}';
		}
	}
}
