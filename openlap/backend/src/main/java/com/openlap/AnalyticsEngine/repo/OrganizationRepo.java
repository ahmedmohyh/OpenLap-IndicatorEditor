package com.openlap.AnalyticsEngine.repo;

import com.openlap.AnalyticsEngine.model.Organization;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

/**
 * MongoRepository to handle data access layer of OrganizationController
 */
public interface OrganizationRepo extends MongoRepository<Organization, String> {
	/**
	 * Query to get organization for logged user
	 *
	 * @param userid
	 * @return id and name of the oragnization
	 */
	@Query(value = "{'owner':?0 }", fields = "{'_id':1,'name':1}")
	List<Organization> findOrganizationsByUserId(ObjectId id);
}
