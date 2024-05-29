package com.openlap.Visualizer.exceptions;

/**
 * Created by bas on 1/12/16.
 */
public class VisualizationTypeNotFoundException extends BaseException {

	public VisualizationTypeNotFoundException(String message) {
		super(message, VisualizationTypeNotFoundException.class.getSimpleName(), "");
	}
}
