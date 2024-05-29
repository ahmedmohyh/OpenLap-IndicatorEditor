package com.openlap.AnalyticsMethods.controller;

import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodLoaderException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodNotFoundException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsUploadErrorException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.AnalyticsMethods.services.AnalyticsMethodsService;
import com.openlap.AnalyticsModules.model.OpenLAPPortConfigImp;
import com.openlap.Common.controller.GenericResponseDTO;
import com.openlap.dataset.OpenLAPColumnConfigData;
import com.openlap.dataset.OpenLAPDataSetConfigValidationResult;
import com.openlap.dynamicparam.OpenLAPDynamicParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
 * A spring Controller that acts as a facade, exposing an API for handling JSON requests to the Analytics Methods
 * macro component of the OpenLAP
 * <p>
 * Created by Faizan Riaz on 12/06/19.
 */
@Controller
@RequestMapping("/AnalyticsMethod/")
public class AnalyticsMethodsController {

	final AnalyticsMethodsService analyticsMethodsService;

	@Autowired
	public AnalyticsMethodsController(AnalyticsMethodsService analyticsMethodsService) {
		this.analyticsMethodsService = analyticsMethodsService;
	}

	@RequestMapping(
			value = "/PopulateAnalyticsMethods",
			method = RequestMethod.GET
	)
	public
	@ResponseBody
	boolean populateAnalyticsMethods() {
		return analyticsMethodsService.populateAnalyticsMethods();
	}

	/**
	 * HTTP endpoint handler method that lists all the Metadata of the  AnalyticsMethods available
	 *
	 * @return A List of the available AnalyticsMethods
	 */
	@RequestMapping(
			value = "AnalyticsMethods",
			method = RequestMethod.GET
	)
	public
	@ResponseBody
	List<AnalyticsMethods> viewAllAnalyticsMethods() {
		return analyticsMethodsService.getAllAnalyticsMethodsFromDatabase();
	}

	/**
	 * HTTP endpoint handler method that returns the Metadata of the Analytics Method of the specified ID
	 *
	 * @param id ID of the AnalyticsMethods to view
	 * @return The AnalyticsMethods with Metadata of the specified ID
	 */
	@RequestMapping(
			value = "/AnalyticsMethods/{id}",
			method = RequestMethod.GET
	)
	public
	@ResponseBody
	AnalyticsMethods viewAnalyticsMethod(@PathVariable String id) {
		return analyticsMethodsService.viewAnalyticsMethod(id);
	}

