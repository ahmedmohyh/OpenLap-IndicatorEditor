package com.openlap.Visualizer.controller;

import com.openlap.Visualizer.dtos.error.BaseErrorDTO;
import com.openlap.Visualizer.dtos.request.UpdateVisualizationLibraryRequest;
import com.openlap.Visualizer.dtos.request.ValidateVisualizationTypeConfigurationRequest;
import com.openlap.Visualizer.dtos.response.*;
import com.openlap.Visualizer.exceptions.*;
import com.openlap.Visualizer.model.VisualizationLibrary;
import com.openlap.Visualizer.model.VisualizationType;
import com.openlap.Visualizer.service.VisualizationFrameworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * A Spring controller which exposes an API for the client to upload new VisualizationFrameworks as well as
 * perform CRUD operations on VisualizationType and their VisualizationFrameworks
 *
 * @author Bassim Bashir
 */
@RestController
@RequestMapping("/frameworks")
public class VisualizationFrameworkController {

	@Autowired
	VisualizationFrameworkService visualizationFrameworkService;

	@RequestMapping(value = "/{idOfLibrary}/update", method = RequestMethod.PUT)
	public UpdateVisualizationLibraryResponse updateVisualizationLibrary(@PathVariable String idOfLibrary, @RequestBody UpdateVisualizationLibraryRequest updateVisualizationLibraryRequest) {
		UpdateVisualizationLibraryResponse response = new UpdateVisualizationLibraryResponse();
		response.setVisualizationLibrary(visualizationFrameworkService.updateVisualizationLibraryAttributes(updateVisualizationLibraryRequest.getVisualizationLibrary(), idOfLibrary));
		return response;
	}

	@RequestMapping(value = "/{idOfLibrary}", method = RequestMethod.GET)
	public VisualizationLibrary getLibraryDetails(@PathVariable String idOfLibrary) {

		return visualizationFrameworkService.findVisualizationLibrary(idOfLibrary);
	}

	@RequestMapping(value = "/{idOfLibrary}/methods/{idOfType}/LibraryScript", method = RequestMethod.GET)
	public String GetLibraryScript(@PathVariable String idOfLibrary, @PathVariable String idOfType) {
		return visualizationFrameworkService.getLibraryScript(idOfLibrary, idOfType);
	}

	@RequestMapping(value = "/{idOfLibrary}/methods/{idOfType}", method = RequestMethod.GET)
	public VisualizationType getFrameworkMethodDetails(@PathVariable String idOfLibrary, @PathVariable String idOfType) {
		return visualizationFrameworkService.findVisualizationType(idOfType);
	}

	@RequestMapping(method = RequestMethod.POST)
	public UploadVisualizationLibraryResponse uploadNewVisualizationLibrary(@RequestParam("jarFile") MultipartFile jarFile) {
		try {
			visualizationFrameworkService.uploadVisualizationLibraries(jarFile);
			UploadVisualizationLibraryResponse response = new UploadVisualizationLibraryResponse();
			response.setSuccess(true);
			return response;
		} catch (VisualizationLibraryUploadException exception) {
			throw new VisualizationLibraryUploadException(exception.getMessage());
		}
	}

	/**
	 * HTTP endpoint handler method for deleting VisulizationLibrary
	 *
	 * @param id id of the VisulizationLibrary to be deleted
	 * @return GenericResponseDTO with deletion confirmation
	 */
	@RequestMapping(value = "/library/{id}", method = RequestMethod.DELETE)
	public
	@ResponseBody
	ResponseEntity<String> deleteVisualizationLibrary(@PathVariable String id) {
		try {
			visualizationFrameworkService.deleteVisualizationLibrary(id);
			return new ResponseEntity<>("Operation successful!", HttpStatus.OK);
		} catch (VisualizationLibraryDeletionException exception) {
			throw new VisualizationLibraryDeletionException(exception.getMessage());
		}
	}

	@RequestMapping(value = "/type/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<String> deleteVisualizationType(@PathVariable String id) {
		try {
			visualizationFrameworkService.deleteVisualizationType(id);
			return new ResponseEntity<>("Operation successful!", HttpStatus.OK);
		} catch (VisualizationTypeDeletionException exception) {
			throw new VisualizationTypeDeletionException(exception.getMessage());
		}
	}

