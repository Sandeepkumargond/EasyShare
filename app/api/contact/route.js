import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Contact from "@/models/form";
import { sendReplyEmail } from "@/lib/email"; 

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectMongoDB();

   
    const contactMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

   
    await sendReplyEmail(email, name); 

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
