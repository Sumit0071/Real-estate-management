# DreamHome Backend API

A comprehensive Spring Boot backend application for the DreamHome real estate platform.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **Maven** for dependency management

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- User registration and login
- Password encryption with BCrypt

### Property Management
- CRUD operations for properties
- Property search and filtering
- Property status management
- Featured properties
- Image URL storage for properties

### User Management
- User profiles
- Admin user management
- User dashboard data

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Properties (Public)
- `GET /api/properties/public` - Get available properties (paginated)
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/search` - Search properties by keyword
- `GET /api/properties/filter` - Filter properties with multiple criteria

#### Properties (Admin)
- `GET /api/properties/admin/all` - Get all properties
- `POST /api/properties/admin` - Create new property
- `PUT /api/properties/admin/{id}` - Update property
- `DELETE /api/properties/admin/{id}` - Delete property
- `PUT /api/properties/admin/{id}/status` - Update property status

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Database Setup
1. Install MySQL and create a database named `dreamhome_db`
2. Update database credentials in `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/dreamhome_db
       username: your_username
       password: your_password
   ```

### Running the Application
1. Clone the repository
2. Navigate to the backend directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The API will be available at `http://localhost:8080/api`

### Configuration
Key configuration properties in `application.yml`:
- Database connection settings
- JWT secret and expiration
- File upload settings
- CORS configuration
- Logging levels

## Project Structure

```
src/main/java/com/dreamhome/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Exception handling
├── repository/     # Data repositories
├── security/       # Security configuration
├── service/        # Business logic
└── util/           # Utility classes
```

## Database Schema

### Users Table
- User authentication and profile information
- Role-based access control

### Properties Table
- Property details and metadata
- Status tracking and categorization

### Inquiries Table
- Property inquiries from users
- Admin response tracking

## Security

- JWT tokens for stateless authentication
- Role-based authorization
- Password encryption
- CORS configuration for frontend integration

## API Documentation

The API follows RESTful conventions with:
- Proper HTTP status codes
- JSON request/response format
- Validation error handling
- Pagination support for list endpoints

## Development

### Adding New Features
1. Create entity classes in `entity/` package
2. Add repository interfaces in `repository/` package
3. Implement business logic in `service/` package
4. Create REST endpoints in `controller/` package
5. Add DTOs for data transfer in `dto/` package

### Testing
Run tests with:
```bash
mvn test
```

## Deployment

For production deployment:
1. Update `application.yml` with production database settings
2. Set secure JWT secret
3. Configure proper CORS origins
4. Build the application: `mvn clean package`
5. Run the JAR file: `java -jar target/dreamhome-backend-0.0.1-SNAPSHOT.jar`
