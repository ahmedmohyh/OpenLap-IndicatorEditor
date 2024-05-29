package com.openlap.AnalyticsMethods.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Objects;

/**
 * Created by Faizan Riaz on 12/06/19.
 */

@Entity
public class AnalyticsMethods {
	@Column(nullable = false)
	public String type;
	@Column(nullable = false)
	public String description;
	@Column(nullable = false)
	public String name;
	@Column(nullable = false)
	public String outputs;
	@Column(nullable = false)
	public String creator;

	//public String binaries_location;
	@Column(nullable = false)
	public String filename;
	@Column(nullable = false)
	public String implementing_class;
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	//@Type(type = "objectid")
	String id;


	/**
	 * Empty constructor.
	 */
	public AnalyticsMethods() {
		this.name = "";
		this.creator = "";
		this.description = "";
		//this.binaries_location = null;
		this.implementing_class = "";
		this.filename = "";
	}

	/**
	 * Standard constructor
	 *
	 * @param name              Name of the Analytics Method
	 * @param creator           Creator of te Analytics Method
	 * @param description       Short description of the Analytics Method
	 * @param implementingClass Class that implements the OpenLAP-AnalyticsFramework
	 * @param filename          File name of the JAR containing the Analytics Method
	 */
	public AnalyticsMethods(String name, String creator, String description,
													String implementingClass, String filename) {
		this.name = name;
		this.creator = creator;
		this.description = description;
		this.implementing_class = implementingClass;
		//this.binaries_location = binariesLocation;
		this.filename = filename;
	}

	/**
	 * Getter and Setters for the Upload Method
	 */
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

//    public String getBinaries_location() {
//        return binaries_location;
//    }
//
//    public void setBinaries_location(String binaries_location) {
//        this.binaries_location = binaries_location;
//    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getImplementing_class() {
		return implementing_class;
	}

	public void setImplementing_class(String implementing_class) {
		this.implementing_class = implementing_class;
	}

	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}

	public String getOutputs() {
		return outputs;
	}

	public void setOutputs(String outputs) {
		this.outputs = outputs;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		AnalyticsMethods that = (AnalyticsMethods) o;
		return Objects.equals(getType(), that.getType()) && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(getName(), that.getName()) && Objects.equals(getOutputs(), that.getOutputs()) && Objects.equals(getCreator(), that.getCreator()) && Objects.equals(getFilename(), that.getFilename()) && Objects.equals(getImplementing_class(), that.getImplementing_class()) && Objects.equals(getId(), that.getId());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getType(), getDescription(), getName(), getOutputs(), getCreator(), getFilename(), getImplementing_class(), getId());
	}

	@Override
	public String toString() {
		return "AnalyticsMethods{" +
				"type='" + type + '\'' +
				", description='" + description + '\'' +
				", name='" + name + '\'' +
				", outputs='" + outputs + '\'' +
				", creator='" + creator + '\'' +
				", filename='" + filename + '\'' +
				", implementing_class='" + implementing_class + '\'' +
				", id='" + id + '\'' +
				'}';
	}

	/**
	 * Cloning Method for the AnalyticsMethods Metadata.
	 *
	 * @return An Object with the properties of this AnalyticsMethodMetadata
	 * @throws CloneNotSupportedException
	 */
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}

	/**
	 * Use another AnalyticsMethodMetadata to update this object
	 *
	 * @param updatedMetadata updated metadata about the analytics method
	 */
	public void updateWithMetadata(AnalyticsMethods updatedMetadata) {
		this.setName(updatedMetadata.getName());
		this.setCreator(updatedMetadata.getCreator());
		this.setDescription(updatedMetadata.getDescription());
		this.setImplementing_class(updatedMetadata.getImplementing_class());
		this.setFilename(updatedMetadata.getFilename());
		this.setType(updatedMetadata.getType());
		this.setOutputs(updatedMetadata.getOutputs());
	}

}
