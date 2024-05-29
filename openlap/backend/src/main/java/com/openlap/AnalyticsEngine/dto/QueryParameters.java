package com.openlap.AnalyticsEngine.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Objects;

@Data
public class QueryParameters implements Serializable {
	private static final long serialVersionUID = -1764970284520387975L;

	private Object[] query;
	private Object[] agg;
	private Object parametersToBeReturnedInResult;
	private Object[] statementDuration;

//	public QueryParameters() {
//	}
//
//	public Object getParametewrsToBeReturnedInResult() {
//		return parametersToBeReturnedInResult;
//	}
//
//	public void setParametersToBeReturnedInResult(Object parametersToBeReturnedInResult) {
//		this.parametersToBeReturnedInResult = parametersToBeReturnedInResult;
//	}
//
//	public Object[] getQuery() {
//		return query;
//	}
//
//	public void setQuery(Object[] query) {
//		this.query = query;
//	}
//
//	public Object[] getStatementDuration() {
//		return statementDuration;
//	}
//
//	public void setStatementDuration(Object[] statementDuration) {
//		this.statementDuration = statementDuration;
//	}
//
////	@Override
////	public String toString() {
////		return "QueryParameters{" +
////				"query=" + Arrays.toString(query) +
////				", parametersToBeReturnedInResult=" + parametersToBeReturnedInResult +
////				", statementDuration=" + Arrays.toString(statementDuration) +
////				'}';
////	}
////
////	@Override
////	public boolean equals(Object o) {
////		if (this == o) return true;
////		if (o == null || getClass() != o.getClass()) return false;
////		QueryParameters that = (QueryParameters) o;
////		return Arrays.equals(query, that.query) &&
////				parametersToBeReturnedInResult.equals(that.parametersToBeReturnedInResult) &&
////				Arrays.equals(statementDuration, that.statementDuration);
////	}
////
////	@Override
////	public int hashCode() {
////		int result = Objects.hash(parametersToBeReturnedInResult);
////		result = 31 * result + Arrays.hashCode(query);
////		result = 31 * result + Arrays.hashCode(statementDuration);
////		return result;
////	}
}
