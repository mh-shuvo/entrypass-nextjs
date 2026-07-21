import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/auth";
import { staticRateLimit } from "@/lib/ratelimit/static";

const checkRateLimit = async (request: NextRequest) => {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const path = request.nextUrl.pathname;
  const { success } = await staticRateLimit.limit(`${ip}:${path}`);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }
}

export default async function proxy(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  const token = await getToken({ req: request, secret: authOptions.secret });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
