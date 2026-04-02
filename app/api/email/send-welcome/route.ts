import { sendEmail, getWelcomeEmailTemplate } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, userName, userType, userId } = await request.json();

    if (!email || !userName || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const template = getWelcomeEmailTemplate(userName, userType);
    const result = await sendEmail({
      to: email,
      subject: "Welcome to Nigerian Real Estate Platform!",
      html: template,
      emailType: "welcome",
      userId,
    });

    return NextResponse.json({
      success: true,
      messageId: result.id,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
