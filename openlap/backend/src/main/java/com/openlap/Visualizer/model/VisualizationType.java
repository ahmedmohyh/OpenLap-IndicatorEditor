package com.openlap.Visualizer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Objects;

/**
 * Model class representing the metadata of a Visualization Method(Technique) of a
 * Visualization Framework
 *
 * @author Faizan Riaz
 * @author Arham Muslim
 */

@Entity
public class VisualizationType {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	// @GeneratedValue(strategy = GenerationType.IDENTITY)
	// @Type(type = "objectid")
	String id;

	// @Column(nullable = false, unique = true)
	String implementingClass;

	//@Column(nullable = false)
	String name;


	@ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
	@JsonIgnore
	private VisualizationLibrary visualizationLibrary;

	public VisualizationType(String implementingClass, String name) {
		this.implementingClass = implementingClass;
		this.name = name;
	}

	public VisualizationType(String implementingClass, String name, VisualizationLibrary visualizationLibrary) {
		this.implementingClass = implementingClass;
		this.name = name;
		this.visualizationLibrary = visualizationLibrary;
	}

	public VisualizationType() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getImplementingClass() {
		return implementingClass;
	}

	public void setImplementingClass(String implementingClass) {
		this.implementingClass = implementingClass;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public VisualizationLibrary getVisualizationLibrary() {
		return visualizationLibrary;
	}

	public void setVisualizationLibrary(VisualizationLibrary visualizationLibrary) {
		this.visualizationLibrary = visualizationLibrary;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "VisualizationType{" +
					"id='" + id + '\'' +
					", implementingClass='" + implementingClass + '\'' +
					", name='" + name + '\'' +
					", visualizationLibrary=" + visualizationLibrary +
					'}';
		}
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		VisualizationType that = (VisualizationType) o;
		return id.equals(that.id) &&
				implementingClass.equals(that.implementingClass) &&
				name.equals(that.name) &&
				visualizationLibrary.equals(that.visualizationLibrary);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, implementingClass, name, visualizationLibrary);
	}
}


//@Entity
//public class VisualizationType {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Type(type = "objectid")
//    String id;
//
//   // @Column(nullable = false, unique = true)
//    String implementingClass;
//
//    //@Column(nullable = false)
//    String name;
//
//
//    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
//    @JsonIgnore
//    private VisualizationLibrary visualizationLibrary;
//
//    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
//    private VisualizationDataTransformerMethod visualizationDataTransformerMethod;
//
//    public VisualizationType(String implementingClass, String name, VisualizationDataTransformerMethod visualizationDataTransformerMethod) {
//        this.implementingClass = implementingClass;
//        this.name = name;
//        this.visualizationDataTransformerMethod = visualizationDataTransformerMethod;
//    }
//
//    public VisualizationType(String implementingClass, String name, VisualizationDataTransformerMethod visualizationDataTransformerMethod, VisualizationLibrary visualizationLibrary) {
//        this.implementingClass = implementingClass;
//        this.name = name;
//        this.visualizationDataTransformerMethod = visualizationDataTransformerMethod;
//        this.visualizationLibrary = visualizationLibrary;
//    }
//
//    public VisualizationType() {
//    }
//
//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getImplementingClass() {
//        return implementingClass;
//    }
//
//    public void setImplementingClass(String implementingClass) {
//        this.implementingClass = implementingClass;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//
//    public VisualizationDataTransformerMethod getVisualizationDataTransformerMethod() {
//        return visualizationDataTransformerMethod;
//    }
//
//    public void setVisualizationDataTransformerMethod(VisualizationDataTransformerMethod visualizationDataTransformerMethod) {
//        this.visualizationDataTransformerMethod = visualizationDataTransformerMethod;
//    }
//
//    public VisualizationLibrary getVisualizationLibrary() {
//        return visualizationLibrary;
//    }
//
//    public void setVisualizationLibrary(VisualizationLibrary visualizationLibrary) {
//        this.visualizationLibrary = visualizationLibrary;
//    }
//
//    @Override
//    public String toString() {
//        ObjectMapper mapper = new ObjectMapper();
//        try {
//            return mapper.writeValueAsString(this);
//        } catch (JsonProcessingException e) {
//            return "VisualizationType{" +
//                    "id='" + id + '\'' +
//                    ", implementingClass='" + implementingClass + '\'' +
//                    ", name='" + name + '\'' +
//                    ", visualizationLibrary=" + visualizationLibrary +
//                    ", visualizationDataTransformerMethod=" + visualizationDataTransformerMethod +
//                    '}';
//        }
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        VisualizationType that = (VisualizationType) o;
//        return id.equals(that.id) &&
//                implementingClass.equals(that.implementingClass) &&
//                name.equals(that.name) &&
//                visualizationLibrary.equals(that.visualizationLibrary) &&
//                visualizationDataTransformerMethod.equals(that.visualizationDataTransformerMethod);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id, implementingClass, name, visualizationLibrary, visualizationDataTransformerMethod);
//    }
//}
