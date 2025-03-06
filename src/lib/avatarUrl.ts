import crypto from "crypto";

export default function getAvatarUrl(email: string) {
    const effectiveEmail = email?.toLowerCase();
    const hash = !effectiveEmail ? null : crypto.createHash('md5').update(effectiveEmail).digest('hex');
    return !hash ? null : `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
}