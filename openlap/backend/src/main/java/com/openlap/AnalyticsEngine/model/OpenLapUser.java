package com.openlap.AnalyticsEngine.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Data
public class OpenLapUser {
	@Id
	private String email;
	private String password;
	private String firstname;
	private String lastname;
	@ElementCollection
	private Set<String> roles;

	public OpenLapUser() {
	}

	public OpenLapUser(String email, String password, String firstname, String lastname) {
		this.email = email;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
	}

	public OpenLapUser(String email, String password, String firstname, String lastname, Set<String> roles) {
		this.email = email;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.roles = roles;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		OpenLapUser that = (OpenLapUser) o;
		return Objects.equals(email, that.email) && Objects.equals(password, that.password) && Objects.equals(firstname, that.firstname) && Objects.equals(lastname, that.lastname) && Objects.equals(roles, that.roles);
	}

	@Override
	public int hashCode() {
		return Objects.hash(email, password, firstname, lastname, roles);
	}

	@Override
	public String toString() {
		return "OpenLAPUser{" +
				"email='" + email + '\'' +
				", password='" + password + '\'' +
				", firstname='" + firstname + '\'' +
				", lastname='" + lastname + '\'' +
				", roles=" + roles +
				'}';
	}
}
