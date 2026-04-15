/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoiceModel";

connect();

export async function GET() {
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: invoices, success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    
    const invoice = await Invoice.create({
      customerName: reqBody.customerName,
      customerAddress: reqBody.customerAddress,
      customerContact: reqBody.customerContact,
      date: reqBody.date,
      oldPurchase: reqBody.oldPurchase || 0,
      items: reqBody.items || [],
      subTotal: reqBody.subTotal || 0,
      total: reqBody.total || 0,
      mode: reqBody.mode || "psj",
      cashPayment: reqBody.cashPayment || 0,
      onlinePayment: reqBody.onlinePayment || 0,
      totalGold: reqBody.totalGold || 0,
      totalSilver: reqBody.totalSilver || 0
    });

    const savedUser = await invoice.save();

    return NextResponse.json({
        message: "User created successfull",
        success: true,
        savedUser
    })
  } catch (error: any) {
    console.error("Client data not registered", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
