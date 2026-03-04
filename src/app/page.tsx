import Link from "next/link";
import { ArrowRight, Calendar, Scissors, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Scissors className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">EzeQ</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">Features</Link>
              <Link href="#salons" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">For Salons</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:flex text-neutral-700 font-semibold hover:bg-neutral-100">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold rounded-lg px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-8 relative z-10">
          

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.1]">
              The smartest way to <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-500">
                book your next look.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for the best haircut in town or managing a high-end salon, EzeQ seamlessy connects clients with top-tier professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth/register?role=CUSTOMER" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-white h-14 px-8 text-base shadow-lg shadow-primary/15 rounded-xl transition-all">
                  Book an Appointment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/register?role=SALON_ADMIN" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/80 hover:text-white shadow-lg shadow-primary/15 h-14 px-8 text-base rounded-xl transition-all">
                  Partner your Salon
                </Button>
              </Link>
            </div>
          </div>

          {/* Abstract Dashboard Mockup Graphic */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-neutral-200/60 bg-white/50 backdrop-blur-sm p-2 sm:p-4 shadow-2xl shadow-neutral-200/50">
              <div className="rounded-xl overflow-hidden border border-neutral-100 bg-white shadow-xs aspect-video flex relative">

                {/* Mockup Sidebar */}
                <div className="w-1/4 max-w-[240px] bg-slate-50 border-r border-neutral-100 p-4 hidden md:block">
                  <div className="h-6 w-24 bg-neutral-200 rounded-md mb-8" />
                  <div className="space-y-3">
                    <div className="h-8 w-full bg-primary/10 rounded-md" />
                    <div className="h-8 w-3/4 bg-neutral-200 rounded-md" />
                    <div className="h-8 w-5/6 bg-neutral-200 rounded-md" />
                  </div>
                </div>

                {/* Mockup Main Content */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
                    <div className="h-8 w-8 bg-neutral-200 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="h-24 bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col justify-between">
                      <div className="h-4 w-1/2 bg-blue-200 rounded-md" />
                      <div className="h-8 w-1/3 bg-blue-300 rounded-md" />
                    </div>
                    <div className="h-24 bg-slate-50 border border-neutral-100 rounded-xl p-4 flex-col justify-between hidden sm:flex">
                      <div className="h-4 w-1/2 bg-neutral-200 rounded-md" />
                      <div className="h-8 w-1/3 bg-neutral-300 rounded-md" />
                    </div>
                    <div className="h-24 bg-slate-50 border border-neutral-100 rounded-xl p-4 flex-col justify-between hidden sm:flex">
                      <div className="h-4 w-1/2 bg-neutral-200 rounded-md" />
                      <div className="h-8 w-1/3 bg-neutral-300 rounded-md" />
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-50 border border-neutral-100 rounded-xl" />
                </div>

                {/* Floating Aesthetic Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl flex items-center justify-center pointer-events-none">
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">One platform. Two dedicated experiences.</h2>
            <p className="text-neutral-500">Built to make lives easier for both salon professionals and clients seeking premium styling services.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-neutral-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-primary flex items-center justify-center rounded-xl mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Instant Booking</h3>
              <p className="text-neutral-600 leading-relaxed">Find available time slots in real-time and secure your appointment in seconds without phone calls.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-neutral-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Salon Management</h3>
              <p className="text-neutral-600 leading-relaxed">A complete administrative dashboard to manage your staff, operating hours, and service catalog.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-neutral-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 flex items-center justify-center rounded-xl mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Verified Partners</h3>
              <p className="text-neutral-600 leading-relaxed">Every salon on our platform goes through mandatory approval ensuring premium service quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-12 text-center border-t border-neutral-800">
        <p className="text-neutral-400 font-medium">© 2026 EzeQ Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
