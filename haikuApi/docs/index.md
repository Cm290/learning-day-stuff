# haiku-api

> An api provide to view haikus.

* [`GET /haikus`](#-get-haikus-) - returns a paginated list of all haikus

#### `GET /haikus`
Returns a paginated list of all haikus

##### Request
```HTTP
GET /haikus
```

##### Response
```JSON
200 OK
Content-Type: application/json

{
  "page": 1,
  "perPage": 20,
  "total": 1,
  "links": {
    "first": "http://localhost:3000/api/haikus?page=1&perPage=20",
    "last": "http://localhost:3000/api/haikus?page=1&perPage=20"
  },
  "results": [
    {
      "id": "some-id",
      "title": "some-title",
      "author": "some-author",
      "genre": "comedy",
      "text": "There was a bear in the woods he gave a huge roar and fell asleep"
    }
  ]
}

```

## TO DO

* set up a database in postgres or redis 'pg_ctl -D /Users/morric67/Documents/learning-day-stuff/postgres -l logfile start'
* allow pagination
* allow for user set tags "tags": ["funny", "bears", "Klaus"],
* allow for series "series": "part of some series?"
* allow for stats "stats": {
                              "published": 2017-04-07,
                              "comments": 3,
                              "likes": 6   
                           }

CREATE TABLE haikus (
    id            varchar(80),
    title         varchar(80),
    author        varchar(80),
    genre         varchar(80),
    text          varchar(120)
);