	/**
	 * HTTP endpoint handler method that enables to post an AnalyticsMethods to the Server to be validated and
	 * made available for usage.
	 *
	 * @param jarFile          The JAR file with the implementation of the AnalyticsMethods
	 */
	@RequestMapping(
			method = RequestMethod.POST
	)
	public
	@ResponseBody
	ResponseEntity<String> uploadAnalyticsMethod(@RequestParam("jarFile") MultipartFile jarFile) {
		try {
			analyticsMethodsService.uploadAnalyticsMethod(jarFile);
			return new ResponseEntity<>("Operation successful!", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	/**
	 * HTTP endpoint handler method that allows to update an AnalyticsMethods to the Server to be validated and made
	 * available for usage.
	 *
	 * @param jarFile          The JAR file with the implementation of the AnalyticsMethods
	 * @return The Metadata of the uploaded AnalyticsMethods if deemed valid by the OpenLAP
	 */
	@RequestMapping(
			value = "/update",
			method = RequestMethod.POST
	)
	public
	@ResponseBody
	ResponseEntity<String>  updateAnalyticsMethod(@RequestParam("jarFile") MultipartFile jarFile) {
		try {
			analyticsMethodsService.updateAnalyticsMethod(jarFile);
			return new ResponseEntity<>("Operation successful!", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	/**
	 * HTTP endpoint handler method that allows to validate an OpenLAPPortConfigImp of a specific AnalyticsMethods.
	 *
	 * @param configurationMapping The OpenLAPPortConfigImp to be validated
	 * @param id                   The ID of the AnalyticsMethods Metadata to be validated against the OpenLAPPortConfigImp.
	 * @return An Object with the validation information of the OpenLAPPortConfigImp against the specified Analytics
	 * Method.
	 */
	@RequestMapping(
			value = "/AnalyticsMethods/{id}/validateConfiguration",
			method = RequestMethod.PUT
	)
	public
	@ResponseBody
	OpenLAPDataSetConfigValidationResult validateConfiguration
	(
			@RequestBody OpenLAPPortConfigImp configurationMapping,
			@PathVariable String id
	) {
		return analyticsMethodsService.validateConfiguration(id, configurationMapping);
	}

	/**
	 * HTTP endpoint handler method that returns the OpenLAPColumnConfigData of the input ports of a
	 * specific AnalyticsMethods
	 *
	 * @param id ID of the AnalyticsMethods Metadata
	 * @return A list of OpenLAPColumnConfigData corresponding to the input ports of the AnalyticsMethods
	 */
	@RequestMapping(
			value = "AnalyticsMethods/{id}/getInputPorts",
			method = RequestMethod.GET
	)
	public @ResponseBody
	List<OpenLAPColumnConfigData> getInputPorts(@PathVariable String id) {
		return analyticsMethodsService.GetInputPortsForMethod(id);
	}


	/**
	 * HTTP endpoint handler method that returns the OpenLAPColumnConfigData of the output ports of a
	 * specific AnalyticsMethods
	 *
	 * @param id ID of the AnalyticsMethods Metadata
	 * @return A list of OpenLAPColumnConfigData corresponding to the output ports of the AnalyticsMethods
	 */
	@RequestMapping(
			value = "AnalyticsMethods/{id}/getOutputPorts",
			method = RequestMethod.GET
	)
	public @ResponseBody
	List<OpenLAPColumnConfigData> getOutputPorts(@PathVariable String id) {
		return analyticsMethodsService.GetOutputPortsForMethod(id);
	}

	/**
	 * HTTP endpoint handler method that returns the OpenLAPDynamicParam of the dynamic paramaters of a
	 * specific AnalyticsMethods
	 *
	 * @param id ID of the AnalyticsMethods Metadata
	 * @return A list of OpenLAPColumnConfigData corresponding to the output ports of the AnalyticsMethods
	 */
	@RequestMapping(
			value = "AnalyticsMethods/{id}/getDynamicParams",
			method = RequestMethod.GET
	)
	public @ResponseBody
	List<OpenLAPDynamicParam> GetDynamicParams(
			@PathVariable String id) {
		return analyticsMethodsService.GetDynamicParamsForMethod(id);
	}

	/**
	 * HTTP endpoint handler method for deleting AnalyticsMethods
	 *
	 * @param id id of the AnalyticsMethods to be deleted
	 * @return GenericResponseDTO with deletion confirmation
	 */
	@RequestMapping(
			value = "/{id}",
			method = RequestMethod.DELETE
	)
	public
	@ResponseBody
	ResponseEntity<String> deleteAnalyticsMethod(@PathVariable String id) {
		try {
			analyticsMethodsService.deleteMethodWithJar(id);
			return new ResponseEntity<>("Operation successful!", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			throw new AnalyticsMethodsBadRequestException(e.getMessage());
		}
	}

	//region ExceptionHandlers

	/**
	 * Handler for AnalyticsMethodNotFoundException.
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler(AnalyticsMethodNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public
	@ResponseBody
	GenericResponseDTO handleMethodNotFoundException(AnalyticsMethodNotFoundException e,
																									 HttpServletRequest request) {
		GenericResponseDTO errorObject = new GenericResponseDTO(
				HttpStatus.NOT_FOUND.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);

		return errorObject;
	}

	/**
	 * Handler for AnalyticsMethodsUploadErrorException and IOException
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler({AnalyticsMethodsUploadErrorException.class, IOException.class})
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public
	@ResponseBody
	GenericResponseDTO handleMethodsUploadErrorException(Exception e,
																											 HttpServletRequest request) {
		GenericResponseDTO errorObject = new GenericResponseDTO(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);

		return errorObject;
	}

	/**
	 * Handler for AnalyticsMethodsBadRequestException
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler(AnalyticsMethodsBadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public
	@ResponseBody
	GenericResponseDTO handleMethodsUploadBadRequestException(AnalyticsMethodsBadRequestException e,
																														HttpServletRequest request) {
		GenericResponseDTO errorObject = new GenericResponseDTO(
				HttpStatus.BAD_REQUEST.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);

		return errorObject;
	}

	/**
	 * Handler for AnalyticsMethodLoaderException
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler(AnalyticsMethodLoaderException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public
	@ResponseBody
	GenericResponseDTO handleMethodsUploadBadRequestException(AnalyticsMethodLoaderException e,
																														HttpServletRequest request) {
		GenericResponseDTO errorObject = new GenericResponseDTO(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);

		return errorObject;
	}
	//endregion
}
