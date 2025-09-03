import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { id } from "zod/locales";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Explicit null check to satisfy TS
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials?.identifier },
            ],
          }).lean();

          if (!user) {
            throw new Error("Invalid username or password");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }
          return {
            //                         CredentialsProvider’s authorize() must return:

            // ts
            // Copy
            // Edit
            // User | null
            // (where User is the NextAuth User type — basically { id: string; name?: string; email?: string; image?: string }).

            // But your user is a Mongoose Document, which has a whole bunch of extra methods and metadata that don’t match User.
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            isVerified: user.isVerified,
  isAcceptingMessage: user.isAcceptingMessage,
  username: user.username,
          };
        } catch (error) {
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;

      }
      return token;
    },
    async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.username = token.username;
        }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
