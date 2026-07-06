import { clerkMiddleware, createRouteMatcher, getAuth  } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from "jose";

  const JWKS = createRemoteJWKSet(
  new URL(`${(process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || '').trim()}/.well-known/jwks.json`)
);

// define which routes require authentication
const isPublicApiRoute = createRouteMatcher(['/api/auth/login']);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/folder(.*)',
  '/customers(.*)',
  '/settings(.*)',
]);


const isLoggedIn = createRouteMatcher([
  "/"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  const { userId, isAuthenticated, getToken } = await auth();

  // logic to check if user is not loggedIn then he would do to login page
  if ((!isAuthenticated || !userId) && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (isAuthenticated && userId && isLoggedIn(req)) {
    return NextResponse.redirect(new URL("/dashboard/overview", req.url));
  }

 
  let role:any;
  let accesses:any;
  const token:any = await getToken({ template: "custom-template" });
  if(token){
    const { payload } = await jwtVerify(token, JWKS);
    if(!payload) return NextResponse.redirect(new URL("/", req.url));
    role = payload?.role
    accesses = payload?.accesses
  }
  
  // console.log('payload.role', role);
  // console.log('payload.accesses', accesses);
  
   const pathname = req.nextUrl.pathname;
  
  //    // Admins can access everything
  if (role === "admin") return NextResponse.next();

  //   // Role-based access control
  const accessRules: Record<string, boolean> = {
    "/dashboard/sales": accesses?.salesAccess,
    "/folder": accesses?.foldersAccess,
    "/dashboard/documents": accesses?.foldersAccess,
    "/dashboard/lastClosing": accesses?.xzReport,
    "/dashboard/scrap-purchase": accesses?.supplierAccess,
    "/dashboard/production": accesses?.productAccess,
    "/dashboard/articles": accesses?.productAccess,
    "/dashboard/suppliers": accesses?.supplierAccess,
    "/customers": accesses?.customerAccess,
    "/settings": accesses?.settingsHelp,
  };

    for (const [route, hasAccess] of Object.entries(accessRules)) {
    if (pathname.startsWith(route) && !hasAccess) {

      const redirectUrl = new URL("/dashboard/unAuthorized", req.url);
        // Encode the original URL so it can be passed safely
      const deniedPath = encodeURIComponent(req.nextUrl.pathname);
      redirectUrl.searchParams.set("reason", "unauthorized");
      redirectUrl.searchParams.set("denied", deniedPath);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}


/*
Accesses of what we have build

By default permissions only for admin not for others
- edit quantity stock from each article edit modal
- settings/user-registration
settingsHelp === settings 
------------------------------------------------------------
can be for employees also in middleware.ts
productAccess  === articlesAccess,
customerAccess === customers
supplierAccess === suppliers
salesAccess === salesManagement
xzReport === lastClosing full
foldersAccess === folder + newDocument + purchases

-------------------------------------------------------------
from within the pages not whole page
changePricesAndDiscount === edit and discounts from cart inside salesManagement (today)
addProductForm === permission to add new article in dashboard/articles (Add new product button)
modifyProductForm === permission to edit/delete article in dashboard/articles (edit/delete button)

---------------------------------------------------------------------------------
not build yet

toolsAccess == tools from flexo
manageTheStock === stock management module from flexo
*/