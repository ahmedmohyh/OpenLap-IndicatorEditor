package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openlap.AnalyticsMethods.model.AnalyticsMethods;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Objects;

/**
 * This class represents an Analytics Goal of the Analytics Modules macro component of the OpenLAP.
 * Analytics Goals are created by any user but must be activated before any Analytics Method can be related to it.
 * <p>
 * Created By Faizan Riaz 12.06.2019
 */
@Entity
public class AnalyticsGoal {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	//@Type(type = "objectid")
	String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false)
	private String author;

	@Column(nullable = false)
	private boolean isActive;

	@ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
	private AnalyticsMethods analyticsMethods;

	/**
	 * Empty constructor
	 */
	public AnalyticsGoal() {
		this.name = "";
		this.description = "";
		this.author = "";
		this.isActive = false;
	}

	/**
	 * Standard constructor
	 *
	 * @param name        Name of the Analytics Goal
	 * @param description Description of the Analytics Goal
	 * @param author      Author of the Analytics Goal
	 * @param isActive    True if active, which enables relating Analytis Methods Metadata to it. False otherwise.
	 */
	public AnalyticsGoal(String name, String description, String author, boolean isActive, AnalyticsMethods analyticsMethods) {
		this.name = name;
		this.description = description;
		this.author = author;
		this.isActive = isActive;
		this.analyticsMethods = analyticsMethods;
	}

	/**
	 * @return ID of the Analytics Goal
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id ID to be set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return Name of the Analytics Goal
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name Name to be set.
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return Description of the Analytics Goal
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description Description to be set.
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return Author of the Analytics Goal
	 */
	public String getAuthor() {
		return author;
	}

	/**
	 * @param author Author to be set.
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * @return true if the Analytics Goal is active.
	 */
	public boolean isActive() {
		return isActive;
	}

	/**
	 * @param isActive Flag to be set.
	 */
	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	/**
	 * @return A Set of the related Analytics Methods Metadata to this Analytics Goal.
	 */
	public AnalyticsMethods getAnalyticsMethods() {
		return analyticsMethods;
	}

	/**
	 * @param analyticsMethods A set Analytics Methods Metadata to be set for this Analytics Goal
	 */
	public void setAnalyticsMethods(AnalyticsMethods analyticsMethods) {
		this.analyticsMethods = analyticsMethods;
	}

	/**
	 * Update this object with the values from another Analytis Goal.
	 *
	 * @param analyticsGoal containing the data to be updated.
	 */
	public void updateWithAnalyticsGoal(AnalyticsGoal analyticsGoal) {
		this.setAuthor(analyticsGoal.getAuthor());
		this.setDescription(analyticsGoal.getDescription());
		this.setName(analyticsGoal.getName());
		this.setActive(analyticsGoal.isActive);
	}

	/**
	 * Attempts to return a JSON representation of the object, defaults to a string representation otherwise.
	 *
	 * @return A JSON text representation of the object.
	 */
	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "AnalyticsGoal{" +
					"id='" + id + '\'' +
					", name='" + name + '\'' +
					", description='" + description + '\'' +
					", author='" + author + '\'' +
					", isActive=" + isActive +
					", analyticsMethods=" + analyticsMethods +
					'}';
		}
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof AnalyticsGoal)) return false;

		AnalyticsGoal that = (AnalyticsGoal) o;

		if (getId() != that.getId()) return false;
		if (isActive() != that.isActive()) return false;
		//if (!getId().equals(that.getId())) return false;
		if (!getName().equals(that.getName())) return false;
		if (!getDescription().equals(that.getDescription())) return false;
		return getAuthor().equals(that.getAuthor());

	}

	@Override
	public int hashCode() {
		return Objects.hash(analyticsMethods, id, name, description, author, isActive);
	}

}
