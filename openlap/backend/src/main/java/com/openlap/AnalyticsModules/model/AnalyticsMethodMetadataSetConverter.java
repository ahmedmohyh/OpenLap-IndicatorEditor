package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;

import javax.persistence.AttributeConverter;
import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * An object Mapper for the DataAccessLayer to convert an AnalyticsMethodMetadata sets to a String during persistence
 * operations
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
public class AnalyticsMethodMetadataSetConverter implements AttributeConverter<Set<AnalyticsMethods>, String> {

	ObjectMapper mapper = new ObjectMapper();

	@Override
	public String convertToDatabaseColumn(Set<AnalyticsMethods> attribute) {
		try {
			return mapper.writeValueAsString(attribute);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return attribute.toString();
		}
	}

	@Override
	public Set<AnalyticsMethods> convertToEntityAttribute(String dbData) {
		try {
			return mapper.readValue(dbData, new TypeReference<Set<AnalyticsMethods>>() {
			});
		} catch (IOException e) {
			e.printStackTrace();
			return new LinkedHashSet<AnalyticsMethods>();
		}
	}
}
