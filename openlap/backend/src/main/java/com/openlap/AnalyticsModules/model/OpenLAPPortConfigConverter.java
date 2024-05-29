package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;

/**
 * An object Mapper for the DataAccessLayer to convert an OpenLAPPortConfigImp sets to a String during persistence
 * operations
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
@Converter
public class OpenLAPPortConfigConverter implements AttributeConverter<OpenLAPPortConfigImp, String> {

	ObjectMapper mapper = new ObjectMapper();

	@Override
	public String convertToDatabaseColumn(OpenLAPPortConfigImp attribute) {
		try {
			return mapper.writeValueAsString(attribute);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return attribute.toString();
		}
	}

	@Override
	public OpenLAPPortConfigImp convertToEntityAttribute(String dbData) {
		try {
			return mapper.readValue(dbData, OpenLAPPortConfigImp.class);
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}
}
