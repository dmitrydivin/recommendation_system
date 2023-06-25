# The description

This repository describes an approach to building real-time recommender systems.
The philosophical concept of this approach is that when in the system comes into balance, it gives a single whole.
The algorithm that will be presented here does not need a lot of memory and is low latency.
The complexity of the algorithm is `o(n)`
Using this approach, you can design the following types of recommendation systems.
- Content based filtering
- User based collaborative filtering
- Combine both methods

This repository contains the implementation of the algorithm as a plugin function for Neo4j.
Also in this repository there is a databse dump with which you can try out the possibilities of this approach. I took the data from an open source https://github.com/unsplash/datasets

## Structure of repository
```
<root>
  |
  +- code
  |   |
  |   +- neo4j-plugin
  +- deployment.zip
```

Where is
- neo4j-plugin - algorithm source code for Neo4J database
- deployment.zip - docker compose installation with dump for example


# Similar function for Neo4J 

```
alg.classifiers.similar(<leftClassifiers>, <leftFeatures>, <rightClassifiers>, <rightFeatures>)
```

Arguments:

- leftClassifiers - left list of classifers in Long type
- leftFeatures - left list of features in Double type
- rightClassifiers - right list of classifiers in Long type
- rightFeatures - right list of features in Double type

NOTE: classifiers and features should be the same size but the size of the classifiers may differ

Result:

The function return score from 0.0 to 1.0 for left and right classifiers between their distances


Examples of using

case 1: when left and right parts is simialar
```Cypher
//return 1.0
return alg.classifiers.similar([1,2,3], [1.0, 1.0, 1.0], [1,2,3], [1.0, 1.0, 1.0])
```

case 2:
```Cypher
//return 1.0
return alg.classifiers.similar([1,2,3], [2.0, 2.0, 2.0], [1,2,3], [1.0, 1.0, 1.0])
```

case 3:
```Cypher
//return 0.9989610386805192
return alg.classifiers.similar([1,2,3], [1.0, 1.1, 1.0], [1,2,3], [1.0, 1.0, 1.0])
```

case 4:
```Cypher
//return 0.9961164901835045
return alg.classifiers.similar([1,2,3], [1.0, 1.2, 1.0], [1,2,3], [1.0, 1.0, 1.0])
```

case 5:
```Cypher
//return 0.8164965809277259
return alg.classifiers.similar([1,2], [1.0, 1.0], [1,2,3], [1.0, 1.0, 1.0])
```

# Examples of using

## Prepare cold start by selected keywords

```Cypher
match (c:Classifier) where c.keyword in ["plant", "outdoors"]
with collect(c.id) as classifiers, [1.0, 1.0] as features
match (p:Post)
return p.id as postId,
  alg.classifiers.similar(p.classifiers, p.features, classifiers, features) as score, p.title as title
order by score desc
limit 10
```


## Post related recommendations

```Cypher
match (p:Post{id:0}), (r:Post) where p <> r
return r.id as postId, r.title as title,
  alg.classifiers.similar(p.classifiers, p.features, r.classifiers, r.features) as score
order by score desc
limit 10
```

If you want to support my work, you can leave me a [tip](https://www.paypal.com/donate/?hosted_button_id=YB9A5UNH7LB34). Thank you.

