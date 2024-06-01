# User API

## Register User API

Endpoint: POST /api/users

Request Body:
```json
    {
        "username": "VArtz",
        "password": "rahasia",
        "name": "Farrel Nikoson"
    }
```

Response Body Success:
```json
    {
        "data": {
            "username": "VArtz",
            "name": "Farrel Nikoson"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Username already registered"
    }
```

## Login User API

Endpoint: POST /api/users/login

Request Body:
```json
{
    "username": "VArtz",
    "password": "rahasia"
}
```

Response Body Success:
```json
    {
        "data": {
            "token": "unique-token"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Username or password wrong"
    }
```

## Update User API

Endpoint: PATCH /api/users/current

Headers:

- Authorization: token

Request Body:
```json
    {
        "name": "Farrel Nikoson Dua",
        "password": "pass rahasia"
    }
```

Response Body Success:
```json
    {
        "data": {
            "username": "VArtz",
            "name": "Farrel Nikoson Dua"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Name length max 100"
    }
```

## Get User API

Endpoint: GET /api/users/current

Headers:

- Authorization: token

Response Body Success:
```json
    {
        "data": {
            "username": "VArtz",
            "name": "Farrel Nikoson"
        }
    }
```

Response Body Error:
```json
    {
        "errors": "Unauthorized"
    }
```

## Logout User API

Endpoint: DELETE /api/users/current

Headers:

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
        "errors": "Unauthorized"
    }
```
