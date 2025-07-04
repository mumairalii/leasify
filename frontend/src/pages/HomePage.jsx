import React from "react";
import Header from "./HomePage/Header";
import HeroSection from "./HomePage/HeroSection";
import ProblemSection from "./HomePage/ProblemSection";
import TwoPathsSection from "./HomePage/TwoPathsSection";
import SocialProofSection from "./HomePage/SocialProofSection";
import CtaSection from "./HomePage/CtaSection";
import Footer from "./HomePage/Footer";

/**
 * The primary landing page for Leaseify, which assembles all marketing sections.
 * This version combines a persistent header with dynamic, story-driven content sections.
 */
const HomePage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* The Header is placed outside of main so it can be positioned over the Hero */}
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <TwoPathsSection />
        <SocialProofSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Building2,
//   FileText,
//   MessagesSquare,
//   FolderKanban,
//   CircleDollarSign,
//   Wrench,
//   LayoutDashboard,
// } from "lucide-react";

// const HomePage = () => {
//   return (
//     // Main container for the entire scrollable page
//     <div>
//       {/* --- Hero Section --- */}
//       <div className="relative w-full h-screen flex flex-col">
//         <header className="absolute top-0 left-0 right-0 z-20">
//           <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
//             <Link
//               to="/"
//               className="flex items-center gap-2 font-bold text-white"
//             >
//               <Building2 className="h-6 w-6" />
//               <span className="text-xl">Leaseify</span>
//             </Link>
//             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
//               <a
//                 href="#features"
//                 className="hover:text-white transition-colors"
//               >
//                 Features
//               </a>
//               <a
//                 href="#testimonials"
//                 className="hover:text-white transition-colors"
//               >
//                 Testimonials
//               </a>
//             </nav>
//             <div className="flex items-center gap-4">
//               <Link
//                 to="/login"
//                 className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
//               >
//                 Login
//               </Link>
//               <Button asChild>
//                 <Link to="/register">Get Started Free</Link>
//               </Button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 flex items-center justify-center relative text-white text-center">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop)",
//             }}
//           />
//           <div className="absolute inset-0 bg-black/50" />

