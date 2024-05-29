package com.openlap.AnalyticsEngine.model;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;


@Document(collection = "fullActivities")
public class Activitiy {

	@Id
	public String id;
	public String activityId;
	public String lrs_id;
	public String organisation;
	public Object name;
	public Object description;
	public Object extensions;
	public String type;


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getActivityId() {
		return activityId;
	}

	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}

	public String getLrs_id() {
		return lrs_id;
	}

	public void setLrs_id(String lrs_id) {
		this.lrs_id = lrs_id;
	}

	public String getOrganization() {
		return organisation;
	}

	public void setOrganization(String organization) {
		this.organisation = organization;
	}

	public Object getName() {
		return name;
	}

	public void setName(Object name) {
		this.name = name;
	}

	public Object getDescription() {
		return description;
	}

	public void setDescription(Object description) {
		this.description = description;
	}

	public Object getExtensions() {
		return extensions;
	}

	public void setExtensions(Object extensions) {
		this.extensions = extensions;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
