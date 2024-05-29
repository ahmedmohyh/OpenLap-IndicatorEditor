package com.openlap.Common;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Created by Arham Muslim
 * on 06-Jan-16.
 */
@Configuration
@EnableWebMvc
public class CORSFilter implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:5500", "http://localhost:3000", "http://localhost:5500",
						"https://openlap.netlify.app")
				.allowedMethods("GET", "POST", "PUT", "DELETE");
		;
	}
}
