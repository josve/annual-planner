import { Metadata } from "next";
import { providerMap } from "@/auth";
import SignInForm from "@/components/login/SignInForm";
import '@/app/globals.css'

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Logga in - Årshjul",
    };
}

export default async function LoginPage({
                                      searchParams,
                                  }: {
    searchParams: Promise<{ callbackUrl?: string }>;
}) {
    const providers = Object.values(providerMap);
    const providerInfo: any[] = [];
    providers.forEach((provider: any) => {
        providerInfo.push({id: provider.id, name: provider.name});
    });

    const { callbackUrl } = await searchParams;

    return (
        <SignInForm
            providers={providerInfo}
            showLoginForm={!!process.env.DEV_MOCK_PWD}
            callbackUrl={callbackUrl ?? "/"}
        />
    );
}
