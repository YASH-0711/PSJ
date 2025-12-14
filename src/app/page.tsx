"use client";

import InvoicePage from "@/components/auth/invoice/InvoicePage";

export default function HomePage() {
  return <InvoicePage variant="default" saveApiUrl="/api/invoice" />;
}
