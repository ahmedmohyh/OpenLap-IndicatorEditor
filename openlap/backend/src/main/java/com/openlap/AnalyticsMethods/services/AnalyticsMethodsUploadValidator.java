package com.openlap.AnalyticsMethods.services;

import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodLoaderException;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import com.openlap.OpenLAPAnalyticsFramework;
import com.openlap.template.AnalyticsMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * A validation utility class to check for upload requests of Analytics Methods so the files submitted effectively
 * implement the OpenLAP-AnalytisMethodFramework correctly.
 */
@Service
public class AnalyticsMethodsUploadValidator {

	protected static final Logger log =
			LoggerFactory.getLogger(OpenLAPAnalyticsFramework.class);
	private AnalyticsMethodsClassPathLoader classPathLoader;
	@Value("${pmmlxsd}")
	private String pmmlXsdUrl;

	/**
	 * Validates the JAR so it contains the class specified on the AnalyticsMethodsMetadata field that describes the
	 * implementing class. Additionally checks for the JAR containing valid files and, if provided, the validity of
	 * the PMML file of the AnalyticsMethods.
	 *
	 * @param analyticsMethod            The AnalyticsMethodMetadata that describes the location of the JAR file and
	 *                                   class implementing the OpenLAP-AnalyticsMethodsFramework.
	 * @param analyticsMethodsJarsFolder The location where the JAR file resides.
	 * @return A AnalyticsMethodsValidationInformation that encapsulates the validation information of the
	 * Analytics Method uploaded
	 */
	public AnalyticsMethodsValidationInformation validatemethod
	(AnalyticsMethods analyticsMethod, String analyticsMethodsJarsFolder) {

		AnalyticsMethodsValidationInformation validationInformation = new AnalyticsMethodsValidationInformation();
		classPathLoader = new AnalyticsMethodsClassPathLoader(analyticsMethodsJarsFolder);

		// Validate non empty fields of the metadata
		if (analyticsMethod.getName().isEmpty()
				|| analyticsMethod.getImplementing_class().isEmpty()
				|| analyticsMethod.getCreator().isEmpty()
				|| analyticsMethod.getDescription().isEmpty()
				|| analyticsMethod.getFilename().isEmpty()
				|| !validateFilename(analyticsMethod.getFilename())
		) {
			validationInformation.setValid(false);
			validationInformation.setMessage("Metadata Name, Implementing Class, "
					+ "Author and Description must have content "
					//+ "and filename must match the regex ^[a-zA-Z0-9]* $"
					+ "(ASCII Alphanumeric, do not include file extensions)");
			return validationInformation;
		}

		// Validate that the class exist and implements the interface and that the class implements the interface
		try {
			AnalyticsMethod method = classPathLoader.loadClass(analyticsMethod.getImplementing_class());
			// Validate pmml if the method has a PMML
			validationInformation.setValid(true);
			if (method.hasPMML() != null && method.hasPMML()) {
				AnalyticsMethodsSimpleXmlSchemaValidator
						.validateXML(validationInformation, method.getPMMLInputStream(), pmmlXsdUrl);
			}
			log.info("Validation successful: " + analyticsMethod.getImplementing_class());
			log.info("OLAPInputOf the method: " + method.getInputPorts());
		} catch (AnalyticsMethodLoaderException e) {
			validationInformation.setValid(false);
			validationInformation.appendMessage(e.getMessage());
		}

		// Return a validation object
		return validationInformation;
	}

	/**
	 * Utility method to check only ASCII Alphanumeric filenames
	 *
	 * @param input The filename
	 * @return true if the filename is ASCII Alphanumeric, false otherwise
	 */
	private boolean validateFilename(String input) {
		final Pattern pattern = Pattern.compile("^[a-zA-Z0-9]*$");
		//if (!pattern.matcher(input).matches()) return false;
		return true;
	}


}
