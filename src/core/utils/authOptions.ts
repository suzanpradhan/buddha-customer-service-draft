import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiPaths } from '../api/apiConstants';

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { username, password } = credentials as any;
          const res = await fetch(apiPaths.baseUrl + apiPaths.loginUrl, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          });
          const user = await res.json();
          if (res.ok && user) {
            return user;
          }
          throw null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          accessToken: (user as any).access,
          refreshToken: (user as any).refresh,
        };
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      session.user = token as any;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
};
