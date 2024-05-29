package com.openlap.AnalyticsEngine.repo;

import com.openlap.AnalyticsEngine.dto.AggItems;
import com.openlap.AnalyticsEngine.dto.LrsObjects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

/**
 Created By Ao on 2022/10/30
 */

@Repository
public class StatementTemplateRepoImpl implements StatementTemplateRepo {
    @Autowired
    MongoTemplate mongoTemplate;

//    DBObject queryObject, DBObject statementDurationObject, DBObject parametersToReceiveObject, ObjectId organizationIdObject, ObjectId lrsIdObject
    @Override
    public List<AggItems> findDataByCustomAggregate() {

        Criteria criteria = Criteria.where("statement.verb.id").is("http://id.tincanapi.com/verb/viewed");
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("statement.actor.account.name")
                        .count()
                        .as("result")
        );
        AggregationResults<AggItems> statements1 = mongoTemplate.aggregate(agg, "statements", AggItems.class);

        List<AggItems> mappedResults = statements1.getMappedResults();
        return mappedResults;
    }

    @Override
    public List<LrsObjects> findAllData(int pageNumber, int pageSize) {
        Query query = new Query();
        query.skip((pageNumber - 1) * pageSize); // skip records
        query.limit(pageSize); // limit return records
        List<LrsObjects> documents = mongoTemplate.find(query, LrsObjects.class,"statements");
        return documents;
    }
}
