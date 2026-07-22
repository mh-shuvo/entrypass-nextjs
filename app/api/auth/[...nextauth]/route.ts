import NextAuth from "next-auth";
import {type NextRequest,NextResponse} from "next/server";
import { authOptions } from "@/lib/auth";
import {authRateLimiter} from "@/lib/authRateLimiter";


type RouteContext = { params: Promise<{ nextauth: string[] }> };

const handler = NextAuth(authOptions) as (
  req: NextRequest,
  context: RouteContext
) => Promise<Response>;


async function POST(req: NextRequest, context: RouteContext) {
  
  if(authRateLimiter && req.nextUrl.pathname.includes("callback/admin")){
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = await authRateLimiter.limit(ip);
    if (!success) {
        return NextResponse.json(
            { url: `${req.nextUrl.origin}/login?error=RateLimited` },
            { status: 429 }
        );
    }
}
  return handler(req, context);
}

export { handler as GET, POST };    