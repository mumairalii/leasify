import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/**
 * Renders the final, primary Call-to-Action section of the landing page.
 * This section uses an impactful animation to draw focus to the sign-up button.
 */
const CtaSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // We animate the text content first
      tl.from("#cta-text-content", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        // Then the button gets a special, more impactful entrance
        .from(
          "#cta-button",
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.7,
            ease: "back.out(1.7)", // This ease creates a satisfying "pop" effect
          },
          "-=0.3"
        )
        // We also subtly animate the background decoration for more depth
        .from(
          ".cta-background-svg",
          {
            opacity: 0,
            scale: 0.5,
            duration: 1.2,
            ease: "power3.out",
          },
          0
        ); // Start this animation at the very beginning of the timeline
    }, component);
    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={component} id="cta" className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative isolate overflow-hidden bg-primary/90 px-6 py-20 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <div id="cta-text-content">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Simplify Your Rental World?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
              Get started for free today. No credit card required. Your calm
              command center is just a few clicks away.
            </p>
          </div>
          <div
            id="cta-button"
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button
              className="transition-transform duration-300 ease-out hover:scale-105"
              size="lg"
              variant="secondary"
            >
              <Link to="/register">Create My Free Account Now</Link>
            </Button>
          </div>

          <svg
            viewBox="0 0 1024 1024"
            className="cta-background-svg absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

CtaSection.propTypes = {};

export default CtaSection;
