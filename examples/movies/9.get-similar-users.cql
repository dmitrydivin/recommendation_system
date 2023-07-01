MATCH (u:User {name: 'Lonnie R. Wright'})-[:HAS_WATCHED]->(m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
WITH u, g.id AS classifier, SUM(r.accuracy) AS total_accuracy
WITH u, COLLECT(classifier) AS ux_classifiers, COLLECT(total_accuracy) AS ux_features
MATCH (similar:User)-[:HAS_WATCHED]->(m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
  WHERE similar <> u
WITH u, similar.name AS name, ux_classifiers, ux_features, g.id AS classifier, SUM(r.accuracy) AS total_feature
WITH u, name, ux_classifiers, ux_features, COLLECT(classifier) AS classifiers, COLLECT(total_feature) AS features
WITH u, name, alg.classifiers.similar(ux_classifiers, ux_features, classifiers, features) AS score
  WHERE score > 0.4
RETURN name, score
  ORDER BY score DESC