UNWIND [
//this user has the following preferences trailer movies
  {user: 'Melvin R. French', movie: 'Assassins (1995)'},
  {user: 'Melvin R. French', movie: 'Twelve Monkeys (a.k.a. 12 Monkeys) (1995)'},
  {user: 'Melvin R. French', movie: 'Seven (a.k.a. Se7en) (1995)'},
  {user: 'Melvin R. French', movie: 'Timecop (1994)'},
//this user has the following preferences children movies
  {user: 'James I. Dolezal', movie: 'Toy Story (1995)'},
  {user: 'James I. Dolezal', movie: 'Babe (1995)'},
  {user: 'James I. Dolezal', movie: 'Jumanji (1995)'},
  {user: 'James I. Dolezal', movie: 'JTom and Huck (1995)'},
//this user has the following preferences action movies
  {user: 'Elmer H. Welch', movie: 'Sudden Death (1995)'},
  {user: 'Elmer H. Welch', movie: 'Assassins (1995)'},
  {user: 'Elmer H. Welch', movie: 'I Love Trouble (1994)'},
  {user: 'Elmer H. Welch', movie: 'Jaws (1975)'},
//this user has the following preferences comedy movies
  {user: 'Carlos M. Pratt', movie: 'Bio-Dome (1996)'},
  {user: 'Carlos M. Pratt', movie: 'Pie in the Sky (1996)'},
  {user: 'Carlos M. Pratt', movie: 'Exit to Eden (1994)'},
  {user: 'Carlos M. Pratt', movie: 'Fools Rush In (1997)'},
//this user has the following preferences adventure movies
  {user: 'John B. Perry', movie: 'Dumb & Dumber (Dumb and Dumber) (1994)'},
  {user: 'John B. Perry', movie: 'Star Trek: The Motion Picture (1979)'},
  {user: 'John B. Perry', movie: 'Walkabout (1971)'},
  {user: 'John B. Perry', movie: 'Seven Years in Tibet (1997)'},
//this user has the following preferences horror movies
  {user: 'William H. Schmitt', movie: 'Castle Freak (1995)'},
  {user: 'William H. Schmitt', movie: 'Wolf (1994)'},
  {user: 'William H. Schmitt', movie: 'Jaws (1975)'},
  {user: 'William H. Schmitt', movie: 'Phantoms (1998)'},
//this user has the following preferences action movies for the similar use case
  {user: 'Lonnie R. Wright', movie: 'Metro (1997)'},
  {user: 'Lonnie R. Wright', movie: 'Mercury Rising (1998)'},
  {user: 'Lonnie R. Wright', movie: 'Star Trek VI: The Undiscovered Country (1991)'},
  {user: 'Lonnie R. Wright', movie: 'Assassins (1995)'}
] AS watchingMovie
MATCH (u:User {name: watchingMovie.user}), (m:Movie {title: watchingMovie.movie})
CREATE (u)-[:HAS_WATCHED]->(m)