# ProCoachHubBackend
i am creating api for coaching management full flege by using node,express,typescript,jsonwebtoken mongoose bcryptjs zod


# ProCoachHubBackend
i am creating api for coaching management full flege by using node,express,typescript,jsonwebtoken mongoose bcryptjs zod

| Key              | Type   | Required |
| ---------------- | ------ | -------- |
| fullName         | string | Yes      |
| email            | string | Yes      |
| phone            | string | No       |
| password         | string | Yes      |
| confirmPassword  | string | Yes      |
| gender           | string | No       |
| dateOfBirth      | string | No       |
| address          | string | No       |
| city             | string | No       |
| state            | string | No       |
| country          | string | No       |
| coachingInterest | string | No       |
| experienceLevel  | string | No       |
| bio              | string | No       |
| qualification    | string | No       |
| organizationName | string | No       |
| emergencyContact | string | No       |
| role             | string | No       |
| profileImage     | file   | No       |

| Method | Route            | Auth | Purpose                    |
| ------ | ---------------- | ---- | -------------------------- |
| POST   | /register        | No   | Register user and send OTP |
| POST   | /verify-otp      | No   | Verify account OTP         |
| POST   | /resend-otp      | No   | Resend verification OTP    |
| POST   | /login           | No   | Login and issue tokens     |
| POST   | /refresh         | No   | Rotate refresh token       |
| POST   | /logout          | No   | Revoke refresh token       |
| POST   | /forgot-password | No   | Send reset OTP             |
| POST   | /reset-password  | No   | Reset password with OTP    |
| GET    | /profile         | Yes  | Get current user profile   |
| PATCH  | /profile         | Yes  | Update profile             |
| PATCH  | /change-password | Yes  | Change password            |

Route Details
Register
POST /api/auth/register
Use form-data because profile image upload is supported.
Form-data keys

{
  "fullName": "Amit Kumar",
  "email": "amit@example.com",
  "phone": "9876543210",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "gender": "male",
  "dateOfBirth": "2000-01-01",
  "address": "Street 1",
  "city": "Delhi",
  "state": "Delhi",
  "country": "India",
  "coachingInterest": "fitness",
  "experienceLevel": "beginner",
  "bio": "Student",
  "qualification": "BCA",
  "organizationName": "ProCoachHub",
  "emergencyContact": "9999999999",
  "role": "student"
}
File key:
{
  "profileImage": "choose image file"
}

Success response:

{
  "success": true,
  "message": "Registered successfully. OTP sent by email or SMS.",
  "data": {
    "userId": "...",
    "email": "amit@example.com",
    "phone": "9876543210"
  }
}


Verify OTP
POST /api/auth/verify-otp

JSON body

{
  "emailOrPhone": "amit@example.com",
  "otp": "123456"
}

Success response
{
  "success": true,
  "message": "OTP verified successfully"
}

Resend OTP
POST /api/auth/resend-otp

JSON body

{
  "emailOrPhone": "amit@example.com"
}

Success response

{
  "success": true,
  "message": "OTP resent successfully"
}

Login
POST /api/auth/login

JSON body

{
  "emailOrPhone": "amit@example.com",
  "password": "Password@123"
}

Success response

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Amit Kumar",
      "email": "amit@example.com"
    },
    "accessToken": "eyJhbGciOi..."
  }
}

The refresh token is stored in an httpOnly cookie named refresh_token.

Refresh Token
POST /api/auth/refresh

JSON body

{
  "refreshToken": "your_refresh_token_here"
}

Success response

{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "_id": "...",
      "fullName": "Amit Kumar"
    },
    "accessToken": "eyJhbGciOi..."
  }
}

Logout
POST /api/auth/logout

JSON body

{
  "refreshToken": "your_refresh_token_here"
}

Success response

{
  "success": true,
  "message": "Logged out successfully"
}

Forgot Password
POST /api/auth/forgot-password

JSON body

{
  "emailOrPhone": "amit@example.com"
}

Success response

{
  "success": true,
  "message": "If the account exists, reset instructions were sent"
}

Reset Password
POST /api/auth/reset-password

JSON body

{
  "emailOrPhone": "amit@example.com",
  "otp": "123456",
  "newPassword": "NewPassword@123",
  "confirmNewPassword": "NewPassword@123"
}

Success response

{
  "success": true,
  "message": "Password reset successfully"
}

Get Profile
GET /api/auth/profile

Set Postman Authorization type to Bearer Token and paste the access token.

Success response

{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "...",
    "fullName": "Amit Kumar",
    "email": "amit@example.com"
  }
}

Update Profile
PATCH /api/auth/profile

Use form-data if uploading a profile image. Send only the fields you want to change.

Example keys

{
  "fullName": "Amit Sharma",
  "phone": "9111111111",
  "gender": "male",
  "city": "Noida",
  "state": "UP",
  "country": "India",
  "bio": "Updated bio"
}
File Key:
{
  "profileImage": "choose image file"
}

Success response

{
  "success": true,
  "message": "Profile updated successfully"
}

Change Password
PATCH /api/auth/change-password

JSON body

{
  "currentPassword": "Password@123",
  "newPassword": "NewPassword@123",
  "confirmNewPassword": "NewPassword@123"
}

Success response

{
  "success": true,
  "message": "Password changed successfully"
}

Postman Testing Order
Register.

Verify OTP.

Login.

Copy access token.

Get Profile.

Update Profile.

Change Password.

Forgot Password.

Reset Password.

Refresh Token.

Logout.

Postman Authorization Setup
For protected routes like /profile, set Authorization to Bearer Token and paste the access token returned by login. You can also manually add this header:

Authorization: Bearer <access_token>

Implementation Notes
Passwords are hashed before storage.

Access tokens are short-lived.

Refresh tokens are stored in a secure cookie and tracked in MongoDB.

OTP documents use TTL indexing so they expire automatically.

lastLoginAt, lastLoginIp, and lastLoginUserAgent are updated after successful login.

Protected routes require the Authorization header.

Error Handling
Common errors you may see include:

401 Unauthorized if the access token is missing or invalid.

403 Please verify your account first if the user has not completed OTP verification.

400 Invalid OTP if the OTP is incorrect or expired.

409 Email already registered if the email already exists.

Recommended Frontend Flow
Register user.

Prompt OTP verification.

Login after verification.

Store access token securely.

Use refresh token for session renewal.

Call refresh endpoint when access token expires.

Logout by revoking refresh token.

