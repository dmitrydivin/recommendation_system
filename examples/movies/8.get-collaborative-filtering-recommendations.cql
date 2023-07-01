MATCH (u:User {name: 'Lonnie R. Wright'})-[:HAS_WATCHED]->(m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
WITH u, g.id AS classifier, SUM(r.accuracy) AS total_accuracy
WITH u, COLLECT(classifier) AS ux_classifiers, COLLECT(total_accuracy) AS ux_features
MATCH (similar:User)-[:HAS_WATCHED]->(m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
  WHERE similar <> u
WITH u, similar, ux_classifiers, ux_features, g.id AS classifier, SUM(r.accuracy) AS total_feature
WITH u, similar, ux_classifiers, ux_features, COLLECT(classifier) AS classifiers, COLLECT(total_feature) AS features
WITH u, similar, ux_classifiers, ux_features, alg.classifiers.similar(ux_classifiers, ux_features, classifiers, features) AS score
  WHERE score > 0.6
MATCH (m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
  WHERE NOT (u)-[:HAS_WATCHED]->(m) AND (similar)-[:HAS_WATCHED]-(m)
WITH ux_classifiers, ux_features, m.title AS title, COLLECT(g.id) AS classifiers, COLLECT(r.accuracy) AS features,
     COLLECT(g.name) AS genres
WITH title, alg.classifiers.similar(ux_classifiers, ux_features, classifiers, features) AS score
RETURN title, score
  ORDER BY score DESC