//           <div className="relative z-10 container px-4 md:px-6">
//             <div className="max-w-3xl mx-auto space-y-6">
//               <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
//                 Effortless Property Management is Here.
//               </h1>
//               <p className="text-lg md:text-xl text-gray-200">
//                 Leaseify centralizes rent payments, maintenance requests, and
//                 communication into one simple dashboard, giving you back your
//                 most valuable asset: your time.
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <Button size="lg" asChild>
//                   <Link to="/register">Get Started for Free</Link>
//                 </Button>
//               </div>
//               <p className="text-xs text-gray-400">No credit card required.</p>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* --- Problem/Solution Section --- */}
//       <section
//         id="features"
//         className="w-full py-12 md:py-20 lg:py-24 bg-background"
//       >
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
//             <div className="space-y-4">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Tired of the Chaos?
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Scattered information leads to missed payments, lost requests,
//                 and unnecessary stress.
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Chasing down rent checks and manually tracking payments.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <MessagesSquare className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Maintenance requests coming from texts, emails, and phone
//                     calls.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <FolderKanban className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Juggling contacts and documents across different,
//                     disconnected apps.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4 rounded-lg bg-card p-8 shadow-md">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Your All-in-One Command Center.
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Leaseify brings everything together in one simple, beautiful
//                 dashboard.
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <CircleDollarSign className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     Secure online rent collection and clear payment histories.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <Wrench className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     A centralized maintenance queue for every request.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <LayoutDashboard className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     One single source of truth for all your properties and
//                     leases.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- Feature Highlights Section --- */}
//       <section className="w-full py-12 md:py-20 lg:py-24 bg-muted/30 dark:bg-muted/20">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
//                 Key Features
//               </div>
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                 Everything You Need. All in One Place.
//               </h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
//                 From rent collection to maintenance, Leaseify provides the tools
//                 to make property management simple, transparent, and efficient.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl items-start gap-12 mt-12 sm:grid-cols-2 md:grid-cols-3">
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <CircleDollarSign className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Online Rent Collection</h3>
//               <p className="text-muted-foreground">
//                 Securely collect rent through Stripe. Track every payment
//                 automatically and say goodbye to chasing checks.
//               </p>
//             </div>
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <Wrench className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Centralized Maintenance</h3>
//               <p className="text-muted-foreground">
//                 Manage all maintenance requests from a single queue. Tenants
//                 submit requests, and you track them to completion.
//               </p>
//             </div>
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <FileText className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Digital Document Hub</h3>
//               <p className="text-muted-foreground">
//                 Go paperless. Keep all your leases, applications, and important
//                 documents organized and accessible.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- Testimonials Section --- */}
//       <section id="testimonials" className="w-full py-12 md:py-20 lg:py-24">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                 Trusted by Landlords and Tenants
//               </h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
//                 See what our users are saying about how Leaseify has transformed
//                 their experience.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl items-stretch gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2">
//             <div className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm">
//               <blockquote className="text-lg font-semibold leading-snug">
//                 &ldquo;This platform has streamlined my entire rental process,
//                 saving me hours every week. Tracking payments and maintenance
//                 has never been easier.&rdquo;
//               </blockquote>
//               <div className="mt-6 flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>SD</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">Sofia Davis</p>
//                   <p className="text-sm text-muted-foreground">
//                     Property Manager
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm">
//               <blockquote className="text-lg font-semibold leading-snug">
//                 &ldquo;Paying my rent is so simple now. I love having all my
//                 lease documents and maintenance requests in one, easy-to-find
//                 place. A total game-changer!&rdquo;
//               </blockquote>
//               <div className="mt-6 flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>MJ</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">Michael Johnson</p>
//                   <p className="text-sm text-muted-foreground">Tenant</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- Final Call-to-Action Section --- */}
//       <section className="w-full py-12 md:py-20 lg:py-24 bg-muted/40 dark:bg-muted/20">
//         <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
//           <div className="space-y-3">
//             <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//               Ready to Simplify Your Rentals?
//             </h2>
//             <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
//               Join today and experience the future of property management. It's
//               free to get started.
//             </p>
//           </div>
//           <div className="mx-auto w-full max-w-sm">
//             <Button size="lg" asChild>
//               <Link to="/register">Get Started for Free</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* --- Footer Section --- */}
//       <footer className="w-full py-6 px-4 md:px-6 border-t bg-background">
//         <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
//           <p className="text-sm text-muted-foreground">
//             &copy; {new Date().getFullYear()} Leaseify. All rights reserved.
//           </p>
//           <nav className="flex gap-4 sm:gap-6">
//             <Link
//               to="/terms"
//               className="text-sm hover:underline underline-offset-4"
//             >
//               Terms of Service
//             </Link>
//             <Link
//               to="/privacy"
//               className="text-sm hover:underline underline-offset-4"
//             >
//               Privacy
//             </Link>
//           </nav>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Building2,
//   FileText,
//   MessagesSquare,
//   FolderKanban,
//   CircleDollarSign,
//   Wrench,
//   LayoutDashboard,
//   Zap,
//   ShieldCheck,
// } from "lucide-react";

// const HomePage = () => {
//   return (
//     // 1. The main container is now a simple div, not a flex column.
//     <div>
//       {/* --- Hero Section Container --- */}
//       <div className="relative w-full h-screen flex flex-col">
//         <header className="absolute top-0 left-0 right-0 z-20">
//           <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
//             <Link
//               to="/"
//               className="flex items-center gap-2 font-bold text-white"
//             >
//               <Building2 className="h-6 w-6" />
//               <span className="text-xl">Leaseify</span>
//             </Link>
//             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
//               <a
//                 href="#features"
//                 className="hover:text-white transition-colors"
//               >
//                 Features
//               </a>
//               <a href="#pricing" className="hover:text-white transition-colors">
//                 Pricing
//               </a>
//               <a
//                 href="#testimonials"
//                 className="hover:text-white transition-colors"
//               >
//                 Testimonials
//               </a>
//             </nav>
//             <div className="flex items-center gap-4">
//               <Link
//                 to="/login"
//                 className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
//               >
//                 Login
//               </Link>
//               <Button asChild>
//                 <Link to="/register">Get Started Free</Link>
//               </Button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 flex items-center justify-center relative text-white text-center">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url(hhttps://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop)",
//             }}
//           />
//           <div className="absolute inset-0 bg-black/50" />

