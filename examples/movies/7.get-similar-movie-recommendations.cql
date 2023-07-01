MATCH (m:Movie {title: 'Jumanji (1995)'})-[r:IS_ASSOCIATED_WITH]->(g:Genre)
WITH m, g.id AS classifier, SUM(r.accuracy) AS total_feature
WITH m, COLLECT(classifier) AS m_classifiers, COLLECT(total_feature) AS m_features
MATCH (similar:Movie)-[r:IS_ASSOCIATED_WITH]->(g:Genre)
  WHERE m <> similar
WITH similar, m_classifiers, m_features, COLLECT(g.id) AS classifiers, COLLECT(r.accuracy) AS features
WITH similar.title AS title, alg.classifiers.similar(m_classifiers, m_features, classifiers, features) AS score
  WHERE score > 0.4
RETURN title, score
  ORDER BY score DESC