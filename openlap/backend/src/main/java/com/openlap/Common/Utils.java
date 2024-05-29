package com.openlap.Common;
import com.openlap.AnalyticsEngine.security.config.TokenContextHolder;
import com.openlap.AnalyticsMethods.exceptions.AnalyticsMethodsBadRequestException;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class Utils {

	public static List<String> getImplementedClassNamesFromJarFile(String JarName, String implementedClassFilesDirectoryPathInJarFile) {
		List<String> listofClasses = new ArrayList<>();

		try {
			JarInputStream JarFile = new JarInputStream(new FileInputStream(JarName));
			JarEntry Jar;

			while (true) {
				Jar = JarFile.getNextJarEntry();
				if (Jar == null) {
					break;
				}
				if ((Jar.getName().endsWith(".class")) && Jar.getName().startsWith(implementedClassFilesDirectoryPathInJarFile.replace('.', '/'))) {
					String className = Jar.getName().replaceAll("/", "\\.");
					String myClass = className.substring(0, className.lastIndexOf('.'));
					listofClasses.add(myClass);
				}
			}
		} catch (Exception e) {
			System.out.println("Encounter an issue while parsing jar: " + e);
		}
		return listofClasses;
	}

	public static String performGetRequest(String url) throws Exception {
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("Authorization", "Bearer " + TokenContextHolder.getToken());
		int responseCode = con.getResponseCode();
		if (responseCode == HttpURLConnection.HTTP_OK) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			return response.toString();
		} else {
			throw new Exception(con.getResponseMessage());
		}
	}

	public static <T> T performJSONPostRequest(String url, String jsonContent, Class<T> type) throws Exception {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.add("Accept", "application/json;charset=utf-8");
		headers.add("Authorization", "Bearer " + TokenContextHolder.getToken());

		HttpEntity<String> entity = new HttpEntity<String>(jsonContent, headers);

		restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

		T result = restTemplate.postForObject(url, entity, type);

		return result;
	}

	public static void performPostRequestBySendingJarFile(String url, MultipartFile jarFile){
		RestTemplate restTemplate = new RestTemplate();

		// Prepare the headers
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);
		headers.add("Authorization", "Bearer " + TokenContextHolder.getToken());

		// Prepare the multipart request
		MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
		body.add("jarFile", jarFile.getResource());

		// Create the request entity
		HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

		try {
			restTemplate.postForEntity(url, requestEntity, String.class);
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			throw new AnalyticsMethodsBadRequestException(e.getResponseBodyAsString());
		}
	}

	public static void performDeleteRequest(String urlWithId){
		RestTemplate restTemplate = new RestTemplate();

		// Prepare the headers
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + TokenContextHolder.getToken());

		// Create the request entity with the headers
		HttpEntity<String> requestEntity = new HttpEntity<>("parameters", headers);

		try {
//			restTemplate.delete(urlWithId, String.class);
			ResponseEntity<String> response = restTemplate.exchange(urlWithId, HttpMethod.DELETE, requestEntity, String.class);

		} catch (HttpClientErrorException | HttpServerErrorException e) {
			throw new AnalyticsMethodsBadRequestException(e.getResponseBodyAsString());
		}
	}

	public static String performPutRequest(String url, String jsonContent) throws Exception {
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("PUT");
		con.setRequestProperty("Content-Type", "application/json");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Content-Length", "" + jsonContent.getBytes().length);
		con.setRequestProperty("Authorization", "Bearer " + TokenContextHolder.getToken());
		con.setUseCaches(false);
		con.setDoInput(true);
		con.setDoOutput(true);

		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(jsonContent);
		wr.flush();
		wr.close();

		int responseCode = con.getResponseCode();
		if (responseCode == HttpURLConnection.HTTP_OK) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			return response.toString();
		} else {
			throw new Exception(con.getResponseMessage());
		}
	}

	public static String decodeURIComponent(String s) {
		if (s == null) {
			return null;
		}

		String result = null;

		result = URLDecoder.decode(s, StandardCharsets.UTF_8);

		return result;
	}

	public static String encodeURIComponent(String s) {
		String result = null;

		result = URLEncoder.encode(s, StandardCharsets.UTF_8)
				.replaceAll("\\%28", "(")
				.replaceAll("\\%29", ")")
				.replaceAll("\\+", "%20")
				.replaceAll("\\%27", "'")
				.replaceAll("\\%21", "!")
				.replaceAll("\\%7E", "~");
		return result;
	}
}
