package com.openlap.AnalyticsEngine.Exceptions;

import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Custom Exception to be thrown whenever the Analytics Engine is not able to find any item.
 */
public class ItemNotFoundException extends RuntimeException {

	private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);
	private final String errorCode;

	public ItemNotFoundException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
		log.error("ItemNotFoundException: " + message);
	}

	public String getErrorCode() {
		return errorCode;
	}
}
