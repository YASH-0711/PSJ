/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password ) {
      return NextResponse.json(
        { message: "username, email, password and adminCode are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 400 }
      );
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdminPSJ: true
    });

    const savedUser = await newUser.save();

    // await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

    return NextResponse.json({
        message: "Admin User created successfull",
        success: true,
        savedUser
    })
  } catch (error: any) {
    console.error("Admin signup error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
