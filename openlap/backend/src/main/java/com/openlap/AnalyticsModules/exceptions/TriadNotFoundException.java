package com.openlap.AnalyticsModules.exceptions;

import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Custom Exception to be thrown whenever the Triad is not found.
 */
public class TriadNotFoundException extends RuntimeException {
	private static final Logger log =
			LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	public TriadNotFoundException(String message) {
		super(message);
		log.error("Triad not found: " + message);
	}
}
