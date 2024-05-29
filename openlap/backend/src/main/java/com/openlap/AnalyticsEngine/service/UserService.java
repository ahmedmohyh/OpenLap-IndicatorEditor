package com.openlap.AnalyticsEngine.service;

import com.openlap.AnalyticsEngine.model.OpenLapUser;
import com.openlap.AnalyticsEngine.model.Roles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Role;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.transaction.TransactionManager;
import java.util.HashSet;
import java.util.Set;

@Service(value = "userService")
@Primary
public class UserService implements UserDetailsService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
	EntityManager em = factory.createEntityManager();

	@Autowired
	OpenLAPUserService openLAPUserService;



	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// TODO Auto-generated method stub

		OpenLapUser openLapUser = openLAPUserService.loadUserByUsername(email);
		if (openLapUser == null) {
			logger.error("Invalid username or password.");
			throw new UsernameNotFoundException("Invalid username or password.");
		}
		return new org.springframework.security.core.userdetails.User(openLapUser.getEmail(), openLapUser.getPassword(),
				getAuthority(openLapUser));
	}

	public Set<SimpleGrantedAuthority> getAuthority(OpenLapUser openLapUser) {
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		Set<String> scopes = openLapUser.getRoles();
		for (String scope : scopes) {
			// authorities.add(new SimpleGrantedAuthority(role.getName()));
			authorities.add(new SimpleGrantedAuthority("ROLE_" + scope));

		}
		return authorities;
	}

}
