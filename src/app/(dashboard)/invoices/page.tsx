"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Invoice {
  id: number;
  invoiceNumber: string;
  total: number;
  status: "PAID" | "UNPAID" | "OVERDUE";
  createdAt: string;
  customer: {
    name: string;
  };
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/v1/invoices");
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/v1/invoices/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
        toast.success("Invoice deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete invoice");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDownloadPdf = async (id: number, invoiceNumber: string) => {
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
      a.download = `invoice-${invoiceNumber}.pdf`;
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

  const handleExportCsv = () => {
    if (invoices.length === 0) {
      toast.error("No invoices to export");
      return;
    }

    const headers = ["Invoice #", "Customer", "Amount", "Date", "Status"];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      inv.customer.name,
      inv.total.toString(),
      new Date(inv.createdAt).toLocaleDateString(),
      inv.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Separator />
        <Card>
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex gap-6">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Badge variant="secondary" className="text-xs">
            {invoices.length}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      <Card>
        <CardContent className="pt-6">
          {invoices.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">No invoices yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first invoice to start tracking payments.
              </p>
              <Button asChild size="sm">
                <Link href="/invoices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="group">
                    <TableCell className="font-mono text-xs font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.customer.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ₹{invoice.total.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(`/invoices/${invoice.id}`)
                          }
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleDownloadPdf(invoice.id, invoice.invoiceNumber)
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this invoice?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Invoice{" "}
                                {invoice.invoiceNumber} will be
                                permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(invoice.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
