# Authentication API Mock Handlers (MSW)

This directory contains Mock Service Worker (MSW) handlers for the authentication API endpoints. These handlers simulate the backend API responses for testing and development purposes.

## Available Endpoints

### 1. Member Sign In (Google OAuth)

- **Endpoint**: `POST /api/v1/users/signin`
- **Description**: Member login using Google OAuth access token
- **Request Body**:
  ```json
  {
    "accessToken": "google_oauth_access_token"
  }
  ```
- **Success Response** (200):

  ```json
  {
    "timestamp": 1704067200000,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "USER"
    },
    "errorCode": null,
    "message": "Success"
  }
  ```

  - Sets `refreshToken` cookie (HttpOnly, Secure, 30 days)

- **Error Responses**:
  - 400: "한양대 이메일(@hanyang.ac.kr)만 로그인 가능합니다."
  - 401: "Google OAuth Token이 유효하지 않습니다."
  - 404: "등록되지 않은 사용자입니다. 먼저 회원가입을 진행해주세요."

### 2. Staff Sign In

- **Endpoint**: `POST /api/v1/staff/signin`
- **Description**: Staff (Mentor/Admin) login with student ID and password
- **Request Body**:
  ```json
  {
    "userId": 2021234567,
    "password": "securePassword123!"
  }
  ```
- **Mock Credentials** (for testing):
  - userId: `2021234567`
  - password: `securePassword123!`

- **Success Response** (200):

  ```json
  {
    "timestamp": 1704067200000,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "MENTOR"
    },
    "errorCode": null,
    "message": "Success"
  }
  ```

  - Sets `refreshToken` cookie (HttpOnly, Secure, 30 days)

- **Error Responses**:
  - 400: "비밀번호가 일치하지 않습니다."
  - 404: "등록되지 않은 스태프입니다."

### 3. Refresh Access Token

- **Endpoint**: `POST /api/v1/users/refresh`
- **Description**: Refresh access token using the refresh token from cookies
- **Request**: No body required (reads from cookie)
- **Success Response** (200):

  ```json
  {
    "timestamp": 1704067200000,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "errorCode": null,
    "message": "Success"
  }
  ```

- **Error Responses**:
  - 401: "Refresh Token이 없습니다."
  - 400: "유효하지 않거나 만료된 Refresh Token입니다."

### 4. Logout

- **Endpoint**: `POST /api/v1/users/logout`
- **Description**: Logout user and clear refresh token cookie
- **Request**: No body required
- **Success Response** (200):

  ```json
  {
    "timestamp": 1704067200000,
    "data": null,
    "errorCode": null,
    "message": "로그아웃되었습니다."
  }
  ```

  - Clears `refreshToken` cookie (Max-Age=0)

## Usage Example

The MSW handlers are automatically enabled when the app runs in development mode. They intercept API calls and return mock responses.

```typescript
// Example: Member Sign In
const response = await fetch("https://api.forif.org/api/v1/users/signin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    accessToken: "google_oauth_token_here",
  }),
});

const data = await response.json();
console.log(data.data.accessToken); // Mock JWT token
console.log(data.data.role); // "USER"

// Example: Staff Sign In
const staffResponse = await fetch("https://api.forif.org/api/v1/staff/signin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: 2021234567,
    password: "securePassword123!",
  }),
  credentials: "include", // Important: Include cookies
});

const staffData = await staffResponse.json();
console.log(staffData.data.role); // "MENTOR"
```

## Implementation Details

- **Base URL**: `https://api.forif.org`
- **Delay**: Each handler has a simulated network delay (200-500ms)
- **Cookie Management**: Refresh tokens are set as HttpOnly cookies with appropriate security flags
- **Mock Tokens**: The handlers use predefined JWT tokens for testing

## Testing Different Scenarios

To test different scenarios (e.g., user not found, invalid credentials), you can modify the mock data in `/apps/web/src/mocks/apis/auth.ts`:

```typescript
// In memberSignIn handler, change:
const userExists = false; // Test 404 error

// In staffSignIn handler, test with different credentials:
const validStaff = {
  userId: 2021999999,
  password: "newPassword123!",
  role: "ADMIN" as const,
};
```

## Files

- `auth.ts`: Main authentication handlers
- `index.ts`: Export all handlers
- `/packages/core/src/types/auth.d.ts`: TypeScript type definitions for authentication
