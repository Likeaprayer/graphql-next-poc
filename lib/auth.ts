import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  exp: number
  [key: string]: any
}

// Function to login user
export async function loginUser(username: string, password: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }

  const data = await response.json()
  localStorage.setItem("token", data.token)
}

// Function to logout user
export function logoutUser(): void {
  localStorage.removeItem("token")
  window.location.href = "/login"
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000

    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}

// Function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem("token")
}
