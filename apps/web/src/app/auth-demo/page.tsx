"use client";

import { useState } from "react";

export default function AuthDemoPage() {
  const [memberResult, setMemberResult] = useState<string>("");
  const [staffResult, setStaffResult] = useState<string>("");
  const [refreshResult, setRefreshResult] = useState<string>("");
  const [logoutResult, setLogoutResult] = useState<string>("");
  const [loading, setLoading] = useState<string>("");

  // Member Sign In
  const handleMemberSignIn = async () => {
    setLoading("member");
    try {
      const response = await fetch(
        "https://api.forif.org/api/v1/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: "mock_google_oauth_token",
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      setMemberResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setMemberResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading("");
    }
  };

  // Staff Sign In
  const handleStaffSignIn = async () => {
    setLoading("staff");
    try {
      const response = await fetch(
        "https://api.forif.org/api/v1/staff/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 2021234567,
            password: "securePassword123!",
          }),
          credentials: "include",
        },
      );

      const data = await response.json();
      setStaffResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setStaffResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading("");
    }
  };

  // Refresh Token
  const handleRefreshToken = async () => {
    setLoading("refresh");
    try {
      const response = await fetch(
        "https://api.forif.org/api/v1/users/refresh",
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();
      setRefreshResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setRefreshResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading("");
    }
  };

  // Logout
  const handleLogout = async () => {
    setLoading("logout");
    try {
      const response = await fetch(
        "https://api.forif.org/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();
      setLogoutResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setLogoutResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Authentication API Demo (MSW)</h1>

      <div className="mb-8 rounded-lg bg-blue-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">📋 Instructions</h2>
        <p className="text-sm text-gray-700">
          This page demonstrates the authentication API mock handlers. Click the
          buttons below to test each endpoint. The responses are mocked using
          MSW (Mock Service Worker).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Member Sign In */}
        <div className="rounded-lg border bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            1. Member Sign In (Google OAuth)
          </h2>
          <button
            onClick={handleMemberSignIn}
            disabled={loading === "member"}
            className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading === "member" ? "Loading..." : "Test Member Sign In"}
          </button>
          {memberResult && (
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {memberResult}
            </pre>
          )}
        </div>

        {/* Staff Sign In */}
        <div className="rounded-lg border bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">2. Staff Sign In</h2>
          <p className="mb-2 text-sm text-gray-600">
            Test credentials: 2021234567 / securePassword123!
          </p>
          <button
            onClick={handleStaffSignIn}
            disabled={loading === "staff"}
            className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading === "staff" ? "Loading..." : "Test Staff Sign In"}
          </button>
          {staffResult && (
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {staffResult}
            </pre>
          )}
        </div>

        {/* Refresh Token */}
        <div className="rounded-lg border bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">3. Refresh Token</h2>
          <p className="mb-2 text-sm text-gray-600">
            Sign in first to get a refresh token cookie
          </p>
          <button
            onClick={handleRefreshToken}
            disabled={loading === "refresh"}
            className="mb-4 rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:bg-gray-400"
          >
            {loading === "refresh" ? "Loading..." : "Test Refresh Token"}
          </button>
          {refreshResult && (
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {refreshResult}
            </pre>
          )}
        </div>

        {/* Logout */}
        <div className="rounded-lg border bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">4. Logout</h2>
          <button
            onClick={handleLogout}
            disabled={loading === "logout"}
            className="mb-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading === "logout" ? "Loading..." : "Test Logout"}
          </button>
          {logoutResult && (
            <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-xs">
              {logoutResult}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-yellow-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">⚠️ Note</h2>
        <p className="text-sm text-gray-700">
          These are mock responses. In production, these will be replaced with
          actual backend API calls. The refresh token is set as an HttpOnly
          cookie and cannot be accessed via JavaScript.
        </p>
      </div>
    </div>
  );
}
