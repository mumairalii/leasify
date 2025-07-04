import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FolderKanban, CircleDollarSign, MessagesSquare } from "lucide-react";

// IMPORTANT: We must register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * Renders the "Problem & Promise" section of the landing page.
 * It uses a responsive three-column grid to highlight common landlord pain points
 * and introduces Leaseify's core promise as the solution for each one.
 * The section and its cards animate into view on scroll.
 */
const ProblemSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // The scrollTrigger object links this timeline to the scroll position.
        scrollTrigger: {
          trigger: component.current, // The element that triggers the animation
          start: "top 70%", // Start animation when the top of the trigger hits 70% of the viewport height
          end: "bottom 20%", // End position
          toggleActions: "play none none none", // Play the animation on enter, do nothing on leave/re-enter
        },
      });

      tl.from("#problem-headline", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      }).from(
        ".problem-card",
        {
          opacity: 0,
          y: 50, // Increased the y distance slightly for a better effect
          rotationX: -30, // Add this: Tilts the card back in 3D space
          transformOrigin: "top center", // Add this: Sets the pivot point for the rotation
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
        },
        "-=0.3"
      ); // Overlap with the headline animation for a smoother effect
    }, component);
    return () => ctx.revert(); // Cleanup
  }, []);

  const problemData = [
    // ... (problemData array remains exactly the same as before)
    {
      icon: (
        <FolderKanban className="h-8 w-8 text-primary" aria-hidden="true" />
      ),
      title: "Scattered Information",
      problem:
        "Your tenant data is in one spreadsheet, lease documents are in another, and property details are in a folder somewhere.",
      promise:
        "Leaseify's Promise: A single, secure place for every record. Find anything in seconds.",
    },
    {
      icon: (
        <CircleDollarSign className="h-8 w-8 text-primary" aria-hidden="true" />
      ),
      title: "The Payment Chase",
      problem:
        'You\'re wasting time with manual tracking, sending awkward "rent is due" texts, and making trips to the bank for deposits.',
      promise:
        "Leaseify's Promise: Empower tenants with online payments and let automated reminders do the follow-up.",
    },
    {
      icon: (
        <MessagesSquare className="h-8 w-8 text-primary" aria-hidden="true" />
      ),
      title: "Communication Breakdowns",
      problem:
        "A tenant texts you about a leak, another emails a question, and there's no central place to track who needs what.",
      promise:
        "Leaseify's Promise: A centralized maintenance log and message history for every tenant. Nothing gets lost.",
    },
  ];

  return (
    <section
      ref={component}
      id="problems"
      className="py-20 sm:py-28 animated-gradient-background"
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-6">
        <div id="problem-headline" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your business deserves better than chaos.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            We built Leaseify to solve the exact frustrations you face every
            day.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 md:grid-cols-3 lg:max-w-6xl">
          {problemData.map((item) => (
            // We add a common class "problem-card" to target all cards for the stagger animation.
            <div
              key={item.title}
              className="problem-card flex flex-col rounded-lg bg-background p-6 shadow-sm"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 flex-grow text-base text-muted-foreground">
                {item.problem}
              </p>
              <p className="mt-5 text-base font-semibold text-primary">
                {item.promise}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

ProblemSection.propTypes = {};

export default ProblemSection;
