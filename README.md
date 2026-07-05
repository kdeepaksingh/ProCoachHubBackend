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
"\_id": "...",
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
"\_id": "...",
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
"\_id": "...",
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

/_ STUDENT MODULE FLOW START FROM HERE _/

Student Module
All student APIs are under the base path:

text
/api/student
Common requirements
Authentication header (required for all routes):

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
User role: STUDENT

Auth middleware: requireAuth + authorizeRoles(ROLES.STUDENT)

1. Dashboard & Core
   1.1 Get Student Dashboard
   Route:
   GET /api/student/dashboard

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Query params: None

Description:
Returns a summary for the student dashboard: total batches, upcoming classes, recent tests, attendance summary, and fee summary.

Example response:

json
{
"success": true,
"message": "Student dashboard data fetched",
"data": {
"totalBatches": 2,
"upcomingClasses": [
{
"batchName": "Batch A",
"courseName": "JEE Physics",
"startTime": "2026-07-06T09:00:00.000Z",
"endTime": "2026-07-06T10:00:00.000Z",
"schedule": {
"days": ["Mon", "Wed", "Fri"],
"time": "09:00 AM",
"mode": "online",
"link": "https://meet.example.com/abc"
}
}
],
"recentTests": [
{
"_id": "testId123",
"title": "Physics Mock 1",
"type": "mock",
"scheduledAt": "2026-07-10T10:00:00.000Z",
"maxMarks": 100
}
],
"attendanceSummary": {
"totalDays": 20,
"presentDays": 18,
"percentage": 90
},
"feeSummary": {
"totalAmount": 50000,
"paidAmount": 30000,
"pendingAmount": 20000
}
}
}

1.2 Get My Courses
Route:
GET /api/student/courses

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
List of courses the student is enrolled in.

Example response:

json
{
"success": true,
"message": "Courses fetched",
"data": [
{
"_id": "courseId123",
"name": "JEE Physics",
"code": "JEE-PHY",
"durationMonths": 12,
"isActive": true
}
]
}
1.3 Get My Batches
Route:
GET /api/student/batches

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
List of batches (with course info) the student is enrolled in.

Example response:

json
{
"success": true,
"message": "Batches fetched",
"data": [
{
"enrollment": {
"\_id": "enrollId123",
"studentId": "userId123",
"batchId": "batchId123",
"courseId": "courseId123",
"status": "active",
"enrolledAt": "2026-01-01T00:00:00.000Z"
},
"batch": {
"\_id": "batchId123",
"name": "Batch A",
"courseId": "courseId123",
"startTime": "2026-01-05T00:00:00.000Z",
"endTime": "2026-12-31T00:00:00.000Z",
"schedule": {
"days": ["Mon", "Wed", "Fri"],
"time": "09:00 AM",
"mode": "online",
"link": "https://meet.example.com/abc"
}
},
"course": {
"\_id": "courseId123",
"name": "JEE Physics",
"code": "JEE-PHY"
}
}
]
}
1.4 Get My Schedule
Route:
GET /api/student/schedule

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Weekly class schedule for active batches.

Example response:

json
{
"success": true,
"message": "Schedule fetched",
"data": [
{
"batchName": "Batch A",
"course": "JEE Physics",
"startTime": "2026-01-05T00:00:00.000Z",
"endTime": "2026-12-31T00:00:00.000Z",
"schedule": {
"days": ["Mon", "Wed", "Fri"],
"time": "09:00 AM",
"mode": "online",
"link": "https://meet.example.com/abc"
}
}
]
} 2. Academic
2.1 Get My Attendance
Route:
GET /api/student/attendance

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Query params (optional):

from: YYYY-MM-DD

to: YYYY-MM-DD

Example:

text
GET /api/student/attendance?from=2026-01-01&to=2026-07-05
Example response:

json
{
"success": true,
"message": "Attendance fetched",
"data": [
{
"date": "2026-07-01T00:00:00.000Z",
"batchName": "Batch A",
"status": "present"
},
{
"date": "2026-07-02T00:00:00.000Z",
"batchName": "Batch A",
"status": "absent"
}
]
}
2.2 Get My Assignments
Route:
GET /api/student/assignments

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
List of assignments / notes / study material for enrolled batches.

