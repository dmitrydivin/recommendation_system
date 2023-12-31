package com.example.controller;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Dmitry Divin
 */
@RestController
@RequestMapping("/api")
public class RecommendationApiController {
    @Autowired
    Driver driver;

    @GetMapping("/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                                                        @RequestParam(defaultValue = "10", required = false) Integer limit,
                                                                        @RequestParam(defaultValue = "0.5", required = false) Double hitRate,
                                                                        //by default match with any item from select
                                                                        @RequestParam(defaultValue = "1.0", required = false) Double throttling) {
        List<Map<String, Object>> items = new ArrayList<>();
        try (Session session = driver.session()) {
            Result result = session.run("""
                    match (u:User{id: $userId})
                    with u
                    match (p:Photo) where not (u)-[:IS_VIEWED]->(p) and p.id * 0 + rand() > 1.0 - $throttling
                    with p.id as id, p.url as url, p.title as title, alg.classifiers.similar(u.ux_classifiers, u.ux_features, p.classifiers, p.features) as score
                    where score >= $hitRate
                    return id, url, title, score
                    order by score desc
                    limit $limit
                    """, Map.of("userId", authUserId, "limit", limit, "hitRate", hitRate, "throttling", throttling));

            while(result.hasNext()) {
                Record record = result.next();
                Map<String, Object> item = new HashMap<>();
                item.put("id", record.get("id").asLong());
                item.put("url", record.get("url").asString());
                item.put("title", record.get("title").asString());
                item.put("score", record.get("score").asDouble());
                items.add(item);
            }
        }
        return ResponseEntity.ok(items);
    }
}
