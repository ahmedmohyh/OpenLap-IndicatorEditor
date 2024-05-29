package com.openlap.AnalyticsEngine.model;


import com.openlap.AnalyticsEngine.dto.QueryParameters;
import com.openlap.AnalyticsModules.model.OpenLAPDataSetMergeMapping;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by Faizan Riaz
 * on 12-06-19.
 */
@Entity
public class Indicator {
	String indicatorType;
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	//@Type(type = "objectid")
	private String id;
	private String type;
	private String name;

	//List<OpenLAPDataSetMergeMapping> dataSetMergeMappingList;
	@SuppressWarnings("JpaAttributeTypeInspection")
	@Convert(converter = IndicatorQueryConverter.class)
	private Map<String, QueryParameters> queries;

	public Indicator() {
		queries = new HashMap<String, QueryParameters>();
	}

	public Indicator(String type, String name, Map<String, QueryParameters> queries,
									 List<OpenLAPDataSetMergeMapping> dataSetMergeMappingList, String indicatorType) {
		this.type = type;
		this.name = name;
		this.queries = queries;
		//  this.dataSetMergeMappingList = dataSetMergeMappingList;
		this.indicatorType = indicatorType;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

    /*public List<OpenLAPDataSetMergeMapping> getDataSetMergeMappingList() {
        return dataSetMergeMappingList;
    }

    public void setDataSetMergeMappingList(List<OpenLAPDataSetMergeMapping> dataSetMergeMappingList) {
        this.dataSetMergeMappingList = dataSetMergeMappingList;
    }*/

	public String getIndicatorType() {
		return indicatorType;
	}

	public void setIndicatorType(String indicatorType) {
		this.indicatorType = indicatorType;
	}

	public Map<String, QueryParameters> getQueries() {
		return queries;
	}

	public void setQueries(Map<String, QueryParameters> QueryParameters) {
		this.queries = queries;
	}

	/**
	 * Update this object with the values from another Indicator.
	 *
	 * @param indicator containing the data to be updated.
	 */
	public void updateWithIndicator(Indicator indicator) {
		this.setName(indicator.getName());
		this.setQueries(indicator.getQueries());
		this.setType(indicator.getType());
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Indicator indicator = (Indicator) o;
		return id.equals(indicator.id) &&
				type.equals(indicator.type) &&
				name.equals(indicator.name) &&
				queries.equals(indicator.queries) &&
				// dataSetMergeMappingList.equals(indicator.dataSetMergeMappingList) &&
				indicatorType.equals(indicator.indicatorType);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, type, name, queries, indicatorType);
	}

	@Override
	public String toString() {
		return "Indicator{" +
				"id='" + id + '\'' +
				", type='" + type + '\'' +
				", name='" + name + '\'' +
				", queries=" + queries +
				//  ", dataSetMergeMappingList=" + dataSetMergeMappingList +
				", indicatorType='" + indicatorType + '\'' +
				'}';
	}

}
