package com.openlap.AnalyticsEngine.model;

import com.openlap.AnalyticsModules.model.Triad;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Created by Faizan Riaz
 * on 12-06-19.
 */
@Entity
public class Question implements Serializable {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Type(type = "objectid")
	private String id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(nullable = false)
	private int indicatorCount;

	@Column(nullable = false)
	private String createdBy;

	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
	@OrderBy(value = "id asc")
	private Set<Triad> triads = new HashSet<Triad>();

	public Question() {
		this.name = "";
		this.indicatorCount = 0;
	}

	public Question(String name, int indicatorCount, String createdBy) {

		this.name = name;
		this.indicatorCount = indicatorCount;
		this.createdBy = createdBy;
	}

	public Question(String name, int indicatorCount, Set<Triad> triads) {
		this.name = name;
		this.indicatorCount = indicatorCount;
		this.triads = triads;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getIndicatorCount() {
		return indicatorCount;
	}

	public void setIndicatorCount(int indicatorCount) {
		this.indicatorCount = indicatorCount;
	}

	public Set<Triad> getTriads() {
		return triads;
	}

	public void setTriads(Set<Triad> triads) {
		this.triads = triads;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Question question = (Question) o;
		return indicatorCount == question.indicatorCount && Objects.equals(id, question.id) && Objects.equals(name, question.name) && Objects.equals(triads, question.triads);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, indicatorCount, triads);
	}

	@Override
	public String toString() {
		return "Question{" +
				"id='" + id + '\'' +
				", name='" + name + '\'' +
				", indicatorCount=" + indicatorCount +
				'}';
	}
}
