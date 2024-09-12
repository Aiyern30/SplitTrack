// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

// Extend the default session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Add other properties you need
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: string; // Add other properties you need
  }
}
