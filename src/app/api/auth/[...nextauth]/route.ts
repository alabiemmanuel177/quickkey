import NextAuth from 'next-auth';
import { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import * as argon2 from 'argon2';
import { prisma } from '@/lib/prisma';
import { sendLoginEmail } from '@/lib/email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth',
    signOut: '/',
    error: '/auth', // Error code passed in query string as ?error=
    verifyRequest: '/auth', // (used for check email message)
    newUser: '/auth' // New users will be directed here on first sign in
  },
  providers: [
    // Only include OAuth providers if client IDs are configured
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
        ]
      : []),
    // Credentials provider is always available
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const isValidPassword = await argon2.verify(
          user.password,
          credentials.password
        );
        
        if (!isValidPassword) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Send login notification email (only for existing users, not new signups)
      if (user.email && account?.provider) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Only send for existing users (not new registrations)
        if (existingUser && existingUser.createdAt < new Date(Date.now() - 60000)) {
          const time = new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });

          sendLoginEmail(
            user.email,
            user.name || 'User',
            time,
            account.provider === 'credentials' ? 'Email/Password' : account.provider,
            'Web'
          ).catch((err) => {
            console.error('Failed to send login email:', err);
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 