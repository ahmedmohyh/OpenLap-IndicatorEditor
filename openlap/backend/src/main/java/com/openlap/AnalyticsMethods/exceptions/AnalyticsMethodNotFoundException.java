package com.openlap.AnalyticsMethods.exceptions;

import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Custom Exception to be thrown whenever an AnalyticsMethods is not found.
 */
public class AnalyticsMethodNotFoundException extends RuntimeException {

	private static final Logger log =
			LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	public AnalyticsMethodNotFoundException(String message) {
		super(message);
		log.error("Analytics Method not found: " + message);
	}

}
