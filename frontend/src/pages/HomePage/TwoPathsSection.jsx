import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  User,
  LayoutDashboard,
  FileText,
  Banknote,
  Wrench,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- Sub-components (FeatureListItem, LandlordVisual, TenantVisual) remain unchanged ---
const FeatureListItem = ({ icon, text }) => (
  <li className="flex items-start gap-4">
    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {React.cloneElement(icon, { className: "h-5 w-5" })}
    </div>
    <span className="flex-1 text-muted-foreground">{text}</span>
  </li>
);
FeatureListItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

const LandlordVisual = () => (
  <div className="aspect-[4/3] rounded-xl bg-muted p-4 shadow-inner sm:aspect-video">
    <div className="h-full w-full rounded-md bg-background p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Properties</p>
          </div>
          <p className="mt-2 text-2xl font-bold">4</p>
        </div>
        <div className="col-span-1 rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Occupancy</p>
          </div>
          <p className="mt-2 text-2xl font-bold">95%</p>
        </div>
        <div className="col-span-2 rounded-lg bg-muted p-3">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Maintenance Queue
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <p>Leaky Faucet - Unit 3</p>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p>Dryer Repair - Unit 1</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TenantVisual = () => (
  <div className="aspect-[4/3] rounded-xl bg-muted p-4 shadow-inner sm:aspect-video">
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-background p-4">
      <div className="w-full max-w-xs rounded-lg bg-muted p-6 text-center">
        <p className="text-sm text-muted-foreground">Rent Due</p>
        <p className="mt-1 text-3xl font-bold text-foreground">$1,850.00</p>
        <Button size="lg" className="mt-4 w-full">
          Pay Rent Securely
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        or{" "}
        <a href="#" className="text-primary underline">
          Submit Maintenance Request
        </a>
      </p>
    </div>
  </div>
);

/**
 * Renders the "Two Paths" section using a Tabs component.
 */
const TwoPathsSection = () => {
  const component = useRef(null);
  const contentRef = useRef(null); // A ref for the content wrapper for animation
  const [activeTab, setActiveTab] = useState("landlord"); // State to track active tab

  const landlordFeatures = [
    {
      icon: <LayoutDashboard />,
      text: "See portfolio health at a glance with a powerful mission control dashboard.",
    },
    {
      icon: <FileText />,
      text: "Streamline your application workflow from submission to lease generation.",
    },
    {
      icon: <Banknote />,
      text: "Track finances effortlessly with online payments and automated overdue alerts.",
    },
    {
      icon: <Wrench />,
      text: "Manage all maintenance requests in one organized, easy-to-track log.",
    },
  ];
  const tenantFeatures = [
    {
      icon: <CreditCard />,
      text: "Pay rent in seconds through a secure, trusted online payment portal powered by Stripe.",
    },
    {
      icon: <Wrench />,
      text: "Submit maintenance requests with descriptions and see their status anytime.",
    },
    {
      icon: <ShieldCheck />,
      text: "Access all your key lease information and payment history in a secure home hub.",
    },
  ];

  // Scroll-triggered animation for the component's initial appearance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      tl.from("#features-headline", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      }).from(
        "#tabs-container",
        { opacity: 0, y: 30, scale: 0.98, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );
    }, component);
    return () => ctx.revert();
  }, []);

  // Animation for when the active tab changes
  useEffect(() => {
    // We target the specific content that is now visible
    gsap.fromTo(
      `#${activeTab}-content`, // Target the specific content div by ID
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1 }
    );
  }, [activeTab]); // This effect runs whenever the activeTab state changes

  return (
    <section ref={component} id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-6 sm:px-8 md:px-6">
        <div id="features-headline" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One Platform. A Perfect Fit for Everyone.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Leaseify is designed from the ground up to serve the unique needs of
            both landlords and tenants.
          </p>
        </div>

        <Tabs
          id="tabs-container"
          defaultValue="landlord"
          className="mx-auto mt-16 max-w-5xl"
          onValueChange={(value) => setActiveTab(value)} // Update state on change
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="landlord" className="group">
              <Briefcase className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              For Landlords
            </TabsTrigger>
            <TabsTrigger value="tenant" className="group">
              <User className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              For Tenants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="landlord" className="mt-8">
            <div
              id="landlord-content"
              className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
            >
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Your Calm Command Center
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Get a bird's-eye view of your entire portfolio and manage
                  every task with ease.
                </p>
                <ul className="mt-6 space-y-5">
                  {landlordFeatures.map((feature) => (
                    <FeatureListItem key={feature.text} {...feature} />
                  ))}
                </ul>
              </div>
              <LandlordVisual />
            </div>
          </TabsContent>

          <TabsContent value="tenant" className="mt-8">
            <div
              id="tenant-content"
              className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
            >
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Your Simple, Secure Home Hub
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Enjoy a modern, professional rental experience with everything
                  you need right at your fingertips.
                </p>
                <ul className="mt-6 space-y-5">
                  {tenantFeatures.map((feature) => (
                    <FeatureListItem key={feature.text} {...feature} />
                  ))}
                </ul>
              </div>
              <TenantVisual />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

TwoPathsSection.propTypes = {};

export default TwoPathsSection;
