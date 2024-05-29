package com.openlap.AnalyticsEngine.controller;

import com.fasterxml.jackson.databind.MappingIterator;
import com.openlap.AnalyticsEngine.dto.XapiStatement;
import com.openlap.AnalyticsEngine.service.CsvToJsonService;
import com.openlap.AnalyticsEngine.service.ImportStatementsToLLService;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
public class ImportCsvController {

	@Autowired
	private CsvToJsonService converter;
	@Autowired
	private ImportStatementsToLLService xapiStatements;

	@RequestMapping("/import/csvdata")
	@ResponseBody
	public String index() throws IOException {
		int response;
		String result;
		MappingIterator<XapiStatement> csvStatements = converter.readStatementsFromCsv("learning_locker_dump.csv");
		System.out.println(csvStatements);
		JSONArray xapiStatementsFromCsv = converter.convertCsvStatementsToXapiStatements(csvStatements);
		response = xapiStatements.sendStatementsToLL(xapiStatementsFromCsv);
		result = "Status code" + response + "\nReturned from Learning Locker";
		if (response == 200) {

			result = result + xapiStatementsFromCsv.length() + "\nRecords Inserted successfully";

		} else {
			result = result + "\nRecords Can't be inserted into Learning Locker";
		}
		return result;
	}
}
