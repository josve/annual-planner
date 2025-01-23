import React from "react";
import FooterClient from "./footerClient";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/auth";

export default async function Footer() {
    const session: any = await getServerSession(authOptions);

    return <FooterClient session={session}/>;
}
