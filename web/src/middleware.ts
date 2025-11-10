import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

// Public pages that don't require authentication
const publicPages = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Workspace pages (require auth + verified email, but no tenant)
const workspacePages = [
  "/auth/workspace",
  "/auth/workspace/create-tenant",
  "/auth/workspace/request-access",
  "/auth/workspace/pending-request",
];

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|fr)/, "");
}

const normalizePath = (pathname: string) => {
  const pathWithoutLocale = stripLocale(pathname);
  return pathWithoutLocale === "" ? "/" : pathWithoutLocale;
};

const isPublicPage = (pathname: string) => {
  // Remove locale prefix to check the actual path
  const pathWithoutLocale = normalizePath(pathname);
  return publicPages.some(
    (page) => pathWithoutLocale === page
    // || pathWithoutLocale.startsWith(page)
  );
};

const isWorkspacePage = (pathname: string) => {
  // Remove locale prefix to check the actual path
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  return workspacePages.some(
    (page) => pathWithoutLocale === page || pathWithoutLocale.startsWith(page)
  );
};

const isVerifyEmailPage = (pathname: string) => {
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  return (
    pathWithoutLocale === "/auth/verify-email" ||
    pathWithoutLocale.startsWith("/auth/verify-email")
  );
};

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/health") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Always run intl middleware first
  const intlResponse = intlMiddleware(req);

  // Check if the route is public
  if (isPublicPage(pathname)) {
    return intlResponse;
  }

  // For protected routes, check authentication using getToken
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // User not authenticated - redirect to sign-in
    const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
    const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Special handling for verify-email page
  // This page requires authentication but NOT email verification or tenant
  if (isVerifyEmailPage(pathname)) {
    // If email is already verified, redirect to workspace or dashboard
    if (token.isEmailVerified) {
      const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
      const redirectPath = token.tenantId ? "/dashboard" : "/auth/workspace";
      return NextResponse.redirect(
        new URL(`/${locale}${redirectPath}`, req.url)
      );
    }
    // Allow access to verify-email page for authenticated users with unverified emails
    return intlResponse;
  }

  // For all other protected routes, check if email is verified
  if (!token.isEmailVerified) {
    // Redirect unverified users to verify-email page
    const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
    return NextResponse.redirect(
      new URL(`/${locale}/auth/verify-email`, req.url)
    );
  }

  // Check if user is on workspace page
  // Workspace pages require verified email but NOT a tenant
  if (isWorkspacePage(pathname)) {
    // If user already has a tenant, redirect to dashboard
    if (token.tenantId) {
      const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    // Check if user has a pending access request
    // If they do, redirect to pending-request page (unless they're already there)
    const isPendingRequestPage = pathname.includes(
      "/auth/workspace/pending-request"
    );
    if (token.hasPendingRequest && !isPendingRequestPage) {
      const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/workspace/pending-request`, req.url)
      );
    }

    // If they're on pending-request page but don't have a pending request, redirect to workspace
    if (isPendingRequestPage && !token.hasPendingRequest) {
      const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/workspace`, req.url)
      );
    }

    // Allow access to workspace pages for verified users without tenant
    return intlResponse;
  }

  // For all other authenticated routes, check if user has a tenant
  if (!token.tenantId) {
    // Redirect to workspace page if user doesn't have a tenant
    const locale = pathname.match(/^\/(en|fr)/)?.[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/auth/workspace`, req.url));
  }

  return intlResponse;
}

// export const config = {
//   matcher: ["/", "/(fr|en)/:path*"],
// };
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
