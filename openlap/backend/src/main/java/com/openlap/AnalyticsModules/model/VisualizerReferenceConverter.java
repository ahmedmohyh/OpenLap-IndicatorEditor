package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import java.io.IOException;

/**
 * An object Mapper for the DataAccessLayer to convert an VisualizerReference sets to a String during persistence
 * operations
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
public class VisualizerReferenceConverter implements AttributeConverter<VisualizerReference, String> {
	ObjectMapper mapper = new ObjectMapper();

	@Override
	public String convertToDatabaseColumn(VisualizerReference attribute) {
		try {
			return mapper.writeValueAsString(attribute);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return attribute.toString();
		}
	}

	@Override
	public VisualizerReference convertToEntityAttribute(String dbData) {
		try {
			return mapper.readValue(dbData, VisualizerReference.class);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
}
