import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthApi } from "@/lib/api/auth-api";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          // Call your backend API
          const response = await AuthApi.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response.data.accessToken && response.data.user) {
            // Store tokens in the user object to pass to callbacks
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              firstName: response.data.user.firstName,
              lastName: response.data.user.lastName,
              isEmailVerified: response.data.user.emailVerified,
              role: response.data.user.role,
              tenantId: response.data.user.tenantId,
              hasPendingRequest: response.data.user.hasPendingRequest,
              pendingRequestId: response.data.user.pendingRequestId,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            };
          }

          return null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Authentication error:", error);
          throw new Error(
            error?.response?.data?.message || "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isEmailVerified = user.isEmailVerified;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.hasPendingRequest = user.hasPendingRequest;
        token.pendingRequestId = user.pendingRequestId;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // Handle session update
      // if (trigger === "update" && session) {
      //   token = { ...token, ...session };
      // }
      // Handle session update (e.g., from useSession().update())
      if (trigger === "update") {
        token.tenantId = session.user.tenantId ?? token.tenantId;
        token.firstName = session.user.firstName ?? token.firstName;
        token.lastName = session.user.lastName ?? token.lastName;
        token.role = session.user.role ?? token.role;
        token.isEmailVerified =
          session.user.isEmailVerified ?? token.isEmailVerified;
        token.hasPendingRequest =
          session.user.hasPendingRequest ?? token.hasPendingRequest;
        token.pendingRequestId =
          session.user.pendingRequestId ?? token.pendingRequestId;
        token.accessToken = session.user.accessToken ?? token.accessToken;
        token.refreshToken = session.user.refreshToken ?? token.refreshToken;
        // add any other user fields you might update client-side
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.user.hasPendingRequest = token.hasPendingRequest as boolean;
        session.user.pendingRequestId = token.pendingRequestId as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
