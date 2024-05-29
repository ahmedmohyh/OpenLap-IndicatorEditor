package com.openlap.AnalyticsEngine.repo;

import com.mongodb.DBObject;
import com.openlap.AnalyticsEngine.dto.LrsObjects;
import com.openlap.AnalyticsEngine.dto.Platforms;
import com.openlap.AnalyticsEngine.dto.Verb;
import com.openlap.AnalyticsEngine.model.Statement;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface StatementRepo extends MongoRepository<Statement, String> {


	@Query(value = "{ 'statement.verb': {$exists: true} }",
			fields = "{'id':0, 'statement.verb.display':1, 'statement.verb.id':1 }"
	)
	List<Verb> getAllActions(ObjectId organizationIdObject, ObjectId lrsIdObject);

	@Query(value = "{'statement.context': {$exists: true}}", fields = "{'statement.context.platform':1}")
	List<Platforms> findAllPlatformsByOrganizationAndLrs(ObjectId organizationIdObject, ObjectId lrsIdObject);


	//  Created by: Shoeb Joarder

//	@Query(
//			value = "{ " +
//					"'statement.verb': {$exists: true}, " +
//					"'organisation':?0, " +
//					"'lrs_id':?1, " +
//					"'statement.context.platform': ?2, " +
//					"'statement.object.definition.type': ?3, " +
//					"'?4': ?5 " +
//					"}",
//			fields = "{ " +
//					"'id':0, " +
//					"'statement.verb.display':1, " +
//					"'statement.verb.id':1 " +
//					"}"
//	)
//	List<LrsObjects> getActions(
//			ObjectId organizationIdObject,
//			ObjectId lrsIdObject,
//			String platform,
//			String activityType,
//			String activityNameId,
//			String activityName
//	);

	//	Database query to fetch object types
	@Query(value = "{'organisation':?0, 'lrs_id':?1, 'statement.object.definition.type': { $exists: true}}",
			fields = "{ 'id':0, 'statement.object.definition.type': 1}")
	List<LrsObjects> findActivityTypes(ObjectId organizationId, ObjectId lrsId);

	//	Database query to fetch the object names using object type
	@Query(value = "{ 'organisation':?0, 'lrs_id':?1, 'statement.object.definition.type': { $exists: true}, " +
			"'statement.object.definition.type': ?2 }",
			fields = "{ 'id':0, 'statement.object.definition.name': 1}"
	)
	List<LrsObjects> findActivityTypeNames(ObjectId organizationId, ObjectId lrsId, String type);

	@Query(value = "{ 'organisation': ?0, 'lrs_id': ?1, 'statement.object.definition.type': ?2, " +
			"'statement.object.definition.extensions': {$exists: true} }",
			fields = "{ 'id':0, 'statement.object.definition': 1}"
	)
	List<LrsObjects> findActivityTypeExtensionId(
			ObjectId organizationId,
			ObjectId lrsId,
			String type
	);


	//	Find attributes using object type, name and it's extensionId
	@Query(
			value = "{ 'organisation': ?0, 'lrs_id': ?1, 'statement.object.definition.type': ?3, '?2.?4': {$exists: true} }",
			fields = "{ 'id':0, 'statement.object.definition': 1}"
	)
	List<LrsObjects> findActivityTypeExtensionProperties(
			ObjectId organizationId,
			ObjectId lrsId,
			String statement,
			String type,
			String extensionId
	);


	@Query(
			value = "{ 'organisation': ?0,  'lrs_id': ?1, '?2.?3.?4.?5.?6.?7': {$exists: true} }",
			fields = "{ 'id':0, 'statement.object.definition.extensions': 1}"
	)
	List<LrsObjects> findActivityTypeExtensionPropertyValues(
			ObjectId organizationId,
			ObjectId lrsId,
			String statement,
			String object,
			String definition,
			String extension,
			String extensionId,
			String attribute
	);

	/*
	 * @Query(value = "{'$or':[{'$and':?0},{'$and':?1}]}", fields = "?2")
	 * List<Statement> findDataByCustomQuery(DBObject queryOptionalObject, DBObject
	 * queryComplusoryObject, DBObject parametersToReceiveObject);
	 */
	@Query(
			value = "{" +
					"'$and':" +
					"[" +
					"{'$and':?0}, " +
					"{'$and':?1}, " +
					"{'$and': [ {'organisation':?3}, {'lrs_id':?4} ] }" +
					"]" +
					"}",
			fields = "?2")
	List<Statement> findDataByCustomQuery(
			DBObject queryObject,
			DBObject statementDurationObject,
			DBObject parametersToReceiveObject,
			ObjectId organizationIdObject,
			ObjectId lrsIdObject
	);

}
