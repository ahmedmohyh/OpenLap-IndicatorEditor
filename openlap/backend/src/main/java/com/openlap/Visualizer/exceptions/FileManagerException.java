package com.openlap.Visualizer.exceptions;

public class FileManagerException extends BaseException {

	public FileManagerException(String message) {
		super(message, FileManagerException.class.getSimpleName(), "");
	}
}
