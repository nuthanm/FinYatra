import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/contact/captcha";
import { isMailConfigured } from "@/lib/contact/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const challenge = createCaptchaChallenge();
  return NextResponse.json({
    challenge: challenge.challenge,
    token: challenge.token,
    mailAvailable: isMailConfigured(),
  });
}
