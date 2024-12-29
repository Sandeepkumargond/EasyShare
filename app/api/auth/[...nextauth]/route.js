import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Ensure database connection is established
          await connectMongoDB();

          // Find the user by email
          const user = await User.findOne({ email });
          if (!user) throw new Error("User not found");

          // Compare the password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) throw new Error("Invalid credentials");

          // Return user details
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (error) {
          console.error("Error during authorization:", error.message);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id; // Attach user ID to token
      return token;
    },
    async session({ session, token }) {
      if (token && token.id) session.user.id = token.id; // Attach ID to session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
