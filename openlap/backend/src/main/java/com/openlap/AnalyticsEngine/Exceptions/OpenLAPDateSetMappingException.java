package com.openlap.AnalyticsEngine.Exceptions;

import com.openlap.OpenLAPAnalyticsFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Arham Muslim
 * on 16-Mar-16.
 */
public class OpenLAPDateSetMappingException extends RuntimeException {
	private static final Logger log = LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);

	public OpenLAPDateSetMappingException(String message) {
		super(message);
		log.error("OpenLAPDateSetMappingException: " + message);
	}
}
