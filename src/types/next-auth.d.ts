import { DefaultSession } from "next-auth"
import {User} from "@/types/User";

declare module "next-auth" {
    interface Session {
        user: {
        } & DefaultSession["user"] & User
    }
}