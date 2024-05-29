package com.openlap.AnalyticsEngine.service;

import com.fasterxml.jackson.databind.MappingIterator;
import com.openlap.AnalyticsEngine.dto.XapiStatement;
import org.json.JSONArray;

import java.io.IOException;

public interface CsvToJsonService {

	MappingIterator<XapiStatement> readStatementsFromCsv(String InptFile);

	JSONArray convertCsvStatementsToXapiStatements(MappingIterator<XapiStatement> csvStatements) throws IOException;
}
