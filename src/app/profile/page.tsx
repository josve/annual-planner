import { Metadata } from "next";
import '@/app/globals.css'

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Profil",
    };
}

export default async function ProfilePAge({
}) {

    return (
        <>
        </>
    );
}
