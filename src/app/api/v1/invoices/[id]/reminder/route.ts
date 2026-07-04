import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";
import { Resend } from "resend";
import { jsPDF } from "jspdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const { action } = await req.json();

    const invoice = await prisma.invoice.findFirst({
      where: { id: parseInt(id), userId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (invoice.status === "PAID") {
      return NextResponse.json(
        { error: "Invoice is already paid" },
        { status: 400 }
      );
    }

    const prompt = `Write a short, polite payment reminder message for a customer. Keep it professional and friendly. 
    
Details:
- Customer name: ${invoice.customer.name}
- Invoice number: ${invoice.invoiceNumber}
- Amount: ₹${invoice.total.toLocaleString()}
- Due since: ${invoice.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
- Status: ${invoice.status}

Generate two versions:
1. A short WhatsApp message (2-3 lines max)
2. A professional email body (4-5 lines)

Return ONLY valid JSON in this exact format:
{"whatsapp": "message here", "email": "message here"}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorData = await geminiRes.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate reminder" },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const messages = JSON.parse(jsonMatch[0]);

    if (action === "send" && invoice.customer.email) {
      // Generate PDF for attachment
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 40, pageWidth, 2, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("InvoTrack", 20, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Simple Billing for Small Businesses", 20, 26);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 20, 22, { align: "right" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.invoiceNumber, pageWidth - 20, 30, { align: "right" });

      doc.setTextColor(60, 60, 60);
      let y = 55;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("INVOICE DATE", 20, y);
      y += 6;
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.text(invoice.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 20, y);

      y += 18;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "normal");
      doc.text("BILL TO", 20, y);
      y += 6;
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.text(invoice.customer.name, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      if (invoice.customer.email) { y += 6; doc.text(invoice.customer.email, 20, y); }
      if (invoice.customer.phone) { y += 6; doc.text(invoice.customer.phone, 20, y); }

      y += 16;
      doc.setFillColor(219, 234, 254);
      doc.rect(20, y - 5, pageWidth - 40, 10, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("PRODUCT", 25, y + 1);
      doc.text("QTY", 105, y + 1);
      doc.text("PRICE", 130, y + 1);
      doc.text("TOTAL", pageWidth - 25, y + 1, { align: "right" });

      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      for (const item of invoice.items) {
        doc.text(item.product.name, 25, y);
        doc.text(item.quantity.toString(), 105, y);
        doc.text(`Rs.${item.price.toFixed(2)}`, 130, y);
        doc.text(`Rs.${item.total.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
        y += 3;
        doc.setDrawColor(226, 232, 240);
        doc.line(20, y, pageWidth - 20, y);
        y += 9;
      }

      y += 8;
      const totalsX = 130;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Subtotal", totalsX, y);
      doc.text(`Rs.${invoice.subtotal.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
      y += 8;
      doc.text(`Tax (${invoice.taxRate}%)`, totalsX, y);
      doc.text(`Rs.${invoice.taxAmount.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
      y += 8;
      doc.text("Discount", totalsX, y);
      doc.text(`-Rs.${invoice.discount.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
      y += 12;
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(totalsX - 5, y - 6, pageWidth - totalsX - 15, 14, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("TOTAL", totalsX, y + 2);
      doc.text(`Rs.${invoice.total.toFixed(2)}`, pageWidth - 25, y + 2, { align: "right" });

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3b82f6; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Payment Reminder</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #374151; line-height: 1.6;">${messages.email}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 13px; color: #6b7280;">Please find the invoice (${invoice.invoiceNumber}) attached as PDF.</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Sent via InvoTrack</p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "InvoTrack <onboarding@resend.dev>",
        to: invoice.customer.email,
        subject: `Payment Reminder - ${invoice.invoiceNumber}`,
        html: htmlContent,
        attachments: [
          {
            filename: `invoice-${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      return NextResponse.json({
        messages,
        emailSent: true,
        sentTo: invoice.customer.email,
      });
    }

    return NextResponse.json({ messages, emailSent: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate reminder" },
      { status: 500 }
    );
  }
}
