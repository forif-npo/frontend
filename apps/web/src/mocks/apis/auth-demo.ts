// Authentication API Demo
// This file demonstrates how to use the authentication MSW handlers

/**
 * Example 1: Member Sign In with Google OAuth
 */
async function demoMemberSignIn() {
  try {
    const response = await fetch("https://api.forif.org/api/v1/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: "mock_google_oauth_token",
      }),
      credentials: "include", // Important: Include cookies for refreshToken
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Member Sign In Success");
      console.log("Access Token:", data.data.accessToken);
      console.log("Role:", data.data.role); // "USER"
      // refreshToken is stored in HttpOnly cookie automatically
    } else {
      console.log("❌ Member Sign In Failed");
      console.log("Error:", data.message);
      console.log("Error Code:", data.errorCode);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Example 2: Staff Sign In with Student ID and Password
 */
async function demoStaffSignIn() {
  try {
    const response = await fetch("https://api.forif.org/api/v1/staff/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 2021234567, // Mock staff ID
        password: "securePassword123!", // Mock password
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Staff Sign In Success");
      console.log("Access Token:", data.data.accessToken);
      console.log("Role:", data.data.role); // "MENTOR" or "ADMIN"
    } else {
      console.log("❌ Staff Sign In Failed");
      console.log("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Example 3: Refresh Access Token
 */
async function demoRefreshToken() {
  try {
    const response = await fetch("https://api.forif.org/api/v1/users/refresh", {
      method: "POST",
      credentials: "include", // Automatically includes refreshToken cookie
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Token Refresh Success");
      console.log("New Access Token:", data.data.accessToken);
    } else {
      console.log("❌ Token Refresh Failed");
      console.log("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Example 4: Logout
 */
async function demoLogout() {
  try {
    const response = await fetch("https://api.forif.org/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Logout Success");
      console.log("Message:", data.message);
      // refreshToken cookie is cleared automatically
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

/**
 * Complete Authentication Flow Demo
 */
async function runAuthenticationDemo() {
  console.log("=== Authentication API Demo ===\n");

  // 1. Sign in as member
  console.log("1. Member Sign In");
  await demoMemberSignIn();

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Refresh token
  console.log("\n2. Refresh Access Token");
  await demoRefreshToken();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Logout
  console.log("\n3. Logout");
  await demoLogout();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 4. Sign in as staff
  console.log("\n4. Staff Sign In");
  await demoStaffSignIn();
}

// Export for use in browser console or Next.js page
export {
  demoMemberSignIn,
  demoStaffSignIn,
  demoRefreshToken,
  demoLogout,
  runAuthenticationDemo,
};
