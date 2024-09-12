import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add other providers here
  ],
  callbacks: {
    async session({ session, token }) {
      if (session && token) {
        session.user.id = token.id as string; // Cast to string if necessary
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string; // Cast to string if necessary
      }
      return token;
    },
  },
} as NextAuthOptions);
