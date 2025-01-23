"use server";
import HeaderClient from "@/components/header/headerClient";
import getAvatarUrl from "@/lib/avatarUrl";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/auth";

export default async function Header() {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
        return (<></>);
    }

    const avatarUrl = getAvatarUrl(session.user.email);

    return (
        <HeaderClient session={session} avatarUrl={avatarUrl}/>
    );
}