//           <div className="relative z-10 container px-4 md:px-6">
//             <div className="max-w-3xl mx-auto space-y-6">
//               <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
//                 Effortless Property Management is Here.
//               </h1>
//               <p className="text-lg md:text-xl text-gray-200">
//                 Leaseify centralizes rent payments, maintenance requests, and
//                 communication into one simple dashboard, giving you back your
//                 most valuable asset: your time.
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <Button size="lg" asChild>
//                   <Link to="/register">Get Started for Free</Link>
//                 </Button>
//               </div>
//               <p className="text-xs text-gray-400">No credit card required.</p>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* --- Problem/Solution Section --- */}
//       {/* 2. This <section> is now a sibling to the hero, not a child. */}
//       <section
//         id="features"
//         className="w-full py-16 md:py-24 lg:py-32 bg-background"
//       >
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
//             {/* The "Problem" Column */}
//             <div className="space-y-4">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Tired of the Chaos?
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Scattered information leads to missed payments, lost requests,
//                 and unnecessary stress. Does this sound familiar?
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Chasing down rent checks and manually tracking payments in a
//                     spreadsheet.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <MessagesSquare className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Maintenance requests coming from texts, emails, and phone
//                     calls with no central record.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <FolderKanban className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Juggling contacts, documents, and reminders across
//                     different, disconnected apps.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//             {/* The "Solution" Column */}
//             <div className="space-y-4 rounded-lg bg-card p-8 shadow-md">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Your All-in-One Command Center.
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Leaseify brings everything together in one simple, beautiful
//                 dashboard.
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <CircleDollarSign className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     Secure online rent collection and a crystal-clear payment
//                     history for every lease.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <Wrench className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     A centralized maintenance queue to track every issue from
//                     submission to completion.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <LayoutDashboard className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     One single source of truth for all your properties, tenants,
//                     leases, and communications.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* --- 3. NEW: Feature Highlights Section --- */}
//       <section className="w-full py-16 md:py-24 lg:py-32">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
//                 Key Features
//               </div>
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                 Everything You Need. All in One Place.
//               </h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 From rent collection to maintenance, Leaseify provides the tools
//                 to make property management simple, transparent, and efficient.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl items-start gap-12 mt-12 sm:grid-cols-2 md:grid-cols-3">
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <CircleDollarSign className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Online Rent Collection</h3>
//               <p className="text-muted-foreground">
//                 Securely collect rent through Stripe. Track every payment
//                 automatically and say goodbye to chasing checks.
//               </p>
//             </div>
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <Wrench className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Centralized Maintenance</h3>
//               <p className="text-muted-foreground">
//                 Manage all maintenance requests from a single queue. Tenants
//                 submit requests, and you track them to completion.
//               </p>
//             </div>
//             <div className="grid gap-2 text-center">
//               <div className="flex justify-center items-center mb-4">
//                 <div className="bg-primary/10 p-4 rounded-full">
//                   <FileText className="h-8 w-8 text-primary" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold">Digital Document Hub</h3>
//               <p className="text-muted-foreground">
//                 Go paperless. Keep all your leases, applications, and important
//                 documents organized and accessible in the cloud.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* --- NEW: Social Proof / Testimonials Section --- */}
//       <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                 Trusted by Landlords and Tenants
//               </h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 See what our users are saying about how Leaseify has transformed
//                 their rental experience.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl items-center gap-8 mt-12 sm:grid-cols-1 md:grid-cols-2">
//             {/* Testimonial Card 1 (Landlord) */}
//             <div className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm">
//               <blockquote className="text-lg font-semibold leading-snug">
//                 &ldquo;This platform has streamlined my entire rental process,
//                 saving me hours every week. Tracking payments and maintenance
//                 has never been easier.&rdquo;
//               </blockquote>
//               <div className="mt-6 flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>SD</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">Sofia Davis</p>
//                   <p className="text-sm text-muted-foreground">
//                     Property Manager, Springfield
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {/* Testimonial Card 2 (Tenant) */}
//             <div className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm">
//               <blockquote className="text-lg font-semibold leading-snug">
//                 &ldquo;Paying my rent is so simple now. I love having all my
//                 lease documents and maintenance requests in one, easy-to-find
//                 place. A total game-changer!&rdquo;
//               </blockquote>
//               <div className="mt-6 flex items-center gap-4">
//                 <Avatar>
//                   <AvatarFallback>MJ</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">Michael Johnson</p>
//                   <p className="text-sm text-muted-foreground">
//                     Tenant, 123 Main St
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- NEW: Final Call-to-Action Section --- */}
//       <section className="w-full py-16 md:py-24 lg:py-32 bg-primary/10">
//         <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
//           <div className="space-y-3">
//             <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//               Ready to Simplify Your Rentals?
//             </h2>
//             <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//               Join today and experience the future of property management. It's
//               free to get started.
//             </p>
//           </div>
//           <div className="mx-auto w-full max-w-sm space-x-2">
//             <Button size="lg" asChild>
//               <Link to="/register">Get Started for Free</Link>
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

