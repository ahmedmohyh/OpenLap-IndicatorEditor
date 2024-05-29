package com.openlap.AnalyticsEngine.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.openlap.AnalyticsEngine.model.User;

public interface UserRepo extends MongoRepository<User, String> {
	User findByEmail(String email);
}
