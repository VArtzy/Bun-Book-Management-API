# Review API

## Create Review API

Endpoint: POST /api/books/:bookId/review

Header:

- Authorization: token

Request Body:
```json
    {
        "body": "This book is the best for everyone who loves to manage their code",
        "rating": 5
    }
```

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "body": "This book is the best for everyone who loves to manage their code",
            "rating": 5
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Review body is required"
    }
```

## Update Review API

Endpoint: PUT /api/books/:bookId/review/:reviewId

Header:

- Authorization: token

Request Body:
```json
    {
        "body": "This book is the best for everyone who loves to having clean code",
        "rating": 4
    }
```

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "body": "This book is the best for everyone who loves to having clean code",
            "rating": 4
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Review body is required"
    }
```

## Get Review API

Endpoint: GET /api/books/:bookId/review/:reviewId

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": {
            "id": 1,
            "body": "This book is the best for everyone who loves to having clean code",
            "rating": 4
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```


## List Book Review API

Endpoint: GET /api/books/:bookId/review

Header:

- Authorization: token

Response Body Success:
```json
    {
        "data": [
            {
                "id": 1,
                "body": "This book is the best for everyone who loves to having clean code",
                "rating": 4
            },
            {
                "id": 2,
                "body": "This book is the best for everyone who loves to manage their code",
                "rating": 5
            },
        ]
    }
    ```

Response Body Error:
```json
    {
        "errors": "Book is not found"
    }
```

## Remove Review API

Endpoint: DELETE /api/books/:bookId/review/:reviewId

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
        "errors": "Review is not found"
    }
```
