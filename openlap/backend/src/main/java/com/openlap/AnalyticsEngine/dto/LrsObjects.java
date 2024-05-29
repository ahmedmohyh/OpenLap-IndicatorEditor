package com.openlap.AnalyticsEngine.dto;

import lombok.Data;

//  Created by: Shoeb Joarder
@Data
public class LrsObjects {
	private String id;
	private Object statement;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Object getStatement() {
		return statement;
	}

	public void setStatement(Object statement) {
		this.statement = statement;
	}

	public LrsObjects(String id, Object statement) {
		this.id = id;
		this.statement = statement;
	}
}

