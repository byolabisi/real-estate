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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Add to waitlist (with fallback if database doesn't exist)
    let waitlistEntry;
    try {
      waitlistEntry = await joinWaitlist(email, userType, state, lga);
    } catch (dbError) {
      // If database is not available, continue without storing (graceful fallback)
      console.warn("Database unavailable, continuing without storage:", dbError);
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
      // Continue even if email fails - user still joined waitlist
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist. Check your email for welcome message!",
      waitlistId: waitlistEntry?.id || null,
    });
  } catch (error) {
    console.error("Waitlist join error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
