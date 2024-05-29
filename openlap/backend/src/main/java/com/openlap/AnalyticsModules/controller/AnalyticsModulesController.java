package com.openlap.AnalyticsModules.controller;

import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsUploadErrorException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.AnalyticsModules.exceptions.AnalyticsGoalNotFoundException;
import com.openlap.AnalyticsModules.exceptions.AnalyticsModulesBadRequestException;
import com.openlap.AnalyticsModules.exceptions.TriadNotFoundException;
import com.openlap.AnalyticsModules.model.AnalyticsGoal;
import com.openlap.AnalyticsModules.model.Triad;
import com.openlap.AnalyticsModules.service.AnalyticsModulesService;
import com.openlap.Common.controller.GenericResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * A spring Controller that acts as a facade, exposing an API for handling JSON requests to the Analytics Modules
 * macro component of the OpenLAP
 * <p>
 * Created by Faizan Riaz 12.06.2019
 */
@Controller
@RequestMapping("/analyticsmodule/")
public class AnalyticsModulesController {

	public static final String ANALYTICS_GOAL_ACTION_ACTIVATE = "activate";
	public static final String ANALYTICS_GOAL_ACTION_DEACTIVATE = "deactivate";

	final AnalyticsModulesService modulesService;

	@Autowired
	public AnalyticsModulesController(AnalyticsModulesService modulesService) {
		this.modulesService = modulesService;
	}

	//region Triads

	/**
	 * HTTP endpoint handler method to save a Triad.
	 *
	 * @param triad to be saved
	 * @return JSON representation of the saved Triad with an ID.
	 */
	@PostMapping("/AnalyticsModules/Triads/")
	@ResponseBody
	public Triad saveTriad(@RequestBody Triad triad) {
		return modulesService.saveTriad(triad);
	}

	/**
	 * HTTP endpoint handler method to get a Triad by its ID.
	 *
	 * @param id of the requested Triad
	 * @return JSON representation of the Triad with the requested ID
	 */
	@GetMapping("/AnalyticsModules/Triads/{id}")
	@ResponseBody
	public Triad getTriadById(@PathVariable String id) {
		return modulesService.getTriadById(id);
	}

	/**
	 * HTTP endpoint handler method to get all Triads
	 *
	 * @return JSON representation of all the Triads
	 */
	@GetMapping("/AnalyticsModules/TriadsByUser")
	@ResponseBody
	public List<Triad> getTriadsByUser(@RequestParam String userName) {
		return modulesService.getTriadsByUser(userName);
	}


	@GetMapping("/AnalyticsModules/Triads")
	@ResponseBody
	public List<Triad> getAllTriads() {
		return modulesService.getAllTriads();
	}


	/**
	 * HTTP endpoint handler method for updating Triad
	 *
	 * @param triad Data of the Triad to be updated.
	 * @param id    of the Triad to be updated
	 * @return updated Triad
	 */
	@PutMapping("/AnalyticsModules/Triads/{id}")
	@ResponseBody
	public Triad updateTriad(@RequestBody Triad triad, @PathVariable String id) {
		return modulesService.updateTriad(triad, id);
	}

	/**
	 * HTTP endpoint handler method for deleting Triad
	 *
	 * @param id id of the Triad to be deleted
	 * @return GenericResponseDTO with deletion confirmation
	 */
	@DeleteMapping("/AnalyticsModules/Triads/{id}")
	@ResponseBody
	public GenericResponseDTO deleteTriad(@PathVariable String id) {
		modulesService.deleteTriad(id);
		return new GenericResponseDTO(HttpStatus.OK.value(),
				"Triad with id {" + id + "} deleted");
	}

	//endregion

	//region AnalyticsGoals

	@GetMapping("/AnalyticsModules/AnalyticsGoals/PopulateSampleGoals")
	@ResponseBody
	public boolean populateSampleGoals() {
		return modulesService.populateSampleGoals();
	}

	/**
	 * HTTP endpoint handler method to get a AnalyticsGoal by its ID.
	 *
	 * @param id of the requested AnalyticsGoal
	 * @return JSON representation of the AnalyticsGoal with the requested ID
	 */
	@GetMapping("/AnalyticsModules/AnalyticsGoals/{id}")
	@ResponseBody
	public AnalyticsGoal getAnalyticsGoalById(@PathVariable String id) {
		return modulesService.getAnalyticsGoalById(id);
	}

	/**
	 * HTTP endpoint handler method to save a AnalyticsGoal.
	 *
	 * @param AnalyticsGoal to be saved
	 * @return JSON representation of the saved AnalyticsGoal with an ID.
	 */
	@PostMapping("/AnalyticsModules/AnalyticsGoals/")
	@ResponseBody
	public AnalyticsGoal saveAnalyticsGoal(@RequestBody AnalyticsGoal AnalyticsGoal) {
		return modulesService.saveAnalyticsGoal(AnalyticsGoal);
	}

