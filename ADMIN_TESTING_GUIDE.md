# DreamHome Admin System Testing Guide

## Admin User Credentials
- **Username**: koustav
- **Password**: koustav123

## Testing Steps

### 1. Admin Login Test
1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - Username: `koustav`
   - Password: `koustav123`
3. Click "Login"
4. Should redirect to `/admin/dashboard`

### 2. Admin Dashboard Test
**URL**: http://localhost:5173/admin/dashboard

**Expected Features**:
- Statistics cards showing:
  - Total Users
  - Total Properties
  - Properties Sold
  - Total Inquiries
- Recent Users section
- Recent Properties section
- Navigation sidebar with links to:
  - Dashboard
  - Manage Users
  - Manage Properties
  - Manage Inquiries

### 3. User Management Test
**URL**: http://localhost:5173/admin/users

**Expected Features**:
- View all users in a table
- Search users by name, email, or username
- Create new users with form:
  - Username, Email, First Name, Last Name
  - Phone Number, Role (USER/ADMIN), Password
- Edit existing users
- Activate/Deactivate users
- Delete users
- Pagination for large user lists

**Test Cases**:
1. Create a new user
2. Search for users
3. Edit user details
4. Toggle user status (activate/deactivate)
5. Delete a user

### 4. Property Management Test
**URL**: http://localhost:5173/admin/properties

**Expected Features**:
- View all properties in a table
- Create new properties with form:
  - Title, Description, Price
  - Address, City, State, Zip Code
  - Bedrooms, Bathrooms, Area
  - Property Type, Status
  - Multiple Image URLs
  - Featured property checkbox
- Edit existing properties
- Delete properties
- Property status management

**Test Cases**:
1. Create a new property
2. Edit property details
3. Update property status
4. Delete a property
5. Add multiple images to a property

### 5. Inquiry Management Test
**URL**: http://localhost:5173/admin/inquiries

**Expected Features**:
- View all property inquiries
- See inquiry details (user, property, message)
- Respond to inquiries
- Update inquiry status
- Pagination for inquiries

**Test Cases**:
1. View inquiry list
2. Respond to an inquiry
3. Edit existing responses

## API Endpoints Testing

### Admin Dashboard Stats
```
GET http://localhost:8080/api/admin/dashboard/stats
Authorization: Bearer <JWT_TOKEN>
```

### User Management
```
GET http://localhost:8080/api/admin/users?page=0&size=10
POST http://localhost:8080/api/admin/users
PUT http://localhost:8080/api/admin/users/{id}
DELETE http://localhost:8080/api/admin/users/{id}
PUT http://localhost:8080/api/admin/users/{id}/activate
PUT http://localhost:8080/api/admin/users/{id}/deactivate
GET http://localhost:8080/api/admin/users/search?query=test
```

### Property Management
```
GET http://localhost:8080/api/properties/admin/all
POST http://localhost:8080/api/properties/admin
PUT http://localhost:8080/api/properties/admin/{id}
DELETE http://localhost:8080/api/properties/admin/{id}
```

### Inquiry Management
```
GET http://localhost:8080/api/admin/inquiries?page=0&size=10
PUT http://localhost:8080/api/admin/inquiries/{id}/respond
```

## Security Testing

### Role-Based Access Control
1. Try accessing admin endpoints without authentication
2. Try accessing admin endpoints with USER role
3. Verify only ADMIN role can access admin features

### JWT Token Validation
1. Test with expired tokens
2. Test with invalid tokens
3. Test with missing tokens

## Database Verification

### Check Admin User Creation
```sql
SELECT * FROM users WHERE username = 'koustav';
```

### Check User Roles
```sql
SELECT username, role, is_active FROM users;
```

### Check Properties
```sql
SELECT id, title, status, type FROM properties;
```

### Check Inquiries
```sql
SELECT id, status, created_at FROM inquiries;
```

## Expected Results

### Successful Admin Login
- User should be redirected to admin dashboard
- JWT token should be stored in localStorage
- Admin navigation should be visible

### Dashboard Statistics
- Should display real data from database
- Statistics should update when data changes
- Recent activity should show latest users and properties

### User Management
- All CRUD operations should work
- Search functionality should return relevant results
- User status changes should be reflected immediately
- Role changes should affect user permissions

### Property Management
- Properties should be created with all fields
- Image URLs should be stored as arrays
- Property status updates should work
- Featured properties should be marked correctly

### Inquiry Management
- All inquiries should be visible to admin
- Admin responses should be saved
- Inquiry status should update after response

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check backend CORS configuration
2. **Authentication Errors**: Verify JWT token is being sent
3. **Database Errors**: Check MySQL connection and schema
4. **API Errors**: Check backend logs for detailed error messages

### Debug Steps
1. Check browser console for JavaScript errors
2. Check Network tab for API request/response details
3. Check backend logs for server-side errors
4. Verify database connections and data

## Performance Testing

### Load Testing
1. Create multiple users simultaneously
2. Upload multiple properties with images
3. Test pagination with large datasets
4. Test search functionality with large user base

### Response Time Testing
1. Dashboard load time should be < 2 seconds
2. User search should return results < 1 second
3. Property creation should complete < 3 seconds
4. Image uploads should handle multiple URLs efficiently

## Security Checklist

- [ ] Admin user created with secure password
- [ ] JWT tokens expire appropriately
- [ ] Role-based access control working
- [ ] SQL injection protection in place
- [ ] XSS protection implemented
- [ ] CSRF protection enabled
- [ ] Password hashing using BCrypt
- [ ] Sensitive data not exposed in API responses

## Final Verification

After completing all tests, verify:
1. Admin user 'koustav' can log in successfully
2. All admin features are functional
3. Database operations work correctly
4. Security measures are in place
5. Error handling works properly
6. User experience is smooth and intuitive
