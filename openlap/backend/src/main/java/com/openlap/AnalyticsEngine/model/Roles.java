package com.openlap.AnalyticsEngine.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Roles {
	@Id
	String name;
	@ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
	private OpenLapUser openLapUser;

	public Roles() {
	}

	public Roles(String name, OpenLapUser openLapUser) {
		this.name = name;
		this.openLapUser = openLapUser;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Roles roles = (Roles) o;
		return name.equals(roles.name) &&
				openLapUser.equals(roles.openLapUser);
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, openLapUser);
	}

	@Override
	public String toString() {
		return "Roles{" +
				"name='" + name + '\'' +
				", openLapUser=" + openLapUser +
				'}';
	}
}
