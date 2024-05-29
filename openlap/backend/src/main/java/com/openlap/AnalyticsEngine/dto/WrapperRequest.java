package com.openlap.AnalyticsEngine.dto;

import com.openlap.AnalyticsEngine.dto.Request.IndicatorPreviewRequest;

public class WrapperRequest {
	QueryParameters parameterholder;
	IndicatorPreviewRequest indicatorPreviewRequest;

	public WrapperRequest(QueryParameters parameterholder, IndicatorPreviewRequest indicatorPreviewRequest) {
		this.parameterholder = parameterholder;
		this.indicatorPreviewRequest = indicatorPreviewRequest;
	}

	public QueryParameters getParameterholder() {
		return parameterholder;
	}

	public void setParameterholder(QueryParameters parameterholder) {
		this.parameterholder = parameterholder;
	}

	public IndicatorPreviewRequest getIndicatorPreviewRequest() {
		return indicatorPreviewRequest;
	}

	public void setIndicatorPreviewRequest(IndicatorPreviewRequest indicatorPreviewRequest) {
		this.indicatorPreviewRequest = indicatorPreviewRequest;
	}
}
