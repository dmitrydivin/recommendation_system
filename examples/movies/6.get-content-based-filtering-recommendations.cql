MATCH (u:User {name: 'Carlos M. Pratt'})-[:HAS_WATCHED]->(m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
WITH u, g.id AS classifier, sum(r.accuracy) AS features
WITH u, collect(classifier) AS ux_classifiers, collect(features) AS ux_features
MATCH (m:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
  WHERE NOT (u)-[:HAS_WATCHED]->(m)
WITH m.title AS title, ux_classifiers, ux_features, collect(g.id) AS classifiers, collect(r.accuracy) AS features,
     collect(g.name) AS genres
WITH title, genres, alg.classifiers.similar(ux_classifiers, ux_features, classifiers, features) AS score
  WHERE score > 0.4
RETURN title, genres, score
  ORDER BY score DESC
  LIMIT 7