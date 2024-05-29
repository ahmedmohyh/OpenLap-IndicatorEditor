package com.openlap.Visualizer.exceptions;

public class VisualizationLibraryNotFoundException extends BaseException {

	public VisualizationLibraryNotFoundException(String message) {
		super(message, VisualizationLibraryNotFoundException.class.getSimpleName(), "");
	}
}
