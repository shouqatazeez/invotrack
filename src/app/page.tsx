import Link from "next/link";
import {
  ReceiptText,
  ArrowRight,
  FileText,
  Users,
  IndianRupee,
  Download,
  UserPlus,
  Send,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <ReceiptText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">InvoTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-6">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          Free and open source
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
          Simple billing for
          <br />
          <span className="text-primary">small businesses</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Create invoices, track payments, and manage customers — all in one
          clean dashboard. No complexity, just billing that works.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href="/register">
              Start for free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href="/login">Sign in to your account</Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-2">Features</p>
          <h2 className="text-3xl font-bold">Everything you need to get paid</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Built for freelancers, tutors, repair shops, and small service businesses
            who want to stop tracking payments in WhatsApp and Excel.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-1.5">Invoice Creation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create professional invoices with multiple line items, tax calculation, and discounts.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <IndianRupee className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold mb-1.5">Payment Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track paid, unpaid, and overdue invoices. Know exactly who owes you money.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-1.5">Customer Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Store customer details and quickly select them when creating new invoices.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Download className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-1.5">PDF Export</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download branded PDF invoices to share with customers via email or WhatsApp.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                <MessageSquare className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="font-semibold mb-1.5">AI Payment Reminders</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate AI-powered reminder messages and send them via WhatsApp or email with invoice attached.
              </p>
            </CardContent>
          </Card>
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <FileDown className="h-5 w-5 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-1.5">CSV Export & Search</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Export invoices as CSV for accounting. Search and filter by customer or status instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-2">How it works</p>
          <h2 className="text-3xl font-bold">Get started in 4 simple steps</h2>
          <p className="mt-3 text-muted-foreground">
            From sign up to sending your first invoice — it takes less than 2 minutes.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-primary mb-2">Step 1</div>
            <h3 className="font-semibold mb-1">Add Customers</h3>
            <p className="text-sm text-muted-foreground">
              Add the people or businesses you bill regularly.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-primary mb-2">Step 2</div>
            <h3 className="font-semibold mb-1">Create Invoice</h3>
            <p className="text-sm text-muted-foreground">
              Pick a customer, add products, set tax and discount.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-primary mb-2">Step 3</div>
            <h3 className="font-semibold mb-1">Send & Track</h3>
            <p className="text-sm text-muted-foreground">
              Download PDF and share. Mark as paid when payment is received.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div className="text-xs font-medium text-primary mb-2">Step 4</div>
            <h3 className="font-semibold mb-1">View Insights</h3>
            <p className="text-sm text-muted-foreground">
              Dashboard shows revenue, pending, and overdue at a glance.
            </p>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            Ready to simplify your billing?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Join small businesses who use InvoTrack to manage invoices,
            track payments, and stay organized.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <ReceiptText className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-medium">InvoTrack</span>
          </div>
          <div className="flex items-center gap-6">
            <p>&copy; 2026 InvoTrack. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/shouqatazeez/mini-invoice-app.git"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/shouqat-azeez-mohammad/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
