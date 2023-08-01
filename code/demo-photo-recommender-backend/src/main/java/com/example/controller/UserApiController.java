package com.example.controller;

import org.neo4j.driver.*;
import org.neo4j.driver.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Dmitry Divin
 */
@RestController
@RequestMapping("/api")
public class UserApiController {
    @Autowired
    Driver driver;

    @PostMapping("/user")
    public ResponseEntity<Long> createOrGetUser(@RequestParam String uuid) {
        Long id = null;
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            boolean exists = tx.run("""
                    match (u:User{uuid: $uuid})
                    return count(u) > 0 as exists
                    """, Map.of("uuid", uuid)).next().get("exists").asBoolean();
            if (exists) {
                id = tx.run("""
                    match (u:User{uuid: $uuid})
                    return u.id as userId
                    """, Map.of("uuid", uuid)).next().get("userId").asLong();
            } else {
                id = tx.run("""
                        MERGE (s:Sequence {id:'user_seq'})
                        ON CREATE SET s.current = 1
                        ON MATCH SET s.current = s.current+1
                        create (u:User{id: s.current, uuid: $uuid, created_at: timestamp()})
                        return s.current as userId
                        """, Map.of("uuid", uuid)).next().get("userId").asLong();
            }
            tx.commit();
        }

        return ResponseEntity.ok(id);
    }

    @GetMapping("/user/interests")
    public ResponseEntity<Map<String, Double>> getInterests(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                                            @RequestParam(defaultValue = "3600000", required = false) Long recentTime,
                                                            @RequestParam(defaultValue = "10", required = false) Integer limit) {
        Map<String, Double> interests = new HashMap<>();
        try (Session session = driver.session()) {
            Result result = session.run("""
                    match (u:User{id: $userId})-[r:IS_INTERESTING_TO]->(c:Classifier) where r.when > timestamp() - $recentTime
                    with c.keyword as interest, sum(r.feature) as weight
                    return interest, weight
                    order by weight desc
                    limit $limit
                    """, Map.of("recentTime", recentTime, "userId", authUserId, "limit", limit));
            while(result.hasNext()) {
                Record record = result.next();
                interests.put(
                        record.get("interest").asString(),
                        record.get("weight").asDouble()
                );
            }
        }
        return ResponseEntity.ok(interests);
    }

    @DeleteMapping("/user/interests/{interest}")
    public ResponseEntity<?> deleteInterests(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                             @RequestParam(defaultValue = "3600000", required = false) Long recentTime,
                                             @PathVariable String interest) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})-[r:IS_INTERESTING_TO]->(c:Classifier) where r.when > timestamp() - $recentTime and c.keyword = $interest
                    delete r
                    """, Map.of("userId", authUserId, "interest", interest, "recentTime", recentTime));
            tx.commit();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/user/interests")
    public ResponseEntity<?> setInterests(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                          @RequestBody List<String> interests) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})
                    set u.ux_classifiers = [], u.ux_features = []
                    with u
                    match (u)-[r:IS_INTERESTING_TO]->(:Classifier)
                    delete r
                    """, Map.of("userId", authUserId));
            tx.run("""
                    match (u:User{id: $userId}), (c:Classifier) where c.keyword in $interests
                    create (u)-[:IS_INTERESTING_TO{when: timestamp(), feature: 1.0}]->(c)
                    """, Map.of("userId", authUserId, "interests", interests));
            tx.commit();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/experience/rollup")
    public ResponseEntity<?> uxRollUp(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId,
                                      //by default rollup user experience
                                      @RequestParam(defaultValue = "60000", required = false) Long recentTime,
                                      @RequestParam(defaultValue = "20", required = false) Integer limitClassifiers) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})
                    with u
                    match (u)-[r:IS_INTERESTING_TO]->(c:Classifier) where r.when > timestamp() - $recentTime
                    with u, [r.feature, c.id] AS pair ORDER BY pair[0] DESC
                    with u, collect(pair[0])[0..$limitClassifiers] AS features,
                            collect(pair[1])[0..$limitClassifiers] AS classifiers
                    set u.ux_classifiers = classifiers, u.ux_features = features
                    """, Map.of("userId", authUserId, "recentTime", recentTime, "limitClassifiers", limitClassifiers));
            tx.commit();
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/history")
    public ResponseEntity<?> deleteHistory(@RequestHeader(value = "AUTH_USER_ID", defaultValue = "0", required = false) Long authUserId) {
        try (Session session = driver.session(); Transaction tx = session.beginTransaction()) {
            tx.run("""
                    match (u:User{id: $userId})-[r:IS_VIEWED|IS_LIKED]->()
                    delete r
                    """, Map.of("userId", authUserId));
            tx.commit();
        }
        return ResponseEntity.noContent().build();
    }
}
