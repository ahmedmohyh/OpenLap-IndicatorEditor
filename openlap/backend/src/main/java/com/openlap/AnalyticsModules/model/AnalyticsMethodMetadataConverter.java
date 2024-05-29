package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;

import javax.persistence.AttributeConverter;
import java.io.IOException;

/**
 * An object Mapper for the DataAccessLayer to convert an AnalyticsMethodMetadata to a String during persistence
 * operations
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
public class AnalyticsMethodMetadataConverter implements AttributeConverter<AnalyticsMethods, String> {

	ObjectMapper mapper = new ObjectMapper();

	@Override
	public String convertToDatabaseColumn(AnalyticsMethods attribute) {
		try {
			return mapper.writeValueAsString(attribute);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return attribute.toString();
		}
	}

	@Override
	public AnalyticsMethods convertToEntityAttribute(String dbData) {
		try {
			return mapper.readValue(dbData, AnalyticsMethods.class);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
}
