import jsPDF from "jspdf";

export interface InvoiceData {
  invoiceNo: string;
  issuedAt: string; // ISO
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  currency?: string;
  paymentId?: string | null;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(24, 34, 41);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("WellMindAI", 40, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("A judgement-free space for mental wellbeing", 40, 62);
  doc.text("support@wellmindai.in  ·  wellmindai.in", 40, 76);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", W - 40, 45, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${data.invoiceNo}`, W - 40, 62, { align: "right" });
  doc.text(`Date: ${new Date(data.issuedAt).toLocaleDateString("en-IN")}`, W - 40, 76, { align: "right" });

  // Bill To
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Bill to", 40, 130);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.customerName || "Customer", 40, 148);
  doc.text(data.customerEmail || "-", 40, 164);

  doc.setFont("helvetica", "bold");
  doc.text("From", W - 40, 130, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text("WellMindAI Pvt. Ltd.", W - 40, 148, { align: "right" });
  doc.text("India · GSTIN: to be updated", W - 40, 164, { align: "right" });

  // Line item table
  const top = 210;
  doc.setDrawColor(220);
  doc.setFillColor(245, 244, 240);
  doc.rect(40, top, W - 80, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", 52, top + 18);
  doc.text("Amount", W - 52, top + 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${data.planName} subscription`, 52, top + 52);
  doc.text(
    `${(data.currency || "INR") === "INR" ? "\u20B9" : (data.currency || "")} ${data.amount.toFixed(2)}`,
    W - 52,
    top + 52,
    { align: "right" },
  );

  // Totals
  const totalsY = top + 90;
  doc.line(40, totalsY, W - 40, totalsY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total paid", 52, totalsY + 24);
  doc.text(
    `${(data.currency || "INR") === "INR" ? "\u20B9" : (data.currency || "")} ${data.amount.toFixed(2)}`,
    W - 52,
    totalsY + 24,
    { align: "right" },
  );

  if (data.paymentId) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(`Razorpay Txn ID: ${data.paymentId}`, 40, totalsY + 60);
  }

  // Footer
  doc.setTextColor(140);
  doc.setFontSize(9);
  doc.text(
    "This is a system-generated invoice. Thank you for choosing WellMindAI.",
    W / 2,
    780,
    { align: "center" },
  );

  doc.save(`WellMindAI-Invoice-${data.invoiceNo}.pdf`);
}
