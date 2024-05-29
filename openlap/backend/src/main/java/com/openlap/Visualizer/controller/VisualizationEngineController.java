package com.openlap.Visualizer.controller;

import com.openlap.Visualizer.dtos.error.BaseErrorDTO;
import com.openlap.Visualizer.dtos.request.GenerateVisualizationCodeRequest;
import com.openlap.Visualizer.dtos.response.GenerateVisualizationCodeResponse;
import com.openlap.Visualizer.exceptions.VisualizationCodeGenerationException;
import com.openlap.Visualizer.service.VisualizationEngineService;
import com.openlap.exceptions.UnTransformableData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * A Spring controller which exposes the API of the VisualizationEngine. The endpoints provide functionality to generate
 * client visualization code
 *
 * @author Bassim Bashir
 */
@RestController
public class VisualizationEngineController {

	@Autowired
	VisualizationEngineService visualizationEngineService;

	@RequestMapping(value = "/generateVisualizationCode", method = RequestMethod.POST)
	public GenerateVisualizationCodeResponse generateVisualizationCode(@RequestBody GenerateVisualizationCodeRequest generateVisualizationCodeRequest) {
		GenerateVisualizationCodeResponse visualizationCodeResponse = new GenerateVisualizationCodeResponse();
		//check which service method to invoke

		try {
			if (generateVisualizationCodeRequest.getLibraryId() == null && generateVisualizationCodeRequest.getTypeId() == null)
				visualizationCodeResponse.setVisualizationCode(visualizationEngineService.generateClientVisualizationCode(generateVisualizationCodeRequest.getLibraryName(), generateVisualizationCodeRequest.getTypeName(), generateVisualizationCodeRequest.getDataSet(), generateVisualizationCodeRequest.getPortConfiguration(), generateVisualizationCodeRequest.getParams()));
			else
				visualizationCodeResponse.setVisualizationCode(visualizationEngineService.generateClientVisualizationCodes(generateVisualizationCodeRequest.getLibraryId(), generateVisualizationCodeRequest.getTypeId(), generateVisualizationCodeRequest.getDataSet(), generateVisualizationCodeRequest.getPortConfiguration(), generateVisualizationCodeRequest.getParams()));
		} catch (InstantiationException e) {
			e.printStackTrace();
			return null;
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			return null;
		}

		return visualizationCodeResponse;
	}

	@ExceptionHandler(VisualizationCodeGenerationException.class)
	public ResponseEntity<Object> handleVisualizationCodeGenerationException(VisualizationCodeGenerationException exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(UnTransformableData.class)
	public ResponseEntity<Object> handleDataTransformationException(UnTransformableData exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
