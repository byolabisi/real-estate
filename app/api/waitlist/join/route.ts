import { joinWaitlist } from "@/lib/supabase/db";
import { sendEmail, getWelcomeEmailTemplate } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, userType, state, lga } = await request.json();

    if (!email || !userType) {
      return NextResponse.json(
        { error: "Email and user type are required" },
        { status: 400 }
      );
    }

    // Add to waitlist
    const waitlistEntry = await joinWaitlist(email, userType, state, lga);

    if (!waitlistEntry) {
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    // Extract name from email or use generic greeting
    const userName = email.split("@")[0];

    // Send welcome email
    try {
      const template = getWelcomeEmailTemplate(userName, userType);
      await sendEmail({
        to: email,
        subject: "Welcome to Nigerian Real Estate Platform - Your Access Awaits!",
        html: template,
        emailType: "welcome",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist. Check your email for welcome message!",
      waitlistId: waitlistEntry.id,
    });
  } catch (error) {
    console.error("Waitlist join error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
