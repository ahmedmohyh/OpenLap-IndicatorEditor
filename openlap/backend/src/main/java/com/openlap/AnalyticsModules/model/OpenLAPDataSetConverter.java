package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.dataset.OpenLAPDataSet;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;

/**
 An object Mapper for the DataAccessLayer to convert an OpenLAPPortConfigImp sets to a String during persistence
 operations
 <p>
 Created by Ao Sun on 03.04.2023.
 */
@Converter
public class OpenLAPDataSetConverter implements AttributeConverter<OpenLAPDataSet, String> {

    ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(OpenLAPDataSet attribute) {
        try {
            return attribute == null ? null : mapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return attribute.toString();
        }
    }

    @Override
    public OpenLAPDataSet convertToEntityAttribute(String dbData) {
        try {
            return dbData == null ? null : mapper.readValue(dbData, OpenLAPDataSet.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
