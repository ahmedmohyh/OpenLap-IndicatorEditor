package com.openlap.AnalyticsEngine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "personas")
public class Personas {

	@Id
	public String id;
	public String organisation;
	public String name;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOrganisation() {
		return organisation;
	}

	public void setOrganisation(String organization) {
		this.organisation = organization;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
