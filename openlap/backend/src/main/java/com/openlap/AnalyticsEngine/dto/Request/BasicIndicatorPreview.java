package com.openlap.AnalyticsEngine.dto.Request;

import com.openlap.AnalyticsEngine.dto.Response.IndicatorResponse;
import com.openlap.dataset.OpenLAPDataSet;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 Created By Ao on 2023/2/5
 */
@Data
public class BasicIndicatorPreview {
    String name;
    String id;
    String indicatorRequestCode;
    String analyticsMethodId;
    String analyticsMethodName;
    Map<String,String> MethodParams;
    private List<IndicatorResponse> indicators;

}
