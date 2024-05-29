package com.openlap.AnalyticsEngine.repo;

import com.openlap.AnalyticsEngine.dto.AggItems;
import com.openlap.AnalyticsEngine.dto.LrsObjects;

import java.util.List;

public interface StatementTemplateRepo {

	List<AggItems> findDataByCustomAggregate();
	List<LrsObjects> findAllData(int pageNumber, int pageSize);
}
