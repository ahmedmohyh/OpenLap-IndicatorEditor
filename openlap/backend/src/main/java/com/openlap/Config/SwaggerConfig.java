package com.openlap.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;

import static springfox.documentation.builders.PathSelectors.regex;

/**
 * The SwaggerConfig class is the configuration class for swagger api doc.It is
 * creating API documentation
 *
 * @author Sammar Javed
 * @version 1.0
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig implements WebMvcConfigurer {
	@Bean
	public Docket productApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.select().apis(RequestHandlerSelectors.basePackage("com.openlap.AnalyticsEngine.controller"))
//				.paths(regex("/v1.*"))
				.paths(PathSelectors.any())
				.build().apiInfo(metaData()).securitySchemes(Arrays.asList(apiKey()));
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry
				.addResourceHandler("swagger-ui.html")
				.addResourceLocations("classpath:/META-INF/resources/");

		registry
				.addResourceHandler("/webjars/**")
				.addResourceLocations("classpath:/META-INF/resources/webjars/");
	}
	private ApiKey apiKey() {
		return new ApiKey("Authorization", "api_key", "header");
	}

	private ApiInfo metaData() {
		ApiInfo apiInfo = new ApiInfo("OpenLAP-Analytics-Engine API",
				"Spring Boot REST API for OpenLAP-Analytics-Engine for xAPI Integration", "1.0",
				"Terms of service",
				new Contact("OpenLAP", "https://openlap.sc.inko.cloud/team", "arham.muslim@uni-due.de"),
				"Apache License Version 2.0", "https://www.apache.org/licenses/LICENSE-2.0");
		return apiInfo;
	}

}