// import React from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Building2,
//   FileText,
//   MessagesSquare,
//   FolderKanban,
//   CircleDollarSign,
//   Wrench,
//   LayoutDashboard,
// } from "lucide-react";

// const HomePage = () => {
//   return (
//     <div className="w-full h-screen flex flex-col">
//       {/* --- Navigation Header for the Landing Page --- */}
//       <header className="absolute top-0 left-0 right-0 z-20">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
//           <Link to="/" className="flex items-center gap-2 font-bold text-white">
//             <Building2 className="h-6 w-6" />
//             <span className="text-xl">Leaseify</span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
//             <Link to="#features" className="hover:text-white transition-colors">
//               Features
//             </Link>
//             <Link to="#pricing" className="hover:text-white transition-colors">
//               Pricing
//             </Link>
//             <Link
//               to="#testimonials"
//               className="hover:text-white transition-colors"
//             >
//               Testimonials
//             </Link>
//           </nav>
//           <div className="flex items-center gap-4">
//             <Link
//               to="/login"
//               className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
//             >
//               Login
//             </Link>
//             <Button asChild>
//               <Link to="/register">Get Started Free</Link>
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* --- Main Hero Section --- */}
//       <main className="flex-1 flex items-center justify-center relative text-white text-center">
//         {/* Background Image & Overlay */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url(https://images.unsplash.com/photo-1618221195710-dd6b41fa2ebb?q=80&w=2070&auto=format&fit=crop)",
//           }}
//         />
//         <div className="absolute inset-0 bg-black/50" />

//         {/* Hero Content */}
//         <div className="relative z-10 container px-4 md:px-6">
//           <div className="max-w-3xl mx-auto space-y-6">
//             <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
//               Effortless Property Management is Here.
//             </h1>
//             <p className="text-lg md:text-xl text-gray-200">
//               Leaseify centralizes rent payments, maintenance requests, and
//               communication into one simple dashboard, giving you back your most
//               valuable asset: your time.
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//               <Button size="lg" asChild>
//                 <Link to="/register">Get Started for Free</Link>
//               </Button>
//             </div>
//             <p className="text-xs text-gray-400">No credit card required.</p>
//           </div>
//         </div>
//       </main>
//       {/* --- 2. NEW: Problem/Solution Section --- */}
//       <section
//         id="features"
//         className="w-full py-16 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/20"
//       >
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
//             {/* The "Problem" Column */}
//             <div className="space-y-4">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Tired of the Chaos?
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Scattered information leads to missed payments, lost requests,
//                 and unnecessary stress. Does this sound familiar?
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Chasing down rent checks and manually tracking payments in a
//                     spreadsheet.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <MessagesSquare className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Maintenance requests coming from texts, emails, and phone
//                     calls with no central record.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <FolderKanban className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
//                   <span>
//                     Juggling contacts, documents, and reminders across
//                     different, disconnected apps.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//             {/* The "Solution" Column */}
//             <div className="space-y-4 rounded-lg bg-card p-8 shadow-lg">
//               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
//                 Your All-in-One Command Center.
//               </h2>
//               <p className="text-muted-foreground md:text-xl">
//                 Leaseify brings everything together in one simple, beautiful
//                 dashboard.
//               </p>
//               <ul className="grid gap-4 pt-4">
//                 <li className="flex items-start gap-3">
//                   <CircleDollarSign className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     Secure online rent collection and a crystal-clear payment
//                     history for every lease.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <Wrench className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     A centralized maintenance queue to track every issue from
//                     submission to completion.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <LayoutDashboard className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
//                   <span>
//                     One single source of truth for all your properties, tenants,
//                     leases, and communications.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Link } from 'react-router-dom';
// import PropertyCard from '@/components/dashboard/PropertyCard';

