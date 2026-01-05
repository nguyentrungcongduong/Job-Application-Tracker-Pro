# Backend Architecture Documentation

## Overview
The backend is a RESTful API built with **Spring Boot 3.4.1** and **Java 17**, designed for security, scalability, and type-safe data handling.

## Core Components

### 1. Security Architecture
- **Framework**: Spring Security 6.
- **Authentication**: Stateless JWT (JSON Web Token).
- **Flow**:
    1. User logs in/registers via `/api/v1/auth/**`.
    2. Server validates credentials and returns a JWT.
    3. Client sends JWT in the `Authorization: Bearer <token>` header for subsequent requests.
    4. `JwtAuthenticationFilter` validates the token and sets the Security Context.

### 2. Data Model (JPA Entities)
- **User**: Stores profile, credentials (hashed), and roles.
- **JobApplication**: Main entity containing company info, status, priority, and metadata. Linked to a User.
- **Interview**: Tracks individual rounds of interviews. Linked to a JobApplication.
- **Enums**: Strict typing for `ApplicationStatus`, `ApplicationSource`, `Priority`, and `InterviewType`.

### 3. Layers & Workflow
1. **Controller**: Handles HTTP requests and returns `ResponseEntity`.
2. **Service**: Contains business logic, manages transactions (`@Transactional`), and interacts with Repositories.
3. **Repository**: Spring Data JPA interfaces for database operations.
4. **DTO (Data Transfer Objects)**: Decouples the API layer from the Database layer.
5. **Mapper (MapStruct)**: Automatically transforms Entities to DTOs and vice versa.

### 4. Configuration
- **CORS**: Configured in `SecurityConfig.java` to allow requests from `localhost:5173`.
- **Auditing**: `JpaConfig` enables `@CreatedDate` and `@LastModifiedDate` for automatic timestamping.
- **Exception Handling**: `GlobalExceptionHandler` ensures all errors follow a consistent `{ "error": "message" }` format.

## API Endpoints
- `POST /api/v1/auth/register`: Create new account.
- `POST /api/v1/auth/login`: Authenticate and get token.
- `GET/POST/PUT/DELETE /api/v1/applications`: Manage job applications.
- `GET/POST/DELETE /api/v1/interviews`: Manage interviews.

## Build Requirements
- **Lombok**: Requires annotation processing enabled in IDE.
- **MapStruct**: Integration with Lombok requires specific compiler plugin settings (configured in `pom.xml`).
- **Java**: Must use JDK 17.
