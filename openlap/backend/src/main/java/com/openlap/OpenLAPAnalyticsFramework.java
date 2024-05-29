package com.openlap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

/**
 * Main Spring Application of the OpenLAP-AnalyticsFramework
 */
@SpringBootApplication
public class OpenLAPAnalyticsFramework {

	public static String API_VERSION_NUMBER;

	/**
	 * Start the application
	 *
	 * @paramargs
	 */
	public static void main(String[] args) {
		SpringApplication.run(OpenLAPAnalyticsFramework.class, args);
	}

}
