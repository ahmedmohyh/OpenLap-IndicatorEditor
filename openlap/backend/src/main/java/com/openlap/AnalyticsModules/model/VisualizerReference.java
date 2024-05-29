package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;
import java.util.Map;

/**
 * This class represents a reference to a particular Visualizer technique of a Visualizing Library of the Visualizer
 * macro component of the OpenLAP. It is modeled after the corresponding Class on the Visualization
 * and holds metadata necessary to reference on a Triad
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
public class VisualizerReference implements Serializable {
	String libraryId;
	String typeId;
	Map<String, String> additionalParams;

	/**
	 * Empty constructor
	 */
	public VisualizerReference() {
	}

	/**
	 * Standard Constructor
	 *
	 * @param frameworkId      ID of the Visualizer Framework
	 * @param methodId         ID of the Visualizer Method
	 * @param additionalParams additional paramaters for the visualizer
	 */
	public VisualizerReference(String frameworkId, String methodId, Map<String, String> additionalParams) {
		this.libraryId = frameworkId;
		this.typeId = methodId;
		this.additionalParams = additionalParams;
	}

	/**
	 * Standard Constructor
	 *
	 * @param frameworkName Name of the Visualizer Framework
	 * @param methodName    Name of the Visualizer Method
	 *//*
    public VisualizerReference(String frameworkName, String methodName) {
        this.frameworkName = frameworkName;
        this.methodName = methodName;
    }

    *//**
	 * Standard Constructor
	 *
	 * @param frameworkId   ID of the Visualizer Framework
	 * @param methodId      ID of the Visualizer Method
	 * @param frameworkName Name of the Visualizer Framework
	 * @param methodName    Name of the Visualizer Method
	 *//*
    public VisualizerReference(long frameworkId, long methodId, String frameworkName, String methodName) {
        this.frameworkId = frameworkId;
        this.methodId = methodId;
        this.frameworkName = frameworkName;
        this.methodName = methodName;
    }*/

	/**
	 * @return ID of the Visualization Framework
	 */
	public String getLibraryId() {
		return libraryId;
	}

	/**
	 * @param libraryId ID of the Visualization Framework to be set.
	 */
	public void setlibraryId(String libraryId) {
		this.libraryId = libraryId;
	}

	/**
	 * @return ID of the Visualization Method
	 */
	public String getTypeId() {
		return typeId;
	}

	/**
	 * @param methodId ID of the Visualization Method to be set.
	 */
	public void setTypeId(String methodId) {
		this.typeId = methodId;
	}

	public Map<String, String> getAdditionalParams() {
		return additionalParams;
	}

	public void setAdditionalParams(Map<String, String> additionalParams) {
		this.additionalParams = additionalParams;
	}


	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "VisualizerReference{" +
					"frameworkId=" + libraryId +
					", methodId=" + typeId +
					", additionalParams=" + additionalParams +
					'}';
		}
	}
}
