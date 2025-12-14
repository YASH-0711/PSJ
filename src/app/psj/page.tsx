"use client";

import InvoicePage from "@/components/auth/invoice/InvoicePage";

export default function PsjHomePage() {
  return <InvoicePage variant="psj" saveApiUrl="/api/psjinvoice"/>;
}
