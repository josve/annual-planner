export { default } from "next-auth/middleware"

export const config = {
    matcher: ["/((?!login|logo.png|icon.png).*)"],
};