Example response:

json
{
"success": true,
"message": "Assignments fetched",
"data": [
{
"_id": "assignId123",
"batchId": "batchId123",
"title": "Physics Chapter 1 Assignment",
"description": "Solve all problems from Chapter 1.",
"type": "assignment",
"attachmentUrl": "https://storage.example.com/assign1.pdf",
"dueDate": "2026-07-10T23:59:59.000Z",
"postedAt": "2026-07-01T10:00:00.000Z"
}
]
}
2.3 Get My Tests
Route:
GET /api/student/tests

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
List of tests for enrolled batches.

Example response:

json
{
"success": true,
"message": "Tests fetched",
"data": [
{
"_id": "testId123",
"batchId": "batchId123",
"title": "Physics Mock 1",
"type": "mock",
"scheduledAt": "2026-07-10T10:00:00.000Z",
"durationMinutes": 120,
"maxMarks": 100,
"link": "https://test.example.com/physics-mock-1"
}
]
}
2.4 Get My Test Results
Route:
GET /api/student/test-results

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Test results with marks, max marks, and percentages.

Example response:

json
{
"success": true,
"message": "Test results fetched",
"data": [
{
"testTitle": "Physics Mock 1",
"testType": "mock",
"batchName": "Batch A",
"maxMarks": 100,
"marksObtained": 78,
"submittedAt": "2026-07-10T12:00:00.000Z"
}
]
}
2.5 Get Performance Report
Route:
GET /api/student/performance/report

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Performance report: attendance stats and test stats.

Example response:

json
{
"success": true,
"message": "Performance report fetched",
"data": {
"attendance": {
"totalDays": 20,
"presentDays": 18,
"percentage": 90
},
"tests": {
"totalTests": 5,
"averagePercentage": 82.4,
"totalMarksObtained": 412,
"totalMaxMarks": 500
}
}
} 3. Fees
3.1 Get My Fee Plans
Route:
GET /api/student/fee-plans

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Fee plans for the student (total amount, installments, etc.).

Example response:

json
{
"success": true,
"message": "Fee plans fetched",
"data": [
{
"\_id": "feePlanId123",
"studentId": "userId123",
"courseId": {
"\_id": "courseId123",
"name": "JEE Physics",
"code": "JEE-PHY"
},
"totalAmount": 50000,
"discount": 5000,
"installments": [
{
"dueDate": "2026-02-01T00:00:00.000Z",
"amount": 15000,
"description": "First installment",
"paid": true
},
{
"dueDate": "2026-05-01T00:00:00.000Z",
"amount": 15000,
"description": "Second installment",
"paid": true
},
{
"dueDate": "2026-08-01T00:00:00.000Z",
"amount": 15000,
"description": "Third installment",
"paid": false
}
]
}
]
}
3.2 Get My Payments
Route:
GET /api/student/payments

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Payment history for the student.

Example response:

json
{
"success": true,
"message": "Payments fetched",
"data": [
{
"_id": "payId123",
"studentId": "userId123",
"feePlanId": "feePlanId123",
"installmentIndex": 0,
"amountPaid": 15000,
"paymentDate": "2026-01-28T00:00:00.000Z",
"paymentMode": "upi",
"transactionId": "TXN123456"
}
]
} 4. Notifications
4.1 Get My Notifications
Route:
GET /api/student/notifications

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Query params (optional):

limit: number (default 20)

unreadOnly: "true" | "false"

Example:

text
GET /api/student/notifications?limit=10&unreadOnly=true
Example response:

json
{
"success": true,
"message": "Notifications fetched",
"data": [
{
"_id": "notifId123",
"userId": "userId123",
"title": "Fee Due",
"message": "Your third installment is due on 2026-08-01.",
"type": "fee",
"isRead": false,
"createdAt": "2026-07-01T10:00:00.000Z"
}
]
}
4.2 Mark Notification as Read
Route:
PATCH /api/student/notifications/:id/read

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
URL params:

id: notification ObjectId

Example:

text
PATCH /api/student/notifications/notifId123/read
Example response:

