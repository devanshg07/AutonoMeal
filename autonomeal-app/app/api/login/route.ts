import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (username.length < 4 || username.length > 20) {
      return NextResponse.json({ error: "Username must be between 4 and 20 characters" }, { status: 400 })
    }

    if (password.length < 8 || password.length > 20) {
      return NextResponse.json({ error: "Password must be between 8 and 20 characters" }, { status: 400 })
    }

    // Here you would typically:
    // 1. Query your database to find the user
    // 2. Compare the hashed password
    // 3. Create a session or JWT token

    // For demo purposes, we'll simulate a successful login
    // In production, replace this with actual database logic
    const mockUser = {
      id: 1,
      username: username,
    }

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
