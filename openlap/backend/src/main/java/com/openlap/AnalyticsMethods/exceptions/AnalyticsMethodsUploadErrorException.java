package com.openlap.AnalyticsMethods.exceptions;

import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Custom Exception to be thrown whenever an erroneous AnalyticsMethods is attempted to be uploaded.
 */
public class AnalyticsMethodsUploadErrorException extends RuntimeException {

	private static final Logger log =
			LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	public AnalyticsMethodsUploadErrorException(String message) {
		super(message);
		log.error("Upload Error Exception: " + message);
	}

}
