package com.openlap.AnalyticsModules.model;

import com.openlap.AnalyticsEngine.model.Question;
import com.openlap.dataset.OpenLAPDataSet;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Triad is used to save the Indicator/Method/Visualization along with the particular configuration between the
 * Indicator to the Analytics Method as well as the one between the Analytics Method to the Visualization
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
@Entity
@Data
public class Triad implements Serializable {

	@Convert(converter = IndicatorReferenceConverter.class)
	IndicatorReference indicatorReference;
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Type(type = "objectid")
	private String id;
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REFRESH})
	private AnalyticsGoal goal;

	//    @Column(nullable = false, columnDefinition = "TEXT")
	@Convert(converter = AnalyticsMethodReferenceConverter.class)
	private AnalyticsMethodReference analyticsMethodReference;

	//    @Column(nullable = false, columnDefinition = "TEXT")
	@Convert(converter = VisualizerReferenceConverter.class)
	private VisualizerReference visualizationReference;

	//    @Column(columnDefinition = "TEXT")
	@Convert(converter = OpenLAPPortConfigReferenceConverter.class)
	private OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping;

	//    @Column(columnDefinition = "TEXT")
	@Convert(converter = OpenLAPPortConfigConverter.class)
	private OpenLAPPortConfigImp analyticsMethodToVisualizationMapping;

	@ManyToMany(mappedBy = "triads", fetch = FetchType.EAGER)
	private Set<Question> questions = new HashSet<Question>();

	@Column(columnDefinition = "TEXT")
	private String parameters;

	@Column(nullable = false)
	private String createdBy;

	@Column(nullable = false)
	private Timestamp createdOn;

	@Column(nullable = false)
	private int timesExecuted;

	@Convert(converter = OpenLAPDataSetConverter.class)
	private OpenLAPDataSet openLAPDataSet;

	/**
	 * Empty constructor
	 */
	public Triad() {

	}

	/**
	 * Standard constructor
	 *
	 * @param id                                    ID of the Triad
	 * @param indicatorReference                    An Indicator Reference that corresponds to an Indicator of the Indicator Engine
	 *                                              macro component of the OpenLAP.
	 * @param analyticsMethodReference              An Analytics Method Reference that corresponds to an Analytics Method metadata of
	 *                                              the Analytics Methods macro component of the OpenLAP.
	 * @param visualizationReference                A Visualization Reference that correponds to a Visualization technique of the
	 *                                              Visualizer macro component of the OpenLAP.
	 * @param indicatorToAnalyticsMethodMapping     The OpenLAPPortConfigImp between the Indicator and the Analytics Method
	 *                                              of this Triad.
	 * @param analyticsMethodToVisualizationMapping The OpenLAPPortConfigImp between the Analytics Method and the
	 *                                              Visualization of this Triad.
	 */
	public Triad(String id,
							 AnalyticsGoal goal,
							 IndicatorReference indicatorReference,
							 AnalyticsMethodReference analyticsMethodReference,
							 VisualizerReference visualizationReference,
							 OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping,
							 OpenLAPPortConfigImp analyticsMethodToVisualizationMapping) {
		this.id = id;
		this.goal = goal;
		this.indicatorReference = indicatorReference;
		this.analyticsMethodReference = analyticsMethodReference;
		this.visualizationReference = visualizationReference;
		this.indicatorToAnalyticsMethodMapping = indicatorToAnalyticsMethodMapping;
		this.analyticsMethodToVisualizationMapping = analyticsMethodToVisualizationMapping;
		this.parameters = "[]";
		this.createdBy = "";
		this.createdOn = new Timestamp(System.currentTimeMillis());
		this.timesExecuted = 0;
	}

	/**
	 * Standard constructor
	 *
	 * @param indicatorReference                    An Indicator Reference that corresponds to an Indicator of the Indicator Engine
	 *                                              macro component of the OpenLAP.
	 * @param analyticsMethodReference              An Analytics Method Reference that corresponds to an Analytics Method metadata of
	 *                                              the Analytics Methods macro component of the OpenLAP.
	 * @param visualizationReference                A Visualization Reference that correponds to a Visualization technique of the
	 *                                              Visualizer macro component of the OpenLAP.
	 * @param indicatorToAnalyticsMethodMapping     The OpenLAPPortConfigImp between the Indicator and the Analytics Method
	 *                                              of this Triad.
	 * @param analyticsMethodToVisualizationMapping The OpenLAPPortConfigImp between the Analytics Method and the
	 *                                              Visualization of this Triad.
	 */
	public Triad(IndicatorReference indicatorReference,
							 AnalyticsMethodReference analyticsMethodReference,
							 VisualizerReference visualizationReference,
							 OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping,
							 OpenLAPPortConfigImp analyticsMethodToVisualizationMapping) {
		this.indicatorReference = indicatorReference;
		this.analyticsMethodReference = analyticsMethodReference;
		this.visualizationReference = visualizationReference;
		this.indicatorToAnalyticsMethodMapping = indicatorToAnalyticsMethodMapping;
		this.analyticsMethodToVisualizationMapping = analyticsMethodToVisualizationMapping;
		this.parameters = "[]";
		this.createdBy = "";
		this.createdOn = new Timestamp(System.currentTimeMillis());
		this.timesExecuted = 0;
	}

	/**
	 * Standard constructor
	 *
	 * @param indicatorReference                    An Indicator Reference that corresponds to an Indicator of the Indicator Engine
	 *                                              macro component of the OpenLAP.
	 * @param analyticsMethodReference              An Analytics Method Reference that corresponds to an Analytics Method metadata of
	 *                                              the Analytics Methods macro component of the OpenLAP.
	 * @param visualizationReference                A Visualization Reference that correponds to a Visualization technique of the
	 *                                              Visualizer macro component of the OpenLAP.
	 * @param indicatorToAnalyticsMethodMapping     The OpenLAPPortConfigImp between the Indicator and the Analytics Method
	 *                                              of this Triad.
	 * @param analyticsMethodToVisualizationMapping The OpenLAPPortConfigImp between the Analytics Method and the
	 *                                              Visualization of this Triad.
	 */
	public Triad(AnalyticsGoal goal,
							 IndicatorReference indicatorReference,
							 AnalyticsMethodReference analyticsMethodReference,
							 VisualizerReference visualizationReference,
							 OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping,
							 OpenLAPPortConfigImp analyticsMethodToVisualizationMapping) {
		this.goal = goal;
		this.indicatorReference = indicatorReference;
		this.analyticsMethodReference = analyticsMethodReference;
		this.visualizationReference = visualizationReference;
		this.indicatorToAnalyticsMethodMapping = indicatorToAnalyticsMethodMapping;
		this.analyticsMethodToVisualizationMapping = analyticsMethodToVisualizationMapping;
		this.parameters = "[]";
		this.createdBy = "";
		this.createdOn = new Timestamp(System.currentTimeMillis());
		this.timesExecuted = 0;
	}

	public Triad(AnalyticsGoal goal, AnalyticsMethodReference analyticsMethodReference, IndicatorReference indicatorReference,
							 VisualizerReference visualizationReference, OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping,
							 OpenLAPPortConfigImp analyticsMethodToVisualizationMapping, Set<Question> questions,
							 String parameters, String createdBy, Timestamp createdOn,
							 int timesExecuted) {
		this.goal = goal;
		this.analyticsMethodReference = analyticsMethodReference;
		this.indicatorReference = indicatorReference;
		this.visualizationReference = visualizationReference;
		this.indicatorToAnalyticsMethodMapping = indicatorToAnalyticsMethodMapping;
		this.analyticsMethodToVisualizationMapping = analyticsMethodToVisualizationMapping;
		this.questions = questions;
		this.parameters = parameters;
		this.createdBy = createdBy;
		this.createdOn = createdOn;
		this.timesExecuted = timesExecuted;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public AnalyticsGoal getGoal() {
		return goal;
	}

	public void setGoal(AnalyticsGoal goal) {
		this.goal = goal;
	}

	public IndicatorReference getIndicatorReference() {
		return indicatorReference;
	}

	public void setIndicatorReference(IndicatorReference indicatorReference) {
		this.indicatorReference = indicatorReference;
	}

	public AnalyticsMethodReference getAnalyticsMethodReference() {
		return analyticsMethodReference;
	}

	public void setAnalyticsMethodReference(AnalyticsMethodReference analyticsMethodReference) {
		this.analyticsMethodReference = analyticsMethodReference;
	}

	public VisualizerReference getVisualizationReference() {
		return visualizationReference;
	}

	public void setVisualizationReference(VisualizerReference visualizationReference) {
		this.visualizationReference = visualizationReference;
	}

	public OpenLAPPortConfigReference getIndicatorToAnalyticsMethodMapping() {
		return indicatorToAnalyticsMethodMapping;
	}

	public void setIndicatorToAnalyticsMethodMapping(OpenLAPPortConfigReference indicatorToAnalyticsMethodMapping) {
		this.indicatorToAnalyticsMethodMapping = indicatorToAnalyticsMethodMapping;
	}

	public OpenLAPPortConfigImp getAnalyticsMethodToVisualizationMapping() {
		return analyticsMethodToVisualizationMapping;
	}

	public void setAnalyticsMethodToVisualizationMapping(OpenLAPPortConfigImp analyticsMethodToVisualizationMapping) {
		this.analyticsMethodToVisualizationMapping = analyticsMethodToVisualizationMapping;
	}

	public Set<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(Set<Question> questions) {
		this.questions = questions;
	}

	public String getParameters() {
		return parameters;
	}

	public void setParameters(String parameters) {
		this.parameters = parameters;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	public int getTimesExecuted() {
		return timesExecuted;
	}

	public void setTimesExecuted(int timesExecuted) {
		this.timesExecuted = timesExecuted;
	}

	/**
	 * Updates this object with the information of the Triad passed as a parameter
	 *
	 * @param triad with the information to be used to update this object.
	 */
	public void updateWithTriad(Triad triad) {
		// this.setGoalId(triad.getGoalId());
		this.setAnalyticsMethodReference(triad.getAnalyticsMethodReference());
		this.setIndicatorReference(triad.getIndicatorReference());
		this.setVisualizationReference(triad.getVisualizationReference());
		this.setAnalyticsMethodToVisualizationMapping(triad.getAnalyticsMethodToVisualizationMapping());
		this.setIndicatorToAnalyticsMethodMapping(triad.getIndicatorToAnalyticsMethodMapping());
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Triad triad = (Triad) o;
		return getTimesExecuted() == triad.getTimesExecuted() && Objects.equals(getIndicatorReference(), triad.getIndicatorReference()) && Objects.equals(getId(), triad.getId()) && Objects.equals(getGoal(), triad.getGoal()) && Objects.equals(getAnalyticsMethodReference(), triad.getAnalyticsMethodReference()) && Objects.equals(getVisualizationReference(), triad.getVisualizationReference()) && Objects.equals(getIndicatorToAnalyticsMethodMapping(), triad.getIndicatorToAnalyticsMethodMapping()) && Objects.equals(getAnalyticsMethodToVisualizationMapping(), triad.getAnalyticsMethodToVisualizationMapping()) && Objects.equals(getQuestions(), triad.getQuestions()) && Objects.equals(getParameters(), triad.getParameters()) && Objects.equals(getCreatedBy(), triad.getCreatedBy()) && Objects.equals(getCreatedOn(), triad.getCreatedOn()) && Objects.equals(getOpenLAPDataSet(), triad.getOpenLAPDataSet());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getIndicatorReference(), getId(), getGoal(), getAnalyticsMethodReference(), getVisualizationReference(), getIndicatorToAnalyticsMethodMapping(), getAnalyticsMethodToVisualizationMapping(), getQuestions(), getParameters(), getCreatedBy(), getCreatedOn(), getTimesExecuted(), getOpenLAPDataSet());
	}

	@Override
	public String toString() {
		return "Triad{" +
				"indicatorReference=" + indicatorReference +
				", id='" + id + '\'' +
				", goal=" + goal +
				", analyticsMethodReference=" + analyticsMethodReference +
				", visualizationReference=" + visualizationReference +
				", indicatorToAnalyticsMethodMapping=" + indicatorToAnalyticsMethodMapping +
				", analyticsMethodToVisualizationMapping=" + analyticsMethodToVisualizationMapping +
				", questions=" + questions +
				", parameters='" + parameters + '\'' +
				", createdBy='" + createdBy + '\'' +
				", createdOn=" + createdOn +
				", timesExecuted=" + timesExecuted +
				", openLAPDataSet=" + openLAPDataSet +
				'}';
	}
}
