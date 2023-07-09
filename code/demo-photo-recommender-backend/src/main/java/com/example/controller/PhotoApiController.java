package com.example.controller;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Transaction;
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
public class PhotoApiController {
    @Autowired
    Driver driver;

    @PutMapping("/photos/{ids}/viewed")
    public ResponseEntity<?> viewed(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                    @PathVariable List<Long> ids) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})
                    with u
                    match (p:Photo) where p.id in $photoIds and not (u)-[:IS_VIEWED]->(p)
                    create (u)-[:IS_VIEWED]->(p)
                    """, Map.of("userId", authUserId, "photoIds", ids));
            tx.commit();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/photos/{id}")
    public ResponseEntity<Map<String, Object>> getPhoto(@PathVariable Long id) {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    match (p:Photo{id: $photoId})
                    return p.id as id, p.url as url
                    """, Map.of("photoId", id));
            if (result.hasNext()) {
                Map<String, Object> item = new HashMap<>();
                Record record = result.next();
                item.put("id", record.get("id").asLong());
                item.put("url", record.get("url").asString());
                return ResponseEntity.ok(item);
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

    @PutMapping("/photos/{id}/like")
    public ResponseEntity<?> like(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                     @PathVariable Long id) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})
                    with u
                    match (p:Photo{id: $photoId}) where not (u)-[:IS_LIKED]->(p)
                    create (u)-[:IS_LIKED]->(p)
                    with u, p
                    match (p)-[r:IS_CLASSIFIED_IN]->(c:Classifier)
                    create (u)-[:IS_INTERESTING_TO{when: timestamp(), feature: r.feature}]->(c)
                    """, Map.of("userId", authUserId, "photoId", id));
            tx.commit();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/photos/{id}/similar")
    public ResponseEntity<List<Map<String, Object>>> getSimilarPhotos(@PathVariable Long id,
                                                                               @RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                                                               @RequestParam(defaultValue = "10", required = false) Integer limit,
                                                                               @RequestParam(defaultValue = "0.5", required = false) Double minHitRate,
                                                                               @RequestParam(defaultValue = "1.0", required = false) Double maxHitRate,
                                                                               //by default match with any item from select
                                                                               @RequestParam(defaultValue = "1.0", required = false) Double throttling) {
        List<Map<String, Object>> items = new ArrayList<>();
        try (Session session = driver.session()) {
            Result result = session.run("""
                    match (s:Photo{id: $photoId}), (u:User{id: $userId})
                    with s, u
                    match (p:Photo) where not (u)-[:IS_VIEWED]->(p) and p.id * 0 + rand() > 1.0 - $throttling and p<>s
                    with p.id as id, p.url as url, p.title as title, alg.classifiers.similar(s.classifiers, s.features, p.classifiers, p.features) as score
                    where score > $minHitRate and score < $maxHitRate
                    return id, url, title, score
                    order by score desc
                    limit $limit
                    """, Map.of("userId", authUserId, "photoId", id, "limit", limit, "minHitRate", minHitRate, "throttling", throttling, "maxHitRate", maxHitRate));
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
