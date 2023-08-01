package alg.classifiers;

import org.junit.jupiter.api.*;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Result;
import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.neo4j.harness.Neo4j;
import org.neo4j.harness.Neo4jBuilders;

import java.util.List;

/**
 * @author Dmitry Divin
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ClassifierSimilarityFunctionsTests {
    private Driver driver;
    private Neo4j embeddedDatabaseServer;
    @BeforeAll
    void initializeNeo4j() {
        this.embeddedDatabaseServer = Neo4jBuilders.newInProcessBuilder()
                .withDisabledServer()
                .withFunction(ClassifierSimilarityFunctions.class)
                .withFunction(apoc.map.Maps.class)
                .build();

        this.driver = GraphDatabase.driver(embeddedDatabaseServer.boltURI());
    }

    @AfterAll
    void closeDriver(){
        this.driver.close();
        this.embeddedDatabaseServer.close();
    }

    @AfterEach
    void cleanDb(){
        try(Session session = driver.session()) {
            session.run("MATCH (n) DETACH DELETE n");
        }
    }

    @Test
    void testSimilarProducts() {
        try(Session session = driver.session()) {
            session.run("""
create (:Classifier{keyword: 'animals'})
create (:Classifier{keyword: 'cat'})
create (:Classifier{keyword: 'dog'})
create (:Classifier{keyword: 'car'})
                    """);

            session.run("""
create (o:Object{title: 'my cat'})
with o, [{keyword: "animals", accuracy: 1.0}, {keyword: "cat", accuracy: 0.8}] as classifiers
unwind classifiers as classifier
match (c:Classifier) where c.keyword = classifier.keyword
create (o)-[:IS_ASSOCIATED_WITH{accuracy: classifier.accuracy}]->(c)
                    """);

            session.run("""
create (o:Object{title: 'my dog'})
with o, [{keyword: "animals", accuracy: 1.0}, {keyword: "dog", accuracy: 0.75}] as classifiers
unwind classifiers as classifier
match (c:Classifier) where c.keyword = classifier.keyword
create (o)-[:IS_ASSOCIATED_WITH{accuracy: classifier.accuracy}]->(c)
                    """);

            session.run("""
create (o:Object{title: 'my car'})
with o, [{keyword: "car", accuracy: 1.0}] as classifiers
unwind classifiers as classifier
match (c:Classifier) where c.keyword = classifier.keyword
create (o)-[:IS_ASSOCIATED_WITH{accuracy: classifier.accuracy}]->(c)
                    """);

            Result res = session.run("""
match (o:Object{title: 'my dog'})-[r:IS_ASSOCIATED_WITH]->(c:Classifier)
with o, apoc.map.fromPairs(collect([ID(c), r.accuracy])) as leftVector
match (s:Object)-[r:IS_ASSOCIATED_WITH]->(c:Classifier)
with leftVector, o, s, apoc.map.fromPairs(collect([ID(c), r.accuracy])) as rightVector
with o.title as obj_title, s.title as similar_obj_title, alg.classifiers.cosineSimilarity(leftVector, rightVector) as score
return obj_title, similar_obj_title, score
                    """);

            while(res.hasNext()) {
                Record rec = res.next();
                System.out.println(String.format("%s | %s | %s", rec.get("obj_title").asString(), rec.get("similar_obj_title").asString(), rec.get("score").asDouble()));
            }
        }
    }


    @Test
    public void testCompare() {
        ClassifierSimilarityFunctions functions = new ClassifierSimilarityFunctions();
        functions.similar(List.of(1l, 2l), List.of(1.0, 2.1), List.of(1l), List.of(1.0));
    }
}
