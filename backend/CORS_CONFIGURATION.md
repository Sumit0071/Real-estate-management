# CORS Configuration Guide

## Overview

This document explains the Cross-Origin Resource Sharing (CORS) configuration implemented in the DreamHome backend application.

## What is CORS?

CORS is a security feature implemented by web browsers that blocks web pages from making requests to a different domain, protocol, or port than the one serving the web page, unless the server explicitly allows it.

## Current Configuration

### 1. Global CORS Configuration

The application uses a centralized CORS configuration in `CorsConfig.java`:

- **Location**: `src/main/java/com/dreamhome/config/CorsConfig.java`
- **Type**: Global configuration using `CorsConfigurationSource`
- **Integration**: Integrated with Spring Security

### 2. Configuration Properties

CORS settings are externalized in `application.yml`:

```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
  allowed-headers: "Authorization,Content-Type,Accept,Origin,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers"
  exposed-headers: "Authorization,Content-Disposition"
  allow-credentials: true
  max-age: 3600
```

### 3. Security Integration

CORS is properly integrated with Spring Security in `SecurityConfig.java`:

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource))
```

## Environment-Specific Configuration

### Development Environment
- **Allowed Origins**: Local development servers (localhost:5173, localhost:3000)
- **Headers**: Permissive for development ease
- **Credentials**: Enabled for authentication

### Production Environment
- **File**: `application-prod.yml`
- **Allowed Origins**: Environment variables for production domains
- **Security**: More restrictive header configuration
- **Monitoring**: Enhanced logging for CORS issues

## Testing CORS Configuration

### Test Endpoints

A dedicated test controller is available at `/cors-test`:

1. **GET** `/cors-test` - Basic CORS test
2. **POST** `/cors-test` - Test with request body
3. **PUT** `/cors-test` - Test PUT requests
4. **DELETE** `/cors-test/{id}` - Test DELETE requests
5. **PATCH** `/cors-test/{id}` - Test PATCH requests
6. **GET** `/cors-test/headers` - Test custom headers
7. **GET** `/cors-test/auth-test` - Test with authentication

### Manual Testing

You can test CORS using browser developer tools or tools like Postman:

```javascript
// Example fetch request from browser console
fetch('http://localhost:8080/api/cors-test', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data));
```

## Common CORS Issues and Solutions

### 1. "Access to fetch at ... has been blocked by CORS policy"

**Cause**: The origin is not in the allowed origins list.

**Solution**: Add the frontend origin to `cors.allowed-origins` in `application.yml`.

### 2. "Request header ... is not allowed by Access-Control-Allow-Headers"

**Cause**: Custom headers are not in the allowed headers list.

**Solution**: Add the header to `cors.allowed-headers` in `application.yml`.

### 3. "Method ... is not allowed by Access-Control-Allow-Methods"

**Cause**: HTTP method is not in the allowed methods list.

**Solution**: Add the method to `cors.allowed-methods` in `application.yml`.

### 4. Credentials not being sent

**Cause**: `allow-credentials` is false or not properly configured.

**Solution**: Ensure `cors.allow-credentials: true` and use `credentials: 'include'` in frontend requests.

## Best Practices

### Development
1. Use specific origins instead of wildcards when possible
2. Enable detailed CORS logging for debugging
3. Test all HTTP methods your frontend uses

### Production
1. **Never use wildcard (*) for origins in production**
2. Use environment variables for configuration
3. Implement proper monitoring and logging
4. Regularly review and update allowed origins
5. Use HTTPS for all production origins

## Configuration Examples

### Frontend Development Servers

```yaml
# For React (Vite)
cors:
  allowed-origins: http://localhost:5173

# For React (Create React App)
cors:
  allowed-origins: http://localhost:3000

# For Angular
cors:
  allowed-origins: http://localhost:4200

# For Vue.js
cors:
  allowed-origins: http://localhost:8080
```

### Production Deployment

```yaml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:https://yourdomain.com,https://www.yourdomain.com}
```

## Troubleshooting

### Enable CORS Debugging

Add this to `application.yml` for detailed CORS logs:

```yaml
logging:
  level:
    org.springframework.web.cors: DEBUG
```

### Browser Developer Tools

1. Open browser developer tools (F12)
2. Go to Network tab
3. Look for preflight OPTIONS requests
4. Check response headers for CORS headers

### Common Headers to Check

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`
- `Access-Control-Max-Age`

## Security Considerations

1. **Principle of Least Privilege**: Only allow necessary origins, methods, and headers
2. **Regular Audits**: Review CORS configuration regularly
3. **Environment Separation**: Use different configurations for dev/staging/prod
4. **Monitoring**: Log and monitor CORS-related errors
5. **Documentation**: Keep this documentation updated with any changes

## Migration Notes

If you need to modify CORS configuration:

1. Update `application.yml` properties
2. Test thoroughly in development
3. Update production environment variables
4. Deploy and monitor for issues
5. Update this documentation
