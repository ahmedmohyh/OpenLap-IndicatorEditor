package com.openlap.AnalyticsModules.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * This class represents a reference to a particular Indicator of the Indicator Engine macro component of the
 * OpenLAP.It is modeled after the corresponding Class on the Indicator Engine and holds metadata necessary to reference
 * on a Triad
 * <p>
 * Created by Faizan Riaz on 12.06.2019.
 */
public class OpenLAPPortConfigReference implements Serializable {
//    long id;
//    String indicatorName;

	//HashMap to store the id and the name of the indicators related to the triad
	Map<String, OpenLAPPortConfigImp> portConfigs;


	public OpenLAPPortConfigReference() {
		portConfigs = new HashMap<String, OpenLAPPortConfigImp>();
	}

	public Map<String, OpenLAPPortConfigImp> getPortConfigs() {
		return portConfigs;
	}

	public void setPortConfigs(Map<String, OpenLAPPortConfigImp> portConfigs) {
		this.portConfigs = portConfigs;
	}

	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			return "OpenLAPPortConfigReference{" +
					"portConfigs=" + portConfigs +
					'}';
		}
	}

	//    public IndicatorReference(long id, String indicatorName) {
//        this.id = id;
//        this.indicatorName = indicatorName;
//    }
//
//    public long getId() {
//        return id;
//    }
//
//    public void setId(long id) {
//        this.id = id;
//    }
//
//    public String getIndicatorName() {
//        return indicatorName;
//    }
//
//    public void setIndicatorName(String indicatorName) {
//        this.indicatorName = indicatorName;
//    }
//
//    @Override
//    public String toString() {
//        ObjectMapper mapper = new ObjectMapper();
//        try {
//            return mapper.writeValueAsString(this);
//        } catch (JsonProcessingException e) {
//            return "IndicatorReference{" +
//                    "id=" + id +
//                    ", indicatorName='" + indicatorName + '\'' +
//                    '}';
//        }
//    }
}
