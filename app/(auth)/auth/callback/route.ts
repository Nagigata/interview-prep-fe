import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (token) {
    const cookieStore = await cookies();
    const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

    // Save JWT token
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    // Decode JWT payload to extract user info (base64 decode, no verification needed)
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
      };
      cookieStore.set("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION,
        path: "/",
      });
    } catch (e) {
      console.error("Failed to decode JWT payload:", e);
    }
  }

  // Redirect to homepage
  return NextResponse.redirect(new URL("/", request.url));
}

