import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      role: string;
      tenantId: string;
      hasPendingRequest: boolean;
      pendingRequestId: string;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    role: string;
    tenantId: string;
    hasPendingRequest: boolean;
    pendingRequestId: string;
    accessToken: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    role: string;
    tenantId: string;
    hasPendingRequest: boolean;
    pendingRequestId: string;
    accessToken: string;
    refreshToken?: string;
  }
}