// const HomePage = () => {
//     const [properties, setProperties] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null); // 1. Add a new state for handling errors

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await api.get('/properties/public');
//                 setProperties(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch public properties", error);
//                 // 2. Set a user-friendly error message if the API call fails
//                 setError('Could not load properties at this time. Please try again later.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     // Helper function to render content based on state
//     const renderContent = () => {
//         if (isLoading) {
//             return <p className="text-center text-muted-foreground">Loading properties...</p>;
//         }

//         // 3. Display the error message if an error occurred
//         if (error) {
//             return <p className="text-center text-destructive font-semibold">{error}</p>;
//         }

//         if (properties.length > 0) {
//             return (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {properties.map((property) => (
//                         <Link to={`/properties/${property._id}`} key={property._id} className="h-full">
//                             <PropertyCard property={property} context="public" />
//                         </Link>
//                     ))}
//                 </div>
//             );
//         }

//         return <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>;
//     };

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
//                 <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//                     Browse our collection of available properties. Click on any property to learn more and apply.
//                 </p>
//             </header>

//             {renderContent()}
//         </div>
//     );
// };

// export default HomePage;
// // src/pages/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Link } from 'react-router-dom';
// import PropertyCard from '@/components/dashboard/PropertyCard'; // Import the reusable component

// const HomePage = () => {
//     const [properties, setProperties] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await api.get('/properties/public');
//                 setProperties(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch public properties", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
//                 <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//                     Browse our collection of available properties. Click on any property to learn more and apply.
//                 </p>
//             </header>

//             {isLoading ? (
//                 <p className="text-center">Loading properties...</p>
//             ) : properties.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {properties.map((property) => (
//                         <Link to={`/properties/${property._id}`} key={property._id} className="h-full">
//                             {/* Use the reusable PropertyCard in a public context */}
//                             <PropertyCard property={property} context="public" />
//                         </Link>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>
//             )}
//         </div>
//     );
// };

// export default HomePage;
// // src/pages/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Card, CardContent } from "@/components/ui/card";
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//     const [properties, setProperties] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const response = await api.get('/properties/public');
//                 setProperties(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch public properties", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Find Your Next Home</h1>
//                 <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
//                     Browse our collection of available properties. Click on any property to learn more and apply.
//                 </p>
//             </header>

//             {isLoading ? (
//                 <p className="text-center">Loading properties...</p>
//             ) : properties.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {properties.map((property) => (
//                         <Card key={property._id} className="overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1">
//                             <Link to={`/properties/${property._id}`}>
//                                 <div className="h-48 bg-muted flex items-center justify-center">
//                                     <p className="text-muted-foreground">Property Image</p>
//                                 </div>
//                                 <CardContent className="p-4">
//                                     <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{property.address.street}</h3>
//                                     <p className="text-sm text-muted-foreground">{property.address.city}, {property.address.state}</p>
//                                     <p className="text-lg font-bold mt-4 text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                                 </CardContent>
//                             </Link>
//                         </Card>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-muted-foreground">No properties are currently listed. Please check back later.</p>
//             )}
//         </div>
//     );
// };

// export default HomePage;
