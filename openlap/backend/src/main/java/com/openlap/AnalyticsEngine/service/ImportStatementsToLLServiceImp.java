package com.openlap.AnalyticsEngine.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("sendXapiStatmentsToLL")
public class ImportStatementsToLLServiceImp implements ImportStatementsToLLService {
	@Value("${learninglocker.url}")
	private String learningLockerUrl;

	@Value("${learninglocker.client.key}")
	private String learningClientKey;

	@Override
	public int sendStatementsToLL(JSONArray statemnets) {
		// TODO Auto-generated method stub
		HttpResponse response = null;
		int statusCode;
		RequestConfig requestConfig = RequestConfig.custom()
				.setConnectTimeout(500000) // 设置连接超时时间，单位毫秒
				.setSocketTimeout(500000) // 设置读取超时时间，单位毫秒
				.build();
		CloseableHttpClient httpClient = HttpClients.custom()
				.setDefaultRequestConfig(requestConfig)
				.build();
		HttpPost request = new HttpPost(learningLockerUrl);
		request.addHeader("content-type", "application/json;charset=UTF-8");
		request.addHeader("Authorization", learningClientKey);
		request.addHeader("X-Experience-API-Version", "1.0.0");
		

		try {
			StringEntity params = new StringEntity(statemnets.toString());
			request.setEntity(params);
			try {
				response = httpClient.execute(request);
				System.out.println(response.getStatusLine().getStatusCode());
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		statusCode = response.getStatusLine().getStatusCode();
		return statusCode;
	}

}
