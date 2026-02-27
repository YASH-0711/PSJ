/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoiceModel";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ data: invoice, success: true });
  } catch (error: any) {
    console.error("GET /api/invoice/[id] error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.items !== undefined) updateData.items = body.items;
    if (body.subTotal !== undefined) updateData.subTotal = Number(body.subTotal);

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: false }
    );
    if (!updated) return NextResponse.json({ message: "Record not found" }, { status: 404 });
    return NextResponse.json({ data: updated, success: true, message: "Updated successfully" });
  } catch (error: any) {
    console.error("PUT /api/invoice/[id] error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Record not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/invoice/[id] error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