json
{
"success": true,
"message": "Notification marked as read",
"data": {
"\_id": "notifId123",
"userId": "userId123",
"title": "Fee Due",
"message": "Your third installment is due on 2026-08-01.",
"type": "fee",
"isRead": true,
"createdAt": "2026-07-01T10:00:00.000Z"
}
}
4.3 Mark All Notifications as Read
Route:
PATCH /api/student/notifications/read-all

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Example response:

json
{
"success": true,
"message": "All notifications marked as read"
} 5. Profile
5.1 Get Student Profile
Route:
GET /api/student/profile

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Description:
Get student profile (user details without password).

Example response:

json
{
"success": true,
"message": "Profile fetched",
"data": {
"\_id": "userId123",
"fullName": "Test Student",
"email": "student@example.com",
"phone": "1234567890",
"gender": "male",
"dateOfBirth": "2000-01-01T00:00:00.000Z",
"address": "Some address",
"city": "City",
"state": "State",
"country": "Country",
"coachingInterest": "JEE",
"experienceLevel": "intermediate",
"bio": "Short bio",
"qualification": "12th",
"organizationName": "School XYZ",
"emergencyContact": "9876543210",
"role": "STUDENT",
"isVerified": true
}
}
5.2 Update Student Profile
Route:
PATCH /api/student/profile

Headers:

text
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
Body (all fields optional):

json
{
"fullName": "Updated Name",
"phone": "1234567890",
"gender": "male",
"dateOfBirth": "2000-01-01",
"address": "Updated address",
"city": "City",
"state": "State",
"country": "Country",
"coachingInterest": "NEET",
"experienceLevel": "advanced",
"bio": "Updated bio",
"qualification": "B.Tech",
"organizationName": "Org ABC",
"emergencyContact": "9876543210"
}
Example response:

json
{
"success": true,
"message": "Profile updated",
"data": {
"\_id": "userId123",
"fullName": "Updated Name",
"email": "student@example.com",
"phone": "1234567890",
"gender": "male",
"dateOfBirth": "2000-01-01T00:00:00.000Z",
"address": "Updated address",
"city": "City",
"state": "State",
"country": "Country",
"coachingInterest": "NEET",
"experienceLevel": "advanced",
"bio": "Updated bio",
"qualification": "B.Tech",
"organizationName": "Org ABC",
"emergencyContact": "9876543210",
"role": "STUDENT",
"isVerified": true
}
}
How to Test the Student Module (Flow)
Use Postman, Thunder Client, or any HTTP client.

Step 1: Register a student
Route: (example, adjust to your auth module)
POST /api/auth/register

Body:

json
{
"fullName": "Test Student",
"email": "student@example.com",
"password": "StrongPass123!",
"role": "STUDENT"
}
Save the user ID and email.

Step 2: Login as student
Route:
POST /api/auth/login

Body:

json
{
"email": "student@example.com",
"password": "StrongPass123!"
}
Response will contain accessToken. Use this token in all student requests:

text
Authorization: Bearer <accessToken>
Step 3: (Admin/Teacher) Create courses, batches, and enroll student
Using admin/teacher APIs (not shown here):

Create a course (e.g., JEE Physics).

Create a batch linked to that course.

Create an enrollment for the student:

studentId: ID from Step 1

batchId: newly created batch

courseId: newly created course

status: "active"

Optionally:

Create some Attendance records for that batch + student.

Create some Assignment / Test records.

Create a FeePlan and some Payment records.

Create some Notification documents for the student.

Step 4: Test core student APIs
With student token:

GET /api/student/dashboard

Verify dashboard summary.

GET /api/student/courses

Verify course list.

GET /api/student/batches

Verify batch list with course info.

GET /api/student/schedule

Verify schedule array.

Step 5: Test academic APIs
GET /api/student/attendance

Optionally add ?from=...&to=....

GET /api/student/assignments

Verify assignments/materials.

GET /api/student/tests

Verify test list.

GET /api/student/test-results

Verify results with marks.

GET /api/student/performance/report

Verify attendance % and test stats.

Step 6: Test fees APIs
GET /api/student/fee-plans

