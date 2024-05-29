package com.openlap.AnalyticsModules.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
public class QuestionTriad implements Serializable {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

	@Column
	private String questionId;

	@Column
	private String triadId;

	public QuestionTriad() {
	}

	public QuestionTriad(String questionId, String triadId) {
		this.questionId = questionId;
		this.triadId = triadId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;

		if (o == null || getClass() != o.getClass()) return false;

		QuestionTriad that = (QuestionTriad) o;

		return new EqualsBuilder().append(id, that.id).append(questionId, that.questionId).append(triadId, that.triadId).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(id).append(questionId).append(triadId).toHashCode();
	}

	public String getQuestionId() {
		return questionId;
	}

	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}

	public String getTriadId() {
		return triadId;
	}

	public void setTriadId(String triadId) {
		this.triadId = triadId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
