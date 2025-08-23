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
    // 1. Check if username already exists
    // 2. Hash the password
    // 3. Save to database
    // 4. Create a session or JWT token

    // For demo purposes, we'll simulate a successful registration
    // In production, replace this with actual database logic
    const newUser = {
      id: Date.now(), // Simple ID generation for demo
      username: username,
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
