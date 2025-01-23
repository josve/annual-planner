import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import {createUser, getUserByEmail, updateLastLogin} from "@/data/User";

function getProviders(): any[] {
    const providers: any[] = [];

    if (process.env.GOOGLE_CLIENT_ID) {
        providers.push(GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }));
    }

    if (process.env.DEV_MOCK_PWD) {
        // For testing allow people to login with a mock password
        const credentials = Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: (credentials: any, req) => {
                if (process.env.DEV_MOCK_PWD !== credentials.password) {
                    throw new Error("No user found" + credentials.password + ":" + process.env.DEV_MOCK_PWD);
                }

                const user: any = {
                    email: credentials.email,
                };

                return user;
            },
        });
        providers.push(credentials);
    }

    return providers;
}

export const providerMap = getProviders();

function getPages() {
    return {
        signIn: "/login"
    };
}

export const authOptions: any = {
    providers: providerMap,
    pages: getPages(),
    callbacks: {
        async signIn({user}: any) {
            if (!user.email) {
                return false;
            }

            const databaseUser = await getUserByEmail(user.email);
            if (!databaseUser) {
                await createUser(user.name || 'Användare', user.email);
            } else {
                await updateLastLogin(user.id, new Date());
            }

            return true;
        },
        async session({session, token}: any) {
            const databaseUser = await getUserByEmail(token.email);
            if (!databaseUser) {
                throw new Error("No user found");
            }
            session.user = {
                ...session.user,
                ...databaseUser
            };
            return session;
        },
    },
};

export const handler = NextAuth(authOptions);
