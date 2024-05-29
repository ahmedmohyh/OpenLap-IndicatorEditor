package com.openlap.AnalyticsEngine.controller;

import com.openlap.AnalyticsEngine.service.AnalyticsEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

@Controller
public class IViewController {

	final AnalyticsEngineService analyticsEngineService;

	@Autowired
	public IViewController(AnalyticsEngineService analyticsEngineService) {
		this.analyticsEngineService = analyticsEngineService;
	}

	@RequestMapping(value = "/iview/indicator")
	public String getIViewIndicator(@RequestParam String triadID,
																	@RequestParam(value = "preview", required = false, defaultValue = "false") boolean preview,
																	HttpServletRequest request,
																	Model model) {
		String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
		return analyticsEngineService.generateIndicatorIViewTemplate(triadID, baseUrl, model, preview);
	}


	@RequestMapping(value = "/iview/question")
	public String getIViewQuestion(@RequestParam String questionId,
																 HttpServletRequest request,
																 Model model) {
		String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
		return analyticsEngineService.generateQuestionIViewTemplate(questionId, baseUrl, model);
	}

}
