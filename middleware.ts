import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Solo aplicar a rutas /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminAuth = request.cookies.get("admin-auth");
    
    // Si no hay cookie de autenticación y no es la página de login
    if (!adminAuth && !request.nextUrl.pathname.includes("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
