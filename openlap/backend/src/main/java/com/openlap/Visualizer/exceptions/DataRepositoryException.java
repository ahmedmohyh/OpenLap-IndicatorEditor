package com.openlap.Visualizer.exceptions;

public class DataRepositoryException extends BaseException {

	public DataRepositoryException(String message) {
		super(message, DataRepositoryException.class.getSimpleName(), "");
	}
}
