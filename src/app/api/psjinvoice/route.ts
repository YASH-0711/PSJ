/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { PsjInvoice } from "@/models/invoiceModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    
    const invoice = await PsjInvoice.create({
      customerName: reqBody.customerName,
      customerAddress: reqBody.customerAddress,
      customerContact: reqBody.customerContact,
      date: reqBody.date,
      oldPurchase: reqBody.oldPurchase || 0,
      items: reqBody.items || [],
      subTotal: reqBody.subTotal || 0,
      total: reqBody.total || 0,
      mode: reqBody.mode || "psj",
    });

    const savedUser = await invoice.save();

    return NextResponse.json({
        message: "Bill Saved Successfull",
        success: true,
        savedUser
    })
  } catch (error: any) {
    console.log(error,"@@@")
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
