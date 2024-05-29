package com.openlap.AnalyticsEngine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import java.util.Date;

@Document(collection = "statements")
public class Statement {

	@Id
	public String id;

	@DateTimeFormat(iso = ISO.DATE_TIME)
	public Date stored;

	@DateTimeFormat(iso = ISO.DATE_TIME)
	public Date timestamp;
	public String organisation;
	public String lrs_id;
	public String client;
	public String hash;
	private Object statement;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getStored() {
		return stored;
	}

	public void setStored(Date stored) {
		this.stored = stored;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getOrganisation() {
		return organisation;
	}

	public void setOrganisation(String organisation) {
		this.organisation = organisation;
	}

	public String getLrs_id() {
		return lrs_id;
	}

	public void setLrs_id(String lrs_id) {
		this.lrs_id = lrs_id;
	}

	public String getClient() {
		return client;
	}

	public void setClient(String client) {
		this.client = client;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public Object getStatement() {
		return statement;
	}

	public void setStatement(Object statement) {
		this.statement = statement;
	}

}
