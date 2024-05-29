package com.openlap.AnalyticsEngine.repo;

import com.openlap.AnalyticsEngine.model.Activitiy;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ActivitiyRepo extends MongoRepository<Activitiy, String> {

	/*
	 * @Query(value = "{ '?0.?1' : '?2' }") List<Activitiy>
	 * findByObjectNameAndProperty(String Object, String Parameter, String Value);
	 *
	 * @Query(value = "{ '?0.?1.?2' : '?3' }") List<Activitiy> findByObjects(String
	 * Object, String Secondobject, String Parameter, int Value);
	 *
	 * List<Activitiy> findByActivityId(String activityid);
	 */

	@Query(value = "{'$and':[{'organisation':?0},{'lrs_id':?1}]}", fields = "{ '?2.?3.?4':1}")
	List<Activitiy> findContextualFieldValuesByExtensionUrlAndKey(ObjectId organizationId,
																																ObjectId lrsId,
																																String extension,
																																String extensionId,
																																String extensionContextKey);

	@Query(value = "{'$and':[{'organisation':?0},{'lrs_id':?1}, {'type':?2}]}", fields = "{ 'extensions':1}")
	List<Activitiy> findContextualidbyactivitytype(ObjectId organizationId,
																								 ObjectId lrsId,
																								 String type);

	@Query(value = "{'$and':[{'organisation':?0},{'lrs_id':?1}]}", fields = "{ '?2.?3':1}")
	List<Activitiy> findkeysbyContextualidandactivitytype(ObjectId organizationId,
																												ObjectId lrsId,
																												String extension,
																												String extensionId);


	@Query(value = "{'$and':[{'organisation':?0},{'lrs_id':?1}]}")
	List<Activitiy> findActivitiesByOrganizationAndLrs(ObjectId organizationId,
																										 ObjectId lrsId);

}
