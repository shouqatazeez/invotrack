import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";
import { Resend } from "resend";

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
      include: { customer: true },
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
      await resend.emails.send({
        from: "InvoTrack <onboarding@resend.dev>",
        to: invoice.customer.email,
        subject: `Payment Reminder - ${invoice.invoiceNumber}`,
        text: messages.email,
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