	/**
	 * HTTP endpoint handler method for Activating/Deactivating a AnalyticsGoal
	 *
	 * @param id     of the AnalyticsGoal
	 * @param action "activate" or "deactivate"
	 * @return the updated AnalyticsGoal with the sent status
	 */
	@PutMapping("/AnalyticsModules/AnalyticsGoals/{id}/{action}")
	@ResponseBody
	public AnalyticsGoal authorizeAnalyticsGoal(@PathVariable String id, @PathVariable String action) {
		if (action.equals(ANALYTICS_GOAL_ACTION_ACTIVATE)) {
			return modulesService.setAnalyticsGoalActive(id, true);
		} else if (action.equals(ANALYTICS_GOAL_ACTION_DEACTIVATE)) {
			return modulesService.setAnalyticsGoalActive(id, false);
		} else throw new AnalyticsMethodsBadRequestException("Invalid request for Analytics Goal");
	}

	/**
	 * HTTP endpoint handler method to get all AnalyticsGoals
	 *
	 * @return JSON representation of all the AnalyticsGoals
	 */
	@GetMapping("/AnalyticsModules/AnalyticsGoals/")
	@ResponseBody
	public List<AnalyticsGoal> getAllAnalyticsGoals() {
		return modulesService.getAllAnalyticsGoals();
	}

	/**
	 * HTTP endpoint handler method to get all AnalyticsGoals
	 *
	 * @return JSON representation of all the AnalyticsGoals
	 */
	@GetMapping("/AnalyticsModules/ActiveAnalyticsGoals/")
	@ResponseBody
	public List<AnalyticsGoal> getActiveAnalyticsGoals() {
		return modulesService.getActiveAnalyticsGoals();
	}

	/**
	 * HTTP endpoint handler method for attaching an AnalyticsMethod to a AnalyticsGoal
	 *
	 * @param AnalyticsGoalId  id of the AnalyticsGoal
	 * @param analyticsMethods of the AnalyticsMethod to be related with the AnalyticsGoal
	 * @return the AnalyticsGoal with the attached analyticsMethodMetadata
	 */
	@PutMapping("/AnalyticsModules/AnalyticsGoals/{AnalyticsGoalId}/addAnalyticsMethod")
	@ResponseBody
	public AnalyticsGoal addAnalyticsMethodToAnalyticsGoal(
			@PathVariable String AnalyticsGoalId,
			@RequestBody AnalyticsMethods analyticsMethods) {
		return modulesService.addAnalyticsMethodToAnalyticsGoal(AnalyticsGoalId, analyticsMethods);
	}

	/**
	 * HTTP endpoint handler method for updating AnalyticsGoal
	 *
	 * @param AnalyticsGoal Data of the AnalyticsGoal to be updated. Note that the isActive, id and the AnalyticsMethods
	 *                      will not be updated using this method.
	 * @param id            of the AnalyticsGoal to be updated
	 * @return updated AnalyticsGoal
	 */
	@PutMapping("/AnalyticsModules/AnalyticsGoals/{id}")
	@ResponseBody
	public AnalyticsGoal updateAnalyticsGoal(@RequestBody AnalyticsGoal AnalyticsGoal,
																					 @PathVariable String id) {
		return modulesService.updateAnalyticsGoal(AnalyticsGoal, id);
	}

	/**
	 * HTTP endpoint handler method for deleting AnalyticsGoal
	 *
	 * @param id id of the AnalyticsGoal to be deleted
	 * @return GenericResponseDTO with deletion confirmation
	 */
	@DeleteMapping("/AnalyticsModules/AnalyticsGoals/{id}")
	@ResponseBody
	public GenericResponseDTO deleteAnalyticsGoal(@PathVariable String id) {
		modulesService.deleteAnalyticsGoal(id);
		return new GenericResponseDTO(HttpStatus.OK.value(),
				"Analytics Goal with id {" + id + "} deleted");
	}
	//endregion

	//region ExceptionHandlers

	/**
	 * Handler for TriadNotFoundException, AnalyticsMethodsUploadErrorException and AnalyticsGoalNotFoundException.
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler({TriadNotFoundException.class,
			AnalyticsMethodsUploadErrorException.class,
			AnalyticsGoalNotFoundException.class})
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public GenericResponseDTO handleMethodNotFoundException(Exception e,
																													HttpServletRequest request) {

		return new GenericResponseDTO(
				HttpStatus.NOT_FOUND.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);
	}

	/**
	 * Handler for AnalyticsModulesBadRequestException.
	 * It returns the appropriate HTTP Error code.
	 *
	 * @param e       exception
	 * @param request HTTP request
	 * @return A GenericResponseDTO with the information about the exception and its cause.
	 */
	@ExceptionHandler(AnalyticsModulesBadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)

	@ResponseBody
	public GenericResponseDTO handleMethodNotFoundException(AnalyticsModulesBadRequestException e,
																													HttpServletRequest request) {

		return new GenericResponseDTO(
				HttpStatus.BAD_REQUEST.value(),
				e.getClass().getName(),
				e.getMessage(),
				request.getServletPath()
		);
	}

	//endregion
}
