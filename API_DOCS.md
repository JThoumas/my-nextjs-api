# User API Documentation

This document outlines the available endpoints for the User API.

**Base URL**: `http://localhost:3000`

---

## 1. Get All Users

Fetches a list of all users.

- **Method**: `GET`
- **URL**: `/api/users`
- **Request Body**: None

#### Success Response (200 OK):
```json
[
    {
        "id": 1,
        "name": "Alice",
        "created_at": "2025-10-06T20:06:28.000Z"
    },
    {
        "id": 2,
        "name": "Bob",
        "created_at": "2025-10-06T20:06:28.000Z"
    }
]
```
## 2. Create a New User

Adds a new user to the database.

- **Method**: `POST`
- **URL**: `/api/users`
- **Request Body**: None

#### Success Response (200 OK):
```json
[
    {
        "name": "Charlie"
    },
    {
        "id": 3,
        "name": "Charlie",
        "created_at": "2025-10-06T20:06:28.000Z"
    },
]
```
#### Error Response (404 Not Found)
```json
[
    {
        "error": "Name is required"
    }
]
```

## 3. Get a Specific User

Fetches a single user by their unique ID.

- **Method**: `GET`
- **URL**: `/api/users/:id` (e.g., /api/users/1)
- **Request Body**: None

#### Success Response (200 OK):
```json
[
    {
        "id": 1,
        "name": "Alice",
        "created_at": "2025-10-06T20:06:28.000Z"
    }
]
```
#### Error Response (404 Not Found)
```json
[
    {
        "error": "User not found"
    }
]
```

## 4. Update a User

Updates the name of a specific user.

- **Method**: `PATCH`
- **URL**: `/api/users/:id` (e.g., /api/users/1)
- **Request Body**: None

#### Success Response (200 OK):
```json
[
    {
        "id": 1,
        "name": "Alice Smith",
        "created_at": "2025-10-06T20:06:28.000Z"
    },
]
```
#### Error Response (404 Not Found)
```json
[
    {
        "error": "User not found"
    }
]
```

## 5. Delete a User

Permanently deletes a user from the database.

- **Method**: `DELETE`
- **URL**: `/api/users/:id` (e.g., /api/users/1)
- **Request Body**: None

#### Success Response (200 No Content):
```json
[
    {
        "error": "User not found"
    }
]
```