Verify total amount and installments.

GET /api/student/payments

Verify payment history.

Step 7: Test notifications
GET /api/student/notifications

Optionally: ?unreadOnly=true&limit=10.

PATCH /api/student/notifications/:id/read

Use a real notification ID from step 7.1.

PATCH /api/student/notifications/read-all

Verify all notifications become read.

Step 8: Test profile
GET /api/student/profile

Verify user fields.

PATCH /api/student/profile

Send partial update (e.g., fullName, phone, bio).

Verify updated response.

Complete Flow of Coaching management system module

# Coaching Backend – API User Manual

This document explains how to run the backend and test all APIs for **Admin**, **Teacher**, and **Student** roles.

## 1. Setup & Running

1. Install dependencies:

```bash
npm install
```

2. Configure `.env`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/coaching
JWT_SECRET=your-super-secret-jwt-key
```

3. Start server:

```bash
npm run dev
```

Base API URL:

```text
http://localhost:4000/api
```

## 2. Authentication

All role‑based APIs require a JWT token.

- Register / login via your existing auth endpoints (e.g. `/api/auth/register`, `/api/auth/login`).
- Response includes `token`.
- For all subsequent requests, send header:

```http
Authorization: Bearer <token>
```

Maintain three tokens while testing:

- `ADMIN_TOKEN`
- `TEACHER_TOKEN`
- `STUDENT_TOKEN`

## 3. Role Summary

### Admin (`/api/admin`)

- Manage users (admin, teacher, student)
- Manage courses, subjects, batches
- Manage enrollments
- Manage fee plans and payments
- Send notifications (single & bulk)

### Teacher (`/api/teacher`)

- View dashboard (batches, students, upcoming tests)
- View & manage own batches
- View students per batch
- Mark attendance
- Create/update/delete assignments & materials
- Create/update/delete tests
- Enter test results (single & bulk)
- Send notifications to all students in a batch

### Student (`/api/student`)

- View dashboard summary
- View enrolled courses, batches, schedule
- View attendance
- View assignments, tests, test results
- View performance report
- View fee plans & payment history
- View & manage notifications
- View & update profile

## 4. Step‑by‑Step Testing Flow

Follow this order for a complete end‑to‑end test.

### 4.1 Admin Flow

1. Login as admin → `ADMIN_TOKEN`.
2. Create teacher user.
3. Create student user.
4. Create a course.
5. Create a subject (optionally link to course).
6. Create a batch (assign course + teacher).
7. Enroll student in batch.
8. Create a fee plan for the student.
9. Record at least one payment.
10. Optionally send notifications.

All endpoints are under `/api/admin` and require `ADMIN_TOKEN`.

### 4.2 Teacher Flow

1. Login as teacher → `TEACHER_TOKEN`.
2. Call `/api/teacher/dashboard`.
3. List batches via `/api/teacher/batches`.
4. List students for a batch via `/api/teacher/students?batchId=...`.
5. Mark attendance for a batch.
6. Create an assignment.
7. Create a test.
8. Add test results (single or bulk).
9. Send a notification to the batch.

All endpoints are under `/api/teacher` and require `TEACHER_TOKEN`.

### 4.3 Student Flow

1. Login as student → `STUDENT_TOKEN`.
2. Call `/api/student/dashboard`.
3. View courses, batches, and schedule.
4. View attendance.
5. View assignments and tests.
6. View test results and performance report.
7. View fee plans and payment history.
8. View notifications and mark them as read.
9. View and update profile.

All endpoints are under `/api/student` and require `STUDENT_TOKEN`.

## 5. Example Tools

Use any of:

- Postman
- Thunder Client (VS Code)
- curl
- Your own frontend

For each request, ensure:

- Correct method (GET/POST/PATCH/DELETE)
- Correct URL
- Correct headers (`Authorization: Bearer <token>`)
- Correct body (JSON)

## 6. Notes

- All IDs (user, course, batch, etc.) are MongoDB ObjectIds.
- Dates should be sent as ISO strings, e.g. `"2026-07-05"`.
- Role‑based access is enforced; using wrong role token will return `403 Forbidden`.
