package com.openlap.AnalyticsEngine.security.config;

//import com.openlap.AnalyticsEngine.security.filter.JwtAuthenticationFilter;

import com.openlap.AnalyticsEngine.security.filter.JwtAuthenticationFilter;
import com.openlap.AnalyticsEngine.security.handler.AccessDeny;
import com.openlap.AnalyticsEngine.security.handler.AuthenticationEnryPoint;
import com.openlap.AnalyticsEngine.security.handler.JwtAuthenticationEntryPoint;
import com.openlap.AnalyticsEngine.security.handler.SelfAuthenticationProvider;
import com.openlap.AnalyticsEngine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.annotation.Resource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Resource(name = "userService")
	private UserDetailsService userDetailsService;

	@Autowired
	AuthenticationEnryPoint authenticationEnryPoint;    //未登录


	@Autowired
	AccessDeny accessDeny;      //无权访问

	@Autowired
	SelfAuthenticationProvider selfAuthenticationProvider;      //自定义认证逻辑处理

	@Autowired
	TokenProvider jwtTokenUtil;


	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
//	@Autowired
//	public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
//		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
//	}


	@Bean
	public JwtAuthenticationFilter authenticationTokenFilterBean() {
		return new JwtAuthenticationFilter(jwtTokenUtil);
	}

	//认证
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(selfAuthenticationProvider);
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return new UserService();
	}

	@Autowired
	JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	// 授权

	@Override
	public void configure(WebSecurity web) throws Exception {
		//放行swagger
		web.ignoring().antMatchers(
				"/v2/api-docs",
				"/swagger-resources",
				"/swagger-resources/**",
				"/configuration/ui",
				"/configuration/security",
				"/swagger-ui.html/**",
				"/webjars/**");
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception {
//		http.headers().frameOptions().disable();
		http
				.cors().and().csrf().disable();
		http.authorizeRequests()
				.antMatchers("/AnalyticsEngine/UserLogin", "/AnalyticsEngine/UserRegistration", "/api/auth/login","/iview/indicator","/swagger-ui.html").permitAll()
//				.antMatchers("/index").hasAuthority("ROLE_ADMIN")
				.anyRequest()
//				.antMatchers("*/**"
////						"/v1/statements/**", "/AnalyticsEngine/**", "/frameworks/**",
////						"/AnalyticsMethod/**", "/analyticsmodule/**", "/v1/authenticate/**", "/v2/api-docs",
////						"/swagger-resources/configuration/ui", "/swagger-resources", "/import/csvdata",
////						"/generateVisualizationCode", "/swagger-resources/configuration/security",
////						"/swagger-ui.html", "/webjars/**",
////						"/v1/**"
//				)
				.authenticated()
//				.permitAll()
				.and()
				.formLogin()
				.and()
				.httpBasic()
				.and()
				.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class)
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				// Exception handling
				.and()
				.exceptionHandling()
				.authenticationEntryPoint(jwtAuthenticationEntryPoint)
				.accessDeniedHandler(accessDeny)    //权限不足的时候的逻辑处理
				.and()
				.headers()
				.contentSecurityPolicy("frame-ancestors 'self' *");


	}

}
