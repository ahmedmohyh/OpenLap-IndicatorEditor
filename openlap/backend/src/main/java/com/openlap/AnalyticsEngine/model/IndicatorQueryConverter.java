package com.openlap.AnalyticsEngine.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsEngine.dto.QueryParameters;

import javax.persistence.AttributeConverter;
import java.io.IOException;
import java.util.Map;

/**
 * An object Mapper for the DataAccessLayer to convert an IndicatorQuery to a String during persistence
 * operations
 */
//public class IndicatorQueryConverter implements AttributeConverter<Indicator, String> {
public class IndicatorQueryConverter implements AttributeConverter<Map<String, QueryParameters>, String> {

	ObjectMapper mapper = new ObjectMapper();

	@Override
	public String convertToDatabaseColumn(Map<String, QueryParameters> indicator) {
		try {
			return mapper.writeValueAsString(indicator);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return indicator.toString();
		}
	}

	@Override
	public Map<String, QueryParameters> convertToEntityAttribute(String dbData) {
		try {
			// TODO: Check for composite indicator might become an issue
			// Possible Solution: store it in a variable and manually check the values
			//noinspection unchecked
			return mapper.readValue(dbData, Map.class);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
}
