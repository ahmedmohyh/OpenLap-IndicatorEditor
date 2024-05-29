package com.openlap.AnalyticsEngine.service;

import com.openlap.AnalyticsEngine.model.OpenLapUser;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.transaction.TransactionManager;

@Service
public class OpenLAPUserService {
	TransactionManager tm = com.arjuna.ats.jta.TransactionManager.transactionManager();
	EntityManagerFactory factory = Persistence.createEntityManagerFactory("OpenLAP");
	EntityManager em = factory.createEntityManager();

	OpenLapUser loadUserByUsername(String email) {
//		em.clear();
		OpenLapUser openLapUser = em.find(OpenLapUser.class, email);
		//User user = userRepo.findByEmail(email);
		if (openLapUser == null) {
			throw new UsernameNotFoundException("Invalid username or password.");
		}
		return openLapUser;
	}
}
