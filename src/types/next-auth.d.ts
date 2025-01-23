import { DefaultSession } from "next-auth"
import {User} from "@/types/User";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
        } & DefaultSession["user"] & User
    }
}