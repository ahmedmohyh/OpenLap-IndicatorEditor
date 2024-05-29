package com.openlap.AnalyticsEngine.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.openlap.AnalyticsEngine.dto.XapiStatement;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;


@Service("csvToJsonConverter")
public class CsvToJsonServiceImp implements CsvToJsonService {

	@Override
	public MappingIterator<XapiStatement> readStatementsFromCsv(String inputFile) {
		// TODO Auto-generated method stub
		InputStream csvStream;
		MappingIterator<XapiStatement> csvStatements = null;
		try {
			csvStream = new FileInputStream(inputFile);
			CsvSchema bootstrap = CsvSchema.builder().build().withHeader();
			CsvMapper csvMapper = new CsvMapper();
			csvStatements = csvMapper.readerFor(XapiStatement.class).with(bootstrap).readValues(csvStream);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return csvStatements;
	}

	@Override
	public JSONArray convertCsvStatementsToXapiStatements(MappingIterator<XapiStatement> csvStatements) throws IOException {
		// TODO Auto-generated method stub
		JSONArray xApiStatements = new JSONArray();
		for (XapiStatement csvStatement : csvStatements.readAll()) {
			JSONObject statement = new JSONObject();
			try {
				JSONObject verb = new JSONObject(csvStatement.getVerb());
				JSONObject actor = new JSONObject(csvStatement.getActor());
				JSONObject object = new JSONObject(csvStatement.getObject());

				statement.put("verb", verb);
				statement.put("actor", actor);
				statement.put("object", object);
				if (!csvStatement.getResult().isEmpty()) {
					JSONObject result = new JSONObject(csvStatement.getResult());
					statement.put("result", result);
				}
				if (!csvStatement.getContext().isEmpty()) {
					JSONObject context = new JSONObject(csvStatement.getContext());
					statement.put("context", context);
				}

				xApiStatements.put(statement);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return xApiStatements;
	}

}
