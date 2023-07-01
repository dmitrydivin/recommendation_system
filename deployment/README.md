All the examples available in this repository can be run using the following approach.

To start the Neo4j server, you can use the following command:

```
docker-compose up
```


After starting the Neo4j web server, it will be accessible at the following link http://localhost:7474/

And then you can import all the data with the following query:

```
// Movies dataset
CALL apoc.import.graphml("movies.graphml", {readLabels: true})
```


List of examples available here:
- [Movie recommendations](../examples/movies)