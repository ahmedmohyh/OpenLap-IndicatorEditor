package com.openlap.Visualizer.exceptions;

public class UnTransformableData extends BaseException {
	public UnTransformableData(String message) {
		super(message, UnTransformableData.class.getSimpleName(), "");
	}
}
