package com.openlap.AnalyticsEngine.repo;

import com.openlap.AnalyticsEngine.model.Personas;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PersonasRepo extends MongoRepository<Personas, String> {
	@Query(value = "{'organisation':?0 }", fields = "{'_id':1,'name':1}")
	List<Personas> findPersonNamesByOrganization(ObjectId id);

}
