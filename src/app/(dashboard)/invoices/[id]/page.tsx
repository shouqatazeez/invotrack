"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, User, Calendar, MessageSquare, Copy, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  product: {
    name: string;
  };
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  createdAt: string;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  items: InvoiceItem[];
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderMessages, setReminderMessages] = useState<{ whatsapp: string; email: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/v1/invoices/${id}`);
        if (!res.ok) {
          toast.error("Invoice not found");
          return;
        }
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!invoice) return;
    setStatusLoading(true);

    try {
      const res = await fetch(`/api/v1/invoices/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      setInvoice({ ...invoice, status: newStatus as Invoice["status"] });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/v1/invoices/${id}/pdf`);
      if (!res.ok) {
        toast.error("Failed to generate PDF");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "UNPAID":
        return "secondary";
      case "OVERDUE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleGenerateReminder = async () => {
    setReminderLoading(true);
    setReminderMessages(null);
    setReminderOpen(true);

    try {
      const res = await fetch(`/api/v1/invoices/${id}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });

      if (!res.ok) {
        toast.error("Failed to generate reminder");
        setReminderOpen(false);
        return;
      }

      const data = await res.json();
      setReminderMessages(data.messages);
    } catch (err) {
      toast.error("Something went wrong");
      setReminderOpen(false);
    } finally {
      setReminderLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);

    try {
      const res = await fetch(`/api/v1/invoices/${id}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to send email");
        return;
      }

      const data = await res.json();
      if (data.emailSent) {
        toast.success(`Reminder sent to ${data.sentTo}`);
        setReminderOpen(false);
      } else {
        toast.error("Customer email not available");
      }
    } catch (err) {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-36" />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-destructive">Invoice not found</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/invoices">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Invoice {invoice.invoiceNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created on{" "}
                  {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={invoice.status}
                onValueChange={handleStatusChange}
                disabled={statusLoading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              {invoice.status !== "PAID" && (
                <Button variant="outline" size="sm" onClick={handleGenerateReminder}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Customer info + Status badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Customer
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{invoice.customer.name}</span>
              </div>
              {invoice.customer.email && (
                <p className="text-sm text-muted-foreground ml-6">
                  {invoice.customer.email}
                </p>
              )}
              {invoice.customer.phone && (
                <p className="text-sm text-muted-foreground ml-6">
                  {invoice.customer.phone}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Date
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </p>
              <Badge variant={statusVariant(invoice.status)} className="text-xs">
                {invoice.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Line items table */}
          <div>
            <h3 className="text-sm font-medium mb-3">Line Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{item.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="space-y-2 text-sm w-[250px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>₹{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-₹{invoice.discount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span className="text-green-600 dark:text-green-400">
                  ₹{invoice.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Reminder Dialog */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Reminder</DialogTitle>
            <DialogDescription>
              AI-generated reminder for {invoice.customer.name}
            </DialogDescription>
          </DialogHeader>

          {reminderLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Generating reminder...</span>
            </div>
          ) : reminderMessages ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">WhatsApp Message</p>
                  <div className="flex gap-1">
                    {invoice.customer.phone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const phone = invoice.customer.phone!.replace(/[^0-9]/g, "");
                          const url = `https://wa.me/${phone}?text=${encodeURIComponent(reminderMessages.whatsapp)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Send
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(reminderMessages.whatsapp)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {reminderMessages.whatsapp}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Email Message</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(reminderMessages.email)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {reminderMessages.email}
                </div>
              </div>

              {invoice.customer.email && (
                <>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                  >
                    {sendingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email to {invoice.customer.email}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
