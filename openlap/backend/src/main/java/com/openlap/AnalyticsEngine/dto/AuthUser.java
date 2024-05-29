package com.openlap.AnalyticsEngine.dto;

import com.openlap.AnalyticsEngine.model.OpenLapUser;

public class AuthUser {
	private OpenLapUser user;
	private String token;

	public AuthUser() {
	}

	public AuthUser(OpenLapUser user, String token) {
		this.user = user;
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public OpenLapUser getUser() {
		return user;
	}

	public void setUser(OpenLapUser user) {
		this.user = user;
	}
}