	@RequestMapping(value = "/visualizationTypes/{libraryId}", method = RequestMethod.GET)
	public List<VisualizationType> getVisualizationTypes(@PathVariable String libraryId) {
		try {
			return visualizationFrameworkService.fetchAllVisualizationTypeForCertainLibrary(libraryId);
		} catch (Exception e) {
			throw new VisualizationTypeNotFoundException(e.getMessage());
		}
	}

	@RequestMapping(value = "/{idOfLibrary}/data_transformer/{idOfTransformer}", method = RequestMethod.DELETE)
	public DeleteDataTransformerResponse deleteDataTransformer(@PathVariable String idOfTransformer) {
		DeleteDataTransformerResponse response = new DeleteDataTransformerResponse();
		//  response.setSuccess(visualizationFrameworkService.deleteDataTransformer(idOfTransformer));
		return response;
	}

	@RequestMapping(value = "/{idOfLibrary}/methods/{id}", method = RequestMethod.PUT)
	public VisualizationType updateVisualizationTypeAttributes(@PathVariable String idOfLibrary, @PathVariable String id, @RequestBody VisualizationType visualizationType) {
		// UpdateVisualizationTypeResponse response = new UpdateVisualizationTypeResponse();
		return visualizationFrameworkService.updateVisualizationTypeAttributes(visualizationType, id);
	}

	@RequestMapping(value = "/{idOfLibrary}/methods/{idOfType}/validateConfiguration", method = RequestMethod.POST)
	public ValidateVisualizationTypeConfigurationResponse validateMethodConfiguration(@PathVariable String idOfLibrary, @PathVariable String idOfType, @RequestBody ValidateVisualizationTypeConfigurationRequest validateVisualizationTypeConfigurationRequest) {
		ValidateVisualizationTypeConfigurationResponse response = new ValidateVisualizationTypeConfigurationResponse();
		try {
			response.setConfigurationValid(visualizationFrameworkService.validateVisualizationTypeConfiguration(idOfType, validateVisualizationTypeConfigurationRequest.getConfigurationMapping()));
		} catch (DataSetValidationException exception) {
			response.setConfigurationValid(false);
			response.setValidationMessage(exception.getMessage());
		} catch (Exception exception) {
			response.setConfigurationValid(false);
			response.setValidationMessage(exception.getMessage());
		}
		return response;
	}

	@RequestMapping(value = "/{idOfLibrary}/methods/{idOfType}/configuration", method = RequestMethod.GET)
	public VisualizationTypeConfigurationResponse getTypeConfiguration(@PathVariable String idOfLibrary, @PathVariable String idOfType) {
		VisualizationTypeConfigurationResponse response = new VisualizationTypeConfigurationResponse();
		response.setTypeConfiguration(visualizationFrameworkService.getTypeConfiguration(idOfType));
		return response;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<VisualizationLibrary> getVisualizationLibraries() {
		return visualizationFrameworkService.fetchAllVisualizationLibrariesFromDatabase();
	}


	@RequestMapping(value = "/PopulateVisualizations", method = RequestMethod.GET)
	public boolean populateVisualizations() {
		return visualizationFrameworkService.populateVisualizations();
	}

	@ExceptionHandler(VisualizationLibraryUploadException.class)
	public ResponseEntity<Object> handleVisualizationLibraryUploadException(VisualizationLibraryUploadException exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(VisualizationLibraryDeletionException.class)
	public ResponseEntity<Object> handleVisualizationLibraryDeletionException(VisualizationLibraryDeletionException exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(VisualizationLibraryNotFoundException.class)
	public ResponseEntity<Object> handleVisualizationLibraryNotFoundException(VisualizationLibraryNotFoundException exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(VisualizationTypeNotFoundException.class)
	public ResponseEntity<Object> handleVisualizationMethodNotFoundException(VisualizationTypeNotFoundException exception, HttpServletRequest request) {
		BaseErrorDTO error = BaseErrorDTO.createBaseErrorDTO(exception.getMessage(), "", "");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<>(error, headers, HttpStatus.NOT_FOUND);
	}

}
