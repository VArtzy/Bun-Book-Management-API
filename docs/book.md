# Book API

## Create Book API

Endpoint: POST /api/books

Header:

- Authorization: token

Request Body:
```json
    {
        "title": "Clean Code",
        "author": "Farrel Nikoson",
        "rating": 5,
        "cover": "./cover/clean_code.png"
    }
```

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "title": "Clean Code",
            "author": "Farrel Nikoson",
            "rating": 5,
            "cover": "./cover/clean_code.png"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Rating is out of range between 1 and 5"
    }
```

## Add Book To User API

Endpoint: POST /api/books/:id/current

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "title": "Clean Code",
            "author": "Farrel Nikoson",
            "rating": 5,
            "cover": "./cover/clean_code.png"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```

## Remove Book From User API

Endpoint: DELETE /api/books/:id/current

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": "OK"
```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```

## Update Book API

Endpoint: PUT /api/books/:id

Header:

- Authorization: token

Request Body:
```json
    {
        "title": "Clean Code",
        "author": "Farrel Nikoson",
        "rating": 5,
        "cover": "./cover/clean_code.png"
    }
```

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "title": "Clean Code",
            "author": "Farrel Nikoson",
            "rating": 5,
            "cover": "./cover/clean_code.png"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Rating is out of range between 1 and 5"
    }
```

## Get Book API

Endpoint: GET /api/books/:id

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "title": "Clean Code",
            "author": "Farrel Nikoson",
            "rating": 5,
            "cover": "./cover/clean_code.png"
            }
    }
```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```

## Get Book From User API

Endpoint: GET /api/books/current

Query params:

- title: search by title, using like, optional
- author: search by author, using like, optional
- rating: search by rating, descending or ascending, optional
- cursor: pointer to fetch next records, optional
- size: size per page, default 10

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": [
            {
                "id": 1,
                "title": "Clean Code",
                "author": "Farrel Nikoson",
                "rating": 5,
                "cover": "./cover/clean_code.png"
            },
            {
                "id": 2,
                "title": "Range",
                "author": "David Epstein",
                "rating": 4,
                "cover": "./cover/range.png"
            },
        ],
        "paging": {
            "cursor": null,
            "total_item": 30
        }
    }
```

## Search Book API

Endpoint: GET /api/books

Header:

- Authorization: token

Query params:

- title: search by title, using like, optional
- author: search by author, using like, optional
- rating: search by rating, descending or ascending, optional
- cursor: pointer to fetch next records, optional
- size: size per page, default 10

Response Body Success:
```json
    {
        "data": [
            {
                "id": 1,
                "title": "Clean Code",
                "author": "Farrel Nikoson",
                "rating": 5,
                "cover": "./cover/clean_code.png"
            },
            {
                "id": 2,
                "title": "Range",
                "author": "David Epstein",
                "rating": 4,
                "cover": "./cover/range.png"
            },
        ],
        "paging": {
            "cursor": null,
            "total_item": 30
        }
    }
```


## Remove Book API

Endpoint: DELETE /api/books/:id

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": "OK"
    }
```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```
